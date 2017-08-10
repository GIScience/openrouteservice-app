angular.module('orsApp.ors-addresses', ['orsApp.ors-exportRoute-controls'])
    .component('orsAddresses', {
        templateUrl: 'components/ors-panel-routing/ors-addresses/ors-addresses.html',
        bindings: {
            showGeocodingPanel: '=',
            showGeocodingPanelIdx: '<'
        },
        controller: ['orsSettingsFactory', 'orsMapFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsMessagingService', 'lists', function(orsSettingsFactory, orsMapFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsMessagingService, lists) {
            let ctrl = this;
            console.log(ctrl.showGeocodingPanelIdx);
            ctrl.waypoint = orsSettingsFactory.getWaypoints()[ctrl.showGeocodingPanelIdx];
            ctrl.checkForAddresses = () => {
                if (ctrl.addresses) ctrl.showAddresses = true;
            };
            ctrl.addressChanged = () => {
                let addressString = ctrl.waypoint._address;
                // split at "," ";" and " "
                addressString = addressString.split(/[\s,;]+/);
                // is this a coordinate?
                if (addressString.length == 2) {
                    var lat = addressString[0];
                    var lng = addressString[1];
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
                    } else {
                        ctrl.contructPayLoad();
                    }
                } else {
                    ctrl.contructPayLoad();
                }
            };
            ctrl.contructPayLoad = () => {
                const payload = orsUtilsService.geocodingPayload(ctrl.waypoint._address);
                const request = orsRequestService.geocode(payload);
                orsRequestService.geocodeRequests.updateRequest(request, ctrl.idx, 'routeRequests');
                orsRequestService.requestSubject.onNext(true);
                request.promise.then((data) => {
                    if (data.features.length > 0) {
                        ctrl.addresses = orsUtilsService.addShortAddresses(data.features);
                        console.log(ctrl.addresses)
                        ctrl.showAddresses = true;
                    } else {
                        orsMessagingService.messageSubject.onNext(lists.errors.GEOCODE);
                    }
                    orsRequestService.requestSubject.onNext(false);
                }, (response) => {
                    // this will be caught my the httpinterceptor
                    console.log(response);
                    orsRequestService.requestSubject.onNext(false);
                });
            };
            ctrl.select = (address) => {
                ctrl.showAddresses = false;
                ctrl.showGeocodingPanel = !ctrl.showGeocodingPanel;
                const addressStrings = [address.processed.primary, address.processed.secondary];
                ctrl.waypoint._address = addressStrings.join(", ");
                ctrl.waypoint._latlng = L.latLng(address.geometry.coordinates[1], address.geometry.coordinates[0]);
                ctrl.waypoint._set = 1;
                orsSettingsFactory.setWaypoint(ctrl.waypoint, ctrl.showGeocodingPanelIdx, true);
                orsRequestService.zoomTo([
                    [address.geometry.coordinates[1], address.geometry.coordinates[0]]
                ]);
            };
        }]
    });