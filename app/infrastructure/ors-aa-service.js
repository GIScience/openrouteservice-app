angular.module('orsApp.aa-service', []).factory('orsAaService', ['$http', 'orsUtilsService', 'orsMapFactory', 'orsObjectsFactory',
    function($http, orsUtilsService, orsMapFactory, orsObjectsFactory) {
        /**
         * Requests geocoding from ORS backend
         * @param {String} requestData: XML for request payload
         */
        let orsAaService = {};
        orsAaService.aaSubject = new Rx.Subject();
        /**
         * Requests accessiblity analysis from ORS backend
         * @param {String} requestData: XML for request payload
         */
        orsAaService.fetchAnalysis = function(requestData) {
            var url = namespaces.services.analyse;
            return $http({
                method: 'POST',
                url: url,
                data: requestData
            });
        };
        /**
         * builds and sends the service request
         * @param {Object} position: OL LonLat or Point representing the reference point
         * @param {int} distanceInMinutes: radius of the analysis
         * @param {Object} successCallback: function callback
         * @param {Object} failureCallback: function callback
         */
        orsAaService.generateAnalysisRequest = function(settings) {
                console.log(settings);
                var writer = new XMLWriter('UTF-8', '1.0');
                writer.writeStartDocument();
                //<aas:AAS>
                writer.writeElementString('aas:AAS');
                writer.writeAttributeString('version', '1.0');
                writer.writeAttributeString('xmlns:aas', namespaces.aas);
                writer.writeAttributeString('xmlns:xsi', namespaces.xsi);
                writer.writeAttributeString('xsi:schemaLocation', namespaces.schemata.analyseService);
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
                writer.writeAttributeString('Duration', 'PT0H' + settings.profile.options.analysis_options.minutes + 'M00S');
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
                writer.writeElementString('aas:Interval', settings.profile.options.analysis_options.interval.toString() || '1000');
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
                writer.writeAttributeString('xmlns:gml', namespaces.gml);
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
            }
            /**
             * Requests accessiblity analysis from ORS backend
             * @param {String} requestData: XML for request payload
             */
        orsAaService.parseResponseToPolygon = function(response) {
            response = orsUtilsService.domParser(response.data);
            var area = orsUtilsService.getElementsByTagNameNS(response, namespaces.aas, 'AccessibilityGeometry');
            var poly, isoChroneTime, isoChroneGeometry, collectionArr;
            var collectionArrGeom = [];
            console.log(area);
            if (area) {
                try {
                    isoChroneTime = orsUtilsService.getElementsByTagNameNS(area[0], namespaces.gml, 'Isochrone', true)[0];
                    isoChroneGeometry = orsUtilsService.getElementsByTagNameNS(isoChroneTime[0], namespaces.gml, 'IsochroneGeometry', true)[0];
                    collectionArr = orsUtilsService.getElementsByTagNameNS(isoChroneGeometry[0], namespaces.gml, 'Polygon', true)[0];
                } catch (err) {
                    var collectionArr = orsUtilsService.getElementsByTagNameNS(area[0], namespaces.gml, 'Polygon', true)[0];
                }
                for (var i = 0; i < collectionArr.length; i++) {
                    if (collectionArr[i].getElementsByTagNameNS) {
                        var exteriorRing = collectionArr[i].getElementsByTagNameNS(namespaces.gml, 'exterior')[0];
                        var interiorRingArr = orsUtilsService.getElementsByTagNameNS(collectionArr[i], namespaces.gml, 'interior', true)[0];
                        var extIntArr = [];
                        if (exteriorRing) {
                            extIntArr.push(exteriorRing);
                        }
                        if (interiorRingArr) {
                            for (var j = 0; j < interiorRingArr.length; j++) {
                                extIntArr.push(interiorRingArr[j]);
                            }
                        }
                        poly = orsAaService.fetchPolygonGeometry(extIntArr, namespaces.gml, 'pos');
                        collectionArrGeom.push(poly);
                    }
                }
            }
            orsAaService.processResponseToMap(collectionArrGeom);
            return collectionArrGeom;
        };
        orsAaService.fetchPolygonGeometry = function(elements, ns, tag) {
            var rings = [];
            for (var i = 0; i < elements.length; i++) {
                var polyPoints = [];
                _.each(orsUtilsService.getElementsByTagNameNS(elements[i], ns, tag), function(polygonPos) {
                    polygonPos = orsUtilsService.convertPositionStringToLonLat(polygonPos.firstChild.nodeValue);
                    polyPoints.push(polygonPos);
                });
                rings.push(polyPoints);
            }
            // construct polygon with holes
            return rings;
        };
        /**
         * Requests accessiblity analysis from ORS backend
         * @param {LatLng} polygon: Leaflet polygon containting the aa area
         */
        orsAaService.processResponseToMap = function(polygon) {
            //clear map
            console.log(polygon);
            let action = orsObjectsFactory.createMapAction(2, lists.layers[3], undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
            //Add polygon to aa layer
            action = orsObjectsFactory.createMapAction(3, lists.layers[3], polygon, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        }
        return orsAaService;
    }
]);