var $__app_47_scripts_47_infrastructure_47_ors_45_error_45_service_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/infrastructure/ors-error-service.js";
  angular.module('orsApp.error-service', []).factory('orsErrorhandlerService', ['orsUtilsService', function(orsUtilsService) {
    var orsErrorhandlerService = {};
    orsErrorhandlerService.parseResponse = function(response) {
      var responseError = orsUtilsService.getElementsByTagNameNS(response, orsNamespaces.xls, 'ErrorList').length;
      if (parseInt(responseError) > 0) {
        return true;
      } else {
        return false;
      }
    };
    return orsErrorhandlerService;
  }]);
  return {};
})();
