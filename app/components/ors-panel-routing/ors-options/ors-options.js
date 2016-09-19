angular.module('orsApp.ors-options', []).component('orsOptions', {
    templateUrl: 'app/components/ors-panel-routing/ors-options/ors-options.html',
    bindings: {
        activeMenu: '<'
    },
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService) {
        var ctrl = this;
        ctrl.optionList = lists.optionList;
        ctrl.$onInit = function() {
            ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
            console.log(ctrl.currentOptions);
        };

        ctrl.changeOptions = function() {
            // call setoptions
            console.log(ctrl.currentOptions);
        };
        ctrl.getClass = (bool) => {
            if (bool === true) return "fa fa-lg fa-fw fa-caret-up";
            else return "fa fa-lg fa-fw fa-caret-down";
        };
    }
});