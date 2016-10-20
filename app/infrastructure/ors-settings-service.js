angular.module('orsApp.settings-service', []).factory('orsSettingsFactory', ['orsObjectsFactory', function(orsObjectsFactory) {
	let aa_settings = {};
    let waypointsSubject = new Rx.Subject();
    let aa_waypointsSubject = new Rx.BehaviorSubject({});
    let aa_settingsSubject = new Rx.BehaviorSubject({});
    let settingsSubject = new Rx.BehaviorSubject({});
	let ngRouteSubject = new Rx.BehaviorSubject(undefined);
	
	// orsSettingsFactory.init = () => {
		// let settings = {
			// waypoints : {},
			// profile : {
				// options : {}
			// }
		// }
		// return settings;
	// }
    settingsSubject.subscribe(function(x) {
        console.log('settings changed..fire request!', x);
    }, function(err) {
        console.log(err);
    }, function() {
        console.log('Completed');
    });
    let orsSettingsFactory = {};
    orsSettingsFactory.setSettings = (params) => {
		let set = settingsSubject.getValue();
        for (var k in params) {
            set[k] = params[k];
        }
		settingsSubject.onNext(set);
    };
	orsSettingsFactory.setAASettings = (params) => {
        for (var k in params) {
            aa_settingsSubject.value[k] = params[k];
        }
		aa_settingsSubject.onNext(aa_settingsSubject.getValue());
    };
    orsSettingsFactory.getActiveProfile = () => {
		if(!('profile' in settingsSubject.getValue())) return [];
        return settingsSubject.getValue().profile;
    };
    orsSettingsFactory.getActiveOptions = () => {
		if(!('profile' in settingsSubject.getValue())) return [];
		if(!('options' in settingsSubject.getValue().profile)) return [];
        return settingsSubject.getValue().profile.options;
    };
    orsSettingsFactory.subscribeToWaypoints = (o) => {
        return waypointsSubject.subscribe(o);
    };
	orsSettingsFactory.subscribeToAAWaypoints = (o) => {
        return aa_waypointsSubject.subscribe(o);
    };
	orsSettingsFactory.subscribeToNgRoute = (o) => {
        return ngRouteSubject.subscribe(o);
    };
    orsSettingsFactory.getWaypoints = () => {
		if (ngRouteSubject.getValue() == 'routing'){
			if (!('waypoints' in settingsSubject.getValue())) return [];
			return settingsSubject.getValue().waypoints;
		}
		if (ngRouteSubject.getValue() == 'analysis'){
			if (!('waypoints' in aa_settingsSubject.getValue())) return [];
			return aa_settingsSubject.getValue().waypoints;
		}
		return [];
    };
    orsSettingsFactory.initWaypoints = () => {
        settingsSubject.getValue().waypoints = [orsObjectsFactory.createWaypoint('', new L.latLng()), orsObjectsFactory.createWaypoint('', new L.latLng())];
        return settingsSubject.getValue().waypoints;
    };
	orsSettingsFactory.initSingleWaypoint = () => {
        aa_settingsSubject.value.waypoint = [orsObjectsFactory.createWaypoint('ABC', new L.latLng())];
        return aa_settingsSubject.getValue().waypoint;
    };
    orsSettingsFactory.updateWaypoint = (idx, address, pos) => {
		//Map wants to add a waypoint. Add it to the right set of settings 
		if (ngRouteSubject.getValue() == 'routing'){
			settingsSubject.getValue().waypoints[idx]._latlng = pos;
			settingsSubject.getValue().waypoints[idx]._address = address;
			waypointsSubject.onNext(settingsSubject.getValue().waypoints);
		}
		if(ngRouteSubject.getValue() == 'analysis'){
			aa_settingsSubject.getValue().waypoints[0]._latlng = pos;
			aa_settingsSubject.getValue().waypoints[0]._address = address;
			aa_waypointsSubject.onNext(aa_settingsSubject.getValue().waypoints);
		}
    };
	orsSettingsFactory.updateWaypoints = () => {
        waypointsSubject.onNext(settingsSubject.getValue().waypoints);
    };
	orsSettingsFactory.updateAAWaypoint = (address, pos) => {
		console.log("Update");
        aa_waypointsSubject.onNext([orsObjectsFactory.createWaypoint(address, new L.latLng(pos))]);
    };
	orsSettingsFactory.updateAAWaypoints = () => {
		console.log(aa_settingsSubject.getValue());
        aa_waypointsSubject.onNext(aa_settingsSubject.getValue().waypoints);
    };
	orsSettingsFactory.updateNgRoute = (newRoute) => {
        ngRouteSubject.onNext(newRoute);
    };
    orsSettingsFactory.updateWaypointAddress = (idx, address, init) => {
		if (ngRouteSubject.getValue() == 'routing'){
			let set = settingsSubject.getValue();
			if (init) {
				set.waypoints[idx]._address = address;
				settingsSubject.onNext(set);
			} else {
				if (idx == 0) {
					set.waypoints[idx]._address = address;
				} else if (idx == 2) {
					set.waypoints[set.waypoints.length - 1]._address = address;
				} else if (idx == 1) {
					set.waypoints[set.waypoints.length - 2]._address = address;
				}
				settingsSubject.onNext(set);
			}
		}
		if (ngRouteSubject.getValue() == 'analysis'){
			let set = aa_settingsSubject.getValue();
			if (init) {
				set.waypoints[0]._address = address;
				aa_settingsSubject.onNext(set);
			} else {
				set.waypoints[0]._address = address;
				aa_settingsSubject.onNext(set);
			}
		}
    };
    orsSettingsFactory.setWaypoints = (d) => {
		let currentSettingsSubject = {}, currentWaypointSubject = {};
		if (ngRouteSubject.getValue() == 'routing'){
			currentSettingsSubject = settingsSubject;
			currentWaypointSubject = waypointsSubject;
		}
		if (ngRouteSubject.getValue() == 'analysis'){
			currentSettingsSubject = aa_settingsSubject;
			currentWaypointSubject = aa_waypointsSubject;
		}
		let set = currentSettingsSubject.getValue();
        set.waypoints = d;
        currentWaypointSubject.onNext(set.waypoints);
        currentSettingsSubject.onNext(set);
    };
    orsSettingsFactory.insertWaypointFromMap = (idx, wp) => {
		// let set = settingsSubject.getValue();
		if (ngRouteSubject.getValue() == 'routing'){
			console.log(ngRouteSubject.getValue());
			if (idx == 0) {
				settingsSubject.value.waypoints[idx] = wp;
			} else if (idx == 2) {
				settingsSubject.value.waypoints[settingsSubject.value.waypoints.length - 1] = wp;
			} else if (idx == 1) {
				settingsSubject.value.waypoints.splice(settingsSubject.value.waypoints.length - 1, 0, wp);
			}
			waypointsSubject.onNext(settingsSubject.getValue().waypoints);
			settingsSubject.onNext(settingsSubject.getValue());
		}
		if (ngRouteSubject.getValue() == 'analysis'){
			console.log(ngRouteSubject.getValue());
			console.log(wp);
			let set = aa_settingsSubject.getValue();
			set.waypoints = [];
			set.waypoints[0] = wp;
			
			// aa_settingsSubject.value.waypoints[0] = wp;
			// console.log(aa_settingsSubject.getValue());
			aa_waypointsSubject.onNext(aa_settingsSubject.getValue().waypoints);
			aa_settingsSubject.onNext(aa_settingsSubject.getValue());
			
		}
    };
    orsSettingsFactory.getIconIdx = (idx) => {
        let iconIdx;
		//Analysis waypoint
		if (ngRouteSubject.getValue() == 'analysis') return 0;
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