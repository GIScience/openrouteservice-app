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
    let currentSettingsObj, currentWaypointsObj;
    /**
     * Sets the settings from permalink
     * @param {Object} The settings object.
     */
    orsSettingsFactory.setSettings = (params) => {
        let set = orsSettingsFactory[currentSettingsObj].getValue();
        for (var k in params) {
            set[k] = params[k];
        }
        /** Fire request. */
        orsSettingsFactory[currentSettingsObj].onNext(set);
    };
    /**
     * Returns active profile.
     * @return {Object} The profile object.
     */
    orsSettingsFactory.getActiveProfile = () => {
        if (!('profile' in orsSettingsFactory[currentSettingsObj].getValue())) return [];
        return orsSettingsFactory[currentSettingsObj].getValue().profile;
    };
    /**
     * Returns current options.
     * @return {Object} The options object, may contain both profile options and aa options.
     */
    orsSettingsFactory.getActiveOptions = () => {
        if (!('profile' in orsSettingsFactory[currentSettingsObj].getValue())) return [];
        if (!('options' in orsSettingsFactory[currentSettingsObj].getValue().profile)) return [];
        return orsSettingsFactory[currentSettingsObj].getValue().profile.options;
    };
    orsSettingsFactory.setActiveOptions = (options) => {
        orsSettingsFactory[currentSettingsObj].getValue().profile.options = options;
        orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
    };
    /** Subscription function to current waypoints object, used in map. */
    orsSettingsFactory.subscribeToWaypoints = (o) => {
        console.warn(orsSettingsFactory, currentWaypointsObj)
        return orsSettingsFactory[currentWaypointsObj].subscribe(o);
    };
    /** Subscription function to current route object. */
    orsSettingsFactory.subscribeToNgRoute = (o) => {
        console.log('ooo', o)
        return orsSettingsFactory.ngRouteSubject.subscribe(o);
    };
    /** Returns waypoints in settings. If none are set then returns empty list. */
    orsSettingsFactory.getWaypoints = () => {
        console.log(currentSettingsObj)
        console.log(currentSettingsObj, orsSettingsFactory[currentSettingsObj])
        console.warn(orsSettingsFactory.routingSettingsSubject);
        if (!('waypoints' in orsSettingsFactory[currentSettingsObj].getValue())) return [];
        return orsSettingsFactory[currentSettingsObj].getValue().waypoints;
    };
    /**
     * Intializes empty waypoints without coordinates.
     * @param {number} n - Specifices the amount of waypoints to be added
     */
    orsSettingsFactory.initWaypoints = (n) => {
        for (var i = 1; i <= n; i++) {
            wp = orsObjectsFactory.createWaypoint('', new L.latLng());
            orsSettingsFactory[currentSettingsObj].getValue().waypoints.push(wp);
        }
        return orsSettingsFactory[currentSettingsObj].getValue().waypoints;
    };
    /** 
     * Updates waypoint address and position in settings.
     * @param {number} idx - Which is the index of the to be updated wp.
     * @param {string} address - Which is the string of the address.
     * @param {Object} pos - Which is the latlng object.
     */
    orsSettingsFactory.updateWaypoint = (idx, address, pos) => {
        orsSettingsFactory[currentSettingsObj].getValue().waypoints[idx]._latlng = pos;
        orsSettingsFactory[currentSettingsObj].getValue().waypoints[idx]._address = address;
        /** Fire a new request. */
        orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
        //orsSettingsFactory.panelWaypoints.onNext(orsSettingsFactory.panelSettings.getValue().waypoints);
    };
    /** Used for map update */
    orsSettingsFactory.updateWaypoints = () => {
        orsSettingsFactory[currentWaypointsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue().waypoints);
    };
    /** 
     * This is basically the heart of navigation. If the panels are switched between
     * routing and accessibility analysis the subject references are updated.
     * @param {string} newRoute - Path of current location.
     */
    orsSettingsFactory.updateNgRoute = (newRoute => {
        console.info('newRoute', newRoute)
        currentSettingsObj = orsSettingsFactory.getCurrentSettings(newRoute);
        currentWaypointsObj = orsSettingsFactory.getCurrentWaypoints(newRoute);
        console.log('objs', currentSettingsObj, currentWaypointsObj)
        orsSettingsFactory.ngRouteSubject.onNext(newRoute);
    });
        orsSettingsFactory.handleRoutePresent = () => {};

    /** Subscription function to current settings */
    orsSettingsFactory.routingSettingsSubject.subscribe(x => {
        // treat routing and analysis differently
        orsSettingsFactory.handleRoutePresent();
        // var isRoutePresent = waypoint.getNumWaypointsSet() >= 2;
        // if (isRoutePresent) {
        // }
        console.info('routing request', x);
    });
    orsSettingsFactory.aaSettingsSubject.subscribe(x => {
        console.info('aa request', x);
    });
    /** 
     * Updates waypoint address. No need to fire subscription for settings.
     * This is done already when updated latlng.
     * @param {number} idx - Index of waypoint.
     * @param {string} address - Address as string.
     * @param {boolean} init - When this is true, forgot why I need this fuck.
     */
    orsSettingsFactory.updateWaypointAddress = (idx, address, init) => {
        let set = orsSettingsFactory[currentSettingsObj].getValue();
        if (init) {
            set.waypoints[idx]._address = address;
        } else {
            if (idx == 0) {
                set.waypoints[idx]._address = address;
            } else if (idx == 2) {
                set.waypoints[set.waypoints.length - 1]._address = address;
            } else if (idx == 1) {
                set.waypoints[set.waypoints.length - 2]._address = address;
            }
        }
    };
    /**
     * Sets waypoints into settings.
     * @param {waypoints.<Object>} List of waypoint objects.
     */
    orsSettingsFactory.setWaypoints = (waypoints) => {
        orsSettingsFactory[currentSettingsObj].getValue().waypoints = waypoints;
        /** fire a new request */
        orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
        /** For map to update */
        orsSettingsFactory[currentWaypointsObj].onNext(waypoints);
    };
    /**
     * Inserts waypoint to settings waypoints when added on map. This can
     * either be a start, via or end
     * @param {number} idx - Type of wp which should be added: start, via or end.
     * @param {Object} wp - The waypoint object to be inserted to wp list.
     */
    orsSettingsFactory.insertWaypointFromMap = (idx, wp) => {
        if (idx == 0) {
            orsSettingsFactory[currentSettingsObj].value.waypoints[idx] = wp;
        } else if (idx == 2) {
            orsSettingsFactory[currentSettingsObj].value.waypoints[orsSettingsFactory[currentSettingsObj].value.waypoints.length - 1] = wp;
        } else if (idx == 1) {
            orsSettingsFactory[currentSettingsObj].value.waypoints.splice(orsSettingsFactory[currentSettingsObj].value.waypoints.length - 1, 0, wp);
        }
        /** Update Map. */
        orsSettingsFactory[currentWaypointsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue().waypoints);
        /** Fire a new request. */
        orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
    };
    /** 
     * Returns the current settings depending on the route
     */
    orsSettingsFactory.getCurrentSettings = (path) => {
        let settingsObject;
        if (path == 'routing') {
            settingsObject = 'routingSettingsSubject';
        } else if (path == 'analysis') {
            settingsObject = 'aaSettingsSubject';
        }
        return settingsObject;
    };
    /** 
     * Returns the current waypoints depending on the route
     */
    orsSettingsFactory.getCurrentWaypoints = (path) => {
        let waypointsObject;
        if (path == 'routing') {
            waypointsObject = 'routingWaypointsSubject';
        } else if (path == 'analysis') {
            waypointsObject = 'aaWaypointsSubject';
        }
        return waypointsObject;
    };
    /**
     * Determines which icon should be returned.
     * @param {number} idx - Type of wp which should be added: start, via or end.
     * @return {number} iconIdx - 0, 1 or 2.
     */
    orsSettingsFactory.getIconIdx = (idx) => {
        let iconIdx;
        if (idx == 0) {
            iconIdx = 0;
        } else if (idx == orsSettingsFactory[currentSettingsObj].getValue().waypoints.length - 1) {
            iconIdx = 2;
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
        let set = orsSettingsFactory[currentSettingsObj].getValue();
        set.profile.type = currentProfile.type;
        /** Fire a new request. */
        orsSettingsFactory[currentSettingsObj].onNext(set);
    };
    return orsSettingsFactory;
}]);