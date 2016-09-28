angular.module('orsApp.ors-panel-accessibilityanalysis', []).component('orsAnalysis', {
    templateUrl: 'app/components/ors-panel-accessibilityanalysis/ors-panel-accessibilityanalysis.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
        var ctrl = this;
        ctrl.$onInit = function() {};
        ctrl.$routerOnActivate = function() {
			ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
            console.log(ctrl.currentOptions);
        };
        ctrl.goInstructions = function() {
        };
		ctrl.getClass = (bool) => {
            if (bool === true) return "fa fa-lg fa-fw fa-caret-up";
            else return "fa fa-lg fa-fw fa-caret-down";
        };
		ctrl.availableOptions =  lists.isochroneList;
		ctrl.selectedOption = ctrl.availableOptions[0];
    },
    require: {
        parent: '^orsSidebar'
    }
});