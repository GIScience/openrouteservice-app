angular.module('orsApp.params-service', []).factory('orsParamsService', ['orsUtilsService', 'orsObjectsFactory', 'orsRequestService', (orsUtilsService, orsObjectsFactory, orsRequestService) => {
    let orsParamsService = {};
    orsParamsService.importSettings = (params, routing = true) => {
        const settings = {
            waypoints: [],
            profile: {
                type: 'Car',
                options: {
                    analysis_options: {},
                    avoidables: {}
                }
            }
        };
        console.log("importing param setttings");
        const user_options = {};
        //TODO: Replace with native loop and use break; in each if clause so not all conditions have to be checked all the time
        angular.forEach(params, (value, key) => {
            if (key == 'a') {
                //TODO Debug, adding does not properly work
                const wps = value.match(/[^,]+,[^,]+/g);
                let idx = 0,
                    waypoints = [];
                angular.forEach(wps, (wp) => {
                    wp = wp.split(",");
                    let latLngString,latLng;
                    if (isNaN(wp[0]) && isNaN(wp[1])) {
                        wp = orsObjectsFactory.createWaypoint('', false, 0);
                    } else {
                        latLng = new L.latLng([parseFloat(wp[0]), parseFloat(wp[1])]);
                        latLngString = orsUtilsService.parseLatLngString(latLng);
                        wp = orsObjectsFactory.createWaypoint(latLngString, latLng, 1);
                    }
                    waypoints.push(wp);
                    idx += 1;
                });
                /** Add second empty wp if only start is set in routing panel */
                if (idx == 1 && routing === true) {
                    wp = orsObjectsFactory.createWaypoint('', false, 0);
                    waypoints.push(wp);
                }
                settings.waypoints = waypoints;
            }
            if (key in lists.permalinkKeysReversed) {
                if (lists.permalinkKeysReversed[key] == 'type') {
                    for (let type in lists.profiles) {
                        if (lists.profiles[type].shortValue == value) {
                            settings.profile.type = lists.profiles[type].name;
                        }
                    }
                }
                if (lists.permalinkKeysReversed[key] == 'weight') {
                    for (let weightType in lists.optionList.weight) {
                        if (lists.optionList.weight[weightType].shortValue == value) {
                            settings.profile.options.weight = lists.optionList.weight[weightType].value;
                        }
                    }
                }
                if (lists.permalinkKeysReversed[key] == 'maxspeed') {
                    settings.profile.options.maxspeed = value;
                }
                if (lists.permalinkKeysReversed[key] == 'hgvWeight') {
                    settings.profile.options.hgvWeight = value;
                }
                if (lists.permalinkKeysReversed[key] == 'width') {
                    settings.profile.options.width = value;
                }
                if (lists.permalinkKeysReversed[key] == 'height') {
                    settings.profile.options.height = value;
                }
                if (lists.permalinkKeysReversed[key] == 'axleload') {
                    settings.profile.options.axleload = value;
                }
                if (lists.permalinkKeysReversed[key] == 'length') {
                    settings.profile.options.length = value;
                }
                if (lists.permalinkKeysReversed[key] == 'fitness') {
                    settings.profile.options.fitness = value;
                }
                if (lists.permalinkKeysReversed[key] == 'steepness') {
                    settings.profile.options.steepness = value;
                }
                if (lists.permalinkKeysReversed[key] == 'surface') {
                    settings.profile.options.surface = value;
                }
                if (lists.permalinkKeysReversed[key] == 'incline') {
                    settings.profile.options.incline = value;
                }
                if (lists.permalinkKeysReversed[key] == 'curb') {
                    settings.profile.options.curb = value;
                }
                if (lists.permalinkKeysReversed[key] == 'method') {
                    settings.profile.options.analysis_options.method = value;
                }
                if (lists.permalinkKeysReversed[key] == 'isovalue') {
                    settings.profile.options.analysis_options.isovalue = value;
                }
                if (lists.permalinkKeysReversed[key] == 'isointerval') {
                    settings.profile.options.analysis_options.isointerval = value;
                }
                if (lists.permalinkKeysReversed[key] == 'reverseflow') {
                    settings.profile.options.analysis_options.reverseflow = orsParamsService.parseStringToBool(value);
                }
                /** not going to be passed in permalink */
                // if (lists.permalinkKeysReversed[key] == 'language') {
                //     settings.user_options.language = value;
                // }
                if (lists.permalinkKeysReversed[key] == 'routinglang') {
                    user_options.routinglang = value;
                }
                if (lists.permalinkKeysReversed[key] == 'units') {
                    user_options.units = value;
                }
                if (lists.permalinkKeysReversed[key] == 'ferry') {
                    settings.profile.options.avoidables.ferry = orsParamsService.parseStringToBool(value);
                }
                if (lists.permalinkKeysReversed[key] == 'unpaved') {
                    settings.profile.options.avoidables.unpaved = orsParamsService.parseStringToBool(value);
                }
                if (lists.permalinkKeysReversed[key] == 'paved') {
                    settings.profile.options.avoidables.paved = orsParamsService.parseStringToBool(value);
                }
                if (lists.permalinkKeysReversed[key] == 'fords') {
                    settings.profile.options.avoidables.fords = orsParamsService.parseStringToBool(value);
                }
                if (lists.permalinkKeysReversed[key] == 'highways') {
                    settings.profile.options.avoidables.highways = orsParamsService.parseStringToBool(value);
                }
                if (lists.permalinkKeysReversed[key] == 'tollroads') {
                    settings.profile.options.avoidables.tollroads = orsParamsService.parseStringToBool(value);
                }
                if (lists.permalinkKeysReversed[key] == 'tunnels') {
                    settings.profile.options.avoidables.tunnels = orsParamsService.parseStringToBool(value);
                }
                if (lists.permalinkKeysReversed[key] == 'tracks') {
                    settings.profile.options.avoidables.tracks = orsParamsService.parseStringToBool(value);
                }
            }
        });
        return {
            settings: settings,
            user_options: user_options
        };
    };
    orsParamsService.parseStringToBool = (string) => {
        if (string == 1) return true;
        else if (string == 0) return false;
    };
    return orsParamsService;
}]);