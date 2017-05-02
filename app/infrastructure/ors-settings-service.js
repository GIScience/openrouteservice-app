angular.module('orsApp.settings-service', []).factory('orsSettingsFactory', ['$timeout', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsRouteService', 'orsAaService', 'orsMessagingService', 'lists', ($timeout, orsObjectsFactory, orsUtilsService, orsRequestService, orsRouteService, orsAaService, orsMessagingService, lists) => {
    let orsSettingsFactory = {};
    /** Behaviour subjects routing. */
    orsSettingsFactory.routingWaypointsSubject = new Rx.BehaviorSubject({});
    orsSettingsFactory.routingSettingsSubject = new Rx.BehaviorSubject({
        waypoints: []
    });
    /** Behaviour subjects accessibility analysis. */
    orsSettingsFactory.aaWaypointsSubject = new Rx.BehaviorSubject({});
    orsSettingsFactory.aaSettingsSubject = new Rx.BehaviorSubject({
        waypoints: []
    });
    /** Behaviour subject for user options, language and units */
    orsSettingsFactory.userOptionsSubject = new Rx.BehaviorSubject({});
    /** Behaviour subject routing. */
    orsSettingsFactory.ngRouteSubject = new Rx.BehaviorSubject(undefined);
    orsSettingsFactory.requestSubject = new Rx.Subject();
    /** Global reference settings, these are switched when panels are changed - default is routing.*/
    let currentSettingsObj, currentWaypointsObj;
    orsSettingsFactory.isInitialized = false;
    orsSettingsFactory.focusIdx = true;
    /**
     * Sets the settings from permalink
     * @param {Object} set - The settings object.
     * @param {boolean} focus - If only one waypoint is set zoom to it.
     */
    orsSettingsFactory.setSettings = (set) => {
        /** Fire request */
        orsSettingsFactory[currentSettingsObj].onNext(set);
    };
    /** 
     * Sets user specific options in settings (language, routinglang and units). Can be used for any key-value pair. Is used by both permalink and Cookies
     * @param {Object} options- Consists of routing instruction language and units km/mi
     */
    orsSettingsFactory.setUserOptions = (params) => {
        if (params === undefined) return;
        //get current settings and add new params/replace existing params
        let set = orsSettingsFactory.userOptionsSubject.getValue();
        for (var k in params) {
            set[k] = params[k];
        }
        orsSettingsFactory.userOptionsSubject.onNext(set);
    };
    /** 
     * Gets user specific options in settings (language and units)
     * @return {Object} The user settings
     */
    orsSettingsFactory.getUserOptions = () => {
        return orsSettingsFactory.userOptionsSubject.getValue();
    };
    /**;
     * Returns active profile.
     * @return {Object} The profile object.
     */
    orsSettingsFactory.getActiveProfile = () => {
        return orsSettingsFactory[currentSettingsObj].getValue().profile;
    };
    /**
     * Returns current options.
     * @return {Object} The options object, may contain both profile options and aa options.
     */
    orsSettingsFactory.getActiveOptions = () => {
        return orsSettingsFactory[currentSettingsObj].getValue().profile.options;
    };
    orsSettingsFactory.setActiveOptions = (options, fireRequest) => {
        orsSettingsFactory[currentSettingsObj].getValue().profile.options = options;
        console.log(orsSettingsFactory[currentSettingsObj].getValue())
        if (fireRequest) orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
        if (orsSettingsFactory.isInitialized) {
            orsUtilsService.parseSettingsToPermalink(orsSettingsFactory[currentSettingsObj].getValue(), orsSettingsFactory.getUserOptions());
        }
    };
    /**
     * Returns current settings.
     * @return {Object} The settings object, may contain both profile options and aa options.
     */
    orsSettingsFactory.getSettings = () => {
        return orsSettingsFactory[currentSettingsObj].getValue();
    };
    /** Subscription function to current waypoints object, used in map. */
    orsSettingsFactory.subscribeToWaypoints = (o) => {
        return orsSettingsFactory.routingWaypointsSubject.subscribe(o);
    };
    /** Subscription function to current aa waypoints object, used in map. */
    orsSettingsFactory.subscribeToAaWaypoints = (o) => {
        return orsSettingsFactory.aaWaypointsSubject.subscribe(o);
    };
    /** Subscription function to current route object. */
    orsSettingsFactory.subscribeToNgRoute = (o) => {
        return orsSettingsFactory.ngRouteSubject.subscribe(o);
    };
    /** Subscription function to current route object. */
    orsSettingsFactory.subscribeToRouteRequest = (o) => {
        return orsSettingsFactory.requestSubject.subscribe(o);
    };
    /** Returns waypoints in settings. If none are set then returns empty list. */
    orsSettingsFactory.getWaypoints = () => {
        return orsSettingsFactory[currentSettingsObj].getValue().waypoints;
    };
    /**
     * Intializes empty waypoints without coordinates.
     * @param {number} n - Specifices the amount of waypoints to be added
     */
    orsSettingsFactory.initWaypoints = (n) => {
        orsSettingsFactory[currentSettingsObj].getValue().waypoints = [];
        var wp;
        for (var i = 1; i <= n; i++) {
            wp = orsObjectsFactory.createWaypoint('', new L.latLng());
            orsSettingsFactory[currentSettingsObj].getValue().waypoints.push(wp);
        }
        orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
        return orsSettingsFactory[currentSettingsObj].getValue().waypoints;
    };
    /** 
     * Updates waypoint address and position in settings.
     * @param {number} idx - Which is the index of the to be updated wp.
     * @param {string} address - Which is the string of the address.
     * @param {Object} pos - Which is the latlng object.
     */
    orsSettingsFactory.updateWaypoint = (idx, address, pos, fireRequest = true) => {
        orsSettingsFactory.focusIdx = false;
        orsSettingsFactory[currentSettingsObj].getValue().waypoints[idx]._latlng = pos;
        orsSettingsFactory[currentSettingsObj].getValue().waypoints[idx]._address = address;
        /** Fire a new request. */
        if (fireRequest) orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
        //orsSettingsFactory.panelWaypoints.onNext(orsSettingsFactory.panelSettings.getValue().waypoints);
    };
    /** Used for map update */
    orsSettingsFactory.updateWaypoints = () => {
        console.log('updating..');
        orsSettingsFactory[currentWaypointsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue().waypoints);
    };
    /** Sets avoidable regions in settings object */
    orsSettingsFactory.setAvoidableAreas = (avoidablePolygons) => {
        orsSettingsFactory[currentSettingsObj].getValue().avoidable_polygons = avoidablePolygons;
        orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
    };
    /** 
     * This is basically the heart of navigation. If the panels are switched between
     * routing and accessibility analysis the subject references are updated.
     * @param {string} newRoute - Path of current location.
     */
    orsSettingsFactory.updateNgRoute = (newRoute => {
        currentSettingsObj = orsSettingsFactory.getCurrentSettings(newRoute);
        currentWaypointsObj = orsSettingsFactory.getCurrentWaypoints(newRoute);
        /** panels switched, clear the map */
        /** Cancel outstanding requests */
        orsAaService.aaRequests.clear();
        orsRouteService.routingRequests.clear();
        orsRequestService.geocodeRequests.clear();
        orsSettingsFactory.ngRouteSubject.onNext(newRoute);
    });
    /** 
     * Checks if two waypoints are set
     * @param {Object} settings - route settings object
     * @return {boolean} routePresent - whether route is present
     */
    orsSettingsFactory.handleRoutePresent = (settings, num) => {
        let sum = 0,
            routePresent = false;
        angular.forEach(settings.waypoints, (waypoint) => {
            sum += waypoint._set;
            if (sum == num) {
                routePresent = true;
                return;
            }
        });
        return routePresent;
    };
    /** Subscription function to current routing settings */
    orsSettingsFactory.routingSettingsSubject.subscribe(settings => {
        console.info("changes in routingSettingsSubject", JSON.stringify(settings));
        const isRoutePresent = orsSettingsFactory.handleRoutePresent(settings, 2);
        if (isRoutePresent) {
            orsSettingsFactory.requestSubject.onNext(true);
            /** Cancel outstanding requests */
            orsRouteService.routingRequests.clear();
            orsRouteService.resetRoute();
            const userOptions = orsSettingsFactory.getUserOptions();
            const payload = orsUtilsService.routingPayload(settings, userOptions);
            const request = orsRouteService.fetchRoute(payload);
            orsRouteService.routingRequests.requests.push(request);
            request.promise.then(function(response) {
                orsSettingsFactory.requestSubject.onNext(false);
                const profile = settings.profile.type;
                orsRouteService.processResponse(response, profile, orsSettingsFactory.focusIdx);
            }, function(response) {
                console.error(response);
                orsSettingsFactory.requestSubject.onNext(false);
            });
        }
        
    });
    /** Subscription function to current accessibility settings */
    orsSettingsFactory.aaSettingsSubject.subscribe(settings => {
        /** get user options */
        console.info("changes in aaSettingsSubject");
        const isAaPresent = orsSettingsFactory.handleRoutePresent(settings, 1);
        if (isAaPresent) {
            orsSettingsFactory.requestSubject.onNext(true);
            /** Cancel outstanding requests */
            orsAaService.aaRequests.clear();
            const payload = orsUtilsService.isochronesPayload(settings);
            const request = orsAaService.getIsochrones(payload);
            orsAaService.aaRequests.requests.push(request);
            request.promise.then(function(response) {
                orsAaService.processResponse(response, settings);
                orsSettingsFactory.requestSubject.onNext(false);
                // orsAaService.parseResultsToBounds(response);
                // orsAaService.parseResponseToPolygonJSON(response);
            }, function(response) {
                orsSettingsFactory.requestSubject.onNext(false);
            });
        }
        
    });
    /** Fetches address 
     * @param {Object} pos - latLng Object 
     * @param {number} idx - Index of waypoint
     * @param {boolean} init - Init is true when the service is loaded over permalink with the correct indices of waypoints
     */
    orsSettingsFactory.getAddress = (pos, idx, init) => {
        // if this function is called from a popup we have to translate the index
        if (!init) {
            const set = orsSettingsFactory[currentSettingsObj].getValue();
            if (idx == 0) {
                idx = 0;
            } else if (idx == 2) {
                idx = set.waypoints.length - 1;
            } else if (idx == 1) {
                idx = set.waypoints.length - 2;
            }
        }
        const lngLatString = orsUtilsService.parseLngLatString(pos);
        orsSettingsFactory.updateWaypointAddress(idx, lngLatString, init);
        const payload = orsUtilsService.geocodingPayload(lngLatString, true);
        const request = orsRequestService.geocode(payload);
        const requestsQue = orsSettingsFactory.ngRouteSubject.getValue() == 'directions' ? 'routeRequests' : 'aaRequests';
        orsRequestService.geocodeRequests.updateRequest(request, idx, requestsQue);
        request.promise.then((data) => {
            if (data.features.length > 0) {
                const addressData = orsUtilsService.addShortAddresses(data.features);
                orsSettingsFactory.updateWaypointAddress(idx, addressData[0].shortaddress, init);
            } else {
                orsMessagingService.messageSubject.onNext(lists.errors.GEOCODE);
            }
        }, (response) => {
            orsMessagingService.messageSubject.onNext(lists.errors.GEOCODE);
        });
    };
    /** 
     * Updates waypoint address. No need to fire subscription for settings.
     * This is done already when updated latlng.
     * @param {number} idx - Index of waypoint.
     * @param {string} address - Address as string.
     * @param {boolean} init - When this is true, the index is loaded from the loop (idx is correct) and not from the popup (0, 1 or 2)
     */
    orsSettingsFactory.updateWaypointAddress = (idx, address, init) => {
        let set = orsSettingsFactory[currentSettingsObj].getValue();
        set.waypoints[idx]._address = address;
    };
    /**
     * Sets waypoints into settings.
     * @param {waypoints.<Object>} List of waypoint objects.
     */
    orsSettingsFactory.setWaypoints = (waypoints, fireRequest = true) => {
        console.log('setting..', waypoints);
        orsSettingsFactory[currentSettingsObj].getValue().waypoints = waypoints;
        /** fire a new request */
        if (fireRequest) orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
        /** For map to update */
        if (fireRequest) orsSettingsFactory[currentWaypointsObj].onNext(waypoints);
        orsUtilsService.parseSettingsToPermalink(orsSettingsFactory[currentSettingsObj].getValue(), orsSettingsFactory.getUserOptions());
    };
    /**
     * Inserts waypoint to settings waypoints when added on map. This can
     * either be a start, via or end
     * @param {number} idx - Type of wp which should be added: start, via or end.
     * @param {Object} wp - The waypoint object to be inserted to wp list.
     */
    orsSettingsFactory.insertWaypointFromMap = (idx, wp, fireRequest = true) => {
        if (idx == 0) {
            orsSettingsFactory[currentSettingsObj].value.waypoints[idx] = wp;
        } else if (idx == 2) {
            orsSettingsFactory[currentSettingsObj].value.waypoints[orsSettingsFactory[currentSettingsObj].value.waypoints.length - 1] = wp;
        } else if (idx == 1) {
            orsSettingsFactory[currentSettingsObj].value.waypoints.splice(orsSettingsFactory[currentSettingsObj].value.waypoints.length - 1, 0, wp);
            orsSettingsFactory.focusIdx = false;
        }
        /** Update Map. */
        orsSettingsFactory[currentWaypointsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue().waypoints);
        /** Fire a new request. */
        if (fireRequest) orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
    };
    /** 
     * Returns the current settings depending on the route
     */
    orsSettingsFactory.getCurrentSettings = (path) => {
        let settingsObject;
        if (path == 'directions') {
            settingsObject = 'routingSettingsSubject';
        } else if (path == 'reach') {
            settingsObject = 'aaSettingsSubject';
        }
        return settingsObject;
    };
    /** 
     * Returns the current waypoints depending on the route
     */
    orsSettingsFactory.getCurrentWaypoints = (path) => {
        let waypointsObject;
        if (path == 'directions') {
            waypointsObject = 'routingWaypointsSubject';
        } else if (path == 'reach') {
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
        orsUtilsService.parseSettingsToPermalink(orsSettingsFactory[currentSettingsObj].getValue(), orsSettingsFactory.getUserOptions());
        let set = orsSettingsFactory[currentSettingsObj].getValue();
        set.profile.type = currentProfile.type;
        /** Fire a new request if on route. */
        const isAaPanel = orsSettingsFactory.ngRouteSubject.getValue() == 'reach' ? true : false;
        if (!isAaPanel) orsSettingsFactory[currentSettingsObj].onNext(set);
    };
    return orsSettingsFactory;
}]);