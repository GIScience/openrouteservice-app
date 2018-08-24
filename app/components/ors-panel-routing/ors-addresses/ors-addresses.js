angular
  .module("orsApp.ors-addresses", [
    "orsApp.ors-exportRoute-controls",
    "focus-if"
  ])
  .component("orsAddresses", {
    templateUrl:
      "components/ors-panel-routing/ors-addresses/ors-addresses.html",
    bindings: {
      showGeocodingPanel: "=",
      showGeocodingPanelIdx: "<"
    },
    controller: [
      "orsSettingsFactory",
      "orsMapFactory",
      "orsObjectsFactory",
      "orsUtilsService",
      "orsRequestService",
      "orsMessagingService",
      "lists",
      function(
        orsSettingsFactory,
        orsMapFactory,
        orsObjectsFactory,
        orsUtilsService,
        orsRequestService,
        orsMessagingService,
        lists
      ) {
        let ctrl = this;
        ctrl.$onInit = () => {
          ctrl.isDirections = ctrl.showGeocodingPanelIdx !== undefined;
          if (ctrl.isDirections) {
            ctrl.waypoint = orsSettingsFactory.getWaypoints()[
              ctrl.showGeocodingPanelIdx
            ];
            ctrl.addresses =
              orsRequestService.savedRequests.directions[
                ctrl.showGeocodingPanelIdx
              ];
          } else {
            ctrl.waypoint = orsSettingsFactory.getWaypoints()[0];
            ctrl.addresses = orsRequestService.savedRequests.geocoding[0];
          }
        };
        ctrl.addressChanged = () => {
          if (ctrl.waypoint._address != "") {
            let addressString = ctrl.waypoint._address;
            // split at "," ";" and " "
            addressString = addressString.split(/[\s,;]+/);
            // is this a coordinate?
            if (addressString.length == 2) {
              var lat = addressString[0];
              var lng = addressString[1];
              if (orsUtilsService.isCoordinate(lat, lng)) {
                let position = L.latLng(lat, lng);
                let positionString = orsUtilsService.parseLatLngString(
                  position
                );
                ctrl.addresses = [
                  {
                    geometry: {
                      coordinates: [lng, lat]
                    },
                    processed: {
                      primary: positionString,
                      secondary: ""
                    }
                  }
                ];
              } else {
                ctrl.constructPayLoad();
              }
            } else {
              ctrl.constructPayLoad();
            }
          } else {
            ctrl.addresses = [];
          }
        };
        ctrl.constructPayLoad = () => {
          ctrl.addresses = [];
          const payload = orsUtilsService.geocodingPayload(
            ctrl.waypoint._address
          );
          const request = orsRequestService.geocode(payload);
          orsRequestService.geocodeRequests.updateRequest(
            request,
            ctrl.idx,
            "routeRequests"
          );
          orsRequestService.requestSubject.onNext(true);
          request.promise.then(
            data => {
              if (data.features.length > 0) {
                ctrl.addresses = orsUtilsService.addShortAddresses(
                  data.features
                );
                if (ctrl.isDirections) {
                  orsRequestService.savedRequests.directions[
                    ctrl.showGeocodingPanelIdx
                  ] = ctrl.addresses;
                } else {
                  orsRequestService.savedRequests.geocoding[0] = ctrl.addresses;
                }
              } else {
                orsMessagingService.messageSubject.onNext(lists.errors.GEOCODE);
              }
              orsRequestService.requestSubject.onNext(false);
            },
            response => {
              // this will be caught my the httpinterceptor
              orsRequestService.requestSubject.onNext(false);
            }
          );
        };
        ctrl.select = address => {
          ctrl.showGeocodingPanel = !ctrl.showGeocodingPanel;
          let addressStrings;
          if (address.processed.secondary.length > 0) {
            addressStrings = [
              address.processed.primary,
              address.processed.secondary
            ];
          } else {
            addressStrings = [address.processed.primary];
          }
          ctrl.waypoint._address = addressStrings.join(", ");
          ctrl.waypoint._latlng = L.latLng(
            address.geometry.coordinates[1],
            address.geometry.coordinates[0]
          );
          ctrl.waypoint._set = 1;
          const idx =
            ctrl.showGeocodingPanelIdx === undefined
              ? 0
              : ctrl.showGeocodingPanelIdx;
          orsSettingsFactory.setWaypoint(ctrl.waypoint, idx, true);
          orsRequestService.zoomTo([
            [address.geometry.coordinates[1], address.geometry.coordinates[0]]
          ]);
        };
      }
    ]
  });
