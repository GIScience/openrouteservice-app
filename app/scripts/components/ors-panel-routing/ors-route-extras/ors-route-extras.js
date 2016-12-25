var $__app_47_scripts_47_components_47_ors_45_panel_45_routing_47_ors_45_route_45_extras_47_ors_45_route_45_extras_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-routing/ors-route-extras/ors-route-extras.js";
  angular.module('orsApp.ors-route-extras', ['orsApp.ors-bars-chart']).component('orsRouteExtras', {
    templateUrl: 'scripts/components/ors-panel-routing/ors-route-extras/ors-route-extras.html',
    bindings: {
      currentRoute: '<',
      routeIndex: '<'
    },
    controller: ['$scope', 'orsErrorhandlerService', function($scope, orsErrorhandlerService) {
      var ctrl = this;
      ctrl.mappings = mappings;
      ctrl.processExtras = function(currentRoute, key) {
        var totalDistance = currentRoute.summary.distance;
        var extras = {};
        _.forEach(currentRoute.extras[key], function(elem, i) {
          var fr = parseInt(elem.fr),
              to = parseInt(elem.to) + 1;
          if (fr !== to) {
            var typeNumber = parseInt(elem.value) + 5;
            var routeSegment = currentRoute.points.slice(fr, to);
            var sumDistance = 0;
            for (var i$__2 = 0; i$__2 < routeSegment.length - 1; i$__2++) {
              var latLngA = L.latLng(routeSegment[i$__2][0], routeSegment[i$__2][1]);
              var latLngB = L.latLng(routeSegment[i$__2 + 1][0], routeSegment[i$__2 + 1][1]);
              sumDistance += latLngA.distanceTo(latLngB);
            }
            if (typeNumber in extras) {
              extras[typeNumber].distance += sumDistance;
              extras[typeNumber].intervals.push([fr, to]);
            } else {
              var text = ctrl.mappings[key][typeNumber].text;
              var color = ctrl.mappings[key][typeNumber].color;
              if (key == 'gradients') {
                if (typeNumber > 5) {
                  text = ctrl.mappings[key][typeNumber].text;
                } else if (typeNumber < 5) {
                  text = ctrl.mappings[key][typeNumber].text;
                } else if (typeNumber == 5) {
                  text = ctrl.mappings[key][typeNumber].text;
                }
              }
              extras[typeNumber] = {
                type: text,
                distance: sumDistance,
                intervals: [[fr, to]],
                percentage: 0,
                y0: 0,
                y1: 0,
                color: color
              };
            }
          }
        });
        var y0 = 0;
        for (var obj in extras) {
          if (Math.round(extras[obj].distance / totalDistance * 100) < 1) {
            extras[obj].percentage = Math.round(extras[obj].distance / totalDistance * 100 * 10) / 10;
          } else {
            extras[obj].percentage = Math.round(extras[obj].distance / totalDistance * 100);
          }
          extras[obj].y0 = y0;
          extras[obj].y1 = y0 += +extras[obj].percentage;
        }
        return extras;
      };
      ctrl.routeExtras = [];
      $scope.$watch('$ctrl.currentRoute', function(route) {
        ctrl.routeExtras = [];
        console.log(true);
        ctrl.routeExtras.push({
          data: ctrl.processExtras(route, 'gradients'),
          type: 'gradients',
          routeIndex: ctrl.routeIndex
        });
      });
    }]
  });
  return {};
})();
