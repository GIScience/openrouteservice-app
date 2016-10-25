angular.module('orsApp.ors-profiles-options', []).component('orsProfilesOptions', {
    templateUrl: 'app/components/ors-profiles-options/ors-profiles-options.html',
    bindings: {
        orsParams: '<',
        showOptions: '=',
        activeMenu: '=',
        profiles: '<'
    },
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
        let ctrl = this;
        ctrl.currentProfile = {};
        // load permalink infos and set active profile
        ctrl.$onInit = () => {
            ctrl.currentProfile = orsSettingsFactory.getActiveProfile();
            ctrl.activeMenu = ctrl.profiles[ctrl.currentProfile.type].subgroup;
        };
        /**
         * Is called when profile is changed
         * @param {String} profile: profile name is passed if button is clicked
         */	
        ctrl.changeProfile = (profile) => {
            if (profile) ctrl.currentProfile.type = profile;
            ctrl.activeMenu = ctrl.profiles[ctrl.currentProfile.type].subgroup;
            orsSettingsFactory.setProfile(ctrl.currentProfile);
        };
        ctrl.callOptions = () => {
            ctrl.showOptions = ctrl.showOptions == false ? true : false;
        };
    }
});