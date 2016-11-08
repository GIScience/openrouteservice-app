angular.module('orsApp.ors-panel-routing', ['orsApp.ors-waypoints', 'orsApp.ors-profiles-options', 'orsApp.ors-options', 'orsApp.ors-summary', 'orsApp.ors-instructions']).component('orsRoute', {
    templateUrl: 'app/components/ors-panel-routing/ors-panel-routing.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService) {
        var ctrl = this;
        ctrl.$onInit = function() {};
        //http://localhost:3000/routing?wps=48.3333,10.1667,48.7758459,9.1829321,48.7758459,9.1839321&profile=Bicycle&subprofile=BicycleMTB&weight=Fastest
        ctrl.$routerOnActivate = function(next) {
            console.log('updating ng route')
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

            console.log(ctrl.activeProfile, ctrl.activeSubgroup)
            ctrl.shouldDisplayRouteDetails = false;
        };
        ctrl.showInstructions = (segments = undefined) => {
            ctrl.shouldDisplayRouteDetails = ctrl.shouldDisplayRouteDetails == true ? false : true;
            if (segments) ctrl.segments = segments;
            console.log(ctrl.segments)
        };
    },
    require: {
        parent: '^orsSidebar'
    }
});