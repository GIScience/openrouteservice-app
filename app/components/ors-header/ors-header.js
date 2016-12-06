angular.module('orsApp.ors-header', []).component('orsHeader', {
    templateUrl: 'app/components/ors-header/ors-header.html',
    controller($scope, orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsCookiesFactory) {
        var ctrl = this;
        ctrl.optionList = lists.userOptions;
        /** http://localhost:3000/routing?units=mi&language=de&routinglanguage=en */
        ctrl.$onInit = function() {};
        /** subscription to settings, when permalink is used with lang params
        we have to update language settings. This is called before panel settings
        object is defined, this is why we have two subscriptions */
        orsSettingsFactory.userOptionsSubject.subscribe(settings => {
            console.log(ctrl.currentOptions)
            ctrl.currentOptions = settings;
            if (!('language' in ctrl.currentOptions)) ctrl.currentOptions.language = ctrl.optionList.languages.default;
            if (!('routinglang' in ctrl.currentOptions)) ctrl.currentOptions.routinglang = ctrl.optionList.routinglanguages.default;
            if (!('units' in ctrl.currentOptions)) ctrl.currentOptions.units = ctrl.optionList.units.default;
        });
        ctrl.changeOptions = () => {
            console.log(ctrl.currentOptions);
            orsSettingsFactory.setUserOptions(ctrl.currentOptions);
            orsCookiesFactory.setCookieUserOptions(ctrl.currentOptions);
            orsUtilsService.parseSettingsToPermalink(orsSettingsFactory.getSettings(), orsSettingsFactory.getUserOptions());
            // TODO: Reload site if site language is changed, we need this due to translations
        };
    },
    bindings: {}
});