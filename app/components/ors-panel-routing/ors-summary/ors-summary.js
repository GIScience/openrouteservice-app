/** dirty hack, the subscription will duplicate if we come back to this component */
let routeSubscription;
angular.module('orsApp.ors-summary', []).component('orsSummaries', {
    templateUrl: 'components/ors-panel-routing/ors-summary/ors-summary.html',
    bindings: {
        showInstructions: '&',
        shouldDisplayRouteDetails: '<'
    },
    controller: ['orsSettingsFactory', 'orsMapFactory', 'orsObjectsFactory', 'orsRouteService', function(orsSettingsFactory, orsMapFactory, orsObjectsFactory, orsRouteService) {
        let ctrl = this;
        ctrl.profiles = lists.profiles;
        ctrl.setIdx = (idx) => {
            orsRouteService.setCurrentRouteIdx(idx);
        };
        ctrl.getIdx = () => {
            return orsRouteService.getCurrentRouteIdx();
        };
        /** if we are coming back to route panel */
        if (angular.isDefined(orsRouteService.data) && angular.isDefined(orsRouteService.data.routes)) {
            if (orsRouteService.data.routes.length > 0) {
                ctrl.data = orsRouteService.data;
                const idx = ctrl.getIdx() === undefined ? 0 : ctrl.getIdx();
                ctrl.route = ctrl.data.routes[idx];
                orsRouteService.addRoute(ctrl.route.geometry);
            }
        }
        /** if we are returning to this panel, dispose all old subscriptions */
        try {
            routeSubscription.dispose();
        } catch (error) {
            console.warn(error);
        }
        routeSubscription = orsRouteService.routesSubject.subscribe(data => {
            ctrl.data = data;
            console.log(ctrl.data)
            orsRouteService.setCurrentRouteIdx(0);
        });
        ctrl.EmphRoute = (idx) => {
            const geometry = ctrl.data.routes[idx].geometry;
            orsRouteService.Emph(geometry);
        };
        ctrl.DeEmphRoute = () => {
            orsRouteService.DeEmph();
        };
    }]
});