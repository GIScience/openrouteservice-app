angular.module('orsApp.ors-aa-controls', []).component('orsAaControls', {
    templateUrl: 'app/components/ors-panel-accessibilityanalysis/ors-aa-controls/ors-aa-controls.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
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
            console.log('zooming');
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