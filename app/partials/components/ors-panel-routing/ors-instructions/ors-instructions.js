let routeSubscriptionInstructions;
angular.module('orsApp.ors-instructions', ['orsApp.ors-exportRoute-controls']).component('orsInstructions', {
    templateUrl: 'scripts/components/ors-panel-routing/ors-instructions/ors-instructions.html',
    bindings: {
        showInstructions: '&',
        shouldDisplayRouteDetails: '<'
    },
    controller: ['$scope', 'orsRouteService', 'orsSettingsFactory', 'orsErrorhandlerService', function($scope, orsRouteService, orsSettingsFactory, orsErrorhandlerService) {
        let ctrl = this;
        ctrl.profiles = lists.profiles;
        /** use scope in order to share same template ng-include with summaries */
        $scope.route = ctrl.route = orsRouteService.routeObj.routes[orsRouteService.getCurrentRouteIdx()];
        ctrl.routeIndex = orsRouteService.getCurrentRouteIdx();
        /** subscribe to route object if instructions are already open */
        /** if we are returning to this panel, dispose all old subscriptions */
        try {
            routeSubscriptionInstructions.dispose();
        } catch (error) {
            console.warn(error);
        }
        routeSubscriptionInstructions = orsRouteService.routesSubject.subscribe(routes => {
            console.info('subscribing to first route', routes);
            ctrl.routeIndex = orsRouteService.getCurrentRouteIdx();
            $scope.route = ctrl.route = routes[ctrl.routeIndex];
        });
        ctrl.waypoints = orsSettingsFactory.getWaypoints();
        ctrl.getClass = (bool) => {
            if (bool === true) return "fa fa-2x fa-fw fa-angle-down";
            else return "fa fa-2x fa-fw fa-angle-right";
        };
        ctrl.getIcon = (code) => {
            let direction = 'fa fa-arrow-up ';
            switch (code) {
                case -3:
                    direction += 'fa-rotate-225';
                    break;
                case 3:
                    direction += 'fa-rotate-135';
                    break;
                case -2:
                    direction += 'fa-rotate-270';
                    break;
                case 2:
                    direction += 'fa-rotate-90';
                    break;
                case -1:
                    direction += 'fa-rotate-315';
                    break;
                case 1:
                    direction += 'fa-rotate-45';
                    break;
                case 0:
                    direction += '';
                    break;
            }
            return direction;
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
        ctrl.zoomTo = (idx) => {
            const segmentStart = $scope.route.wayPoints[idx];
            const segmentEnd = $scope.route.wayPoints[idx + 1];
            const routeString = orsRouteService.routeObj.routes[ctrl.routeIndex].points;
            const geometry = _.slice(routeString, segmentStart, segmentEnd + 1);
            orsRouteService.zoomTo(geometry);
        };
        ctrl.zoomToStep = (pair) => {
            const routeString = orsRouteService.routeObj.routes[ctrl.routeIndex].points;
            const geometry = _.slice(routeString, pair[0], pair[1] + 1);
            orsRouteService.zoomTo(geometry);
        };
    }]
});