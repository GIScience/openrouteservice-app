angular.module('orsApp.ors-header', [])
    .component('orsHeader', {
        templateUrl: 'components/ors-header/ors-header.html',
        controller: ['$rootScope', '$timeout', '$translate', 'orsUtilsService', 'orsSettingsFactory', 'orsCookiesFactory', 'lists', function($rootScope, $timeout, $translate, orsUtilsService, orsSettingsFactory, orsCookiesFactory, lists) {
            let ctrl = this;
            ctrl.changeExtras = () => {
                orsUtilsService.setExtraInformation(ctrl.extra_infos);
            };
            ctrl.$onInit = () => {
                ctrl.extra_infos = {
                    steepness: true
                };
                ctrl.lists_extra_info = lists.extra_info;
                ctrl.getActiveProfile = orsSettingsFactory.getActiveProfile;
                ctrl.optionList = lists.userOptions;
                ctrl.changeExtras();
            };
            /** subscription to settings, when permalink is used with lang params
            we have to update language settings. This is called before panel settings
            object is defined, this is why we have two subscriptions */
            orsSettingsFactory.userOptionsSubject.subscribe(settings => {
                ctrl.currentOptions = settings;
                $translate.use(ctrl.currentOptions.language);
            });
            ctrl.changeOptions = (langChange) => {
                if (langChange) $translate.use(ctrl.currentOptions.language);
                orsSettingsFactory.setUserOptions(ctrl.currentOptions);
                orsCookiesFactory.setCookieUserOptions(ctrl.currentOptions);
                orsUtilsService.parseSettingsToPermalink(orsSettingsFactory.getSettings(), orsSettingsFactory.getUserOptions());
                // TODO: Reload site if site language is changed, we need this due to translations
                // update slider units!
                $timeout(() => {
                    $rootScope.$broadcast('rzSliderForceRender');
                });
            };
        }],
        bindings: {}
    });