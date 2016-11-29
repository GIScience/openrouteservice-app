angular.module('orsApp.params-service', []).factory('orsParamsService', ['orsObjectsFactory', 'orsRequestService', function(orsObjectsFactory, orsRequestService) {
    let orsParamsService = {};
    orsParamsService.importSettings = (params) => {
        const settings = {
            waypoints: [],
            profile: {
                type: 'Car',
                options: {
                    weight: 'Fastest',
                    analysis_options: {},
                    avoidables: {}
                }
            }
        };
        console.log("importing param setttings");
        const user_options = {};
        //TODO: Replace with native loop and use break; in each if clause so not all conditions have to be checked all the time
        angular.forEach(params, function(value, key) {
            if (key == 'wps') {
                //TODO Debug, adding does not properly work
                const wps = value.match(/[^,]+,[^,]+/g);
                let idx = 0,
                    waypoints = [];
                angular.forEach(wps, function(wp) {
                    wp = wp.split(",");
                    wp = orsObjectsFactory.createWaypoint('', new L.latLng([parseFloat(wp[0]), parseFloat(wp[1])]), 1);
                    waypoints.push(wp);
                    orsRequestService.getAddress(wp._latlng, idx, true);
                    idx += 1;
                });
                settings.waypoints = waypoints;
            }
            if (key == 'type') {
                settings.profile.type = value;
            }
            if (key == 'weight') {
                settings.profile.options.weight = value;
            }
            if (key == 'maxspeed') {
                settings.profile.options.maxspeed = value;
            }
            if (key == 'hgvweight') {
                settings.profile.options.hgvWeight = value;
            }
            if (key == 'width') {
                settings.profile.options.width = value;
            }
            if (key == 'height') {
                settings.profile.options.height = value;
            }
            if (key == 'axleload') {
                settings.profile.options.axleload = value;
            }
            if (key == 'length') {
                settings.profile.options.length = value;
            }
            if (key == 'fitness') {
                settings.profile.options.fitness = value;
            }
            if (key == 'steepness') {
                settings.profile.options.steepness = value;
            }
            if (key == 'surface') {
                settings.profile.options.surface = value;
            }
            if (key == 'incline') {
                settings.profile.options.incline = value;
            }
            if (key == 'curb') {
                settings.profile.options.curb = value;
            }
            if (key == 'method') {
                settings.profile.options.analysis_options.method = value;
            }
            if (key == 'minutes') {
                settings.profile.options.analysis_options.minutes = value;
            }
            if (key == 'interval') {
                settings.profile.options.analysis_options.interval = value;
            }
            /** not going to be passed in permalink */
            // if (key == 'language') {
            //     settings.user_options.language = value;
            // }
            if (key == 'routinglang') {
                user_options.routinglang = value;
            }
            if (key == 'units') {
                user_options.units = value;
            }
            //http://localhost:3000/routing?type=Car&weight=Fastest&maxspeed=200&ferry=true&unpaved=true&paved=true&fords=true&highways=true&tollroads=true&tunnels=true&tracks=true&routinglang=en&units=km
            if (key == 'ferry') {
                settings.profile.options.avoidables.ferry = orsParamsService.parseStringToBool(value);
            }
            if (key == 'unpaved') {
                settings.profile.options.avoidables.unpaved = orsParamsService.parseStringToBool(value);
            }
            if (key == 'paved') {
                settings.profile.options.avoidables.paved = orsParamsService.parseStringToBool(value);
            }
            if (key == 'fords') {
                settings.profile.options.avoidables.fords = orsParamsService.parseStringToBool(value);
            }
            if (key == 'highways') {
                settings.profile.options.avoidables.highways = orsParamsService.parseStringToBool(value);
            }
            if (key == 'tollroads') {
                settings.profile.options.avoidables.tollroads = orsParamsService.parseStringToBool(value);
            }
            if (key == 'tunnels') {
                settings.profile.options.avoidables.tunnels = orsParamsService.parseStringToBool(value);
            }
            if (key == 'tracks') {
                settings.profile.options.avoidables.tracks = orsParamsService.parseStringToBool(value);
            }
        });
        //console.warn(JSON.stringify(globalSettings));
        return {
            settings: settings,
            user_options: user_options
        };
    };
    orsParamsService.parseStringToBool = (string) => {
        if (string == "true") return true;
        return false;
    }
    return orsParamsService;
}]);