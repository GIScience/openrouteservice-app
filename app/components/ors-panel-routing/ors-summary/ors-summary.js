angular
  .module("orsApp.ors-summary", [
    "orsApp.ors-exportRoute-controls",
    "orsApp.ors-share"
  ])
  .component("orsSummaries", {
    templateUrl: "components/ors-panel-routing/ors-summary/ors-summary.html",
    bindings: {
      showInstructions: "&",
      shouldDisplayRouteDetails: "<"
    },
    controller: [
      "$rootScope",
      "orsSettingsFactory",
      "orsMapFactory",
      "orsObjectsFactory",
      "orsRouteService",
      "lists",
      "carCategories",
      function(
        $rootScope,
        orsSettingsFactory,
        orsMapFactory,
        orsObjectsFactory,
        orsRouteService,
        lists,
        carCategories
      ) {
        let ctrl = this;
        ctrl.carCategories = carCategories;
        ctrl.checkboxes = [false, false, false, false];
        ctrl.showShare = false;
        ctrl.showExport = false;
        ctrl.profiles = lists.profiles;
        ctrl.setIdx = idx => {
          orsRouteService.setCurrentRouteIdx(idx);
        };
        ctrl.getIdx = () => {
          return orsRouteService.getCurrentRouteIdx();
        };
        ctrl.getClass = bool => {
          if (bool === true) return "fa fa-lg fa-fw fa-angle-down";
          else return "fa fa-lg fa-fw fa-angle-right";
        };
        /** if we are coming back to route panel */
        if (
          angular.isDefined(orsRouteService.data) &&
          angular.isDefined(orsRouteService.data.routes)
        ) {
          if (orsRouteService.data.routes.length > 0) {
            ctrl.data = orsRouteService.data;
            const idx = ctrl.getIdx() === undefined ? 0 : ctrl.getIdx();
            ctrl.route = ctrl.data.routes[idx];
            if (ctrl.route.elevation) {
              // process heightgraph data
              const hgGeojson = orsRouteService.processHeightgraphData(
                ctrl.route
              );
              orsRouteService.addHeightgraph(hgGeojson);
            }
            orsRouteService.addRoute(ctrl.route);
          }
        }
        /** if we are returning to this panel, dispose all old subscriptions */
        try {
          if ($rootScope.routeSubscription !== undefined)
            $rootScope.routeSubscription.dispose();
        } catch (error) {
          console.warn(error);
        }
        $rootScope.routeSubscription = orsRouteService.routesSubject.subscribe(
          data => {
            ctrl.data = data;
            orsRouteService.setCurrentRouteIdx(0);
          }
        );
        ctrl.EmphRoute = idx => {
          const geometry = ctrl.data.routes[idx].geometry;
          orsRouteService.Emph(geometry);
        };
        ctrl.DeEmphRoute = () => {
          orsRouteService.DeEmph();
        };
        ctrl.classInQuery = (ofsData, vehicleClass) => {
          return ofsData.general.vehicle_categories.indexOf(vehicleClass) > -1;
        };
      }
    ]
  });
