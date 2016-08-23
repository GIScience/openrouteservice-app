angular.module('orsApp.ors-waypoints', ['orsApp.ors-waypoint', 'orsApp.ors-route-controls']).component('orsWaypoints', {
    templateUrl: 'app/components/ors-panel-routing/ors-waypoints/ors-waypoints.html',
    controller: function(orsSettingsFactory, orsObjectsFactory) {
        var ctrl = this;
        ctrl.$onInit = () => {
            ctrl.waypoints = orsSettingsFactory.getWaypoints();
        };
        ctrl.deleteWaypoint = (idx) => {
            ctrl.waypoints.splice(idx, 1);
            // set
        };
        ctrl.reverseWaypoints = () => {
            ctrl.waypoints.reverse();
            // set
        };
        ctrl.moveUpWaypoint = (idx) => {
            if (ctrl.waypoints.length == 2) {
                ctrl.reverseWaypoints();
            } else {
                if (idx > 0) {
                    ctrl.waypoints.move(idx, idx - 1);
                }
            }
            orsSettingsFactory.setWaypoints(ctrl.waypoints);
        };
        ctrl.moveDownWaypoint = (idx) => {
            if (ctrl.waypoints.length == 2) {
                ctrl.reverseWaypoints();
            } else {
                ctrl.waypoints.move(idx, idx + 1);
            }
            orsSettingsFactory.setWaypoints(ctrl.waypoints);
        };
        ctrl.addWaypoint = () => {
            let wp = orsObjectsFactory.createWaypoint('Test', []);
            ctrl.waypoints.push(wp);
            orsSettingsFactory.setWaypoints(ctrl.waypoints);
        };
    }
});

function WayPointsController(orsSettings) {}