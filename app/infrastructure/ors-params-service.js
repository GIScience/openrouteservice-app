angular.module('orsApp.params-service', []).factory('orsParamsService', ['orsObjectsFactory', 'orsRequestService', function(orsObjectsFactory, orsRequestService) {
    let orsParamsService = {};
    orsParamsService.importSettings = (params) => {
        const settings = {
            waypoints: [],
            profile: {
                type: 'Car',
                options: {
                    weight: 'Fastest',
                    analysis_options: {}
                }
            }
        };
        const user_options = {};
        angular.forEach(params, function(value, key) {
            console.info(value, key);
            if (key == 'wps') {
                const wps = value.match(/[^,]+,[^,]+/g);
                let idx = 0,
                    waypoints = [];
                angular.forEach(wps, function(wp) {
                    wp = wp.split(",");
                    console.log(wp)
                    wp = orsObjectsFactory.createWaypoint('', new L.latLng([parseFloat(wp[0]), parseFloat(wp[1])]), 1);
                    console.log(wp)
                    waypoints.push(wp);
                    orsRequestService.getAddress(wp._latlng, idx, true);
                    idx += 1;
                });
                settings.waypoints = waypoints;
            }
            if (key == 'profile') {
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
        });
        //console.warn(JSON.stringify(globalSettings));
        return {
            settings: settings,
            user_options: user_options
        };
    };
    return orsParamsService;
}]);