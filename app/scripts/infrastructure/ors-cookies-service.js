var $__app_47_scripts_47_infrastructure_47_ors_45_cookies_45_service_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/infrastructure/ors-cookies-service.js";
  angular.module('orsApp.cookies-service', ['ngCookies']).factory('orsCookiesFactory', ['$cookies', '$window', 'orsSettingsFactory', function($cookies, $window, orsSettingsFactory) {
    var orsCookiesFactory = {};
    orsCookiesFactory.getCookies = function() {
      var userOptions = $cookies.getObject('userOptions');
      var lang = $window.navigator.language || $window.navigator.userLanguage;
      if (userOptions === undefined)
        userOptions = {language: lang};
      return userOptions;
    };
    orsCookiesFactory.setCookieUserOptions = function(options) {
      $cookies.putObject('userOptions', options);
    };
    orsCookiesFactory.setMapOptions = function(options) {
      $cookies.putObject('mapOptions', options);
    };
    orsCookiesFactory.getMapOptions = function() {
      return $cookies.getObject('mapOptions');
    };
    return orsCookiesFactory;
  }]);
  return {};
})();
