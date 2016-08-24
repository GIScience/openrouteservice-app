angular.module('orsApp.ors-waypoints', ['orsApp.ors-waypoint', 'orsApp.ors-route-controls']).component('orsWaypoints', {
    templateUrl: 'app/components/ors-panel-routing/ors-waypoints/ors-waypoints.html',
    bindings: {
        orsMap: '<',
    },
    controller(orsSettingsFactory, orsObjectsFactory, notifyingFactory) {
        var ctrl = this;
        console.log(ctrl.orsMap)
        ctrl.$onInit = () => {
            console.log('init...')
            ctrl.waypoints = orsSettingsFactory.getWaypoints();
            ctrl.showAdd = true;
            console.log(ctrl.orsMap)
            L.marker([1, 0]).addTo(ctrl.orsMap);
        };
        // subscribe from map
        notifyingFactory.subscribeMap(ctrl, function somethingChanged() {
            // Handle notification
            ctrl.waypoints = orsSettingsFactory.getWaypoints();
            console.log('something has happened on map, update panel..');
        });
        ctrl.$doCheck = () => {
            // check if array has changed
            //console.log('update route');
        };
        ctrl.waypointsChanged = () => {
            console.log('wps changed');
        };
        ctrl.deleteWaypoint = (idx) => {
            ctrl.waypoints.splice(idx, 1);
            orsSettingsFactory.setWaypoints(ctrl.waypoints);
        };
        ctrl.reverseWaypoints = () => {
            ctrl.waypoints.reverse();
            orsSettingsFactory.setWaypoints(ctrl.waypoints);
        };
        ctrl.resetWaypoints = () => {
            ctrl.waypoints = [];
            //orsSettingsFactory.setWaypoints(ctrl.waypoints);
        };
        ctrl.moveUpWaypoint = (idx) => {
            console.log('called');
            if (ctrl.waypoints.length == 2) {
                ctrl.reverseWaypoints();
            } else {
                if (idx > 0) {
                    ctrl.waypoints.move(idx, idx - 1);
                    orsSettingsFactory.setWaypoints(ctrl.waypoints);
                }
            }
            //notifyingFactory.notifyMap();
        };
        ctrl.moveDownWaypoint = (idx) => {
            if (ctrl.waypoints.length == 2) {
                ctrl.reverseWaypoints();
            } else {
                ctrl.waypoints.move(idx, idx + 1);
                orsSettingsFactory.setWaypoints(ctrl.waypoints);
            }
            //notifyingFactory.notifyMap();
        };
        ctrl.addWaypoint = () => {
            let wp = orsObjectsFactory.createWaypoint('', new L.latLng());
            ctrl.waypoints.push(wp);
            orsSettingsFactory.setWaypoints(ctrl.waypoints);
        };
    }
});

function WayPointsController(orsSettings) {}