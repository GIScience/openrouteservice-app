/** dirty hack, the subscription will duplicate if we come back to this component */
let routeSubscription;
angular.module('orsApp.ors-summary', []).component('orsSummaries', {
    templateUrl: 'app/components/ors-panel-routing/ors-summary/ors-summary.html',
    bindings: {
        showInstructions: '&',
        shouldDisplayRouteDetails: '<'
    },
    controller(orsSettingsFactory, orsMapFactory, orsObjectsFactory, orsRouteService, orsErrorhandlerService) {
        let ctrl = this;
        ctrl.profiles = lists.profiles;
        ctrl.setIdx = (idx) => {
            orsRouteService.setCurrentRouteIdx(idx);
        };
        ctrl.getIdx = () => {
            return orsRouteService.getCurrentRouteIdx();
        };
        /** if we are coming back to route panel */
        if (angular.isDefined(orsRouteService.routeObj)) {
            ctrl.routes = orsRouteService.routeObj.routes;
            let idx = ctrl.getIdx();
            console.log(ctrl.routes, idx)
            let action = orsObjectsFactory.createMapAction(1, lists.layers[1], ctrl.routes[idx].points, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        }
        /** if we are returning to this panel, dispose all old subscriptions */
        try {
            routeSubscription.dispose();
        } catch (error) {
            console.log('dude')
        }
        routeSubscription = orsRouteService.routesSubject.subscribe(routes => {
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