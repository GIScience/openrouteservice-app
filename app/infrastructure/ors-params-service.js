angular.module('orsApp').factory('orsParamsService', ['orsObjectsFactory', 'orsRequestService', function(orsObjectsFactory, orsRequestService) {
    let orsParamsService = {};
    orsParamsService.settings = {
        waypoints: [],
        profile: {
            subprofile: {
                type: undefined
            },
            options: {}
        }
    };
    orsParamsService.importSettings = (params) => {
        angular.forEach(params, function(value, key) {
            console.log(value, key);
            if (key == 'wps') {
                const wps = value.match(/[^,]+,[^,]+/g);
                let idx = 0,
                    waypoints = [];
                angular.forEach(wps, function(wp) {
                    wp = wp.split(",");
                    console.log(wp)
                    wp = orsObjectsFactory.createWaypoint('', new L.latLng([parseFloat(wp[0]), parseFloat(wp[1])]));
                    console.log(wp)
                    waypoints.push(wp);
                    orsRequestService.getAddress(wp._latlng, idx, true);
                    idx += 1;
                });
                orsParamsService.settings.waypoints = waypoints;
            }
            if (key == 'profile') {
                orsParamsService.settings.profile.type = value;
            }
            if (key == 'subprofile') {
                orsParamsService.settings.profile.subprofile.type = value;
            }
            if (key == 'weight') {
                orsParamsService.settings.profile.options.weight = value;
            }
        });
        return orsParamsService.settings;
    };
    return orsParamsService;
}]);