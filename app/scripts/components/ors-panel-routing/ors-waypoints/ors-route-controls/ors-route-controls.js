var $__app_47_scripts_47_components_47_ors_45_panel_45_routing_47_ors_45_waypoints_47_ors_45_route_45_controls_47_ors_45_route_45_controls_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-route-controls.js";
  angular.module('orsApp.ors-route-controls', ['orsApp.ors-importRoute-controls']).component('orsRouteControls', {
    templateUrl: 'scripts/components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-route-controls.html',
    controller: ['$location', 'orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsErrorhandlerService', 'orsMapFactory', 'orsCookiesFactory', function($location, orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsMapFactory, orsCookiesFactory) {
      var ctrl = this;
      ctrl.showOptions = false;
      ctrl.add = function() {
        ctrl.onAdd();
        ctrl.showAdd = true;
      };
      ctrl.reset = function() {
        ctrl.onReset();
      };
      ctrl.reversing = function() {
        ctrl.onReverse();
        ctrl.onWaypointsChanged();
      };
      ctrl.callOptions = function() {
        ctrl.showOptions = ctrl.showOptions == false ? true : false;
      };
      ctrl.zoom = function() {
        var action = orsObjectsFactory.createMapAction(0, undefined, undefined, undefined);
        orsMapFactory.mapServiceSubject.onNext(action);
      };
    }],
    bindings: {
      onAdd: '&',
      onReset: '&',
      onReverse: '&',
      onWaypointsChanged: '&',
      showAdd: '=',
      activeSubgroup: '<',
      activeProfile: '<'
    }
  });
  return {};
})();
