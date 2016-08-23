angular.module('orsApp.ors-waypoint', []).component('orsWaypoint', {
    templateUrl: 'app/components/ors-panel-routing/ors-waypoints/ors-waypoint/ors-waypoint.html',
    controller: WaypointDetailController,
    bindings: {
        idx: '<',
        waypoint: '=',
        onMoveUp: '&',
        onMoveDown: '&',
        onDelete: '&',
        onWaypointsChanged: '&',
        waypoints: '<',
        showAdd: '='
    }
});

function WaypointDetailController() {
    var ctrl = this;

    ctrl.addressChanged = () => {
    	console.log(ctrl.waypoint);
    	// fire nominatim etc.. on success call ctrl.onWaypointsChanged();
    };

    // ctrl.$doCheck = () => {
    // 	console.log('check')
    // }

    // ctrl.$onChanges = (changesObj) => {
    //     // can be different kinds of changes
    //     if (changesObj.idx) {
    //     	console.log(changesObj.idx);
    //     	console.log(ctrl.waypoints);
    //     	// if array is reversed, 5 changes, how to unify???
    //     }
    // };


    ctrl.delete = () => {
        ctrl.onDelete({
            idx: ctrl.idx
        });
        ctrl.onWaypointsChanged();

    };
    ctrl.moveup = () => {
        ctrl.onMoveUp({
            idx: ctrl.idx
        });
        ctrl.onWaypointsChanged();

    };
    ctrl.movedown = () => {
        ctrl.onMoveDown({
            idx: ctrl.idx
        });
        ctrl.onWaypointsChanged();

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