var $__app_47_scripts_47_infrastructure_47_ors_45_objects_45_service_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/infrastructure/ors-objects-service.js";
  angular.module('orsApp.objects-service', []).factory('orsObjectsFactory', function() {
    var waypoint = function() {
      function waypoint(address, latlng, set) {
        this._address = address;
        this._latlng = latlng;
        this._set = set;
      }
      return ($traceurRuntime.createClass)(waypoint, {}, {});
    }();
    var mapAction = function() {
      function mapAction(aCode, layerCode, geometry, fId, style) {
        this._actionCode = aCode;
        this._package = {
          layerCode: layerCode,
          geometry: geometry,
          featureId: fId,
          style: style
        };
      }
      return ($traceurRuntime.createClass)(mapAction, {}, {});
    }();
    return {
      createWaypoint: function(address, latlng) {
        var set = arguments[2] !== (void 0) ? arguments[2] : 0;
        return new waypoint(address, latlng, set);
      },
      createMapAction: function(actionCode, layerCode) {
        var geometry = arguments[2];
        var featureId = arguments[3];
        var style = arguments[4];
        return new mapAction(actionCode, layerCode, geometry, featureId, style);
      }
    };
  });
  return {};
})();
