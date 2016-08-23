angular.module('orsApp').factory('orsSettingsFactory', ['orsObjectsFactory', function(orsObjectsFactory) {
    
    var settings = {};
    settings.waypoints = [orsObjectsFactory.createWaypoint('Ulm', []), orsObjectsFactory.createWaypoint('Nuernberg', [])];

    return {
        getWaypoints: () => {
            return settings.waypoints;
        },
        setWaypoints: (waypoints) => {
            settings.waypoints = waypoints;
        },
        resetWaypoints: () => {
            settings.waypoints = [];
        }
    };
}]);
