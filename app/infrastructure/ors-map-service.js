angular.module('orsApp.map-service', []).factory('orsMapFactory', ['$q',
    function($q) {
        var deferred = $q.defer();
        return {
            map: deferred.promise,
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