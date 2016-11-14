angular.module('orsApp.ors-summary', []).component('orsSummaries', {
    templateUrl: 'app/components/ors-panel-routing/ors-summary/ors-summary.html',
    bindings: {
        showInstructions: '&',
        shouldDisplayRouteDetails: '<'
    },
    controller(orsSettingsFactory, orsObjectsFactory, orsRouteService, orsErrorhandlerService) {
        let ctrl = this;
        ctrl.profiles = lists.profiles;
        ctrl.setIdx = (idx) => {
            orsRouteService.setCurrentRouteIdx(idx);
        };
        /** if we are coming back to route panel */
        if (angular.isDefined(orsRouteService.routeObj)) {
            ctrl.routes = orsRouteService.routeObj.routes;
            ctrl.setInstructions(ctrl.routes[0]);
        }
        // subscribe to route object?
        orsRouteService.routesSubject.subscribe(routes => {
            console.info('routes', routes);
            ctrl.routes = routes;
            /** this first route object is used if we are in instruction mode */
            ctrl.setIdx(0);
        });
        ctrl.EmphRoute = (idx) => {
            const geometry = orsRouteService.routeObj.routes[idx].points;
            orsRouteService.Emph(geometry);
        };
        ctrl.DeEmphRoute = () => {
            orsRouteService.DeEmph();
        };
    }
});