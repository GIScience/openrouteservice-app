angular
  .module("orsApp.ors-route-controls", ["orsApp.ors-importRoute-controls"])
  .component("orsRouteControls", {
    templateUrl:
      "components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-route-controls.html",
    controller: [
      "$location",
      "orsSettingsFactory",
      "orsObjectsFactory",
      "orsUtilsService",
      "orsRequestService",
      "orsMapFactory",
      "orsCookiesFactory",
      function(
        $location,
        orsSettingsFactory,
        orsObjectsFactory,
        orsUtilsService,
        orsRequestService,
        orsMapFactory,
        orsCookiesFactory
      ) {
        let ctrl = this;
        ctrl.showOptions = true;
        ctrl.add = () => {
          ctrl.onAdd();
          ctrl.showAdd = true;
        };
        ctrl.reset = () => {
          ctrl.onReset();
        };
        ctrl.reversing = () => {
          ctrl.onReverse();
          ctrl.onWaypointsChanged();
        };
        ctrl.callOptions = () => {
          ctrl.showOptions = ctrl.showOptions === false;
        };
        /**
         * Called when clicking the zoom button. Forwards zoom command to mapservice
         */
        ctrl.zoom = () => {
          const action = orsObjectsFactory.createMapAction(
            0,
            undefined,
            undefined,
            undefined
          );
          orsMapFactory.mapServiceSubject.onNext(action);
        };
      }
    ],
    bindings: {
      onAdd: "&",
      onReset: "&",
      onReverse: "&",
      onWaypointsChanged: "&",
      showAdd: "=",
      activeSubgroup: "<",
      activeProfile: "<",
      roundTrip: "="
    }
  });
