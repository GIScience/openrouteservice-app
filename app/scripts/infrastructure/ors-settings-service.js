var $__app_47_scripts_47_infrastructure_47_ors_45_settings_45_service_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/infrastructure/ors-settings-service.js";
  angular.module('orsApp.settings-service', []).factory('orsSettingsFactory', ['orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsRouteService', 'orsAaService', 'orsErrorhandlerService', function(orsObjectsFactory, orsUtilsService, orsRequestService, orsRouteService, orsAaService, orsErrorhandlerService) {
    var orsSettingsFactory = {};
    orsSettingsFactory.routingWaypointsSubject = new Rx.BehaviorSubject({});
    orsSettingsFactory.routingSettingsSubject = new Rx.BehaviorSubject({waypoints: []});
    orsSettingsFactory.aaWaypointsSubject = new Rx.BehaviorSubject({});
    orsSettingsFactory.aaSettingsSubject = new Rx.BehaviorSubject({waypoints: []});
    orsSettingsFactory.userOptionsSubject = new Rx.BehaviorSubject({});
    orsSettingsFactory.ngRouteSubject = new Rx.BehaviorSubject(undefined);
    var currentSettingsObj,
        currentWaypointsObj;
    orsSettingsFactory.isInitialized = false;
    orsSettingsFactory.setSettings = function(set) {
      orsSettingsFactory[currentSettingsObj].onNext(set);
    };
    orsSettingsFactory.setUserOptions = function(params) {
      if (params === undefined)
        return;
      var set = orsSettingsFactory.userOptionsSubject.getValue();
      for (var k in params) {
        set[k] = params[k];
      }
      orsSettingsFactory.userOptionsSubject.onNext(set);
    };
    orsSettingsFactory.getUserOptions = function() {
      return orsSettingsFactory.userOptionsSubject.getValue();
    };
    orsSettingsFactory.getActiveProfile = function() {
      return orsSettingsFactory[currentSettingsObj].getValue().profile;
    };
    orsSettingsFactory.getActiveOptions = function() {
      console.log("getActiveOptions");
      console.log(orsSettingsFactory[currentSettingsObj].getValue());
      return orsSettingsFactory[currentSettingsObj].getValue().profile.options;
    };
    orsSettingsFactory.setActiveOptions = function(options) {
      orsSettingsFactory[currentSettingsObj].getValue().profile.options = options;
      orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
    };
    orsSettingsFactory.getSettings = function() {
      return orsSettingsFactory[currentSettingsObj].getValue();
    };
    orsSettingsFactory.subscribeToWaypoints = function(o) {
      return orsSettingsFactory.routingWaypointsSubject.subscribe(o);
    };
    orsSettingsFactory.subscribeToAaWaypoints = function(o) {
      return orsSettingsFactory.aaWaypointsSubject.subscribe(o);
    };
    orsSettingsFactory.subscribeToNgRoute = function(o) {
      return orsSettingsFactory.ngRouteSubject.subscribe(o);
    };
    orsSettingsFactory.getWaypoints = function() {
      return orsSettingsFactory[currentSettingsObj].getValue().waypoints;
    };
    orsSettingsFactory.initWaypoints = function(n) {
      orsSettingsFactory[currentSettingsObj].getValue().waypoints = [];
      var wp;
      for (var i = 1; i <= n; i++) {
        wp = orsObjectsFactory.createWaypoint('', new L.latLng());
        orsSettingsFactory[currentSettingsObj].getValue().waypoints.push(wp);
      }
      orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
      return orsSettingsFactory[currentSettingsObj].getValue().waypoints;
    };
    orsSettingsFactory.updateWaypoint = function(idx, address, pos) {
      var fireRequest = arguments[3] !== (void 0) ? arguments[3] : true;
      orsSettingsFactory[currentSettingsObj].getValue().waypoints[idx]._latlng = pos;
      orsSettingsFactory[currentSettingsObj].getValue().waypoints[idx]._address = address;
      if (fireRequest)
        orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
    };
    orsSettingsFactory.updateWaypoints = function() {
      console.log('updating..');
      orsSettingsFactory[currentWaypointsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue().waypoints);
    };
    orsSettingsFactory.updateNgRoute = (function(newRoute) {
      currentSettingsObj = orsSettingsFactory.getCurrentSettings(newRoute);
      currentWaypointsObj = orsSettingsFactory.getCurrentWaypoints(newRoute);
      orsAaService.aaRequests.clear();
      orsRouteService.routingRequests.clear();
      orsRequestService.geocodeRequests.clear();
      orsSettingsFactory.ngRouteSubject.onNext(newRoute);
    });
    orsSettingsFactory.handleRoutePresent = function(settings, num) {
      var sum = 0,
          routePresent = false;
      angular.forEach(settings.waypoints, function(waypoint) {
        sum += waypoint._set;
        if (sum == num) {
          routePresent = true;
          return;
        }
      });
      return routePresent;
    };
    orsSettingsFactory.routingSettingsSubject.subscribe(function(settings) {
      console.info("changes in routingSettingsSubject");
      var isRoutePresent = orsSettingsFactory.handleRoutePresent(settings, 2);
      if (isRoutePresent) {
        orsRouteService.routingRequests.clear();
        orsRouteService.resetRoute();
        var userOptions = orsSettingsFactory.getUserOptions();
        var payload = orsUtilsService.generateRouteXml(userOptions, settings);
        var request = orsRouteService.fetchRoute(payload);
        orsRouteService.routingRequests.requests.push(request);
        request.promise.then(function(response) {
          var profile = settings.profile.type;
          orsRouteService.processResponse(response, profile);
        }, function(response) {
          console.error(response);
        });
      }
      if (orsSettingsFactory.isInitialized) {
        orsUtilsService.parseSettingsToPermalink(settings, orsSettingsFactory.getUserOptions());
      }
    });
    orsSettingsFactory.aaSettingsSubject.subscribe(function(settings) {
      console.info("changes in aaSettingsSubject");
      var isAaPresent = orsSettingsFactory.handleRoutePresent(settings, 1);
      if (isAaPresent) {
        orsAaService.aaRequests.clear();
        var payload = orsAaService.generateAnalysisRequest(settings);
        var request = orsAaService.fetchAnalysis(payload);
        orsAaService.aaRequests.requests.push(request);
        request.promise.then(function(response) {
          orsAaService.processResponse(response);
        }, function(response) {});
      }
      if (orsSettingsFactory.isInitialized) {
        orsUtilsService.parseSettingsToPermalink(settings, orsSettingsFactory.getUserOptions());
      }
    });
    orsSettingsFactory.getAddress = function(pos, idx, init) {
      var latLngString = orsUtilsService.parseLatLngString(pos);
      orsSettingsFactory.updateWaypointAddress(idx, latLngString, init);
      var payload = orsUtilsService.reverseXml(pos);
      var request = orsRequestService.geocode(payload);
      orsRequestService.geocodeRequests.updateRequest(request, idx);
      request.promise.then(function(response) {
        var data = orsUtilsService.domParser(response);
        var error = orsErrorhandlerService.parseResponse(data);
        if (!error) {
          var addressData = orsUtilsService.processAddresses(data, true);
          orsSettingsFactory.updateWaypointAddress(idx, addressData[0].address, init);
        } else {
          console.log('Not able to find address!');
        }
      }, function(response) {
        console.log('It was not possible to get the address of the current waypoint. Sorry for the inconvenience!');
      });
    };
    orsSettingsFactory.updateWaypointAddress = function(idx, address, init) {
      var set = orsSettingsFactory[currentSettingsObj].getValue();
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
    orsSettingsFactory.setWaypoints = function(waypoints) {
      var fireRequest = arguments[1] !== (void 0) ? arguments[1] : true;
      console.log('setting..', waypoints);
      orsSettingsFactory[currentSettingsObj].getValue().waypoints = waypoints;
      if (fireRequest)
        orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
      if (fireRequest)
        orsSettingsFactory[currentWaypointsObj].onNext(waypoints);
    };
    orsSettingsFactory.insertWaypointFromMap = function(idx, wp) {
      var fireRequest = arguments[2] !== (void 0) ? arguments[2] : true;
      if (idx == 0) {
        orsSettingsFactory[currentSettingsObj].value.waypoints[idx] = wp;
      } else if (idx == 2) {
        orsSettingsFactory[currentSettingsObj].value.waypoints[orsSettingsFactory[currentSettingsObj].value.waypoints.length - 1] = wp;
      } else if (idx == 1) {
        orsSettingsFactory[currentSettingsObj].value.waypoints.splice(orsSettingsFactory[currentSettingsObj].value.waypoints.length - 1, 0, wp);
      }
      orsSettingsFactory[currentWaypointsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue().waypoints);
      if (fireRequest)
        orsSettingsFactory[currentSettingsObj].onNext(orsSettingsFactory[currentSettingsObj].getValue());
    };
    orsSettingsFactory.getCurrentSettings = function(path) {
      var settingsObject;
      if (path == 'routing') {
        settingsObject = 'routingSettingsSubject';
      } else if (path == 'analysis') {
        settingsObject = 'aaSettingsSubject';
      }
      return settingsObject;
    };
    orsSettingsFactory.getCurrentWaypoints = function(path) {
      var waypointsObject;
      if (path == 'routing') {
        waypointsObject = 'routingWaypointsSubject';
      } else if (path == 'analysis') {
        waypointsObject = 'aaWaypointsSubject';
      }
      return waypointsObject;
    };
    orsSettingsFactory.getIconIdx = function(idx) {
      var iconIdx;
      if (idx == 0) {
        iconIdx = 0;
      } else if (idx == orsSettingsFactory[currentSettingsObj].getValue().waypoints.length - 1) {
        iconIdx = 2;
      } else {
        iconIdx = 1;
      }
      return iconIdx;
    };
    orsSettingsFactory.setProfile = function(currentProfile) {
      var set = orsSettingsFactory[currentSettingsObj].getValue();
      set.profile.type = currentProfile.type;
      orsSettingsFactory[currentSettingsObj].onNext(set);
    };
    return orsSettingsFactory;
  }]);
  return {};
})();
