angular.module('orsApp.ors-panel-accessibilityanalysis', ['orsApp.ors-aa-controls', 'orsApp.ors-aa-waypoints', 'orsApp.ors-aa-sliders']).component('orsAnalysis', {
    templateUrl: 'app/components/ors-panel-accessibilityanalysis/ors-panel-accessibilityanalysis.html',
    controller($scope, orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService) {
        var ctrl = this;
        ctrl.$onInit = function() {};
        ctrl.$routerOnActivate = function(next) {
            /** notify the settings that we're now in the aa panel */
            orsSettingsFactory.updateNgRoute(next.urlPath);
            /** 
             * check if anything is saved in the settings object
             * if there isn't initialize settings object from permalink or provide empty
             */
            if (orsSettingsFactory.getWaypoints().length == 0) {
                ctrl.routeParams = next.params;
                orsSettingsFactory.initWaypoints(1);
                const importedParams = orsParamsService.importSettings(ctrl.routeParams);
                console.info('SETTINGS', importedParams)
                orsSettingsFactory.initSettings(importedParams.settings);
                orsSettingsFactory.initUserOptions(importedParams.user_options);
            }
            orsSettingsFactory.updateWaypoints();
            ctrl.profiles = lists.profiles;
            ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
        };
        /**
         * Called when clicking the reset button. Broadcasts the delete to the waypoint
         */
        ctrl.resetWaypoints = function() {
            $scope.$broadcast('resetWaypoints');
        }
    },
    require: {
        parent: '^orsSidebar'
    }
});