angular.module('orsApp.ors-instructions', []).component('orsInstructions', {
    templateUrl: 'app/components/ors-panel-routing/ors-instructions/ors-instructions.html',
    bindings: {
        routeSegments: '<',
        showInstructions: '&'
    },
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService) {
        var ctrl = this;

        
    }
});