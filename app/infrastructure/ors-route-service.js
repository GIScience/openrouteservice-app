angular.module('orsApp.route-service', []).factory('orsRouteService', ['$q', '$http', 'orsUtilsService', 'orsMapFactory', 'orsObjectsFactory', ($q, $http, orsUtilsService, orsMapFactory, orsObjectsFactory) => {
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
        var url = orsNamespaces.services.routing;
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
    orsRouteService.addRoute = (geometry) => {
        const routePadding = orsObjectsFactory.createMapAction(1, lists.layers[1], geometry, undefined, lists.layerStyles.routePadding());
        orsMapFactory.mapServiceSubject.onNext(routePadding);
        const routeLine = orsObjectsFactory.createMapAction(1, lists.layers[1], geometry, undefined, lists.layerStyles.route());
        orsMapFactory.mapServiceSubject.onNext(routeLine);
    };
    /** prepare route to json */
    orsRouteService.processResponse = (data, profile) => {
        orsRouteService.data = data;
        let cnt = 0;
        _.each(orsRouteService.data.routes, (route) => {
            const geometry = orsUtilsService.decodePolyline(route.geometry);
            route.geometry = geometry;
            if (cnt == 0) orsRouteService.addRoute(geometry);
            cnt += 1;
        });
        orsRouteService.routesSubject.onNext(orsRouteService.data);
    };
    return orsRouteService;
}]);