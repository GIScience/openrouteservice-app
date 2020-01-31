angular.module("orsApp.ors-waypoint", []).component("orsWaypoint", {
  templateUrl:
    "components/ors-panel-routing/ors-waypoints/ors-waypoint/ors-waypoint.html",
  bindings: {
    idx: "<",
    waypoint: "<",
    onDelete: "&",
    onWaypointsChanged: "&",
    onAddressChanged: "&",
    waypoints: "<",
    showAdd: "=",
    addresses: "<",
    showGeocodingPanel: "=",
    showGeocodingPanelIdx: "=",
    roundTrip: "<"
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
      ctrl.callGeocodingPanel = () => {
        ctrl.showGeocodingPanel = !ctrl.showGeocodingPanel;
        ctrl.showGeocodingPanelIdx = ctrl.idx;
      };
      ctrl.getIdx = () => {
        if (ctrl.idx === 0) return "A";
        else if (ctrl.idx === ctrl.waypoints.length - 1) return "B";
        else return ctrl.idx;
      };
      ctrl.emph = () => {
        if (Object.entries(ctrl.waypoint._latlng).length !== 0) {
          const highlightWaypoint = orsObjectsFactory.createMapAction(
            3,
            lists.layers[2],
            ctrl.waypoint._latlng,
            ctrl.idx,
            undefined
          );
          orsMapFactory.mapServiceSubject.onNext(highlightWaypoint);
        }
      };
      ctrl.deEmph = () => {
        const clearHighlightWaypoints = orsObjectsFactory.createMapAction(
          2,
          lists.layers[2],
          undefined,
          undefined,
          undefined
        );
        orsMapFactory.mapServiceSubject.onNext(clearHighlightWaypoints);
      };
      ctrl.getPlaceholder = () => {
        let placeholder;
        if (ctrl.idx === 0) placeholder = "Start";
        else if (ctrl.idx === ctrl.waypoints.length - 1) placeholder = "End";
        else placeholder = "Via";
        return placeholder;
      };
      // ctrl.$doCheck = () => {
      //  console.log('check');
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
    }
  ]
});
