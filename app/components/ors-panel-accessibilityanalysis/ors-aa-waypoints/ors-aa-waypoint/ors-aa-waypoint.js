angular.module("orsApp.ors-aa-waypoint", []).component("orsAaWaypoint", {
  templateUrl:
    "components/ors-panel-accessibilityanalysis/ors-aa-waypoints/ors-aa-waypoint/ors-aa-waypoint.html",
  bindings: {
    idx: "<",
    waypoint: "<",
    onDelete: "&",
    onWaypointsChanged: "&",
    waypoints: "<",
    showAdd: "=",
    addresses: "<",
    showGeocodingPanel: "="
  },
  controller: [
    "orsSettingsFactory",
    "orsObjectsFactory",
    "orsUtilsService",
    "orsRequestService",
    "orsMessagingService",
    "lists",
    function(
      orsSettingsFactory,
      orsObjectsFactory,
      orsUtilsService,
      orsRequestService,
      orsMessagingService,
      lists
    ) {
      let ctrl = this;
      ctrl.getPlaceholder = () => {
        let placeholder = "Area center";
        return placeholder;
      };
      ctrl.callGeocodingPanel = () => {
        ctrl.showGeocodingPanel = !ctrl.showGeocodingPanel;
      };
      // ctrl.$doCheck = () => {
      // }
      // ctrl.$onChanges = (changesObj) => {
      //     // can be different kinds of changes
      //     if (changesObj.idx) {
      //      // if array is reversed, 5 changes, how to unify???
      //     }
      // };
      ctrl.delete = () => {
        ctrl.onDelete({
          idx: ctrl.idx
        });
        ctrl.onWaypointsChanged();
      };
    }
  ]
});
