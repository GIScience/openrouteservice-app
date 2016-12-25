var $__app_47_scripts_47_components_47_ors_45_panel_45_routing_47_ors_45_summary_47_ors_45_summary_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-routing/ors-summary/ors-summary.js";
  var routeSubscription;
  angular.module('orsApp.ors-summary', []).component('orsSummaries', {
    templateUrl: 'scripts/components/ors-panel-routing/ors-summary/ors-summary.html',
    bindings: {
      showInstructions: '&',
      shouldDisplayRouteDetails: '<'
    },
    controller: ['orsSettingsFactory', 'orsMapFactory', 'orsObjectsFactory', 'orsRouteService', 'orsErrorhandlerService', function(orsSettingsFactory, orsMapFactory, orsObjectsFactory, orsRouteService, orsErrorhandlerService) {
      var ctrl = this;
      ctrl.profiles = lists.profiles;
      ctrl.setIdx = function(idx) {
        orsRouteService.setCurrentRouteIdx(idx);
      };
      ctrl.getIdx = function() {
        return orsRouteService.getCurrentRouteIdx();
      };
      if (angular.isDefined(orsRouteService.routeObj) && angular.isDefined(orsRouteService.routeObj.routes)) {
        if (orsRouteService.routeObj.routes.length > 0) {
          ctrl.routes = orsRouteService.routeObj.routes;
          var idx = ctrl.getIdx() === undefined ? 0 : ctrl.getIdx();
          orsRouteService.addRoute(ctrl.routes[idx].points);
        }
      }
      try {
        routeSubscription.dispose();
      } catch (error) {
        console.warn(error);
      }
      routeSubscription = orsRouteService.routesSubject.subscribe(function(routes) {
        ctrl.routes = routes;
        orsRouteService.setCurrentRouteIdx(0);
      });
      ctrl.EmphRoute = function(idx) {
        var geometry = orsRouteService.routeObj.routes[idx].points;
        orsRouteService.Emph(geometry);
      };
      ctrl.DeEmphRoute = function() {
        orsRouteService.DeEmph();
      };
    }]
  });
  return {};
})();
