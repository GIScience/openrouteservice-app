angular.module('orsApp.ors-profiles-options', []).component('orsProfilesOptions', {
    templateUrl: 'app/components/ors-profiles-options/ors-profiles-options.html',
    bindings: {
        orsParams: '<',
        activeProfile: '=',
        activeSubgroup: '=',
        showOptions: '=',
        profiles: '<'
    },
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
        let ctrl = this;
        ctrl.currentProfile = {};
        ctrl.loading = true;
        // load permalink infos and set active profile
        ctrl.$onInit = () => {
            ctrl.currentProfile = orsSettingsFactory.getActiveProfile();
            console.log(ctrl.profiles[ctrl.currentProfile.type].subgroup)
            ctrl.activeSubgroup = ctrl.profiles[ctrl.currentProfile.type].subgroup; 
            ctrl.activeProfile = ctrl.currentProfile.type;
        };
        /**
         * Is called when profile is changed
         * @param {String} profile: profile name is passed if button is clicked
         */	
        ctrl.changeProfile = (profile) => {
            if (profile) ctrl.currentProfile.type = profile;
            ctrl.activeProfile = ctrl.currentProfile.type;
            console.log(ctrl.currentProfile.type)
            ctrl.activeSubgroup = ctrl.profiles[ctrl.currentProfile.type].subgroup;
            orsSettingsFactory.setProfile(ctrl.currentProfile);
        };
        ctrl.callOptions = () => {
            ctrl.showOptions = ctrl.showOptions == false ? true : false;
        };
    }
});