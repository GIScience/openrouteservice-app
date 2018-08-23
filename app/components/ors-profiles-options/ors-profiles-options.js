angular
  .module("orsApp.ors-profiles-options", [])
  .component("orsProfilesOptions", {
    templateUrl: "components/ors-profiles-options/ors-profiles-options.html",
    bindings: {
      orsParams: "<",
      activeProfile: "=",
      activeSubgroup: "=",
      showOptions: "=",
      profiles: "<"
    },
    controller: [
      "orsSettingsFactory",
      "$window",
      function(orsSettingsFactory, $window) {
        let ctrl = this;
        ctrl.currentProfile = {};
        // load permalink infos and set active profile
        ctrl.$onInit = () => {
          ctrl.currentProfile = orsSettingsFactory.getActiveProfile();
          ctrl.activeSubgroup =
            ctrl.profiles[ctrl.currentProfile.type].subgroup;
          ctrl.activeProfile = ctrl.currentProfile.type;
        };
        /**
         * Is called when profile is changed
         * @param {String} profile: profile name is passed if button is clicked
         */
        ctrl.changeProfile = profile => {
          if (profile) ctrl.currentProfile.type = profile;
          ctrl.activeProfile = ctrl.currentProfile.type;
          ctrl.activeSubgroup =
            ctrl.profiles[ctrl.currentProfile.type].subgroup;
          orsSettingsFactory.setProfile(ctrl.currentProfile);
        };
        ctrl.$onChanges = changes => {
          //console.info(changes)
        };
        ctrl.callOptions = () => {
          ctrl.showOptions = ctrl.showOptions == false ? true : false;
        };
        ctrl.callUrl = link => {
          $window.location.href = link;
        };
      }
    ]
  });
