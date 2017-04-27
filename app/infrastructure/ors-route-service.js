angular.module('orsApp.route-service', []).factory('orsRouteService', ['$q', '$http', 'orsUtilsService', 'orsMapFactory', 'orsObjectsFactory', 'lists', 'ENV', ($q, $http, orsUtilsService, orsMapFactory, orsObjectsFactory, lists, ENV) => {
    /**
     * Requests geocoding from ORS backend
     * @param {String} requestData: XML for request payload
     */
    let orsRouteService = {};
    orsRouteService.routesSubject = new Rx.BehaviorSubject({});
    orsRouteService.resetRoute = () => {
        orsRouteService.routeObj = {};
        orsRouteService.routesSubject.onNext([]);
        let action = orsObjectsFactory.createMapAction(2, lists.layers[1], undefined, undefined);
        orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.routingRequests = {};
    orsRouteService.routingRequests.requests = [];
    orsRouteService.routingRequests.clear = () => {
        for (let req of orsRouteService.routingRequests.requests) {
            if ('cancel' in req) req.cancel("Cancel last request");
        }
        orsRouteService.routingRequests.requests = [];
    };
    /**
     * Requests route from ORS backend
     * @param {String} requestData: XML for request payload
     */
    orsRouteService.fetchRoute = (requestData) => {
        var url = ENV.routing;
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
    orsRouteService.setCurrentRouteIdx = (idx) => {
        orsRouteService.currentRouteIdx = idx;
    };
    orsRouteService.getCurrentRouteIdx = () => {
        return orsRouteService.currentRouteIdx;
    };
    orsRouteService.DeEmph = () => {
        let action = orsObjectsFactory.createMapAction(2, lists.layers[2], undefined, undefined);
        orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.Emph = (geom) => {
        let action = orsObjectsFactory.createMapAction(1, lists.layers[2], geom, undefined, lists.layerStyles.routeEmph());
        orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.zoomTo = (geom) => {
        let action = orsObjectsFactory.createMapAction(0, lists.layers[2], geom, undefined);
        orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.addRoute = (geometry, focusIdx) => {
        const routePadding = orsObjectsFactory.createMapAction(1, lists.layers[1], geometry, undefined, lists.layerStyles.routePadding());
        orsMapFactory.mapServiceSubject.onNext(routePadding);
        const routeLine = orsObjectsFactory.createMapAction(1, lists.layers[1], geometry, undefined, lists.layerStyles.route());
        orsMapFactory.mapServiceSubject.onNext(routeLine);
        if (focusIdx) {
            const zoomTo = orsObjectsFactory.createMapAction(0, lists.layers[1], geometry, undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(zoomTo);
        }
    };
    orsRouteService.addHeightgraph = (geometry) => {
        const heightgraph = orsObjectsFactory.createMapAction(-1, undefined, geometry, undefined, undefined);
        orsMapFactory.mapServiceSubject.onNext(heightgraph);
    };
    orsRouteService.removeHeightgraph = () => {
        const heightgraph = orsObjectsFactory.createMapAction(-1, undefined, undefined, undefined, undefined);
        orsMapFactory.mapServiceSubject.onNext(heightgraph);
    };
    /** prepare route to json */
    orsRouteService.processResponse = (data, profile, focusIdx) => {
        orsRouteService.data = data;
        let cnt = 0;
        angular.forEach(orsRouteService.data.routes, function(route) {
            //const geometry = orsUtilsService.decodePolyline(route.geometry, route.elevation);
            route.geometryRaw = angular.copy(route.geometry.coordinates);
            let geometry = route.geometry.coordinates;
            // reverse order, needed as leaflet ISO 6709
            for (let i = 0; i < geometry.length; i++) {
                let lng = geometry[i][0];
                let lat = geometry[i][1];
                geometry[i][0] = lat;
                geometry[i][1] = lng;
            }
            route.geometry = geometry;
            if (cnt == 0) {
                if (route.elevation) {
                    // process heightgraph data
                    const hgGeojson = orsRouteService.processHeightgraphData(route);
                    orsRouteService.addHeightgraph(hgGeojson);
                } else {
                    orsRouteService.removeHeightgraph();
                }
                orsRouteService.addRoute(geometry, focusIdx);
            }
            cnt += 1;
        });
        orsRouteService.routesSubject.onNext(orsRouteService.data);
    };
    /* process heightgraph geojson object */
    orsRouteService.processHeightgraphData = (route) => {
        const routeString = route.geometryRaw;
        let hgData = [];
        for (let key in route.extras) {
            let extra = [];
            for (let item of route.extras[key].values) {
                let chunk = {};
                const from = item[0];
                const to = item[1];
                const geometry = routeString.slice(from, to + 1);
                chunk.line = geometry;
                const typenumber = item[2];
                chunk.attributeType = typenumber;
                extra.push(chunk);
            }
            extra = GeoJSON.parse(extra, {
                LineString: 'line',
                extraGlobal: {
                    'Creator': 'OpenRouteService.org',
                    'records': extra.length,
                    'summary': key
                }
            });
            // console.log(JSON.stringify(extra))
            hgData.push(extra);
        }
        return hgData;
    };
    return orsRouteService;
}]);