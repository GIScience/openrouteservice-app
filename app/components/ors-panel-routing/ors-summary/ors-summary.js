angular.module('orsApp.ors-summary', []).component('orsSummaries', {
    templateUrl: 'app/components/ors-panel-routing/ors-summary/ors-summary.html',
    bindings: {
        showInstructions: '&'
    },
    controller(orsSettingsFactory, orsRouteService, orsErrorhandlerService) {
        let ctrl = this;
        ctrl.profiles = lists.profiles;
        console.log(ctrl.profiles)
        console.log('summary yea')
            // subscribe to route object?
        orsRouteService.routesSubject.subscribe(routes => {
            console.info('routes', routes);
            ctrl.routes = routes;
        });
    }
});