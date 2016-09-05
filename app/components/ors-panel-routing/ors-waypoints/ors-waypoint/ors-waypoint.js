angular.module('orsApp.ors-waypoint', []).component('orsWaypoint', {
    templateUrl: 'app/components/ors-panel-routing/ors-waypoints/ors-waypoint/ors-waypoint.html',
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
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
        var ctrl = this;
        ctrl.select = (address) => {
            ctrl.showAddresses = false;
            ctrl.waypoint._address = address.shortAddress;
            ctrl.waypoint._latlng = address.position;
            ctrl.onAddressChanged(ctrl.waypoint);
        };
        ctrl.getIdx = () => {
            if (ctrl.idx == 0) return 'A';
            else if (ctrl.idx == ctrl.waypoints.length - 1) return 'B';
            else return ctrl.idx;
        };
        ctrl.checkForAddresses = () => {
            if (ctrl.addresses) ctrl.showAddresses = true;
        };
        ctrl.addressChanged = () => {
            console.log(ctrl.waypoint._address)
            // is this a waypoint...?
            
            // fire nominatim
            const requestData = orsUtilsService.generateXml(ctrl.waypoint._address);
            orsRequestService.geocode(requestData).then(function(response) {
                let data = orsUtilsService.domParser(response.data);
                const error = orsErrorhandlerService.parseResponse(data);
                if (!error) {
                    ctrl.addresses = orsUtilsService.processAddresses(data);
                    // show 
                    ctrl.showAddresses = true;
                } else {
                    console.log('error');
                }
            }, function(response) {
                console.log(response)
                    //$scope.errorMessage = orsErrorhandlerService.generalErrors('It was not possible to get the address at this time. Sorry for the inconvenience!');
            });
        };
        ctrl.getPlaceholder = () => {
            let placeholder;
            if (ctrl.idx == 0) placeholder = 'Start';
            else if (ctrl.idx == ctrl.waypoints.length - 1) placeholder = 'End';
            else placeholder = 'Via';
            return placeholder;
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
    }
});