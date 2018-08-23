angular
  .module("orsApp.ors-panel-accessibilityanalysis", [
    "orsApp.ors-aa-controls",
    "orsApp.ors-aa-waypoints",
    "orsApp.ors-aa-sliders",
    "orsApp.ors-aa-queries"
  ])
  .component("orsAnalysis", {
    templateUrl:
      "components/ors-panel-accessibilityanalysis/ors-panel-accessibilityanalysis.html",
    controller: [
      "$scope",
      "$location",
      "orsSettingsFactory",
      "orsObjectsFactory",
      "orsUtilsService",
      "orsRequestService",
      "orsParamsService",
      "orsCookiesFactory",
      "orsMapFactory",
      "lists",
      function(
        $scope,
        $location,
        orsSettingsFactory,
        orsObjectsFactory,
        orsUtilsService,
        orsRequestService,
        orsParamsService,
        orsCookiesFactory,
        orsMapFactory,
        lists
      ) {
        let ctrl = this;
        ctrl.$routerCanReuse = (next, prev) => {
          return next.urlPath === prev.urlPath;
        };
        ctrl.$onInit = () => {
          ctrl.profiles = lists.profiles;
        };
        ctrl.$routerOnActivate = next => {
          orsSettingsFactory.isInitialized = true;
          /** notify the settings that we're now in the aa panel */
          orsSettingsFactory.updateNgRoute(next.urlPath);
          /**
           * check if anything is saved in the settings object
           * if there isn't initialize settings object from permalink or provide empty
           */
          if (orsSettingsFactory.getWaypoints().length == 0) {
            ctrl.routeParams = next.params;
            orsSettingsFactory.initWaypoints(1);
            const importedParams = orsParamsService.importSettings(
              ctrl.routeParams,
              false
            );
            orsSettingsFactory.setSettings(importedParams.settings);
            // fetch addresses afterwards
            angular.forEach(importedParams.settings.waypoints, (wp, idx) => {
              orsSettingsFactory.getAddress(wp._latlng, idx, true);
            });
            // merge cookies and permalink settings
            const userOptionsCookie = orsCookiesFactory.getCookies();
            const mapOptionsCookie = orsCookiesFactory.getMapOptions();
            const userOptions = Object.assign(
              {},
              userOptionsCookie,
              mapOptionsCookie,
              importedParams.user_options
            );
            orsSettingsFactory.setUserOptions(userOptions);
          }
          orsSettingsFactory.updateWaypoints();
          ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
          ctrl.activeProfile = orsSettingsFactory.getActiveProfile().type;
          ctrl.activeSubgroup = ctrl.profiles[ctrl.activeProfile].subgroup;
          ctrl.showGeocodingPanel = false;
          orsUtilsService.parseSettingsToPermalink(
            orsSettingsFactory.getSettings(),
            orsSettingsFactory.getUserOptions()
          );
        };
        ctrl.$routerOnReuse = function(next, prev) {
          // No need to update permalink here, this is done via settings-subject
          // const settings = orsSettingsFactory.getSettings();
          // const userSettings = orsSettingsFactory.getUserOptions();
          // orsUtilsService.parseSettingsToPermalink(settings, userSettings);
        };
      }
    ],
    require: {
      parent: "^orsSidebar"
    }
  });
