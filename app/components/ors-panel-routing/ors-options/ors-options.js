angular.module('orsApp.ors-options', []).component('orsOptions', {
    templateUrl: 'app/components/ors-panel-routing/ors-options/ors-options.html',
    bindings: {
        activeMenu: '<'
    },
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService) {
        var ctrl = this;
        ctrl.$onInit = function() {
            console.log(ctrl.activeMenu)
        };
        ctrl.getClass = (bool) => {
            if (bool === true) return "fa fa-lg fa-fw fa-caret-up";
            else return "fa fa-lg fa-fw fa-caret-down";
        };
    }
});