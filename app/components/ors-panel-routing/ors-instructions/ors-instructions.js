angular.module('orsApp.ors-instructions', []).component('orsInstructions', {
    templateUrl: 'app/components/ors-panel-routing/ors-instructions/ors-instructions.html',
    bindings: {
        showInstructions: '&',
        shouldDisplayRouteDetails: '<'
    },
    controller($scope, orsRouteService, orsSettingsFactory, orsErrorhandlerService) {
        let ctrl = this;
        ctrl.profiles = lists.profiles;
        console.warn(true, 'instructions')
            /** use scope in order to share same template ng-include with summaries */
        $scope.route = orsRouteService.routeObj.routes[orsRouteService.getCurrentRouteIdx()];
        ctrl.routeIndex = orsRouteService.getCurrentRouteIdx();
        /** subscribe to route object if instructions are already open */
        orsRouteService.routesSubject.subscribe(routes => {
            console.info('subscribing to first route', routes);
            $scope.route = routes[0];
        });
        ctrl.waypoints = orsSettingsFactory.getWaypoints();
        ctrl.getClass = (bool) => {
            if (bool === true) return "fa fa-lg fa-fw fa-caret-up";
            else return "fa fa-lg fa-fw fa-caret-down";
        };
        ctrl.EmphSegment = (idx) => {
            const segmentStart = $scope.route.wayPoints[idx];
            const segmentEnd = $scope.route.wayPoints[idx + 1];
            const routeString = orsRouteService.routeObj.routes[ctrl.routeIndex].points;
            const geometry = _.slice(routeString, segmentStart, segmentEnd + 1);
            orsRouteService.Emph(geometry);
        };
        ctrl.DeEmph = () => {
            orsRouteService.DeEmph();
        };
        ctrl.EmphStep = (pair) => {
            const routeString = orsRouteService.routeObj.routes[ctrl.routeIndex].points;
            const geometry = _.slice(routeString, pair[0], pair[1] + 1);
            orsRouteService.Emph(geometry);
        };
    }
});