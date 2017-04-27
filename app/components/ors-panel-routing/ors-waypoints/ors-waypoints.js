angular.module('orsApp.ors-waypoints', ['orsApp.ors-waypoint', 'orsApp.ors-route-controls']).component('orsWaypoints', {
    templateUrl: 'components/ors-panel-routing/ors-waypoints/ors-waypoints.html',
    bindings: {
        orsMap: '<',
        orsParams: '<',
        activeProfile: '<',
        activeSubgroup: '<',
    },
    controller: ['orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRouteService', 'orsRequestService', 'orsParamsService', '$timeout', function(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRouteService, orsRequestService, orsParamsService, $timeout) {
        let ctrl = this;
        ctrl.$onInit = () => {
            /** If waypoints list is empty initialize new waypoints. */
            ctrl.waypoints = orsSettingsFactory.getWaypoints();
            if (ctrl.waypoints.length == 0) {
                ctrl.waypoints = orsSettingsFactory.initWaypoints(2);
            }
            ctrl.showAdd = true;
        };
        // ctrl.$onChanges = function(changesObj) {
        //     console.log(changesObj)
        // };
        // subscribes to changes in waypoints, this doesnt have to be added though, why? Because of reference?
        orsSettingsFactory.subscribeToWaypoints(function onNext(d) {
            console.log('waypoints updated!!! panel', d);
            ctrl.waypoints = d;
        });
        /**Determines which collapse icon to show. */
        ctrl.collapsed = false;
        ctrl.collapseIcon = "fa fa-chevron-down";
        ctrl.collapse = () => {
            ctrl.collapsed = ctrl.collapsed === true ? false : true;
            if (ctrl.collapsed === true) {
                ctrl.sortableOptions.disabled = true;
                ctrl.collapseIcon = "fa fa-chevron-right";
            }
            if (ctrl.collapsed === false) {
                ctrl.sortableOptions.disabled = false;
                ctrl.collapseIcon = "fa fa-chevron-down";
            }
        };
        /**
         * Determines whether list of viapoints should be shown.
         * @param {number} The idx.
         */
        ctrl.showViapoints = (idx) => {
            if (ctrl.collapsed === true) {
                if (ctrl.waypoints.length > 2) {
                    if (idx == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        };
        /**
         * Determines whether list of waypoints should be collapsed.
         * @param {number} The idx.
         */
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
        ctrl.$doCheck = () => {};
        /**
         * Removes waypoint. If only start and end are set new wp is created.
         * @param {number} The idx.
         */
        ctrl.deleteWaypoint = (idx) => {
            /** is this waypoint set, if so fire request and update route **/
            let toggleRequest = (ctrl.waypoints[idx]._set == 1) ? true : false;
            if (ctrl.waypoints.length == 2) {
                let wp = orsObjectsFactory.createWaypoint('', new L.latLng());
                ctrl.waypoints[idx] = wp;
            } else {
                ctrl.waypoints.splice(idx, 1);
            }
            /** remove this request from request que */
            orsRequestService.geocodeRequests.removeRequest(idx, 'routeRequests');
            orsSettingsFactory.setWaypoints(ctrl.waypoints, toggleRequest);
        };
        /** Reveres waypoints order. */
        ctrl.reverseWaypoints = () => {
            ctrl.waypoints.reverse();
            orsSettingsFactory.setWaypoints(ctrl.waypoints);
        };
        /** Resets waypoints to emptry start and end. */
        ctrl.resetWaypoints = () => {
            orsRouteService.resetRoute();
            ctrl.waypoints = orsSettingsFactory.initWaypoints(2);
            orsSettingsFactory.updateWaypoints();
        };
        /** Adds waypoint to the end. */
        ctrl.addWaypoint = () => {
            let wp = orsObjectsFactory.createWaypoint('', new L.latLng());
            ctrl.waypoints.splice(ctrl.waypoints.length - 1, 0, wp);
            orsSettingsFactory.setWaypoints(ctrl.waypoints, false);
        };
        /** If dropdown of addresses is openend once again and address is changed. */
        ctrl.addressChanged = () => {
            orsSettingsFactory.setWaypoints(ctrl.waypoints, true);
        };
        /** Sortable options for angular-jquery-ui .*/
        ctrl.sortableOptions = {
            axis: 'y',
            containment: 'parent',
            activate: () => {},
            beforeStop: () => {},
            change: () => {},
            create: () => {},
            deactivate: () => {},
            out: () => {},
            over: () => {},
            receive: () => {},
            remove: () => {},
            sort: () => {},
            start: () => {},
            update: (e, ui) => {
                $timeout(function() {
                    orsSettingsFactory.setWaypoints(ctrl.waypoints, true);
                }, 100);
            },
            stop: (e, ui) => {
                //orsSettingsFactory.setWaypoints(ctrl.waypoints, true);
            }
        };
    }]
});