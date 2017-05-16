angular.module('orsApp.ors-aa-waypoint', []).component('orsAaWaypoint', {
    templateUrl: 'components/ors-panel-accessibilityanalysis/ors-aa-waypoints/ors-aa-waypoint/ors-aa-waypoint.html',
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
    controller: ['orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsMessagingService', 'lists', function(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsMessagingService, lists) {
        let ctrl = this;
        ctrl.select = (address) => {
            ctrl.showAddresses = false;
            ctrl.waypoint._address = address.shortaddress;
            ctrl.waypoint._latlng = L.latLng(address.geometry.coordinates[1], address.geometry.coordinates[0]);
            ctrl.waypoint._set = 1;
            ctrl.onAddressChanged(ctrl.waypoint);
            orsRequestService.zoomTo([[address.geometry.coordinates[1], address.geometry.coordinates[0]]])
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
                        geometry: {
                            coordinates: [lng, lat]
                        },
                        shortaddress: positionString
                    }];
                    ctrl.showAddresses = true;
                }
            } else {
                const payload = orsUtilsService.geocodingPayload(ctrl.waypoint._address);
                const request = orsRequestService.geocode(payload);
                orsRequestService.geocodeRequests.updateRequest(request, ctrl.idx, 'routeRequests');
                request.promise.then((data) => {
                    if (data.features.length > 0) {
                        ctrl.addresses = orsUtilsService.addShortAddresses(data.features);
                        ctrl.showAddresses = true;
                    } else {
                        orsMessagingService.messageSubject.onNext(lists.errors.GEOCODE);
                    }
                }, (response) => {
                    // this will be caught my the httpinterceptor
                    console.log(response);
                });
            }
        };
        ctrl.getPlaceholder = () => {
            let placeholder = 'Area center';
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