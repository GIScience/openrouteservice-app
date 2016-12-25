var $__app_47_scripts_47_js_47_app_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/js/app.js";
  var orsApp = angular.module('orsApp', ['orsApp.ors-nav', 'orsApp.ors-panel-routing', 'orsApp.ors-panel-accessibilityanalysis', 'orsApp.ors-header', 'orsApp.ors-modal', 'ui.sortable', 'orsApp.error-service', 'orsApp.map-service', 'orsApp.objects-service', 'orsApp.params-service', 'orsApp.request-service', 'orsApp.settings-service', 'orsApp.utils-service', 'orsApp.route-service', 'orsApp.cookies-service', 'orsApp.aa-service', 'orsApp.GeoFileHandler-service', 'ngCookies', 'rzModule', 'ngAnimate', 'ngSanitize', 'pascalprecht.translate', 'angular-loading-bar', '720kb.tooltips', 'orsApp.ors-filters', 'orsApp.ors-route-extras']).config(function($locationProvider, $httpProvider) {
    var ak = '?api_key=0894982ba55b12d3d3e4abd28d1838f2';
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push(function($q, $document) {
      return {
        'request': function(config) {
          for (var k in orsNamespaces.services) {
            if (config.url == orsNamespaces.services[k]) {
              config.url = config.url + ak;
            }
          }
          return config || $q.when(config);
        },
        'response': function(response) {
          return response;
        }
      };
    });
  }).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>';
  }]).config(['tooltipsConfProvider', function configConf(tooltipsConfProvider) {
    tooltipsConfProvider.configure({
      'smart': true,
      'size': 'small',
      'speed': 'fast',
      'tooltipTemplateUrlCache': true
    });
  }]).config(['$translateProvider', '$windowProvider', function($translateProvider, $windowProvider) {
    var $window = $windowProvider.$get();
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.useStaticFilesLoader({
      prefix: 'languages/',
      suffix: '.json'
    });
    $translateProvider.preferredLanguage('en-US');
  }]).controller('RootController', function(orsSettingsFactory, orsObjectsFactory, orsMapFactory, $route) {
    var ctrl = this;
    ctrl.myOrsMap = orsMapFactory.initMapA("map");
  });
  Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
    return this;
  };
  return {};
})();
