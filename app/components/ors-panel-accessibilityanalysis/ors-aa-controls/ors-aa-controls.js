angular.module('orsApp.ors-aa-controls', []).component('orsAaControls', {
    templateUrl: 'components/ors-panel-accessibilityanalysis/ors-aa-controls/ors-aa-controls.html',
    controller: ['orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsMapFactory', function(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsMapFactory) {
        let ctrl = this;
        ctrl.calculate = () => {
            ctrl.onCalculate();
        };
    }],
    bindings: {
        onCalculate: '&'
    }
});