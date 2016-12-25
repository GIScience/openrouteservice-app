var $__app_47_scripts_47_components_47_ors_45_panel_45_routing_47_ors_45_panel_45_routing_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-routing/ors-panel-routing.js";
  angular.module('orsApp.ors-panel-routing', ['orsApp.ors-waypoints', 'orsApp.ors-profiles-options', 'orsApp.ors-options', 'orsApp.ors-summary', 'orsApp.ors-instructions']).component('orsRoute', {
    templateUrl: 'scripts/components/ors-panel-routing/ors-panel-routing.html',
    controller: ['orsSettingsFactory', 'orsParamsService', 'orsUtilsService', 'orsCookiesFactory', function(orsSettingsFactory, orsParamsService, orsUtilsService, orsCookiesFactory) {
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
          console.log('importing routing settings..');
          ctrl.routeParams = next.params;
          orsSettingsFactory.initWaypoints(2);
          var importedParams = orsParamsService.importSettings(ctrl.routeParams);
          orsSettingsFactory.setSettings(importedParams.settings);
          angular.forEach(importedParams.settings.waypoints, function(wp, idx) {
            if (wp._latlng !== false)
              orsSettingsFactory.getAddress(wp._latlng, idx, true);
          });
          orsSettingsFactory.setUserOptions(orsCookiesFactory.getCookies());
          orsSettingsFactory.setUserOptions(importedParams.user_options);
        }
        orsSettingsFactory.updateWaypoints();
        ctrl.activeProfile = orsSettingsFactory.getActiveProfile().type;
        ctrl.activeSubgroup = ctrl.profiles[ctrl.activeProfile].subgroup;
        console.info(ctrl.activeProfile, ctrl.activeSubgroup);
        ctrl.shouldDisplayRouteDetails = false;
        orsUtilsService.parseSettingsToPermalink(orsSettingsFactory.getSettings(), orsSettingsFactory.getUserOptions());
      };
      ctrl.$routerOnReuse = function(next, prev) {};
      ctrl.showInstructions = function() {
        ctrl.shouldDisplayRouteDetails = ctrl.shouldDisplayRouteDetails == true ? false : true;
      };
    }],
    require: {parent: '^orsSidebar'}
  });
  return {};
})();
