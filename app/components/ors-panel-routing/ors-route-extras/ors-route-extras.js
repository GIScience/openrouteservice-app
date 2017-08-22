angular.module('orsApp.ors-route-extras', ['orsApp.ors-bars-chart', 'orsApp.ors-route-extras-map'])
    .component('orsRouteExtras', {
        templateUrl: 'components/ors-panel-routing/ors-route-extras/ors-route-extras.html',
        bindings: {
            currentRoute: '<',
            routeIndex: '<',
            checkboxes: '<'
        },
        controller: ['$scope', 'mappings', 'orsRouteService', 'orsUtilsService', function($scope, mappings, orsRouteService, orsUtilsService) {
            let ctrl = this;
            ctrl.mappings = mappings;
            ctrl.processExtras = (currentRoute, key) => {
                let totalDistance = currentRoute.summary.distance;
                let extras = {};
                angular.forEach(currentRoute.extras[key].values, function(elem, i) {
                    const fr = elem[0],
                        to = elem[1];
                    if (fr !== to) {
                        let typeNumber = 0;
                        if (key == 'avgspeed') {
                            typeNumber = parseInt(orsUtilsService.getSpeedRange(elem[2]));
                        } else {
                            typeNumber = parseInt(elem[2]);
                        }
                        const routeSegment = currentRoute.geometry.slice(fr, to);
                        if (typeNumber in extras) {
                            extras[typeNumber].intervals.push([fr, to]);
                        } else {
                            let text = ctrl.mappings[key][typeNumber].text;
                            let color = ctrl.mappings[key][typeNumber].color;
                            extras[typeNumber] = {
                                type: text,
                                intervals: [
                                    [fr, to]
                                ],
                                color: color
                            };
                        }
                    }
                });
                let y0 = 0;
                let typesOrder = [];
                // sort by value to maintain color ordering
                currentRoute.extras[key].summary.sort(function(a, b) {
                    return parseFloat(a.value) - parseFloat(b.value);
                });
                for (let i = 0; i < currentRoute.extras[key].summary.length; i++) {
                    const extra = currentRoute.extras[key].summary[i];
                    // handle average Speed categories
                    if (extras[extra.value] == undefined) {
                        extra.value = parseInt(orsUtilsService.getSpeedRange(extra.value));
                    }
                    if (extras[extra.value].distance !== undefined) {
                        extras[extra.value].distance += extra.distance;
                        extras[extra.value].percentage += extra.amount;
                        extras[extra.value].y1 += +extra.amount;
                    } else {
                        extras[extra.value].distance = extra.distance;
                        extras[extra.value].percentage = extra.amount;
                        extras[extra.value].y0 = y0;
                        extras[extra.value].y1 = y0 += +extra.amount;
                    }
                    if (typesOrder.indexOf(extra.value) === -1) {
                        typesOrder.push(extra.value);
                    }
                }
                return {
                    extras: extras,
                    typesOrder: typesOrder
                };
            };
            ctrl.routeExtras = [];
            $scope.$watch('$ctrl.currentRoute', (route) => {
                ctrl.routeExtras = [];
                for (let key in route.extras) {
                    const data = ctrl.processExtras(route, key);
                    ctrl.routeExtras.push({
                        data: data.extras,
                        typesOrder: data.typesOrder,
                        type: key,
                        routeIndex: ctrl.routeIndex,
                        checkboxes: ctrl.checkboxes
                    });
                }
                //ctrl.routeExtras = angular.copy(ctrl.routeExtras);
            });
        }]
    });