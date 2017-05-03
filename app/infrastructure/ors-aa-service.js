    angular.module('orsApp.aa-service', []).factory('orsAaService', ['$http', '$q', 'orsUtilsService', 'orsMapFactory', 'orsObjectsFactory', 'lists', 'ENV', ($http, $q, orsUtilsService, orsMapFactory, orsObjectsFactory, lists, ENV) => {
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
        orsAaService.toggleQuery = (idx, isochronesObj, zoomTo = false) => {
            let action;
            action = orsObjectsFactory.createMapAction(4, lists.layers[3], isochronesObj.features, idx);
            orsMapFactory.mapServiceSubject.onNext(action);
            action = orsObjectsFactory.createMapAction(8, lists.layers[5], isochronesObj.info.query.locations[0], idx);
            orsMapFactory.mapServiceSubject.onNext(action);
            if (zoomTo) {
                action = orsObjectsFactory.createMapAction(0, lists.layers[5], isochronesObj.features[isochronesObj.features.length - 1].geometry.coordinates, undefined, undefined);
                orsMapFactory.mapServiceSubject.onNext(action);
            }
        };
        orsAaService.removeQuery = (idx) => {
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
            orsAaService.orsAaObj = data;
            // add geocode address
            orsAaService.orsAaObj.info.address = settings.waypoints[0]._address;
            // reverse order, needed as leaflet ISO 6709
            for (let i = 0; i < orsAaService.orsAaObj.features.length; i++) {
                for (let j = 0; j < orsAaService.orsAaObj.features[i].geometry.coordinates[0].length; j++) {
                    orsAaService.orsAaObj.features[i].geometry.coordinates[0][j].reverse();
                }
            }
            // split ranges into list
            orsAaService.orsAaObj.info.query.ranges = orsAaService.orsAaObj.info.query.ranges.split(',');
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
        orsAaService.getIsochrones = (requestData) => {
            console.log(requestData)
            var url = ENV.analyse;
            var canceller = $q.defer();
            var cancel = (reason) => {
                canceller.resolve(reason);
            };
            var promise = $http.get(url, {
                params: requestData,
                timeout: canceller.promise
            }).then((response) => {
                return response.data;
            });
            return {
                promise: promise,
                cancel: cancel
            };
        };
        return orsAaService;
    }]);