angular.module('orsApp.settings-service', []).factory('orsSettingsFactory', ['orsObjectsFactory', function(orsObjectsFactory) {
    let orsSettingsFactory = {};
    /** Behaviour subjects routing. */
    orsSettingsFactory.routingWaypointsSubject = new Rx.BehaviorSubject({});
    orsSettingsFactory.routingSettingsSubject = new Rx.BehaviorSubject({});
    /** Behaviour subjects accessibility analysis. */
    orsSettingsFactory.aaWaypointsSubject = new Rx.BehaviorSubject({});
    orsSettingsFactory.aaSettingsSubject = new Rx.BehaviorSubject({});
    /** Behaviour subject routing. */
    orsSettingsFactory.ngRouteSubject = new Rx.BehaviorSubject(undefined);
    /** Global reference settings, these are switched when panels are changed - default is routing.*/
    orsSettingsFactory.panelSettings = orsSettingsFactory.routingSettingsSubject;
    orsSettingsFactory.panelWaypoints = orsSettingsFactory.routingWaypointsSubject;
    /**
     * Sets the settings from permalink
     * @param {Object} The settings object.
     */
    orsSettingsFactory.setSettings = (params) => {
        let set = orsSettingsFactory.panelSettings.getValue();
        console.warn('set settings..', orsSettingsFactory.panelSettings.getValue());
        for (var k in params) {
            set[k] = params[k];
        }
        //orsSettingsFactory.panelSettings.onNext(set);
    };
    /**
     * Returns active profile.
     * @return {Object} The profile object.
     */
    orsSettingsFactory.getActiveProfile = () => {
        if (!('profile' in orsSettingsFactory.panelSettings.getValue())) return [];
        return orsSettingsFactory.panelSettings.getValue().profile;
    };
    /**
     * Returns current options.
     * @return {Object} The options object, may contain both profile options and aa options.
     */
    orsSettingsFactory.getActiveOptions = () => {
        console.info(orsSettingsFactory.panelSettings.getValue());
        if (!('profile' in orsSettingsFactory.panelSettings.getValue())) return [];
        if (!('options' in orsSettingsFactory.panelSettings.getValue().profile)) return [];
        return orsSettingsFactory.panelSettings.getValue().profile.options;
    };
    /** Subscription function to current waypoints object, used in map. */
    orsSettingsFactory.subscribeToWaypoints = (o) => {
        return orsSettingsFactory.panelWaypoints.subscribe(o);
    };
    /** Subscription function to current route object. */
    orsSettingsFactory.subscribeToNgRoute = (o) => {
        return orsSettingsFactory.ngRouteSubject.subscribe(o);
    };
    /** Subscription function to current settings */
    orsSettingsFactory.subscribeToSettings = (o) => {
        return orsSettingsFactory.panelSettings.subscribe(o);
    };
    /** Returns waypoints in settings. If none are set then returns empty list. */
    orsSettingsFactory.getWaypoints = () => {
        if (!('waypoints' in orsSettingsFactory.panelSettings.getValue())) return [];
        return orsSettingsFactory.panelSettings.getValue().waypoints;
    };
    /**
     * Intializes empty waypoints without coordinates
     * @param {number} n - Specifices the amount of waypoints to be added
     */
    orsSettingsFactory.initWaypoints = (n) => {
        for (var i = 1; i <= n; i++) {
            wp = orsObjectsFactory.createWaypoint('', new L.latLng());
            orsSettingsFactory.panelSettings.getValue().waypoints.push(wp);
        }
        return orsSettingsFactory.panelSettings.getValue().waypoints;
    };
    orsSettingsFactory.updateWaypoint = (idx, address, pos) => {
        orsSettingsFactory.panelSettings.getValue().waypoints[idx]._latlng = pos;
        orsSettingsFactory.panelSettings.getValue().waypoints[idx]._address = address;
        orsSettingsFactory.panelWaypoints.onNext(orsSettingsFactory.panelSettings.getValue().waypoints);
    };
    orsSettingsFactory.updateWaypoints = () => {
        orsSettingsFactory.panelWaypoints.onNext(orsSettingsFactory.panelSettings.getValue().waypoints);
    };
    orsSettingsFactory.updateNgRoute = (newRoute) => {
        orsSettingsFactory.ngRouteSubject.onNext(newRoute);
        if (orsSettingsFactory.ngRouteSubject.getValue() == 'routing') {
            orsSettingsFactory.panelSettings = orsSettingsFactory.routingSettingsSubject;
            orsSettingsFactory.panelWaypoints = orsSettingsFactory.routingWaypointsSubject;
        } else if (orsSettingsFactory.ngRouteSubject.getValue() == 'analysis') {
            orsSettingsFactory.panelSettings = orsSettingsFactory.aaSettingsSubject;
            orsSettingsFactory.panelWaypoints = orsSettingsFactory.aaWaypointsSubject;
        }
        console.log('BOM DIA.....', orsSettingsFactory.panelSettings)
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
    /**
     * Sets waypoints into settings.
     * @param {waypoints.<Object>} List of waypoint objects.
     */
    orsSettingsFactory.setWaypoints = (waypoints) => {
        orsSettingsFactory.panelSettings.getValue().waypoints = waypoints;
        //orsSettingsFactory.panelSettings.onNext(orsSettingsFactory.panelSettings.getValue());
        /** For map to update */
        orsSettingsFactory.panelWaypoints.onNext(waypoints);
    };
    /**
     * Inserts waypoint to settings waypoints when added on map. This can
     * either be a start, via or end
     * @param {number} idx - Type of wp which should be added: start, via or end.
     * @param {Object} wp - The waypoint object to be inserted to wp list.
     */
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
    /**
     * Determines which icon should be returned.
     * @param {number} idx - Type of wp which should be added: start, via or end.
     * @return {number} iconIdx - 0, 1 or 2.
     */
    orsSettingsFactory.getIconIdx = (idx) => {
        let iconIdx;
        // start
        if (idx == 0) {
            iconIdx = 0;
            // last
        } else if (idx == orsSettingsFactory.panelSettings.getValue().waypoints.length - 1) {
            iconIdx = 2;
            // via
        } else {
            iconIdx = 1;
        }
        return iconIdx;
    };
    /**
     * Sets the profile of selected in settings.
     * @param {Object} currentProfile - current profile.
     */
    orsSettingsFactory.setProfile = (currentProfile) => {
        let set = orsSettingsFactory.panelSettings.getValue();
        set.profile.type = currentProfile.type;
        orsSettingsFactory.panelSettings.onNext(set);
    };
    return orsSettingsFactory;
}]);