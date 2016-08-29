angular.module('orsApp').factory('orsSettingsFactory', ['orsObjectsFactory', function(orsObjectsFactory) {
    

    var settings = {};
        settings.waypoints = [orsObjectsFactory.createWaypoint('', new L.latLng()), orsObjectsFactory.createWaypoint('', new L.latLng())];

    var mapSubject = new Rx.Subject();
    var panelSubject = new Rx.Subject();
    var settingsSubject = new Rx.Subject();

    settingsSubject.subscribe(function(x) {
        console.log('settings', x);
    }, function(err) {
        console.log(err);
    }, function() {
        console.log('Completed');
    });
    return {
        subscribeToMap: (o) => {
            return mapSubject.subscribe(o)
        },
        subscribeToPanel: (o) => {
            return panelSubject.subscribe(o);
        },
        getWaypoints: () => {
            return settings.waypoints;
        },
        setWaypoints: (d) => {
            settings.waypoints = d;
            panelSubject.onNext(d);
            settingsSubject.onNext(settings);
        },
        insertWaypointFromMap: (idx, wp) => {
            if (idx == 0 || idx == 2) settings.waypoints[idx] = wp;
            if (idx == 1) settings.waypoints.splice(idx, 0, wp);
            mapSubject.onNext(settings.waypoints);
            settingsSubject.onNext(settings);
        }
    };
}]);