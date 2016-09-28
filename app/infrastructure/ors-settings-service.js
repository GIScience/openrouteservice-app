angular.module('orsApp.settings-service', []).factory('orsSettingsFactory', ['orsObjectsFactory', function(orsObjectsFactory) {
    let settings = {
        waypoints: [],
        profile: {
            type: 'Car',
            options: {
                maxspeed: undefined,
                avoidables: undefined,
                weight: 'Fastest',
                filters: {
                    hgv_options: undefined,
                    difficulty_options: undefined,
                    wheelchair_options: undefined
                }
            }
        }
    };
    let waypointsSubject = new Rx.Subject();
    let settingsSubject = new Rx.Subject();
    settingsSubject.subscribe(function(x) {
        console.log('settings changed..fire request!', x);
    }, function(err) {
        console.log(err);
    }, function() {
        console.log('Completed');
    });
    let orsSettingsFactory = {};
    orsSettingsFactory.setSettings = (params) => {
        console.log('params', params)
        for (var k in params) {
            settings[k] = params[k];
        }
        console.log(settings);
    };
    orsSettingsFactory.getActiveProfile = () => {
        return settings.profile;
    };
    orsSettingsFactory.getActiveOptions = () => {
        return settings.profile.options;
    };
    orsSettingsFactory.subscribeToWaypoints = (o) => {
        return waypointsSubject.subscribe(o);
    };
    orsSettingsFactory.getWaypoints = () => {
        return settings.waypoints;
    };
    orsSettingsFactory.initWaypoints = () => {
        settings.waypoints = [orsObjectsFactory.createWaypoint('', new L.latLng()), orsObjectsFactory.createWaypoint('', new L.latLng())];
        return settings.waypoints;
    };
    orsSettingsFactory.updateWaypoint = (idx, address, pos) => {
        settings.waypoints[idx]._latlng = pos;
        settings.waypoints[idx]._address = address;
        waypointsSubject.onNext(settings.waypoints);
    };
    orsSettingsFactory.updateWaypointAddress = (idx, address, init) => {
        if (init) {
            settings.waypoints[idx]._address = address;
        } else {
            if (idx == 0) {
                settings.waypoints[idx]._address = address;
            } else if (idx == 2) {
                settings.waypoints[settings.waypoints.length - 1]._address = address;
            } else if (idx == 1) {
                settings.waypoints[settings.waypoints.length - 2]._address = address;
            }
        }
    };
    orsSettingsFactory.setWaypoints = (d) => {
        settings.waypoints = d;
        waypointsSubject.onNext(settings.waypoints);
        settingsSubject.onNext(settings);
    };
    orsSettingsFactory.insertWaypointFromMap = (idx, wp) => {
        if (idx == 0) {
            settings.waypoints[idx] = wp;
        } else if (idx == 2) {
            settings.waypoints[settings.waypoints.length - 1] = wp;
        } else if (idx == 1) {
            settings.waypoints.splice(settings.waypoints.length - 1, 0, wp);
        }
        waypointsSubject.onNext(settings.waypoints);
        settingsSubject.onNext(settings);
    };
    orsSettingsFactory.getIconIdx = (idx) => {
        let iconIdx;
        // start
        if (idx == 0) {
            iconIdx = 0;
            // last
        } else if (idx == settings.waypoints.length - 1) {
            iconIdx = 2;
            // via
        } else {
            iconIdx = 1;
        }
        return iconIdx;
    };
    orsSettingsFactory.setProfile = (currentProfile) => {
        console.log('setting profile', currentProfile)
        settings.profile.type = currentProfile.type;
    };
    return orsSettingsFactory;
}]);