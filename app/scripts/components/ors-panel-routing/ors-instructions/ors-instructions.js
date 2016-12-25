var $__app_47_scripts_47_components_47_ors_45_panel_45_routing_47_ors_45_instructions_47_ors_45_instructions_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-routing/ors-instructions/ors-instructions.js";
  var routeSubscriptionInstructions;
  angular.module('orsApp.ors-instructions', ['orsApp.ors-exportRoute-controls']).component('orsInstructions', {
    templateUrl: 'scripts/components/ors-panel-routing/ors-instructions/ors-instructions.html',
    bindings: {
      showInstructions: '&',
      shouldDisplayRouteDetails: '<'
    },
    controller: ['$scope', 'orsRouteService', 'orsSettingsFactory', 'orsErrorhandlerService', function($scope, orsRouteService, orsSettingsFactory, orsErrorhandlerService) {
      var ctrl = this;
      ctrl.profiles = lists.profiles;
      $scope.route = ctrl.route = orsRouteService.routeObj.routes[orsRouteService.getCurrentRouteIdx()];
      ctrl.routeIndex = orsRouteService.getCurrentRouteIdx();
      try {
        routeSubscriptionInstructions.dispose();
      } catch (error) {
        console.warn(error);
      }
      routeSubscriptionInstructions = orsRouteService.routesSubject.subscribe(function(routes) {
        console.info('subscribing to first route', routes);
        ctrl.routeIndex = orsRouteService.getCurrentRouteIdx();
        $scope.route = ctrl.route = routes[ctrl.routeIndex];
      });
      ctrl.waypoints = orsSettingsFactory.getWaypoints();
      ctrl.getClass = function(bool) {
        if (bool === true)
          return "fa fa-2x fa-fw fa-angle-down";
        else
          return "fa fa-2x fa-fw fa-angle-right";
      };
      ctrl.getIcon = function(code) {
        var direction = 'fa fa-arrow-up ';
        switch (code) {
          case -3:
            direction += 'fa-rotate-225';
            break;
          case 3:
            direction += 'fa-rotate-135';
            break;
          case -2:
            direction += 'fa-rotate-270';
            break;
          case 2:
            direction += 'fa-rotate-90';
            break;
          case -1:
            direction += 'fa-rotate-315';
            break;
          case 1:
            direction += 'fa-rotate-45';
            break;
          case 0:
            direction += '';
            break;
        }
        return direction;
      };
      ctrl.EmphSegment = function(idx) {
        var segmentStart = $scope.route.wayPoints[idx];
        var segmentEnd = $scope.route.wayPoints[idx + 1];
        var routeString = orsRouteService.routeObj.routes[ctrl.routeIndex].points;
        var geometry = _.slice(routeString, segmentStart, segmentEnd + 1);
        orsRouteService.Emph(geometry);
      };
      ctrl.DeEmph = function() {
        orsRouteService.DeEmph();
      };
      ctrl.EmphStep = function(pair) {
        var routeString = orsRouteService.routeObj.routes[ctrl.routeIndex].points;
        var geometry = _.slice(routeString, pair[0], pair[1] + 1);
        orsRouteService.Emph(geometry);
      };
      ctrl.zoomTo = function(idx) {
        var segmentStart = $scope.route.wayPoints[idx];
        var segmentEnd = $scope.route.wayPoints[idx + 1];
        var routeString = orsRouteService.routeObj.routes[ctrl.routeIndex].points;
        var geometry = _.slice(routeString, segmentStart, segmentEnd + 1);
        orsRouteService.zoomTo(geometry);
      };
      ctrl.zoomToStep = function(pair) {
        var routeString = orsRouteService.routeObj.routes[ctrl.routeIndex].points;
        var geometry = _.slice(routeString, pair[0], pair[1] + 1);
        orsRouteService.zoomTo(geometry);
      };
    }]
  });
  return {};
})();
