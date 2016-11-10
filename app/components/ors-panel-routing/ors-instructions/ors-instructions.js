angular.module('orsApp.ors-instructions', []).component('orsInstructions', {
    templateUrl: 'app/components/ors-panel-routing/ors-instructions/ors-instructions.html',
    bindings: {
        route: '<',
        showInstructions: '&',
        shouldDisplayRouteDetails: '<'
    },
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService) {
        var ctrl = this;     
        ctrl.profiles = lists.profiles;   
    }
});