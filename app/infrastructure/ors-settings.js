angular.module('orsApp').factory('orsSettingsFactory', ['orsObjectsFactory', 'notifyingFactory', function(orsObjectsFactory, notifyingFactory) {
    var settings = {};
    settings.waypoints = [orsObjectsFactory.createWaypoint('', new L.latLng()), orsObjectsFactory.createWaypoint('', new L.latLng())];
    return {
        getWaypoints: () => {
            return settings.waypoints;
        },
        setWaypoints: (waypoints) => {
            console.log('set')
            settings.waypoints = waypoints;
            notifyingFactory.notifyMap();
        },
        resetWaypoints: () => {
            settings.waypoints = [];
            notifyingFactory.notifyMap();
        }
    };
}]);