angular.module('orsApp.ors-profiles-options', [])

.component('orsProfilesOptions', {
    templateUrl: 'app/components/ors-panel-routing/ors-profiles-options/ors-profiles-options.html',
    controller: RouteOptionsCtrl
});

function RouteOptionsCtrl() {
    var ctrl = this;
    ctrl.changeProfile = function() {
        console.log('change');
    };
}