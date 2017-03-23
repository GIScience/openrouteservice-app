angular.module('orsApp.ors-loading', []).component('orsLoading', {
    templateUrl: 'components/ors-loading/ors-loading.html',
    controller: ['orsSettingsFactory', function(orsSettingsFactory) {
        let ctrl = this;
        ctrl.requesting = false;
        
        orsSettingsFactory.subscribeToRouteRequest(function onNext(bool) {
            ctrl.requesting = bool === true ? true: false;
            
        });
    }],
    bindings: {}
});