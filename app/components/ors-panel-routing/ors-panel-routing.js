angular.module('orsApp.ors-panel-routing', ['orsApp.ors-waypoints', 'orsApp.ors-profiles-options', 'orsApp.ors-options']).component('orsRoute', {
    templateUrl: 'app/components/ors-panel-routing/ors-panel-routing.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService) {
        var ctrl = this;
        ctrl.$onInit = function() {};
        //http://localhost:3000/routing?wps=48.3333,10.1667,48.7758459,9.1829321,48.7758459,9.1839321&profile=Bicycle&subprofile=BicycleMTB&weight=Fastest
        ctrl.$routerOnActivate = function(next) {
            ctrl.routeParams = next.params;
			if (orsSettingsFactory.getWaypoints().length == 0){
				let settings = orsParamsService.importSettings(ctrl.routeParams);
				orsSettingsFactory.setSettings(settings);
			}
            ctrl.profiles = lists.profiles;
            //ctrl.activeMenu = ctrl.profiles.Car.name;
            ctrl.activeMenu = orsSettingsFactory.getActiveProfile().type;
            ctrl.shouldDisplayRouteDetails = false;
			orsSettingsFactory.updateNgRoute(next.urlPath);
			orsSettingsFactory.updateWaypoints();
			
        };
        ctrl.goInstructions = function() {
            ctrl.shouldDisplayRouteDetails = ctrl.shouldDisplayRouteDetails == true ? false : true;
        };
    },
    require: {
        parent: '^orsSidebar'
    }
});