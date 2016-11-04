angular.module('orsApp.map-service', []).factory('orsMapFactory', ['$q',
    function($q) {
        var deferred = $q.defer();
        var mapServiceSubject = new Rx.Subject();
        /** Subscription function to current route object. */
        subscribeToMapFunctions = (o) => {
            return mapServiceSubject.subscribe(o);
        };
        return {
            map: deferred.promise,
            subscribeToMapFunctions: subscribeToMapFunctions,
            mapServiceSubject: mapServiceSubject,
            initMap: (element) => {
                deferred.resolve(new L.Map(element));
            },
            initMapA: (element) => {
                return new L.Map(element, {
                    zoomControl: true,
                    layerControl: true,
                    tap: true
                });
            }
        };
    }
]);