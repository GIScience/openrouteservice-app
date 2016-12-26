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
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
        var ctrl = this;
        ctrl.select = (address) => {
            ctrl.showAddresses = false;
            ctrl.waypoint._address = address.shortAddress;
            ctrl.waypoint._latlng = address.position;
            ctrl.onAddressChanged(ctrl.waypoint);
        };
        ctrl.checkForAddresses = () => {
            if (ctrl.addresses) ctrl.showAddresses = true;
        };
        ctrl.addressChanged = () => {
            const payload = orsUtilsService.generateXml(ctrl.waypoint._address);
            const request = orsRequestService.geocode(payload);
            orsRequestService.updateRequest(request, ctrl.idx);
            request.promise.then(function(response) {
                let data = orsUtilsService.domParser(response);
                const error = orsErrorhandlerService.parseResponse(data);
                if (!error) {
                    ctrl.addresses = orsUtilsService.processAddresses(data);
                    // show 
                    ctrl.showAddresses = true;
                } else {
                    console.log('error');
                }
            }, function(response) {
                console.log(response);
                    //$scope.errorMessage = orsErrorhandlerService.generalErrors('It was not possible to get the address at this time. Sorry for the inconvenience!');
            });
        };
        ctrl.getPlaceholder = () => {
            let placeholder = 'Area center';
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