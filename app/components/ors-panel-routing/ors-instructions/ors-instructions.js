angular.module('orsApp.ors-instructions', []).component('orsInstructions', {
    templateUrl: 'app/components/ors-panel-routing/ors-instructions/ors-instructions.html',
    bindings: {
        showInstructions: '&',
        shouldDisplayRouteDetails: '<'
    },
    controller($scope, orsRouteService, orsErrorhandlerService) {
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


    }
});