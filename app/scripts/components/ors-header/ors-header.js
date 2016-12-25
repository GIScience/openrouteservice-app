var $__app_47_scripts_47_components_47_ors_45_header_47_ors_45_header_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-header/ors-header.js";
  angular.module('orsApp.ors-header', []).component('orsHeader', {
    templateUrl: 'scripts/components/ors-header/ors-header.html',
    controller: ['$translate', 'orsUtilsService', 'orsSettingsFactory', 'orsCookiesFactory', function($translate, orsUtilsService, orsSettingsFactory, orsCookiesFactory) {
      var ctrl = this;
      ctrl.optionList = lists.userOptions;
      ctrl.$onInit = function() {};
      orsSettingsFactory.userOptionsSubject.subscribe(function(settings) {
        ctrl.currentOptions = settings;
        if (!('language' in ctrl.currentOptions))
          ctrl.currentOptions.language = ctrl.optionList.languages.default;
        if (!('routinglang' in ctrl.currentOptions))
          ctrl.currentOptions.routinglang = ctrl.optionList.routinglanguages.default;
        if (!('units' in ctrl.currentOptions))
          ctrl.currentOptions.units = ctrl.optionList.units.default;
        $translate.use(ctrl.currentOptions.language);
      });
      ctrl.changeOptions = function(langChange) {
        if (langChange)
          $translate.use(ctrl.currentOptions.language);
        console.log(ctrl.currentOptions);
        orsSettingsFactory.setUserOptions(ctrl.currentOptions);
        orsCookiesFactory.setCookieUserOptions(ctrl.currentOptions);
        orsUtilsService.parseSettingsToPermalink(orsSettingsFactory.getSettings(), orsSettingsFactory.getUserOptions());
      };
    }],
    bindings: {}
  });
  return {};
})();
