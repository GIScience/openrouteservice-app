angular.module("orsApp.map-service", []).factory("orsMapFactory", [
  () => {
    var mapServiceSubject = new Rx.Subject();
    /** Subscription function to current route object. */
    var subscribeToMapFunctions = o => {
      return mapServiceSubject.subscribe(o);
    };
    return {
      subscribeToMapFunctions: subscribeToMapFunctions,
      mapServiceSubject: mapServiceSubject,
      initMap: element => {
        const southWest = L.latLng(-89.98155760646617, -180),
          northEast = L.latLng(89.99346179538875, 180);
        const bounds = L.latLngBounds(southWest, northEast);

        return L.map(element, {
          zoomControl: false,
          layerControl: true,
          tap: true,
          editable: true,
          maxBounds: bounds,
          minZoom: 2,
          maxZoom: 18
        });
      }
    };
  }
]);
