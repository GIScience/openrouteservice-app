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
                // var dist = util.convertDistanceFormat(d.distance, preferences.distanceUnit);
                // return d.percentage + '% ' + d.typetranslated + ' (' + dist[1] + ' ' + dist[2] + ')';
                return d.type;
            });
            data = [];
            let keys = _.keysIn(scope.obj).map(Number);
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
                // not implemented yet
                scope.ZoomToSegment(d.intervals);
            });
            var legendRectSize = 7;
            var legendSpacing = 7;
            var legendTotalHeight = 0;
            var legend = svg.selectAll('.legend').data(data).enter().append('g').attr('class', 'legend').attr('transform', function(d, i) {
                var legendHeight = legendRectSize + legendSpacing;
                var vert = height * 1.1 + i * legendHeight;
                legendTotalHeight += legendHeight;
                return 'translate(' + 0 + ',' + vert + ')';
            });
            legend.append('rect') // NEW
                .attr('width', legendRectSize).attr('height', legendRectSize).style('fill', function(d, i) {
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
            svg.attr("height", legendTotalHeight + height);
            svg.call(tip);
        },
        controller: ['$scope', 'orsRouteService',
            function($scope, orsRouteService) {
                $scope.EmphSegment = (segments) => {
                    _.forEach(segments, function(pair) {
                        const routeString = orsRouteService.routeObj.routes[$scope.routeIndex].points;
                        const geometry = _.slice(routeString, pair[0], pair[1] + 1);
                        orsRouteService.Emph(geometry);
                    });
                };
                $scope.DeEmphSegment = () => {
                    orsRouteService.DeEmph();
                };
                $scope.ZoomToSegment = () => {
                    console.log('TO DO!')
                };
            }
        ]
    };
});