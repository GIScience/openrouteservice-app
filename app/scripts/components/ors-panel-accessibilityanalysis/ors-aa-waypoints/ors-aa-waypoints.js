var $__app_47_scripts_47_components_47_ors_45_panel_45_accessibilityanalysis_47_ors_45_aa_45_waypoints_47_ors_45_aa_45_waypoints_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-accessibilityanalysis/ors-aa-waypoints/ors-aa-waypoints.js";
  angular.module('orsApp.ors-aa-waypoints', ['orsApp.ors-aa-waypoint']).component('orsAaWaypoints', {
    templateUrl: 'scripts/components/ors-panel-accessibilityanalysis/ors-aa-waypoints/ors-aa-waypoints.html',
    bindings: {
      orsMap: '<',
      orsParams: '<',
      activeProfile: '<',
      activeSubgroup: '<'
    },
    controller: function($scope, orsSettingsFactory, orsAaService, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService) {
      var ctrl = this;
      ctrl.$onInit = function() {
        ctrl.waypoints = orsSettingsFactory.getWaypoints();
        if (ctrl.waypoints.length == 0) {
          ctrl.waypoints = orsSettingsFactory.initWaypoints(1);
        }
        ctrl.showAdd = true;
      };
      ctrl.collapsed = false;
      ctrl.collapseIcon = "fa fa-minus-circle";
      ctrl.collapse = function() {
        ctrl.collapsed = ctrl.collapsed == true ? false : true;
        if (ctrl.collapsed == true) {
          ctrl.sortableOptions = {disabled: true};
          ctrl.collapseIcon = "fa fa-plus-circle";
        }
        if (ctrl.collapsed == false) {
          ctrl.sortableOptions = {disabled: false};
          ctrl.collapseIcon = "fa fa-minus-circle";
        }
      };
      ctrl.collapseWp = function(idx) {
        if (ctrl.collapsed == true) {
          if (idx == 0 || idx == ctrl.waypoints.length - 1) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      };
      ctrl.$doCheck = function() {};
      ctrl.waypointsChanged = function() {
        console.log('wps changed');
      };
      ctrl.resetWaypoints = function() {
        console.log(true);
        ctrl.waypoints = orsSettingsFactory.initWaypoints(1);
        orsAaService.initAaObj();
        orsSettingsFactory.updateWaypoints();
      };
      ctrl.addressChanged = function() {
        orsSettingsFactory.setWaypoints(ctrl.waypoints);
      };
      ctrl.calculate = function() {
        console.log(ctrl.currentOptions);
        orsSettingsFactory.setActiveOptions(ctrl.currentOptions);
      };
      if (angular.isDefined(orsAaService.orsAaObj)) {
        orsAaService.processResponseToMap();
      }
    }
  });
  return {};
})();
