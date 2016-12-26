angular.module('orsApp.ors-aa-controls', []).component('orsAaControls', {
    templateUrl: 'components/ors-panel-accessibilityanalysis/ors-aa-controls/ors-aa-controls.html',
    controller: ['orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsErrorhandlerService', 'orsMapFactory', function(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsMapFactory) {
        let ctrl = this;
        ctrl.calculate = () => {
            ctrl.onCalculate();
        };
        ctrl.reset = () => {
            ctrl.onReset();
        };
        ctrl.zoomToArea = () => {
            orsMapFactory.mapServiceSubject.onNext({
                _actionCode: 0
            });
        };
    }],
    bindings: {
        onCalculate: '&',
        onReset: '&'
    }
});