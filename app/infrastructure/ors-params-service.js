angular.module("orsApp.params-service", []).factory("orsParamsService", [
  "orsUtilsService",
  "orsObjectsFactory",
  "orsRequestService",
  "orsMapFactory",
  "lists",
  (
    orsUtilsService,
    orsObjectsFactory,
    orsRequestService,
    orsMapFactory,
    lists
  ) => {
    let orsParamsService = {};
    orsParamsService.importSettings = (params, routing = true) => {
      const settings = {
        waypoints: [],
        profile: {
          type: "Car",
          options: {
            analysis_options: {},
            avoidables: {},
            borders: {}
          }
        }
      };
      const user_options = {};
      //TODO: Replace with native loop and use break; in each if clause so not all conditions have to be checked all the time
      angular.forEach(params, (value, key) => {
        if (key == "a") {
          //TODO Debug, adding does not properly work
          const wps = value.match(/[^,]+,[^,]+/g);
          let validWpCnt = 0,
            idx = 0,
            waypoints = [],
            latLngString,
            latLng;
          angular.forEach(wps, wp => {
            wp = wp.split(",");
            if (isNaN(wp[0]) && isNaN(wp[1])) {
              wp = orsObjectsFactory.createWaypoint("", false, 0);
            } else {
              latLng = new L.latLng([parseFloat(wp[0]), parseFloat(wp[1])]);
              latLngString = orsUtilsService.parseLatLngString(latLng);
              wp = orsObjectsFactory.createWaypoint(latLngString, latLng, 1);
              validWpCnt += 1;
            }
            idx += 1;
            waypoints.push(wp);
          });
          /** Add second empty wp if only start is set in routing panel */
          if (idx == 1 && routing === true) {
            wp = orsObjectsFactory.createWaypoint("", false, 0);
            waypoints.push(wp);
          }
          if (validWpCnt == 1) {
            const action = orsObjectsFactory.createMapAction(
              0,
              undefined,
              latLng,
              undefined
            );
            orsMapFactory.mapServiceSubject.onNext(action);
          }
          settings.waypoints = waypoints;
        }
        let permalinkKeysReversed = lists.reversePermalinkKeys(
          lists.permalinkKeys
        );
        if (key in permalinkKeysReversed) {
          if (permalinkKeysReversed[key] == "type") {
            for (let type in lists.profiles) {
              if (lists.profiles[type].shortValue == value) {
                settings.profile.type = lists.profiles[type].name;
              }
            }
          }
          if (permalinkKeysReversed[key] == "weight") {
            for (let weightType in lists.optionList.weight) {
              if (lists.optionList.weight[weightType].shortValue == value) {
                settings.profile.options.weight =
                  lists.optionList.weight[weightType].value;
              }
            }
          }
          if (permalinkKeysReversed[key] == "maxspeed") {
            settings.profile.options.maxspeed = value;
          }
          if (permalinkKeysReversed[key] == "hgvWeight") {
            settings.profile.options.hgvWeight = value;
          }
          if (permalinkKeysReversed[key] == "width") {
            settings.profile.options.width = value;
          }
          if (permalinkKeysReversed[key] == "height") {
            settings.profile.options.height = value;
          }
          if (permalinkKeysReversed[key] == "axleload") {
            settings.profile.options.axleload = value;
          }
          if (permalinkKeysReversed[key] == "length") {
            settings.profile.options.length = value;
          }
          if (permalinkKeysReversed[key] == "hazmat") {
            settings.profile.options.hazmat = value;
          }
          if (permalinkKeysReversed[key] == "fitness") {
            settings.profile.options.fitness = value;
          }
          if (permalinkKeysReversed[key] == "steepness") {
            settings.profile.options.steepness = value;
          }
          if (permalinkKeysReversed[key] == "surface") {
            settings.profile.options.surface = value;
          }
          if (permalinkKeysReversed[key] == "incline") {
            settings.profile.options.incline = value;
          }
          if (permalinkKeysReversed[key] == "curb") {
            settings.profile.options.curb = value;
          }
          if (permalinkKeysReversed[key] == "wheelchairWidth") {
            settings.profile.options.wheelchairWidth = value;
          }
          if (permalinkKeysReversed[key] == "method") {
            settings.profile.options.analysis_options.method = value;
          }
          if (permalinkKeysReversed[key] == "isovalue") {
            settings.profile.options.analysis_options.isovalue = value;
          }
          if (permalinkKeysReversed[key] == "isointerval") {
            settings.profile.options.analysis_options.isointerval = value;
          }
          if (permalinkKeysReversed[key] == "reverseflow") {
            settings.profile.options.analysis_options.reverseflow = orsParamsService.parseStringToBool(
              value
            );
          }
          /** not going to be passed in permalink */
          // if (lists.permalinkKeysReversed[key] == 'language') {
          //     settings.user_options.language = value;
          // }
          if (permalinkKeysReversed[key] == "routinglang") {
            user_options.routinglang = value;
          }
          if (permalinkKeysReversed[key] == "units") {
            user_options.units = value;
          }
          if (permalinkKeysReversed[key] == "lat") {
            user_options.lat = value;
          }
          if (permalinkKeysReversed[key] == "lng") {
            user_options.lng = value;
          }
          if (permalinkKeysReversed[key] == "zoom") {
            user_options.zoom = value;
          }
          if (permalinkKeysReversed[key] == "ferry") {
            settings.profile.options.avoidables.ferry = orsParamsService.parseStringToBool(
              value
            );
          }
          if (permalinkKeysReversed[key] == "unpaved") {
            settings.profile.options.avoidables.unpaved = orsParamsService.parseStringToBool(
              value
            );
          }
          if (permalinkKeysReversed[key] == "paved") {
            settings.profile.options.avoidables.paved = orsParamsService.parseStringToBool(
              value
            );
          }
          if (permalinkKeysReversed[key] == "fords") {
            settings.profile.options.avoidables.fords = orsParamsService.parseStringToBool(
              value
            );
          }
          if (permalinkKeysReversed[key] == "highways") {
            settings.profile.options.avoidables.highways = orsParamsService.parseStringToBool(
              value
            );
          }
          if (permalinkKeysReversed[key] == "tollroads") {
            settings.profile.options.avoidables.tollroads = orsParamsService.parseStringToBool(
              value
            );
          }
          if (permalinkKeysReversed[key] == "tunnels") {
            settings.profile.options.avoidables.tunnels = orsParamsService.parseStringToBool(
              value
            );
          }
          if (permalinkKeysReversed[key] == "tracks") {
            settings.profile.options.avoidables.tracks = orsParamsService.parseStringToBool(
              value
            );
          }
          if (permalinkKeysReversed[key] == "all") {
            if (orsParamsService.parseStringToBool(value)) {
              settings.profile.options.borders.all = orsParamsService.parseStringToBool(
                value
              );
            }
          }
          if (permalinkKeysReversed[key] == "controlled") {
            if (orsParamsService.parseStringToBool(value)) {
              settings.profile.options.borders.controlled = orsParamsService.parseStringToBool(
                value
              );
            }
          }
          if (permalinkKeysReversed[key] == "country") {
            settings.profile.options.borders.country = value.replace(/,/g, "|");
          }
        }
      });
      return {
        settings: settings,
        user_options: user_options
      };
    };
    orsParamsService.parseStringToBool = string => {
      if (string == 1) return true;
      else if (string == 0) return false;
    };
    return orsParamsService;
  }
]);
