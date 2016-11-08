angular.module('orsApp.ors-header', []).component('orsHeader', {
    templateUrl: 'app/components/ors-header/ors-header.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsCookiesFactory) {
        var ctrl = this;
        ctrl.optionList = lists.userOptions;
        /** http://localhost:3000/routing?units=mi&language=de&routinglanguage=en */
        ctrl.$onInit = function() {};
        /** subscription to settings, when permalink is used with lang params
        we have to update language settings. This is called before panel settings
        object is defined, this is why we have two subscriptions */
        console.log("header.js calling subscription");
        orsSettingsFactory.userOptionsSubject.subscribe(settings => {
            ctrl.currentOptions = settings;
            if (!('language' in ctrl.currentOptions)) ctrl.currentOptions.language = ctrl.optionList.languages.default;
            if (!('routinglang' in ctrl.currentOptions)) ctrl.currentOptions.routinglang = ctrl.optionList.routinglanguages.default;
            if (!('units' in ctrl.currentOptions)) ctrl.currentOptions.units = ctrl.optionList.units.default;
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
            console.log(ctrl.currentOptions);
            orsSettingsFactory.setUserOptions(ctrl.currentOptions);
            orsCookiesFactory.setCookieUserOptions(ctrl.currentOptions);
            // TODO: 
            // 1. If site lang is changed, set cookie
            // 2. Reload site if site language is changed, we need this due to translations
        };
        ctrl.translate = (term) => {
            return term;
            //orsTranslateService.translate
        };
    },
    bindings: {}
});