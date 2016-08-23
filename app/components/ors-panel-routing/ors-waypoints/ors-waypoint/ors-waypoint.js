angular.module('orsApp.ors-waypoint', []).component('orsWaypoint', {
    templateUrl: 'app/components/ors-panel-routing/ors-waypoints/ors-waypoint/ors-waypoint.html',
    controller: WaypointDetailController,
    require: {
        parent: '^orsWaypoints'
    },
    bindings: {
        idx: '<',
        waypoint: '=',
        onMoveUp: '&',
        onMoveDown: '&',
        onDelete: '&',
        waypoints: '<'
    }
});

function WaypointDetailController() {
    var ctrl = this;
    
    ctrl.$onChanges = (changesObj) => {
        // can be different kinds of changes
        console.log(changesObj);
    };
    ctrl.delete = () => {
        console.log('del', ctrl.idx);
        ctrl.onDelete({
            idx: ctrl.idx
        });
    };
    ctrl.moveup = () => {
        ctrl.onMoveUp({
            idx: ctrl.idx
        });
    };
    ctrl.movedown = () => {
        ctrl.onMoveDown({
            idx: ctrl.idx
        });
    };
    ctrl.showHideMoveUp = () => {
        if (ctrl.idx == 0) {
            return false;
        } else {
            return true;
        }
    };
    ctrl.showHideMoveDown = () => {
        if (ctrl.idx == ctrl.waypoints.length - 1) {
            return false;
        } else {
            return true;
        }
    };
}