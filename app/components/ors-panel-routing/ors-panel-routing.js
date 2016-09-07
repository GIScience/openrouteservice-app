angular.module('orsApp.ors-panel-routing', ['orsApp.ors-waypoints', 'orsApp.ors-profiles-options', 'orsApp.ors-options']).component('orsRoute', {
    templateUrl: 'app/components/ors-panel-routing/ors-panel-routing.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService) {

        var ctrl = this;
        ctrl.$onInit = function() {};


        //http://localhost:3000/routing?wps=48.3333,10.1667,48.7758459,9.1829321&profile=Bicycle&subprofile=BicycleMTB

        ctrl.$routerOnActivate = function(next) {
            ctrl.routeParams = next.urlParams;
            console.log(ctrl.routeParams);
            if (ctrl.routeParams.length > 0) {
                console.log(ctrl.routeParams)
                let settings = orsParamsService.importSettings(ctrl.routeParams);
                console.log(settings)
                orsSettingsFactory.setSettings(settings);
            }

        };
        ctrl.showOptions = false;
        ctrl.profiles = lists.profiles;
        console.log(ctrl.profiles)
        ctrl.activeMenu = ctrl.profiles.Car.name;
    },
    require: {
        parent: '^orsSidebar'
    }
});