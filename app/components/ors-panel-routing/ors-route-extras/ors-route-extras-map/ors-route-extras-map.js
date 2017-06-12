angular.module('orsApp.ors-route-extras-map', [])
    .component('orsRouteExtrasMap', {
        replace: true,
        templateUrl: 'components/ors-panel-routing/ors-route-extras/ors-route-extras-map/ors-route-extras-map.html',
        bindings: {
            key: "<"
        },
        controller: ['orsRouteService', function(orsRouteService) {
            let ctrl = this;
            console.log(ctrl.key)
            console.log(ctrl)
        }]
    });

