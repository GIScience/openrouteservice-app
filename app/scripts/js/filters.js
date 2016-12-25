var $__app_47_scripts_47_js_47_filters_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/js/filters.js";
  angular.module('orsApp.ors-filters', []).filter('duration', function() {
    return function(input) {
      var date = new Date(input);
      var hours = date.getUTCHours();
      hours = hours.toString().length == 1 ? ("0" + hours) : hours;
      var minutes = date.getUTCMinutes();
      minutes = minutes.toString().length == 1 ? ("0" + minutes) : minutes;
      date = hours + ":" + minutes;
      return date;
    };
  }).filter('distance', ['orsSettingsFactory', function(orsSettingsFactory) {
    function distance(input) {
      input = parseInt(input);
      var units = orsSettingsFactory.getUserOptions().units;
      if (units == 'km') {
        units = 'm';
        if (input > 1000) {
          input = (input / 1000).toFixed(2);
          units = 'km';
        } else {
          input = input.toFixed();
        }
      } else if (units == 'mi') {
        input = (input * 0.000621371192).toFixed(2);
        if (input < 0.5 && input > 0.2) {
          input = (input * 1760).toFixed();
          units = 'yd';
        } else if (input <= 0.1) {
          input = (input * 1760 * 3).toFixed();
          units = 'ft';
        }
      }
      input = input + units;
      return input;
    }
    distance.$stateful = true;
    return distance;
  }]);
  return {};
})();
