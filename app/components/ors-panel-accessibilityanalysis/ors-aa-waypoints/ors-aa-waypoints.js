angular
  .module("orsApp.ors-aa-waypoints", ["orsApp.ors-aa-waypoint"])
  .component("orsAaWaypoints", {
    templateUrl:
      "components/ors-panel-accessibilityanalysis/ors-aa-waypoints/ors-aa-waypoints.html",
    bindings: {
      orsMap: "<",
      orsParams: "<",
      activeProfile: "<",
      activeSubgroup: "<",
      currentOptions: "<",
      showGeocodingPanel: "="
    },
    controller: [
      "$scope",
      "orsSettingsFactory",
      "orsAaService",
      "orsObjectsFactory",
      "orsUtilsService",
      "orsRequestService",
      "orsParamsService",
      function(
        $scope,
        orsSettingsFactory,
        orsAaService,
        orsObjectsFactory,
        orsUtilsService,
        orsRequestService,
        orsParamsService
      ) {
        let ctrl = this;
        ctrl.$onInit = () => {
          ctrl.waypoints = orsSettingsFactory.getWaypoints();
          if (ctrl.waypoints.length == 0) {
            ctrl.waypoints = orsSettingsFactory.initWaypoints(1);
          }
          ctrl.showAdd = true;
        };
        // subscribes to changes in waypoints, this doesnt have to be added though, why?
        // orsSettingsFactory.subscribeToAaWaypoints(function onNext(d) {
        //     ctrl.waypoints = d;
        // });
        ctrl.collapsed = false;
        ctrl.collapseIcon = "fa fa-minus-circle";
        ctrl.collapse = () => {
          ctrl.collapsed = ctrl.collapsed == true ? false : true;
          if (ctrl.collapsed == true) {
            ctrl.sortableOptions = {
              disabled: true
            };
            ctrl.collapseIcon = "fa fa-plus-circle";
          }
          if (ctrl.collapsed == false) {
            ctrl.sortableOptions = {
              disabled: false
            };
            ctrl.collapseIcon = "fa fa-minus-circle";
          }
        };
        ctrl.collapseWp = idx => {
          if (ctrl.collapsed == true) {
            if (idx == 0 || idx == ctrl.waypoints.length - 1) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        };
        ctrl.$doCheck = () => {
          // check if array has changed
        };
        ctrl.waypointsChanged = () => {};
        ctrl.resetWaypoints = () => {
          ctrl.waypoints = orsSettingsFactory.initWaypoints(1);
          orsAaService.initAaObj();
          orsSettingsFactory.updateWaypoints();
        };
        ctrl.addressChanged = () => {
          orsSettingsFactory.setWaypoints(ctrl.waypoints, false);
        };
        ctrl.calculate = function() {
          orsSettingsFactory.setActiveOptions(ctrl.currentOptions, true);
        };
      }
    ]
  });
