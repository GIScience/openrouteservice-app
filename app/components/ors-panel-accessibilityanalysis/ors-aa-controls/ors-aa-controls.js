angular.module('orsApp.ors-aa-controls', []).component('orsAaControls', {
    templateUrl: 'app/components/ors-panel-accessibilityanalysis/ors-aa-controls/ors-aa-controls.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsMapFactory) {
        var ctrl = this;
        ctrl.calculate = () => {
            console.log('adding');
            ctrl.onCalculate();
            // ctrl.showAdd = true;
        };
        ctrl.reset = () => {
            console.log('resetting');
            ctrl.onReset();
        };
		ctrl.zoomToArea = () => {
            orsMapFactory.mapServiceSubject.onNext({id: 0, params: "params"});
        };
    },
    bindings: {
        onCalculate: '&',
        onReset: '&',
        onReverse: '&',
        onWaypointsChanged: '&',
        showAdd: '=',
    }
});