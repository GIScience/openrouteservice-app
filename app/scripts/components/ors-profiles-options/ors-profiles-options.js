var $__app_47_scripts_47_components_47_ors_45_profiles_45_options_47_ors_45_profiles_45_options_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-profiles-options/ors-profiles-options.js";
  angular.module('orsApp.ors-profiles-options', []).component('orsProfilesOptions', {
    templateUrl: 'scripts/components/ors-profiles-options/ors-profiles-options.html',
    bindings: {
      orsParams: '<',
      activeProfile: '=',
      activeSubgroup: '=',
      showOptions: '=',
      profiles: '<'
    },
    controller: ['orsSettingsFactory', function(orsSettingsFactory) {
      var ctrl = this;
      ctrl.currentProfile = {};
      ctrl.$onInit = function() {
        ctrl.currentProfile = orsSettingsFactory.getActiveProfile();
        ctrl.activeSubgroup = ctrl.profiles[ctrl.currentProfile.type].subgroup;
        ctrl.activeProfile = ctrl.currentProfile.type;
      };
      ctrl.changeProfile = function(profile) {
        if (profile)
          ctrl.currentProfile.type = profile;
        ctrl.activeProfile = ctrl.currentProfile.type;
        ctrl.activeSubgroup = ctrl.profiles[ctrl.currentProfile.type].subgroup;
        orsSettingsFactory.setProfile(ctrl.currentProfile);
      };
      ctrl.$onChanges = function(changes) {};
      ctrl.callOptions = function() {
        ctrl.showOptions = ctrl.showOptions == false ? true : false;
      };
    }]
  });
  return {};
})();
