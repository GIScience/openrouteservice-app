angular.module('orsApp.ors-profiles-options', []).component('orsProfilesOptions', {
    templateUrl: 'app/components/ors-panel-routing/ors-profiles-options/ors-profiles-options.html',
    bindings: {
        orsParams: '<',
        showOptions: '=',
        activeMenu: '=',
        profiles: '<'
    },
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
        let ctrl = this;
        ctrl.currentProfile = {
            subprofile: {}
        };
        // load permalink infos and set active profile
        ctrl.$onInit = () => {
            console.log(ctrl.profiles, ctrl.activeMenu)
            ctrl.currentProfile = orsSettingsFactory.getActiveProfile();
            console.log(ctrl.currentProfile, ctrl.profiles, ctrl.profiles[ctrl.currentProfile.type])
            if ('type' in ctrl.currentProfile) {
                ctrl.activeMenu = ctrl.profiles[ctrl.currentProfile.type].name;
                console.log(ctrl.activeMenu)
            }
        };
        /**
         * Is called when profile is changed
         * @param {String} profile: profile name
         */
        ctrl.changeProfile = (profile) => {
            ctrl.activeMenu = profile;
            ctrl.currentProfile = {
                subprofile: {}
            };
            ctrl.currentProfile.type = profile;
            if ('subtypes' in ctrl.profiles[profile]) {
                ctrl.currentProfile.subprofile.type = ctrl.profiles[profile].subtypes.default.name;
            }
            orsSettingsFactory.setProfile(ctrl.currentProfile);
        };
        /**
         * Listens to changes in subprofiles and updates parent profile if not selected previously
         * @param {String} setProfile: parent profile name
         */
        ctrl.changeSubprofile = (setProfile) => {
            if (setProfile) {
                ctrl.currentProfile.type = setProfile;
                ctrl.activeMenu = setProfile;
            }
            orsSettingsFactory.setProfile(ctrl.currentProfile);
            // update settingsFactory on change with current profile
        };
        // todo: permalink should update ng-model of subtypes and profile type
        // ctrl.orsParams needed for permalink
        ctrl.callOptions = () => {
            console.log('show options..')
            ctrl.showOptions = ctrl.showOptions == false ? true : false;
            console.log(ctrl.showOptions)
        };
    }
});