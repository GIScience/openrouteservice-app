var $__app_47_scripts_47_infrastructure_47_ors_45_params_45_service_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/infrastructure/ors-params-service.js";
  angular.module('orsApp.params-service', []).factory('orsParamsService', ['orsUtilsService', 'orsObjectsFactory', 'orsRequestService', function(orsUtilsService, orsObjectsFactory, orsRequestService) {
    var orsParamsService = {};
    orsParamsService.importSettings = function(params) {
      var routing = arguments[1] !== (void 0) ? arguments[1] : true;
      var settings = {
        waypoints: [],
        profile: {
          type: 'Car',
          options: {
            weight: 'Fastest',
            analysis_options: {},
            avoidables: {}
          }
        }
      };
      console.log("importing param setttings");
      var user_options = {};
      angular.forEach(params, function(value, key) {
        if (key == 'wps') {
          var wps = value.match(/[^,]+,[^,]+/g);
          var idx = 0,
              waypoints = [];
          angular.forEach(wps, function(wp) {
            wp = wp.split(",");
            var latLng = new L.latLng([parseFloat(wp[0]), parseFloat(wp[1])]);
            var latLngString = orsUtilsService.parseLatLngString(latLng);
            wp = orsObjectsFactory.createWaypoint(latLngString, latLng, 1);
            waypoints.push(wp);
            idx += 1;
          });
          if (idx == 1 && routing === true) {
            wp = orsObjectsFactory.createWaypoint('', false, 0);
            waypoints.push(wp);
          }
          settings.waypoints = waypoints;
        }
        if (key == 'type') {
          settings.profile.type = value;
        }
        if (key == 'weight') {
          settings.profile.options.weight = value;
        }
        if (key == 'maxspeed') {
          settings.profile.options.maxspeed = value;
        }
        if (key == 'hgvWeight') {
          settings.profile.options.hgvWeight = value;
        }
        if (key == 'width') {
          settings.profile.options.width = value;
        }
        if (key == 'height') {
          settings.profile.options.height = value;
        }
        if (key == 'axleload') {
          settings.profile.options.axleload = value;
        }
        if (key == 'length') {
          settings.profile.options.length = value;
        }
        if (key == 'fitness') {
          settings.profile.options.fitness = value;
        }
        if (key == 'steepness') {
          settings.profile.options.steepness = value;
        }
        if (key == 'surface') {
          settings.profile.options.surface = value;
        }
        if (key == 'incline') {
          settings.profile.options.incline = value;
        }
        if (key == 'curb') {
          settings.profile.options.curb = value;
        }
        if (key == 'method') {
          settings.profile.options.analysis_options.method = value;
        }
        if (key == 'minutes') {
          settings.profile.options.analysis_options.minutes = value;
        }
        if (key == 'interval') {
          settings.profile.options.analysis_options.interval = value;
        }
        if (key == 'routinglang') {
          user_options.routinglang = value;
        }
        if (key == 'units') {
          user_options.units = value;
        }
        if (key == 'ferry') {
          settings.profile.options.avoidables.ferry = orsParamsService.parseStringToBool(value);
        }
        if (key == 'unpaved') {
          settings.profile.options.avoidables.unpaved = orsParamsService.parseStringToBool(value);
        }
        if (key == 'paved') {
          settings.profile.options.avoidables.paved = orsParamsService.parseStringToBool(value);
        }
        if (key == 'fords') {
          settings.profile.options.avoidables.fords = orsParamsService.parseStringToBool(value);
        }
        if (key == 'highways') {
          settings.profile.options.avoidables.highways = orsParamsService.parseStringToBool(value);
        }
        if (key == 'tollroads') {
          settings.profile.options.avoidables.tollroads = orsParamsService.parseStringToBool(value);
        }
        if (key == 'tunnels') {
          settings.profile.options.avoidables.tunnels = orsParamsService.parseStringToBool(value);
        }
        if (key == 'tracks') {
          settings.profile.options.avoidables.tracks = orsParamsService.parseStringToBool(value);
        }
      });
      return {
        settings: settings,
        user_options: user_options
      };
    };
    orsParamsService.parseStringToBool = function(string) {
      if (string == "true")
        return true;
      return false;
    };
    return orsParamsService;
  }]);
  return {};
})();
