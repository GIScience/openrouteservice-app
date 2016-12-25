var $__app_47_scripts_47_components_47_ors_45_panel_45_accessibilityanalysis_47_ors_45_panel_45_accessibilityanalysis_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-accessibilityanalysis/ors-panel-accessibilityanalysis.js";
  angular.module('orsApp.ors-panel-accessibilityanalysis', ['orsApp.ors-aa-controls', 'orsApp.ors-aa-waypoints', 'orsApp.ors-aa-sliders']).component('orsAnalysis', {
    templateUrl: 'scripts/components/ors-panel-accessibilityanalysis/ors-panel-accessibilityanalysis.html',
    controller: ['$scope', '$location', 'orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsErrorhandlerService', 'orsParamsService', 'orsCookiesFactory', 'orsMapFactory', function($scope, $location, orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService, orsCookiesFactory, orsMapFactory) {
      var ctrl = this;
      ctrl.$routerCanReuse = function(next, prev) {
        return next.urlPath === prev.urlPath;
      };
      ctrl.$onInit = function() {
        ctrl.profiles = lists.profiles;
      };
      ctrl.$routerOnActivate = function(next) {
        orsSettingsFactory.isInitialized = true;
        orsSettingsFactory.updateNgRoute(next.urlPath);
        if (orsSettingsFactory.getWaypoints().length == 0) {
          ctrl.routeParams = next.params;
          orsSettingsFactory.initWaypoints(1);
          var importedParams = orsParamsService.importSettings(ctrl.routeParams, false);
          orsSettingsFactory.setSettings(importedParams.settings);
          angular.forEach(importedParams.settings.waypoints, function(wp, idx) {
            orsSettingsFactory.getAddress(wp._latlng, idx, true);
          });
          orsSettingsFactory.setUserOptions(orsCookiesFactory.getCookies());
          orsSettingsFactory.setUserOptions(importedParams.user_options);
        }
        orsSettingsFactory.updateWaypoints();
        ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
        ctrl.activeProfile = orsSettingsFactory.getActiveProfile().type;
        ctrl.activeSubgroup = ctrl.profiles[ctrl.activeProfile].subgroup;
        orsUtilsService.parseSettingsToPermalink(orsSettingsFactory.getSettings(), orsSettingsFactory.getUserOptions());
      };
      ctrl.$routerOnReuse = function(next, prev) {};
    }],
    require: {parent: '^orsSidebar'}
  });
  return {};
})();
