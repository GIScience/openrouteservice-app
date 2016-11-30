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
            let tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
                // var dist = util.convertDistanceFormat(d.distance, preferences.distanceUnit);
                // return d.percentage + '% ' + d.typetranslated + ' (' + dist[1] + ' ' + dist[2] + ')';
                return d.percentage + '% ' + '(' + d.distance + ')';
            });
            data = [];
            let keys = _.keysIn(scope.obj).map(Number);
            keys = _.sortBy(keys);
            _.forEach(keys, function(key) {
                data.push(scope.obj[key]);
            });
            let margin = {
                    top: 0,
                    right: 10,
                    bottom: 0,
                    left: 10
                },
                width = 330 - margin.left - margin.right,
                height = 30 - margin.top - margin.bottom;
            let y = d3.scaleLinear().rangeRound([height, 0]);
            let x = d3.scaleLinear().rangeRound([0, width]);
            let xAxis = d3.axisBottom().scale(x);
            let yAxis = d3.axisLeft().scale(y);
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
            let legendRectSize = 7;
            let legendSpacing = 7;
            let legendTotalHeight = 0;
            let legendContainer = svg.append("g");
            let legend = legendContainer.selectAll('.legend').data(data).enter().append('g').attr('class', 'legend').attr('transform', function(d, i) {
                let legendHeight = legendRectSize + legendSpacing;
                let vert = height * 1.1 + i * legendHeight;
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
            svg.attr("height", 40);
            if (keys.length > 1) {
                let show = false;
                let expandText = svg.append("text").style("text-anchor", "end").attr("x", "310").attr("y", 40).text('show more').on("click", function() {
                    // Determine if current line is visible
                    show = show === false ? true : false;
                    if (show === true) {
                        svg.attr("height", legendTotalHeight + height);
                        expandText.text('show less');
                    } else {
                        svg.attr("height", 40);
                        expandText.text('show more');
                    }
                    // Hide or show the elements
                });
            }
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