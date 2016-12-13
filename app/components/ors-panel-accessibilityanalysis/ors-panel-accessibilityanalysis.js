angular.module('orsApp.ors-panel-accessibilityanalysis', ['orsApp.ors-aa-controls', 'orsApp.ors-aa-waypoints', 'orsApp.ors-aa-sliders']).component('orsAnalysis', {
    templateUrl: 'app/components/ors-panel-accessibilityanalysis/ors-panel-accessibilityanalysis.html',
    controller($scope, $location, orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService, orsCookiesFactory, orsMapFactory) {
        var ctrl = this;
        let currentUrl;
        ctrl.$onInit = function() {
            ctrl.profiles = lists.profiles;
            
        };
        ctrl.$routerOnActivate = function(next) {
            console.log(JSON.stringify($location.reload))
            /** the router is always activated on permalink update. This code
                must be ignored if the permalink is changed, as no waypoints are changed, interacts with app.js line 99 */
            if ($location.reload !== false) {
                console.log('reload')
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
                    orsSettingsFactory.setSettings(importedParams.settings);
                    // fetch addresses afterwards
                    angular.forEach(importedParams.settings.waypoints, function(wp, idx) {
                        orsRequestService.getAddress(wp._latlng, idx, true);
                    });
                    /**
                     * First get the Cookie Settings (These are currently language, routinglanguage and units). Then get the permalink user settings (Can be routinglanguage and units)
                     * The permalink settings replace the cookie settings if they exist.
                     */
                    orsSettingsFactory.setUserOptions(orsCookiesFactory.getCookies());
                    orsSettingsFactory.setUserOptions(importedParams.user_options);
                }
                
                orsSettingsFactory.updateWaypoints();
                ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
                ctrl.activeProfile = orsSettingsFactory.getActiveProfile().type;
                ctrl.activeSubgroup = ctrl.profiles[ctrl.activeProfile].subgroup;
            }
        };
    },
    require: {
        parent: '^orsSidebar'
    }
});