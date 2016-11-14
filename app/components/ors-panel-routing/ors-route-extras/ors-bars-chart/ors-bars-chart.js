angular.module('orsApp.ors-bars-chart', []).directive('orsBarsChart', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            obj: '<',
        },
        template: '<svg class="chart" width="250" height="100"></svg>',
        link: function(scope, element, attrs, fn) {
            console.log(scope.obj, element);
            d3.select(types).selectAll("svg").remove();
            var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
                var dist = util.convertDistanceFormat(d.distance, preferences.distanceUnit);
                return d.percentage + '% ' + d.typetranslated + ' (' + dist[1] + ' ' + dist[2] + ')';
            });
            var margin = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                width = 320 - margin.left - margin.right,
                height = 24 - margin.top - margin.bottom;
            var y = d3.scale.ordinal().rangeRoundBands([height, 0]);
            var x = d3.scale.linear().rangeRound([0, width]);
            var yAxis = d3.svg.axis().scale(y).orient("left");
            var xAxis = d3.svg.axis().scale(x).orient("bottom");
            var svg = d3.select(types).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            y.domain([0]);
            x.domain([0, data[Object.keys(data)[Object.keys(data).length - 1]].y1]);
            svg.selectAll("rect").data(data).enter().append("rect").attr("height", 24).attr("x", function(d) {
                return x(d.y0) / 1;
            }).attr("width", function(d) {
                return x(d.y1) / 1 - x(d.y0) / 1;
            }).attr("title", function(d) {
                return (d.y1 - d.y0) + "% : " + d.typetranslated;
            }).style("fill", function(d, i) {
                return d.color;
            }).on('mouseover', function(d) {
                handleHighlightTypes(d.ids, layer);
                tip.show(d);
            }).on('mouseout', function(d) {
                handleResetTypes(d.ids, layer);
                tip.hide(d);
            }).on('click', function(d) {
                handleClickRouteIds(d.ids, layer);
            });
            $(list).empty();
            $(list).append("<ul></ul>");
            for (var i = 0; i < data.length; i++) {
                var li = $('<li>');
                li.html(data[i].percentage + '% ' + data[i].typetranslated);
                li.wrapInner('<span />');
                li.css('color', data[i].color);
                if (i !== "type" && i !== "total") $(list + "> ul").append(li);
            }
            svg.call(tip);
            // var chart = d3.select($element[0]).append('svg').attr({
            //     height: 20,
            //     width: 20
            // });
            // chart.append('rect').attr({
            //     height: 10,
            //     width: 10
            // });
        }
    };
});