angular.module('orsApp.ors-instructions', ['orsApp.ors-exportRoute-controls']).component('orsInstructions', {
    templateUrl: 'components/ors-panel-routing/ors-instructions/ors-instructions.html',
    bindings: {
        showInstructions: '&',
        shouldDisplayRouteDetails: '<'
    },
    controller: ['$rootScope', '$scope', 'orsRouteService', 'orsSettingsFactory', 'lists', function($rootScope, $scope, orsRouteService, orsSettingsFactory, lists) {
        let ctrl = this;
        ctrl.profiles = lists.profiles;
        /** use scope in order to share same template ng-include with summaries */
        ctrl.routeIndex = orsRouteService.getCurrentRouteIdx();
        ctrl.data = orsRouteService.data;
        $scope.route = ctrl.route = ctrl.data.routes[ctrl.routeIndex];
        /** subscribe to route object if instructions are already open */
        /** if we are returning to this panel, dispose all old subscriptions */
        try {
            $rootScope.routeSubscriptionInstructions.dispose();
        } catch (error) {
            console.warn(error);
        }
        $rootScope.routeSubscriptionInstructions = orsRouteService.routesSubject.subscribe(data => {
            ctrl.routeIndex = orsRouteService.getCurrentRouteIdx();
            if (data.routes) {
                $scope.route = ctrl.route = data.routes[ctrl.routeIndex];
                ctrl.data = orsRouteService.data;
                ctrl.isLoading = false;
            }
        });
        orsSettingsFactory.subscribeToRouteRequest(function onNext(bool) {
            if (bool === true) {
                $scope.route = ctrl.route = [];
                ctrl.data = undefined;
                ctrl.isLoading = bool;
            }
        });
        ctrl.waypoints = orsSettingsFactory.getWaypoints();
        ctrl.getClass = (bool) => {
            if (bool === true) return "fa fa-lg fa-fw fa-angle-down";
            else return "fa fa-lg fa-fw fa-angle-right";
        };
        ctrl.getIcon = (code) => {
            let arrow = 'fa fa-arrow-up ';
            const enterRoundabout = '';
            const exitRoundabout = '';
            const uTurn = '';
            const finish = '';
            switch (code) {
                case 0:
                    arrow += 'fa-rotate-270';
                    break;
                case 1:
                    arrow += 'fa-rotate-90';
                    break;
                case 2:
                    arrow += 'fa-rotate-225';
                    break;
                case 3:
                    arrow += 'fa-rotate-135';
                    break;
                case 4:
                    arrow += 'fa-rotate-270';
                    break;
                case 5:
                    arrow += 'fa-rotate-45';
                    break;
                case 6:
                    break;
                case 7:
                    break;
                case 8:
                    break;
                case 9:
                    break;
                case 10:
                    break;
            }
            return arrow;
        };
        ctrl.EmphSegment = (idx) => {
            const segmentStart = $scope.route.way_points[idx];
            const segmentEnd = $scope.route.way_points[idx + 1];
            const routeString = $scope.route.geometry;
            const geometry = routeString.slice(segmentStart, segmentEnd + 1);
            orsRouteService.Emph(geometry);
        };
        ctrl.DeEmph = () => {
            orsRouteService.DeEmph();
        };
        ctrl.EmphStep = (pair) => {
            const routeString = $scope.route.geometry;
            const geometry = routeString.slice(pair[0], pair[1] + 1);
            orsRouteService.Emph(geometry);
        };
        ctrl.zoomTo = (idx, destination = false) => {
            const routeString = $scope.route.geometry;
            let geometry;
            if (destination) {
                const segmentEnd = $scope.route.way_points[idx];
                geometry = [routeString[segmentEnd]];
            } else {
                const segmentStart = $scope.route.way_points[idx];
                const segmentEnd = $scope.route.way_points[idx + 1];
                geometry = routeString.slice(segmentStart, segmentEnd + 1);
            }
            orsRouteService.zoomTo(geometry);
        };
        ctrl.zoomToStep = (pair) => {
            const routeString = $scope.route.geometry;
            const geometry = routeString.slice(pair[0], pair[1] + 1);
            orsRouteService.zoomTo(geometry);
        };
    }]
});