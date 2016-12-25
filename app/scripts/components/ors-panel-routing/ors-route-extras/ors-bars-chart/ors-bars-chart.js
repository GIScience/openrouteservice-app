var $__app_47_scripts_47_components_47_ors_45_panel_45_routing_47_ors_45_route_45_extras_47_ors_45_bars_45_chart_47_ors_45_bars_45_chart_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-routing/ors-route-extras/ors-bars-chart/ors-bars-chart.js";
  angular.module('orsApp.ors-bars-chart', []).directive('orsBarsChart', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        key: '<',
        obj: '<',
        routeIndex: '<'
      },
      template: '<div class="ors-bars"></div>',
      link: function(scope, element, attrs, fn) {
        var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
          return d.percentage + '% ' + '(' + scope.distanceFilter(d.distance) + ')';
        });
        data = [];
        var keys = _.keysIn(scope.obj).map(Number);
        keys = _.sortBy(keys);
        _.forEach(keys, function(key) {
          data.push(scope.obj[key]);
        });
        var margin = {
          top: 0,
          right: 10,
          bottom: 0,
          left: 10
        },
            width = 330 - margin.left - margin.right,
            height = 30 - margin.top - margin.bottom;
        var y = d3.scaleLinear().rangeRound([height, 0]);
        var x = d3.scaleLinear().rangeRound([0, width]);
        var xAxis = d3.axisBottom().scale(x);
        var yAxis = d3.axisLeft().scale(y);
        var svg = d3.select(element[0]).append("svg").attr("width", width).attr("height", height);
        y.domain([0]);
        x.domain([0, _.last(data).y1]);
        svg.append("g").selectAll("rect").data(data).enter().append("rect").attr("height", 26).attr("x", function(d) {
          return x(d.y0) / 1;
        }).attr("width", function(d) {
          return x(d.y1) / 1 - x(d.y0) / 1;
        }).attr("title", function(d) {
          return (d.y1 - d.y0) + "% : " + d.type;
        }).style("fill", function(d, i) {
          return d.color;
        }).on('mouseover', function(d) {
          scope.EmphSegment(d.intervals);
          tip.show(d);
        }).on('mouseout', function(d) {
          scope.DeEmphSegment();
          tip.hide(d);
        }).on('click', function(d) {
          scope.ZoomToSegment(d.intervals);
        });
        var legendRectSize = 7;
        var legendSpacing = 7;
        var legendTotalHeight = 0;
        var legendContainer = svg.append("g");
        var legend = legendContainer.selectAll('.legend').data(data).enter().append('g').attr('class', 'legend').attr('transform', function(d, i) {
          var legendHeight = legendRectSize + legendSpacing;
          var vert = height * 1.1 + i * legendHeight;
          legendTotalHeight += legendHeight;
          return 'translate(' + 0 + ',' + vert + ')';
        });
        legend.append('rect').attr('width', legendRectSize).attr('height', legendRectSize).style('fill', function(d, i) {
          return d.color;
        });
        legend.append('text').attr('x', legendRectSize + legendSpacing).attr('y', legendRectSize).text(function(d) {
          return d.type;
        });
        legend.on('mouseover', function(d) {
          scope.EmphSegment(d.intervals);
        });
        legend.on('mouseout', function(d) {
          scope.DeEmphSegment();
        });
        svg.attr("height", 40);
        if (keys.length > 1) {
          var show = false;
          var expandText = svg.append("text").style("text-anchor", "end").attr("x", "310").attr("y", 40).text('show more').on("click", function() {
            show = show === false ? true : false;
            if (show === true) {
              svg.attr("height", legendTotalHeight + height);
              expandText.text('show less');
            } else {
              svg.attr("height", 40);
              expandText.text('show more');
            }
          });
        }
        svg.call(tip);
      },
      controller: ['$scope', '$filter', 'orsRouteService', function($scope, $filter, orsRouteService) {
        $scope.distanceFilter = $filter('distance');
        $scope.EmphSegment = function(segments) {
          _.forEach(segments, function(pair) {
            var routeString = orsRouteService.routeObj.routes[$scope.routeIndex].points;
            var geometry = _.slice(routeString, pair[0], pair[1] + 1);
            orsRouteService.Emph(geometry);
          });
        };
        $scope.DeEmphSegment = function() {
          orsRouteService.DeEmph();
        };
        $scope.ZoomToSegment = function() {
          console.log('TO DO!');
        };
      }]
    };
  });
  return {};
})();
