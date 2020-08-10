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
            borders: {},
            round_trip: {}
          }
        }
      };
      const user_options = {};
      const permalinkKeysReversed = lists.reversePermalinkKeys(
        lists.permalinkKeys
      );
      let skip_segments = [];
      if (params.s && params.s.length > 0) {
        skip_segments = params.s.split(",");
      }
      //TODO: Replace with native loop and use break; in each if clause so not all conditions have to be checked all the time
      angular.forEach(params, (value, key) => {
        key = permalinkKeysReversed[key];
        if (key === "wps") {
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
              wp = orsObjectsFactory.createWaypoint(
                "",
                false,
                0,
                skip_segments.includes(idx.toString())
              );
            } else {
              latLng = new L.latLng([parseFloat(wp[0]), parseFloat(wp[1])]);
              latLngString = orsUtilsService.parseLatLngString(latLng);
              wp = orsObjectsFactory.createWaypoint(
                latLngString,
                latLng,
                1,
                skip_segments.includes(idx.toString())
              );
              validWpCnt += 1;
            }
            idx += 1;
            waypoints.push(wp);
          });
          /** Add second empty wp if only start is set in routing panel */
          if (idx === 1 && routing === true) {
            wp = orsObjectsFactory.createWaypoint("", false, 0);
            waypoints.push(wp);
          }
          if (validWpCnt === 1) {
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
        if (key === "type") {
          for (let type in lists.profiles) {
            if (lists.profiles[type].shortValue === value) {
              settings.profile.type = lists.profiles[type].name;
            }
          }
        }
        if (key === "weight") {
          // switches to Recommended (0) for old Recommended values (2), old Fastest (0) go automatically to Recommended
          if (value === "2") {
            value = "0";
          }
          for (let weightType in lists.optionList.weight) {
            if (lists.optionList.weight[weightType].shortValue === value) {
              settings.profile.options.weight =
                lists.optionList.weight[weightType].value;
            }
          }
        }
        if (key === "hazmat") {
          settings.profile.options[key] = orsParamsService.parseStringToBool(
            value
          );
        }
        if (
          [
            "maximum_speed",
            "hgvWeight",
            "width",
            "height",
            "axleload",
            "length",
            "surface",
            "incline",
            "curb",
            "wheelchairWidth"
          ].includes(key)
        ) {
          settings.profile.options[key] = value;
        }

        if (["method", "isovalue", "isointerval"].includes(key)) {
          settings.profile.options.analysis_options[key] = value;
        }

        if (["round_length", "round_points", "round_seed"].includes(key)) {
          value *= key === "round_length" ? 1000 : 1;
          settings.profile.options.round_trip[key.split("_")[1]] = parseInt(
            value
          );
        }

        if (key === "reverseflow") {
          settings.profile.options.analysis_options.reverseflow = orsParamsService.parseStringToBool(
            value
          );
        }
        if (["routinglang", "units", "lat", "lng", "zoom"].includes(key)) {
          user_options[key] = value;
        }
        if (
          ["ferry", "fords", "highways", "tollroads"].includes(key) &&
          orsParamsService.parseStringToBool(value)
        ) {
          settings.profile.options.avoidables[
            key
          ] = orsParamsService.parseStringToBool(value);
        }
        if (["all", "controlled"].includes(key)) {
          if (orsParamsService.parseStringToBool(value)) {
            settings.profile.options.borders[
              key
            ] = orsParamsService.parseStringToBool(value);
          }
        }
      });
      return {
        settings: settings,
        user_options: user_options
      };
    };
    orsParamsService.parseStringToBool = string => {
      if (string === "1") return true;
      else if (string === "0") return false;
    };
    return orsParamsService;
  }
]);
