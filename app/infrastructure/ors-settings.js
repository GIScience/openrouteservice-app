angular.module('orsApp').factory('orsSettingsFactory', ['orsObjectsFactory', function(orsObjectsFactory) {
    var settings = {};
    var subject = new Rx.Subject();
    settings.waypoints = [orsObjectsFactory.createWaypoint('', new L.latLng()), orsObjectsFactory.createWaypoint('', new L.latLng())];
    return {
        getWaypoints: () => {
            return settings.waypoints;
        },
        setWaypoints: (d) => {
            console.log('set')
            settings.waypoints = d;
            subject.onNext(d);
        },
        resetWaypoints: () => {
            settings.waypoints = [];
            subject.onNext([]);
        },
        subscribe: (o) => {
            return subject.subscribe(o);
        },
        insertWaypoint: (idx, wp) => {
            idx = (idx == 1 ? settings.waypoints.length - 1 : idx == 2 ? settings.waypoints.length : 0);
            settings.waypoints.splice(idx, 0, wp);
            subject.onNext(settings.waypoints);
        }
    };
}]);