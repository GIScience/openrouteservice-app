angular.module('orsApp.ors-waypoint', []).component('orsWaypoint', {
    templateUrl: 'components/ors-panel-routing/ors-waypoints/ors-waypoint/ors-waypoint.html',
    bindings: {
        idx: '<',
        waypoint: '<',
        onDelete: '&',
        onWaypointsChanged: '&',
        onAddressChanged: '&',
        waypoints: '<',
        showAdd: '=',
        addresses: '<'
    },
    controller: ['orsSettingsFactory', 'orsMapFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsErrorhandlerService', function(orsSettingsFactory, orsMapFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
        let ctrl = this;
        ctrl.select = (address) => {
            ctrl.showAddresses = false;
            ctrl.waypoint._address = address.shortAddress;
            ctrl.waypoint._latlng = address.position;
            ctrl.waypoint._set = 1;
            ctrl.onAddressChanged(ctrl.waypoint);
        };
        ctrl.getIdx = () => {
            if (ctrl.idx == 0) return 'A';
            else if (ctrl.idx == ctrl.waypoints.length - 1) return 'B';
            else return ctrl.idx;
        };
        ctrl.emph = () => {
            const highlightWaypoint = orsObjectsFactory.createMapAction(3, lists.layers[0], undefined, ctrl.idx, undefined);
            orsMapFactory.mapServiceSubject.onNext(highlightWaypoint);
        };
        ctrl.checkForAddresses = () => {
            if (ctrl.addresses) ctrl.showAddresses = true;
        };
        ctrl.addressChanged = () => {
            // is this a coordinate?
            let inputCoordinates = ctrl.waypoint._address;
            // split at "," ";" and " "
            inputCoordinates = inputCoordinates.split(/[\s,;]+/);
            if (inputCoordinates.length == 2) {
                var lat = inputCoordinates[0];
                var lng = inputCoordinates[1];
                if (orsUtilsService.isCoordinate(lat, lng)) {
                    let position = L.latLng(lat, lng);
                    let positionString = orsUtilsService.parseLatLngString(position);
                    ctrl.addresses = [{
                        address: positionString,
                        position: position,
                        shortAddress: positionString
                    }];
                    ctrl.showAddresses = true;
                    //49.44045, 8.686752
                }
            } else /** fire nominatim */ {
                const payload = orsUtilsService.generateXml(ctrl.waypoint._address);
                const request = orsRequestService.geocode(payload);
                orsRequestService.removeRequest(request, ctrl.idx);
                request.promise.then((response) => {
                    let data = orsUtilsService.domParser(response);
                    const error = orsErrorhandlerService.parseResponse(data);
                    if (!error) {
                        ctrl.addresses = orsUtilsService.processAddresses(data);
                        // show 
                        ctrl.showAddresses = true;
                    } else {
                        console.log('error');
                    }
                }, (response) => {
                    console.log(response);
                    //$scope.errorMessage = orsErrorhandlerService.generalErrors('It was not possible to get the address at this time. Sorry for the inconvenience!');
                });
            }
        };
        ctrl.getPlaceholder = () => {
            let placeholder;
            if (ctrl.idx == 0) placeholder = 'Start';
            else if (ctrl.idx == ctrl.waypoints.length - 1) placeholder = 'End';
            else placeholder = 'Via';
            return placeholder;
        };
        // ctrl.$doCheck = () => {
        //  console.log('check')
        // }
        // ctrl.$onChanges = (changesObj) => {
        //     // can be different kinds of changes
        //     if (changesObj.idx) {
        //      console.log(changesObj.idx);
        //      console.log(ctrl.waypoints);
        //      // if array is reversed, 5 changes, how to unify???
        //     }
        // };
        ctrl.delete = () => {
            ctrl.onDelete({
                idx: ctrl.idx
            });
            ctrl.onWaypointsChanged();
        };
    }]
});