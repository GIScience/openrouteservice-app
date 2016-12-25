var $__app_47_scripts_47_components_47_ors_45_panel_45_routing_47_ors_45_waypoints_47_ors_45_waypoints_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-routing/ors-waypoints/ors-waypoints.js";
  angular.module('orsApp.ors-waypoints', ['orsApp.ors-waypoint', 'orsApp.ors-route-controls']).component('orsWaypoints', {
    templateUrl: 'scripts/components/ors-panel-routing/ors-waypoints/ors-waypoints.html',
    bindings: {
      orsMap: '<',
      orsParams: '<',
      activeProfile: '<',
      activeSubgroup: '<'
    },
    controller: ['orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRouteService', 'orsRequestService', 'orsErrorhandlerService', 'orsParamsService', function(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRouteService, orsRequestService, orsErrorhandlerService, orsParamsService) {
      var ctrl = this;
      ctrl.$onInit = function() {
        ctrl.waypoints = orsSettingsFactory.getWaypoints();
        if (ctrl.waypoints.length == 0) {
          ctrl.waypoints = orsSettingsFactory.initWaypoints(2);
        }
        ctrl.showAdd = true;
      };
      orsSettingsFactory.subscribeToWaypoints(function onNext(d) {
        console.log('waypoints updated!!! panel', d);
        ctrl.waypoints = d;
      });
      ctrl.collapsed = false;
      ctrl.collapseIcon = "fa fa-chevron-down";
      ctrl.collapse = function() {
        ctrl.collapsed = ctrl.collapsed == true ? false : true;
        if (ctrl.collapsed == true) {
          ctrl.sortableOptions.disabled = true;
          ctrl.collapseIcon = "fa fa-chevron-right";
        }
        if (ctrl.collapsed == false) {
          ctrl.sortableOptions.disabled = false;
          ctrl.collapseIcon = "fa fa-chevron-down";
        }
      };
      ctrl.showViapoints = function(idx) {
        if (ctrl.collapsed == true) {
          if (ctrl.waypoints.length > 2) {
            if (idx == 0) {
              return true;
            } else {
              return false;
            }
          }
        } else {
          return false;
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
      ctrl.deleteWaypoint = function(idx) {
        var toggleRequest = (ctrl.waypoints[idx]._set == 1) ? true : false;
        if (ctrl.waypoints.length == 2) {
          var wp = orsObjectsFactory.createWaypoint('', new L.latLng());
          ctrl.waypoints[idx] = wp;
        } else {
          ctrl.waypoints.splice(idx, 1);
        }
        orsRequestService.geocodeRequests.removeRequest(idx);
        orsSettingsFactory.setWaypoints(ctrl.waypoints, toggleRequest);
      };
      ctrl.reverseWaypoints = function() {
        ctrl.waypoints.reverse();
        orsSettingsFactory.setWaypoints(ctrl.waypoints);
      };
      ctrl.resetWaypoints = function() {
        orsRouteService.resetRoute();
        ctrl.waypoints = orsSettingsFactory.initWaypoints(2);
        orsSettingsFactory.updateWaypoints();
      };
      ctrl.addWaypoint = function() {
        var wp = orsObjectsFactory.createWaypoint('', new L.latLng());
        ctrl.waypoints.push(wp);
        orsSettingsFactory.setWaypoints(ctrl.waypoints, false);
      };
      ctrl.addressChanged = function() {
        orsSettingsFactory.setWaypoints(ctrl.waypoints, true);
      };
      ctrl.sortableOptions = {
        axis: 'y',
        containment: 'parent',
        activate: function() {},
        beforeStop: function() {},
        change: function() {},
        create: function() {},
        deactivate: function() {},
        out: function() {},
        over: function() {},
        receive: function() {},
        remove: function() {},
        sort: function() {},
        start: function() {},
        update: function(e, ui) {},
        stop: function(e, ui) {
          orsSettingsFactory.setWaypoints(ctrl.waypoints, true);
        }
      };
    }]
  });
  return {};
})();
