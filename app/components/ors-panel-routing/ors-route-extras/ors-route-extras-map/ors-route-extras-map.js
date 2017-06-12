angular.module('orsApp.ors-route-extras-map', [])
    .component('orsRouteExtrasMap', {
    	replace: true,
        templateUrl: 'components/ors-panel-routing/ors-route-extras/ors-route-extras-map/ors-route-extras-map.html',
	    bindings: {
	    	key: "<"
	    },
	    controller: ['$scope', 'orsRouteService' ,'orsRouteExtras', function(scope, orsRouteService, orsRouteExtras) {
	    	let ctrl = this;
	    	console.log(key)
	    	console.log(ctrl)

	    }]

    });