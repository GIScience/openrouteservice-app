    angular.module('orsApp.aa-service', []).factory('orsAaService', ['$http', '$q', 'orsUtilsService', 'orsMapFactory', 'orsObjectsFactory', ($http, $q, orsUtilsService, orsMapFactory, orsObjectsFactory) => {
        /**
         * Requests geocoding from ORS backend
         * @param {String} requestData: XML for request payload
         */
        let orsAaService = {};
        orsAaService.aaSubject = new Rx.Subject();
        orsAaService.aaRequests = {};
        orsAaService.aaRequests.requests = [];
        orsAaService.aaQueries = [];
        /** Clears outstanding requests */
        orsAaService.aaRequests.clear = () => {
            for (let req of orsAaService.aaRequests.requests) {
                if ('cancel' in req) req.cancel("Cancel last request");
            }
            orsAaService.aaRequests.requests = [];
        };
        /**
         * Resets the AaObj
         */
        orsAaService.initAaObj = () => {
            orsAaService.orsAaObj = {
                code: 'Ok',
                bbox: [
                    [],
                    []
                ],
                isochrones: [],
                info: {},
            };
        };
        orsAaService.DeEmph = () => {
            let action = orsObjectsFactory.createMapAction(2, lists.layers[2], undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        orsAaService.Emph = (geom) => {
            let action = orsObjectsFactory.createMapAction(1, lists.layers[2], geom, undefined, lists.layerStyles.isochroneEmph());
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        orsAaService.zoomTo = (geom) => {
            let action = orsObjectsFactory.createMapAction(0, lists.layers[3], geom, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        orsAaService.reshuffle = () => {
            let action;
            action = orsObjectsFactory.createMapAction(6, lists.layers[3], undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
            action = orsObjectsFactory.createMapAction(9, lists.layers[5], undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        /**
         * Clears the map and forwards the polygons to it
         */
        orsAaService.toggleQuery = (idx, isochrones, center) => {
            let action, polygons = [];
            for (let i = 0; i < isochrones.length; i++) {
                polygons.push(isochrones[i].geometry.coordinates);
            }
            action = orsObjectsFactory.createMapAction(4, lists.layers[3], polygons, idx);
            orsMapFactory.mapServiceSubject.onNext(action);
            action = orsObjectsFactory.createMapAction(8, lists.layers[5], center, idx);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        orsAaService.removeQuery = (idx) => {
            console.log('removing', idx)
            let action;
            // remove isochrones
            action = orsObjectsFactory.createMapAction(7, lists.layers[3], undefined, idx);
            orsMapFactory.mapServiceSubject.onNext(action);
            // remove centermarker
            action = orsObjectsFactory.createMapAction(2, lists.layers[5], undefined, idx);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        /**
         * Coordinates processing of server response
         * @param {String} data: XML response
         * @param {Object} settings: object which contains settings of request
         */
        orsAaService.processResponse = (data, settings) => {
            orsAaService.initAaObj();
            orsAaService.parseResultsToBounds(data);
            orsAaService.parseSettings(settings);
            orsAaService.parseResponseToPolygonJSON(data);
            // update aa component in panel
            orsAaService.aaSubject.onNext(orsAaService.orsAaObj);
        };
        /** Subscription function to current aa responses object, used in panel. */
        orsAaService.subscribeToAaQueries = (o) => {
            return orsAaService.aaSubject.subscribe(o);
        };
        /**
         * Requests accessiblity analysis from ORS backend
         * @param {String} requestData: XML for request payload
         */
        orsAaService.fetchAnalysis = (requestData) => {
            var url = orsNamespaces.services.analyse;
            var canceller = $q.defer();
            var cancel = (reason) => {
                canceller.resolve(reason);
            };
            var promise = $http.post(url, requestData, {
                timeout: canceller.promise
            }).then((response) => {
                return response.data;
            });
            return {
                promise: promise,
                cancel: cancel
            };
        };
        /**
         * builds and sends the service request
         * @param {Object} position: OL LonLat or Point representing the reference point
         * @param {int} distanceInMinutes: radius of the analysis
         * @param {Object} successCallback: function callback
         * @param {Object} failureCallback: function callback
         */
        orsAaService.generateAnalysisRequest = (settings) => {
            var writer = new XMLWriter('UTF-8', '1.0');
            writer.writeStartDocument();
            //<aas:AAS>
            writer.writeElementString('aas:AAS');
            writer.writeAttributeString('version', '1.0');
            writer.writeAttributeString('xmlns:aas', orsNamespaces.aas);
            writer.writeAttributeString('xmlns:xsi', orsNamespaces.xsi);
            writer.writeAttributeString('xsi:schemaLocation', orsNamespaces.schemata.analyseService);
            //<aas:RequestHeader />
            writer.writeElementString('aas:RequestHeader');
            //<aas:Request>
            writer.writeStartElement('aas:Request');
            writer.writeAttributeString('methodName', 'AccessibilityRequest');
            writer.writeAttributeString('version', '1.0');
            writer.writeAttributeString('requestID', '00');
            //<aas:DetermineAccessibilityRequest>
            writer.writeStartElement('aas:DetermineAccessibilityRequest');
            //<aas:Accessibility>
            writer.writeStartElement('aas:Accessibility');
            //<aas:AccessibilityPreference>
            writer.writeStartElement('aas:AccessibilityPreference');
            //<aas:Time/>
            writer.writeStartElement('aas:Time');
            writer.writeAttributeString('Duration', 'PT0H' + settings.profile.options.analysis_options.isovalue + 'M00S');
            writer.writeEndElement();
            //</aas:AccessibilityPreference
            writer.writeEndElement();
            //<aas:AccessibilitySettings
            writer.writeStartElement('aas:AccessibilitySettings');
            writer.writeElementString('aas:RoutePreference', settings.profile.type || 'Fastest');
            //<aas:RoutePreference>
            // writer.writeElementString('aas:Method', settings.profile.options.analysis_options.method || 'Default');
            //TODO
            writer.writeElementString('aas:Method', 'Default');
            //<aas:Method>
            //To be sent in seconds
            writer.writeElementString('aas:Interval', (settings.profile.options.analysis_options.isointerval * 60).toString() || '1000');
            // writer.writeElementString('aas:Interval', '1000');
            //<aas:Intervall>                         
            //</aas:AccessibilitySettings>
            writer.writeEndElement();
            //<aas:LocationPoint>
            writer.writeStartElement('aas:LocationPoint');
            //<aas:Position>
            writer.writeStartElement('aas:Position');
            //<gml:Point>
            writer.writeStartElement('gml:Point');
            writer.writeAttributeString('xmlns:gml', orsNamespaces.gml);
            writer.writeAttributeString('srsName', 'EPSG:4326');
            //<gml:pos />
            writer.writeStartElement('gml:pos');
            writer.writeString(settings.waypoints[0]._latlng.lng + ' ' + settings.waypoints[0]._latlng.lat);
            writer.writeEndElement();
            //</gml:Point>
            writer.writeEndElement();
            //</aas:Position>
            writer.writeEndElement();
            //</aas:LocationPoint>
            writer.writeEndElement();
            //</aas:Accessibility>
            writer.writeEndElement();
            //<aas:AccessibilityGeometryRequest>
            writer.writeStartElement('aas:AccessibilityGeometryRequest');
            //<aas:PolygonPreference />
            writer.writeStartElement('aas:PolygonPreference');
            writer.writeString('Detailed');
            writer.writeEndElement();
            //</aas:AccessibilityGeometryRequest
            writer.writeEndElement();
            //</aas:DetermineAccessibilityRequest>
            writer.writeEndElement('aas:DetermineAccessibilityRequest');
            //</aas:Request>
            writer.writeEndElement();
            writer.writeEndElement();
            //</aas:AAS>
            writer.writeEndDocument();
            var xmlRequest = writer.flush();
            writer.close();
            return xmlRequest;
        };
        /**
         * processes the results and extracts area bounds
         * @param {Object} result: the response of the service
         * @return OL.Bounds containing the accessible area; null in case of an error response
         */
        orsAaService.parseResultsToBounds = (response) => {
            response = orsUtilsService.domParser(response);
            var boundingBox = orsUtilsService.getElementsByTagNameNS(response, orsNamespaces.aas, 'BoundingBox');
            var bounds, latlngs;
            if (boundingBox && boundingBox.length > 0) {
                latlngs = [];
                _.each(orsUtilsService.getElementsByTagNameNS(boundingBox[0], orsNamespaces.gml, 'pos'), (position) => {
                    position = orsUtilsService.convertPositionStringToLonLat(position.firstChild.nodeValue);
                    latlngs.push(position);
                });
            }
            bounds = new L.latLngBounds(latlngs);
            orsAaService.orsAaObj.bbox[0] = bounds._northEast;
            orsAaService.orsAaObj.bbox[1] = bounds._southWest;
        };
        /**
         * Adds request settings to the aa response, this is mocked and will be removed on update
         * @param {Object} settings: Object containing the settings of the request
         */
        orsAaService.parseSettings = (settings) => {
            let element = {
                profile: settings.profile.type,
                method: settings.profile.options.analysis_options.method,
                isointerval: settings.profile.options.analysis_options.isointerval,
                isovalue: settings.profile.options.analysis_options.isovalue,
                latlng: settings.waypoints[0]._latlng,
                address: settings.waypoints[0]._address
            };
            orsAaService.orsAaObj.info = element;
        };
        /**
         * Parses XML input to JSON object and stores data in orsAaObj
         * @param {String} response: XML response from server         
         */
        orsAaService.parseResponseToPolygonJSON = (response) => {
            response = orsUtilsService.domParser(response);
            console.log(response);
            let area = orsUtilsService.getElementsByTagNameNS(response, orsNamespaces.aas, 'AccessibilityGeometry')[0];
            if (area) {
                var isochrones = orsUtilsService.getElementsByTagNameNS(area, orsNamespaces.aas, 'IsochroneGeometry', true)[0];
                for (var i = 0; i < isochrones.length; i++) {
                    let element = {
                        geometry: {
                            coordinates: [],
                            type: 'Polygon'
                        },
                        type: 'Feature',
                        properties: {
                            value: i,
                            area: isochrones[i].attributes.area.value
                        }
                    };
                    let isochroneData = orsUtilsService.getElementsByTagNameNS(isochrones[i], orsNamespaces.gml, 'Polygon', true)[0][0];
                    const exteriorRing = orsUtilsService.getElementsByTagNameNS(isochroneData, orsNamespaces.gml, 'exterior', true)[0][0];
                    const interiorRingArr = orsUtilsService.getElementsByTagNameNS(isochroneData, orsNamespaces.gml, 'interior', true)[0];
                    let extIntArr = [];
                    if (exteriorRing) {
                        extIntArr.push(exteriorRing);
                    }
                    if (interiorRingArr) {
                        for (var j = 0; j < interiorRingArr.length; j++) {
                            extIntArr.push(interiorRingArr[j]);
                        }
                    }
                    poly = orsAaService.fetchPolygonGeometry(extIntArr, orsNamespaces.gml, 'pos');
                    element.geometry.coordinates = poly;
                    orsAaService.orsAaObj.isochrones.push(element);
                }
            }
        };
        /**
         * Convert element to polygon ring
         */
        orsAaService.fetchPolygonGeometry = (elements, ns, tag) => {
            var rings = [];
            for (var i = 0; i < elements.length; i++) {
                var polyPoints = [];
                _.each(orsUtilsService.getElementsByTagNameNS(elements[i], ns, tag), (polygonPos) => {
                    polygonPos = orsUtilsService.convertPositionStringToLonLat(polygonPos.firstChild.nodeValue);
                    polyPoints.push(polygonPos);
                });
                rings.push(polyPoints);
            }
            // construct polygon with holes
            return rings;
        };
        return orsAaService;
    }]);