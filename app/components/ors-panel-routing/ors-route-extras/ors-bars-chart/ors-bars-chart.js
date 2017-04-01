angular.module('orsApp.ors-bars-chart', []).directive('orsBarsChart', () => {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            key: '<',
            typesOrder: '<',
            obj: '<',
            routeIndex: '<'
        },
        template: '<div class="ors-bars"></div>',
        link: (scope, element, attrs, fn) => {
            let tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html((d) => {
                return d.percentage + '% ' + scope.translateFilter(d.type) + ' (' + scope.distanceFilter(d.distance) + ')';
            });
            let data = [];
            angular.forEach(scope.typesOrder, function(type) {
                data.push(scope.obj[type]);
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
            x.domain([0, data[data.length - 1].y1]);
            svg.append("g").selectAll("rect").data(data).enter().append("rect").attr("height", 26).attr("x", (d) => {
                return x(d.y0) / 1;
            }).attr("width", (d) => {
                return x(d.y1) / 1 - x(d.y0) / 1;
            }).attr("title", (d) => {
                return (d.y1 - d.y0) + "% : " + d.type;
            }).style("fill", (d, i) => {
                return d.color;
            }).on('mouseover', (d) => {
                scope.EmphSegment(d.intervals);
                tip.show(d);
            }).on('mouseout', (d) => {
                scope.DeEmphSegment();
                tip.hide(d);
            }).on('click', (d) => {
                // not implemented yet
                scope.ZoomToSegment(d.intervals);
            });
            let legendRectSize = 7;
            let legendSpacing = 7;
            let legendTotalHeight = 0;
            let legendContainer = svg.append("g");
            let legend = legendContainer.selectAll('.chart-legend').data(data).enter().append('g').attr('class', '.chart-legend').attr('transform', (d, i) => {
                let legendHeight = legendRectSize + legendSpacing;
                let vert = height * 1.1 + i * legendHeight;
                legendTotalHeight += legendHeight;
                return 'translate(' + 0 + ',' + vert + ')';
            });
            legend.append('rect').attr('width', legendRectSize).attr('height', legendRectSize).style('fill', (d, i) => {
                return d.color;
            });
            legend.append('text').style("font-size", "11px").attr('x', legendRectSize + legendSpacing).attr('y', legendRectSize).text((d) => {
                return scope.translateFilter(d.type) + ' (' + d.percentage + '%)';
            });
            legend.on('mouseover', (d) => {
                scope.EmphSegment(d.intervals);
            });
            legend.on('mouseout', (d) => {
                scope.DeEmphSegment();
            });
            svg.attr("height", 45);
            if (scope.typesOrder.length > 1) {
                let show = false;
                let expand = svg.append('path').attr("transform", "translate(300,35) rotate(90)").attr("class", "pointer").style("fill", "#444").attr("d", d3.symbol().type(d3.symbolTriangle).size(35)).style("font-size", "11px").on("click", () => {
                    // Determine if current line is visible
                    show = show === false ? true : false;
                    if (show === true) {
                        svg.attr("height", legendTotalHeight + height);
                        expand.attr("transform", "translate(300,35) rotate(180)");
                    } else {
                        svg.attr("height", 45);
                        expand.attr("transform", "translate(300,35) rotate(90)");
                    }
                });
            }
            svg.call(tip);
        },
        controller: ['$scope', '$filter', 'orsRouteService', ($scope, $filter, orsRouteService) => {
            $scope.distanceFilter = $filter('distance');
            $scope.translateFilter = $filter('translate');
            $scope.EmphSegment = (segments) => {
                angular.forEach(segments, function(pair) {
                    const routeString = orsRouteService.data.routes[$scope.routeIndex].geometry;
                    const geometry = routeString.slice(pair[0], pair[1] + 1);
                    orsRouteService.Emph(geometry);
                });
            };
            $scope.DeEmphSegment = () => {
                orsRouteService.DeEmph();
            };
            $scope.ZoomToSegment = () => {
                console.log('TO DO!');
            };
        }]
    };
});