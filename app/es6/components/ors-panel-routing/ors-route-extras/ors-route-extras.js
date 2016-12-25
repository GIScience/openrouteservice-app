angular.module('orsApp.ors-route-extras', ['orsApp.ors-bars-chart']).component('orsRouteExtras', {
    templateUrl: 'scripts/components/ors-panel-routing/ors-route-extras/ors-route-extras.html',
    bindings: {
        currentRoute: '<',
        routeIndex: '<'
    },
    controller: ['$scope', 'orsErrorhandlerService', function($scope, orsErrorhandlerService) {
        let ctrl = this;
        ctrl.mappings = mappings;
        ctrl.processExtras = (currentRoute, key) => {
            let totalDistance = currentRoute.summary.distance;
            let extras = {};
            _.forEach(currentRoute.extras[key], (elem, i) => {
                const fr = parseInt(elem.fr),
                    to = parseInt(elem.to) + 1;
                if (fr !== to) {
                    const typeNumber = parseInt(elem.value) + 5;
                    const routeSegment = currentRoute.points.slice(fr, to);
                    /** calculate distances */
                    let sumDistance = 0;
                    for (let i = 0; i < routeSegment.length - 1; i++) {
                        const latLngA = L.latLng(routeSegment[i][0], routeSegment[i][1]);
                        const latLngB = L.latLng(routeSegment[i + 1][0], routeSegment[i + 1][1]);
                        sumDistance += latLngA.distanceTo(latLngB);
                    }
                    if (typeNumber in extras) {
                        extras[typeNumber].distance += sumDistance;
                        extras[typeNumber].intervals.push([fr, to]);
                    } else {
                        let text = ctrl.mappings[key][typeNumber].text;
                        let color = ctrl.mappings[key][typeNumber].color;
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
                            intervals: [
                                [fr, to]
                            ],
                            percentage: 0,
                            y0: 0,
                            y1: 0,
                            color: color
                        };
                    }
                }
            });
            let y0 = 0;
            for (let obj in extras) {
                // consider percentages less than 1
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
        $scope.$watch('$ctrl.currentRoute', (route) => {
            ctrl.routeExtras = [];
            console.log(true);
            ctrl.routeExtras.push({
                data: ctrl.processExtras(route, 'gradients'),
                type: 'gradients',
                routeIndex: ctrl.routeIndex
            });
            //surfaces: ctrl.processExtras('surfaces'),
            //wayTypes: ctrl.processExtras('wayTypes')
            //ctrl.routeExtras = angular.copy(ctrl.routeExtras);
        });
    }]
});