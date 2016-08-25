angular.module('orsApp.ors-waypoints', ['orsApp.ors-waypoint', 'orsApp.ors-route-controls']).component('orsWaypoints', {
    templateUrl: 'app/components/ors-panel-routing/ors-waypoints/ors-waypoints.html',
    bindings: {
        orsMap: '<',
    },
    controller(orsSettingsFactory, orsObjectsFactory) {
        var ctrl = this;
        console.log(ctrl.orsMap)
        ctrl.$onInit = () => {
            console.log('init...')
            ctrl.waypoints = orsSettingsFactory.getWaypoints();
            ctrl.showAdd = true;
            console.log(ctrl.orsMap)
            L.marker([1, 0]).addTo(ctrl.orsMap);
        };
        // subscribes to changes in the map
        var subscription = orsSettingsFactory.subscribe(function onNext(d) {
            console.log('CHANGE IN MAP!!!', d);
            ctrl.waypoints = d;
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
            orsSettingsFactory.setWaypoints(ctrl.waypoints);
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
        };
        ctrl.moveDownWaypoint = (idx) => {
            if (ctrl.waypoints.length == 2) {
                ctrl.reverseWaypoints();
            } else {
                ctrl.waypoints.move(idx, idx + 1);
                orsSettingsFactory.setWaypoints(ctrl.waypoints);
            }
        };
        ctrl.addWaypoint = () => {
            let wp = orsObjectsFactory.createWaypoint('', new L.latLng());
            ctrl.waypoints.push(wp);
            orsSettingsFactory.setWaypoints(ctrl.waypoints);
        };
        ctrl.addressChanged = (address) => {
            // fire nominatim etc.. on success call ctrl.onWaypointsChanged();
            console.log(address)
                // fire nominatim
            var requestData = utilsFactory.generateXml(scope.filterText);
            requestFactory.geocode(requestData).then(function(response) {
                var data = utilsFactory.domParser(response.data);
                var error = errorFactory.parseResponse(data);
                if (!error) {
                    scope.addressData = utilsFactory.processAddresses(data);
                    scope.isResponseListVisible = true;
                } else {
                    scope.angularddress = 'error code: 0';
                }
            }, function(response) {
                $scope.errorMessage = errorFactory.generalErrors('It was not possible to get the address at this time. Sorry for the inconvenience!');
            });
        };
    }
});

function WayPointsController(orsSettings) {}