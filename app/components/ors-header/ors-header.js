angular.module('orsApp.ors-header', []).component('orsHeader', {
    templateUrl: 'app/components/ors-header/ors-header.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
        var ctrl = this;
        ctrl.user = {
            name: 'OpenRouteService.org'
        };
    },
    bindings: {
        
    }
});