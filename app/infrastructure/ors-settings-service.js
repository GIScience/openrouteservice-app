angular.module('orsApp.settings-service', []).factory('orsSettingsFactory', ['orsObjectsFactory', function(orsObjectsFactory) {
    let waypointsSubject = new Rx.BehaviorSubject({});
    let aa_waypointsSubject = new Rx.BehaviorSubject({});
    let aa_settingsSubject = new Rx.BehaviorSubject({});
    let settingsSubject = new Rx.BehaviorSubject({});
    let ngRouteSubject = new Rx.BehaviorSubject(undefined);
    // settingsSubject.subscribe(function(x) {
    //     console.log('settings changed..fire request!', x);
    // }, function(err) {
    //     console.log(err);
    // }, function() {
    //     console.log('Completed');
    // });
    let orsSettingsFactory = {};
    // global reference settings
    orsSettingsFactory.panelSettings = undefined;
    orsSettingsFactory.panelWaypoints = undefined;
    orsSettingsFactory.setSettings = (params) => {
        let set = orsSettingsFactory.panelSettings.getValue();
        for (var k in params) {
            set[k] = params[k];
        }
        orsSettingsFactory.panelSettings.onNext(set);
    };
    orsSettingsFactory.getActiveProfile = () => {
        if (!('profile' in orsSettingsFactory.panelSettings.getValue())) return [];
        return orsSettingsFactory.panelSettings.getValue().profile;
    };
    orsSettingsFactory.getActiveOptions = () => {
        if (!('profile' in orsSettingsFactory.panelSettings.getValue())) return [];
        if (!('options' in orsSettingsFactory.panelSettings.getValue().profile)) return [];
        return orsSettingsFactory.panelSettings.getValue().profile.options;
    };
    orsSettingsFactory.subscribeToWaypoints = (o) => {
        return orsSettingsFactory.panelWaypoints.subscribe(o);
    };
    orsSettingsFactory.subscribeToNgRoute = (o) => {
        return ngRouteSubject.subscribe(o);
    };
    orsSettingsFactory.getWaypoints = () => {
        if (!('waypoints' in orsSettingsFactory.panelSettings.getValue())) return [];
        return orsSettingsFactory.panelSettings.getValue().waypoints;
    };
    /**
     * todo: let's merge these functions
     */ 
    orsSettingsFactory.initWaypoints = () => {
        settingsSubject.getValue().waypoints = [orsObjectsFactory.createWaypoint('', new L.latLng()), orsObjectsFactory.createWaypoint('', new L.latLng())];
        return settingsSubject.getValue().waypoints;
    };
    orsSettingsFactory.initSingleWaypoint = () => {
        aa_settingsSubject.value.waypoint = [orsObjectsFactory.createWaypoint('', new L.latLng())];
        return aa_settingsSubject.getValue().waypoint;
    };
    orsSettingsFactory.updateWaypoint = (idx, address, pos) => {
        console.log('updating waypoint..');
        // map wants to add a waypoint. Add it to the right set of settings 
        orsSettingsFactory.panelSettings.getValue().waypoints[idx]._latlng = pos;
        orsSettingsFactory.panelSettings.getValue().waypoints[idx]._address = address;
        orsSettingsFactory.panelWaypoints.onNext(settingsSubject.getValue().waypoints);
    };
    orsSettingsFactory.updateWaypoints = () => {
        orsSettingsFactory.panelWaypoints.onNext(orsSettingsFactory.panelSettings.getValue().waypoints);
    };
    orsSettingsFactory.updateNgRoute = (newRoute) => {
        ngRouteSubject.onNext(newRoute);
        if (ngRouteSubject.getValue() == 'routing') {
            orsSettingsFactory.panelSettings = settingsSubject;
            orsSettingsFactory.panelWaypoints = waypointsSubject;
        } else if (ngRouteSubject.getValue() == 'analysis') {
            orsSettingsFactory.panelSettings = aa_settingsSubject;
            orsSettingsFactory.panelWaypoints = aa_waypointsSubject;
        }
        console.log(orsSettingsFactory.panelSettings)
        console.log(orsSettingsFactory.panelWaypoints)
    };
    orsSettingsFactory.updateWaypointAddress = (idx, address, init) => {
        let set = orsSettingsFactory.panelSettings.getValue();
        if (init) {
            set.waypoints[idx]._address = address;
            orsSettingsFactory.panelSettings.onNext(set);
        } else {
            if (idx == 0) {
                set.waypoints[idx]._address = address;
            } else if (idx == 2) {
                set.waypoints[set.waypoints.length - 1]._address = address;
            } else if (idx == 1) {
                set.waypoints[set.waypoints.length - 2]._address = address;
            }
            orsSettingsFactory.panelSettings.onNext(set);
        }
    };
    orsSettingsFactory.setWaypoints = (d) => {
        let currentSettingsSubject = orsSettingsFactory.panelSettings;
        let currentWaypointSubject = orsSettingsFactory.panelWaypoints;
        let set = currentSettingsSubject.getValue();
        set.waypoints = d;
        currentWaypointSubject.onNext(set.waypoints);
        currentSettingsSubject.onNext(set);
    };
    orsSettingsFactory.insertWaypointFromMap = (idx, wp) => {
        if (idx == 0) {
            orsSettingsFactory.panelSettings.value.waypoints[idx] = wp;
        } else if (idx == 2) {
            orsSettingsFactory.panelSettings.value.waypoints[orsSettingsFactory.panelSettings.value.waypoints.length - 1] = wp;
        } else if (idx == 1) {
            orsSettingsFactory.panelSettings.value.waypoints.splice(orsSettingsFactory.panelSettings.value.waypoints.length - 1, 0, wp);
        }
        orsSettingsFactory.panelWaypoints.onNext(orsSettingsFactory.panelSettings.getValue().waypoints);
        orsSettingsFactory.panelSettings.onNext(orsSettingsFactory.panelSettings.getValue());
    };
    orsSettingsFactory.getIconIdx = (idx) => {
        let iconIdx;
        // start
        if (idx == 0) {
            iconIdx = 0;
            // last
        } else if (idx == settingsSubject.getValue().waypoints.length - 1) {
            iconIdx = 2;
            // via
        } else {
            iconIdx = 1;
        }
        return iconIdx;
    };
    orsSettingsFactory.setProfile = (currentProfile) => {
        let set = settingsSubject.getValue();
        set.profile.type = currentProfile.type;
        settingsSubject.onNext(set);
    };
    return orsSettingsFactory;
}]);