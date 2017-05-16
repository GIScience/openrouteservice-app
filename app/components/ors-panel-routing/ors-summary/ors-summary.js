angular.module('orsApp.ors-summary', ['orsApp.ors-exportRoute-controls', 'orsApp.ors-share']).component('orsSummaries', {
    templateUrl: 'components/ors-panel-routing/ors-summary/ors-summary.html',
    bindings: {
        showInstructions: '&',
        shouldDisplayRouteDetails: '<'
    },
    controller: ['$rootScope', 'orsSettingsFactory', 'orsMapFactory', 'orsObjectsFactory', 'orsRouteService', 'lists', function($rootScope, orsSettingsFactory, orsMapFactory, orsObjectsFactory, orsRouteService, lists) {
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
                if (ctrl.route.elevation) {
                    // process heightgraph data
                    const hgGeojson = orsRouteService.processHeightgraphData(ctrl.route);
                    orsRouteService.addHeightgraph(hgGeojson);
                }
            }
        }
        /** if we are returning to this panel, dispose all old subscriptions */
        try {
            $rootScope.routeSubscription.dispose();
        } catch (error) {
            console.warn(error);
        }
        $rootScope.routeSubscription = orsRouteService.routesSubject.subscribe(data => {
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