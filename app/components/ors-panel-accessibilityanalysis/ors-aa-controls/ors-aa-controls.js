angular.module('orsApp.ors-aa-controls', []).component('orsAaControls', {
    templateUrl: 'app/components/ors-panel-accessibilityanalysis/ors-aa-controls/ors-aa-controls.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
        var ctrl = this;
        ctrl.add = () => {
            console.log('adding');
            ctrl.onAdd();
            ctrl.showAdd = true;
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
        onAdd: '&',
        onReset: '&',
        onReverse: '&',
        onWaypointsChanged: '&',
        showAdd: '=',
    }
});