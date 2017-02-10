angular.module('orsApp.map-service', []).factory('orsMapFactory', [
    () => {
        var mapServiceSubject = new Rx.Subject();
        /** Subscription function to current route object. */
        var subscribeToMapFunctions = (o) => {
            return mapServiceSubject.subscribe(o);
        };
        return {
            subscribeToMapFunctions: subscribeToMapFunctions,
            mapServiceSubject: mapServiceSubject,
            initMap: (element) => {
                return L.map(element, {
                    zoomControl: true,
                    layerControl: true,
                    tap: true,
                    editable: true
                });
            }
        };
    }
]);