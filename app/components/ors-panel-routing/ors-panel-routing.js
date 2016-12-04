angular.module('orsApp.ors-panel-routing', ['orsApp.ors-waypoints', 'orsApp.ors-profiles-options', 'orsApp.ors-options', 'orsApp.ors-summary', 'orsApp.ors-instructions']).component('orsRoute', {
    templateUrl: 'app/components/ors-panel-routing/ors-panel-routing.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService, orsCookiesFactory) {
        var ctrl = this;
        ctrl.$routerCanReuse = function(next, prev) {
            return next.params.name === prev.params.name;
        };
        ctrl.$onInit = function() {};
        ctrl.$routerOnActivate = function(next) {
            orsSettingsFactory.updateNgRoute(next.urlPath);
            /** 
             * check if anything is saved in the settings object
             * if there isn't initialize settings object from permalink or provide empty settings object
             */
            if (orsSettingsFactory.getWaypoints().length == 0) {
                console.log('importing routing settings..')
                ctrl.routeParams = next.params;
                orsSettingsFactory.initWaypoints(2);
                const importedParams = orsParamsService.importSettings(ctrl.routeParams);
                orsSettingsFactory.setSettings(importedParams.settings);

                // fetch addresses afterwards
                angular.forEach(importedParams.settings.waypoints, function(wp, idx) {
                    orsRequestService.getAddress(wp._latlng, idx, true);
                });
                orsSettingsFactory.setUserOptions(orsCookiesFactory.getCookies());
                orsSettingsFactory.setUserOptions(importedParams.user_options);
            }
            // TODO site language only saved in cookies!!! remove from permalink, only use cookies
            // if site language changed saved in cookie and reload, this is needed due to translations
            // routing instructions and units are used for routing request
            orsSettingsFactory.updateWaypoints();
            ctrl.profiles = lists.profiles;
            //ctrl.activeMenu = ctrl.profiles.Car.name;
            ctrl.activeProfile = orsSettingsFactory.getActiveProfile().type;
            ctrl.activeSubgroup = ctrl.profiles[ctrl.activeProfile].subgroup;
            ctrl.shouldDisplayRouteDetails = false;
            // orsUtilsService.parseSettingsToPermalink(orsSettingsFactory.getSettings(), orsSettingsFactory.getUserOptions());
        };
        ctrl.$routerOnReuse = function(next, prev) {
            // console.info("REUSE");
        };
        ctrl.showInstructions = () => {
            ctrl.shouldDisplayRouteDetails = ctrl.shouldDisplayRouteDetails == true ? false : true;
        };
    },
    require: {
        parent: '^orsSidebar'
    }
});