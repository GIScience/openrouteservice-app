var $__app_47_scripts_47_infrastructure_47_ors_45_map_45_service_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/infrastructure/ors-map-service.js";
  angular.module('orsApp.map-service', []).factory('orsMapFactory', ['$q', function($q) {
    var deferred = $q.defer();
    var mapServiceSubject = new Rx.Subject();
    var subscribeToMapFunctions = function(o) {
      return mapServiceSubject.subscribe(o);
    };
    return {
      map: deferred.promise,
      subscribeToMapFunctions: subscribeToMapFunctions,
      mapServiceSubject: mapServiceSubject,
      initMap: function(element) {
        deferred.resolve(new L.Map(element));
      },
      initMapA: function(element) {
        return new L.Map(element, {
          zoomControl: true,
          layerControl: true,
          tap: true
        });
      }
    };
  }]);
  return {};
})();
