angular.module('orsApp.ors-route-controls', []).component('orsRouteControls', {
    templateUrl: 'app/components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-route-controls.html',
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
        ctrl.reversing = () => {
            console.log('reverse');
            ctrl.onReverse();
            ctrl.onWaypointsChanged();
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