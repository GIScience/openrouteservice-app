angular.module('orsApp.ors-aa-waypoints', ['orsApp.ors-aa-waypoint']).component('orsAaWaypoints', {
    templateUrl: 'app/components/ors-panel-accessibilityanalysis/ors-aa-waypoints/ors-aa-waypoints.html',
    bindings: {
        orsMap: '<',
        orsParams: '<',
        activeProfile: '<',
        activeSubgroup: '<'
    },
    controller($scope, orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService) {
        var ctrl = this;
        ctrl.$onInit = () => {
            ctrl.waypoints = orsSettingsFactory.getWaypoints();
            if (ctrl.waypoints.length == 0) {
                ctrl.waypoints = orsSettingsFactory.initWaypoints(1);
            }
            ctrl.showAdd = true;
        };
        // subscribes to changes in waypoints, this doesnt have to be added though, why?
        orsSettingsFactory.subscribeToWaypoints(function onNext(d) {
            console.log('waypoints updated!!! panel', d);
            ctrl.waypoints = d;
        });
        ctrl.collapsed = false;
        ctrl.collapseIcon = "fa fa-minus-circle";
        ctrl.collapse = () => {
            ctrl.collapsed = ctrl.collapsed == true ? false : true;
            if (ctrl.collapsed == true) {
                ctrl.sortableOptions = {
                    disabled: true
                };
                ctrl.collapseIcon = "fa fa-plus-circle";
            }
            if (ctrl.collapsed == false) {
                ctrl.sortableOptions = {
                    disabled: false
                };
                ctrl.collapseIcon = "fa fa-minus-circle";
            }
        };
        ctrl.collapseWp = (idx) => {
            if (ctrl.collapsed == true) {
                if (idx == 0 || idx == ctrl.waypoints.length - 1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        };
        ctrl.$doCheck = () => {
            // check if array has changed
            //console.log('update route');
        };
        ctrl.waypointsChanged = () => {
            console.log('wps changed');
        };
        ctrl.deleteWaypoint = () => {};
        ctrl.resetWaypoints = () => {
            let wp = orsObjectsFactory.createWaypoint('', new L.latLng());
            ctrl.waypoints[0] = wp;
        };
        ctrl.addressChanged = () => {
            // const wp = orsObjectsFactory.createWaypoint(address.shortAddress, address.position);
            // console.log(wp)
            // ctrl.waypoints.push(wp);
            // console.log(ctrl.waypoints)
            orsSettingsFactory.setWaypoints(ctrl.waypoints);
        };
        $scope.$on('resetWaypoints', function(e) {
            ctrl.deleteWaypoint();
        });
        ctrl.sortableOptions = {
            axis: 'y',
            containment: 'parent',
            activate: function() {},
            beforeStop: function() {},
            change: function() {},
            create: function() {},
            deactivate: function() {},
            out: function() {},
            over: function() {},
            receive: function() {},
            remove: function() {},
            sort: function() {},
            start: function() {},
            update: function(e, ui) {},
            stop: function(e, ui) {
                orsSettingsFactory.setWaypoints(ctrl.waypoints);
            }
        };
    }
});