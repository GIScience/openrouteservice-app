angular.module('orsApp.ors-panel-routing', ['orsApp.ors-waypoints', 'orsApp.ors-profiles-options', 'orsApp.ors-options', 'orsApp.ors-summary', 'orsApp.ors-instructions']).component('orsRoute', {
    templateUrl: 'components/ors-panel-routing/ors-panel-routing.html',
    controller: ['orsSettingsFactory', 'orsParamsService', 'orsUtilsService', 'orsCookiesFactory', function(orsSettingsFactory, orsParamsService, orsUtilsService, orsCookiesFactory) {
        let ctrl = this;
        ctrl.$routerCanReuse = (next, prev) => {
            return next.params.name === prev.params.name;
        };
        ctrl.$onInit = () => {
            ctrl.profiles = lists.profiles;
        };
        ctrl.$routerOnActivate = (next) => {
            /** the router is always activated on permalink update. This code
                must be ignored if the permalink is changed, as no waypoints are changed, interacts with app.js line 99 */
            orsSettingsFactory.isInitialized = true;
            orsSettingsFactory.updateNgRoute(next.urlPath);
            /** 
             * check if anything is saved in the settings object
             * if there isn't initialize settings object from permalink or provide empty settings object
             */
            if (orsSettingsFactory.getWaypoints().length == 0) {
                console.log('importing routing settings..');
                ctrl.routeParams = next.params;
                orsSettingsFactory.initWaypoints(2);
                const importedParams = orsParamsService.importSettings(ctrl.routeParams);
                orsSettingsFactory.setSettings(importedParams.settings);
                // fetch addresses afterwards
                angular.forEach(importedParams.settings.waypoints, (wp, idx) => {
                    if (wp._latlng !== false) orsSettingsFactory.getAddress(wp._latlng, idx, true);
                });
                orsSettingsFactory.setUserOptions(orsCookiesFactory.getCookies());
                orsSettingsFactory.setUserOptions(importedParams.user_options);
            }
            orsSettingsFactory.updateWaypoints();
            ctrl.activeProfile = orsSettingsFactory.getActiveProfile().type;
            ctrl.activeSubgroup = ctrl.profiles[ctrl.activeProfile].subgroup;
            console.info(ctrl.activeProfile, ctrl.activeSubgroup);
            ctrl.shouldDisplayRouteDetails = false;
        };
        // ctrl.$onChanges = function(changes) {
        //     console.info(changes)
        // }
        ctrl.$routerOnReuse = (next, prev) => {
            // update permalink
            const settings = orsSettingsFactory.getSettings();
            const userSettings = orsSettingsFactory.getUserOptions();
            orsUtilsService.parseSettingsToPermalink(settings, userSettings);
        };
        ctrl.showInstructions = () => {
            ctrl.shouldDisplayRouteDetails = ctrl.shouldDisplayRouteDetails == true ? false : true;
        };
    }],
    require: {
        parent: '^orsSidebar'
    }
});