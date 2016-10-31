angular.module('orsApp.ors-header', []).component('orsHeader', {
    templateUrl: 'app/components/ors-header/ors-header.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
        var ctrl = this;
        ctrl.optionList = lists.userOptions;
        ctrl.$onInit = function() {};
        /** subscription to global settings update */
        orsSettingsFactory.globalSettings.subscribe(x => {
            console.log(JSON.stringify(x))
            ctrl.currentOptions = x;
            console.log(!('units' in ctrl.currentOptions))

            if (!('language' in ctrl.currentOptions.user_options)) ctrl.currentOptions.user_options.language = ctrl.optionList.language.default;
            if (!('routinglang' in ctrl.currentOptions.user_options)) ctrl.currentOptions.user_options.routinglang = ctrl.optionList.routinglang.default;
            if (!('units' in ctrl.currentOptions.user_options)) ctrl.currentOptions.user_options.units = ctrl.optionList.units.default;
            
            console.log(JSON.stringify(ctrl.currentOptions))

        });
        ctrl.showModal = {
            settings: false,
            feedback: false
        };
        ctrl.closeModal = () => {
            ctrl.showModal.settings = false;
            ctrl.showModal.feedback = false;
        };
        ctrl.user = {
            name: 'OpenRouteService.org'
        };
        ctrl.showModalFn = (idx) => {
            console.log(idx)
            if (idx == 0) ctrl.showModal.settings = true;
            if (idx == 1) ctrl.showModal.feedback = true;
        };
        ctrl.changeOptions = () => {
            console.log(ctrl.currentOptions)
            orsSettingsFactory.setGlobalSettings(ctrl.currentOptions);
        };
    },
    bindings: {}
});