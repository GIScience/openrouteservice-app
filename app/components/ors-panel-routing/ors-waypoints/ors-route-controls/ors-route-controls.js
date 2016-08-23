angular.module('orsApp.ors-route-controls', []).component('orsRouteControls', {
    templateUrl: 'app/components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-route-controls.html',
    controller: RouteControlsController,
    bindings: {
        onAdd: '&'
    }
});

function RouteControlsController() {
    var ctrl = this;
    ctrl.add = () => {
        console.log('adding');
        ctrl.onAdd();
    };
}