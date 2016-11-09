angular.module('orsApp.ors-summary', []).component('orsSummaries', {
    templateUrl: 'app/components/ors-panel-routing/ors-summary/ors-summary.html',
    bindings: {
        showInstructions: '&',
        route: '='
    },
    controller(orsSettingsFactory, orsRouteService, orsErrorhandlerService) {
        let ctrl = this;
        ctrl.profiles = lists.profiles;
        
        // subscribe to route object?
        orsRouteService.routesSubject.subscribe(routes => {
            console.info('routes', routes);
            ctrl.routes = routes;
            /** this first route object is used if we are in instruction mode */
            ctrl.setInstructions(ctrl.routes[0]);
            console.log(ctrl.route)
        });
        ctrl.setInstructions = (route) => {
            ctrl.route = route;
            console.log(ctrl.route)
        };
    }
});