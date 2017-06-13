angular.module('orsApp.ors-route-extras-map', [])
    .component('orsRouteExtrasMap', {
        replace: true,
        templateUrl: 'components/ors-panel-routing/ors-route-extras/ors-route-extras-map/ors-route-extras-map.html',
        bindings: {
            routeIndex: "<",
            i: "<",
            extra: "<", //needed for translation in the template
            types: "<",
            extrasCheck:"<",
        },
        controller: ['orsRouteService', function(orsRouteService) {
            let ctrl = this;
            let currentRoute = orsRouteService.data.routes;
           
            ctrl.updateExtrasColor = () => {
                orsRouteService.DeColor();
                // only one checkbox allowed at a time
                if (ctrl.extrasCheck[ctrl.i]) {
                    for (let val = 0; val < ctrl.extrasCheck.length; val++) {
                        if (val != ctrl.i) {
                        	ctrl.extrasCheck[val] = false;
                        }
                    }
                    angular.forEach(ctrl.types, function(value,key){
                        const color = value.color;
                        angular.forEach(ctrl.types[key].intervals, function(v,k){
                            const geom = currentRoute[ctrl.routeIndex].geometry.slice(v[0],v[1]+1);

                            orsRouteService.Color(geom, color);
                        });
                    });
                }
                else {
                    orsRouteService.DeColor();
                }
            };
        }]
    });