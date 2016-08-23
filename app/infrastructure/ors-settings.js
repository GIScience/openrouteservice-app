angular.module('orsApp').factory('orsSettingsFactory', ['orsObjectsFactory', function(orsObjectsFactory) {
    var settings = {};
    settings.waypoints = [orsObjectsFactory.createWaypoint('', new L.latLng()), orsObjectsFactory.createWaypoint('', new L.latLng())];
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