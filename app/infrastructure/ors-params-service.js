angular.module('orsApp').factory('orsParamsService', ['orsObjectsFactory', 'orsRequestService', function(orsObjectsFactory, orsRequestService) {
    let orsParamsService = {};
    orsParamsService.settings = {};
    orsParamsService.importSettings = (params) => {
        angular.forEach(params, function(param) {
            param = param.split("=");
            console.log(param)
            if (param[0] == 'waypoints') {
                const wps = param[1].match(/[^,]+,[^,]+/g);
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
        });
        return orsParamsService.settings;
    };
    return orsParamsService;
}]);