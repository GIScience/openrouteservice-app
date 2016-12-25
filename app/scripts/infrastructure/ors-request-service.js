var $__app_47_scripts_47_infrastructure_47_ors_45_request_45_service_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/infrastructure/ors-request-service.js";
  angular.module('orsApp.request-service', []).factory('orsRequestService', ['$q', '$http', 'orsUtilsService', 'orsErrorhandlerService', function($q, $http, orsUtilsService, orsErrorhandlerService) {
    var orsRequestService = {};
    orsRequestService.geocodeRequests = {};
    orsRequestService.geocodeRequests.requests = [];
    orsRequestService.geocodeRequests.updateRequest = function(request, idx) {
      if (typeof orsRequestService.geocodeRequests.requests[idx] === 'undefined') {
        orsRequestService.geocodeRequests.requests[idx] = request;
      } else {
        orsRequestService.geocodeRequests.requests[idx].cancel("Cancel last request");
        orsRequestService.geocodeRequests.requests[idx] = request;
      }
    };
    orsRequestService.geocodeRequests.removeRequest = function(idx) {
      orsRequestService.geocodeRequests.requests[idx].cancel("Cancel last request");
      orsRequestService.geocodeRequests.requests.splice(idx, 1);
    };
    orsRequestService.geocodeRequests.clear = function() {
      console.info(orsRequestService.geocodeRequests.requests);
      if (orsRequestService.geocodeRequests.requests.length > 0) {
        var $__4 = true;
        var $__5 = false;
        var $__6 = undefined;
        try {
          for (var $__2 = void 0,
              $__1 = (orsRequestService.geocodeRequests.requests)[Symbol.iterator](); !($__4 = ($__2 = $__1.next()).done); $__4 = true) {
            var req = $__2.value;
            {
              req.cancel("Cancel last request");
            }
          }
        } catch ($__7) {
          $__5 = true;
          $__6 = $__7;
        } finally {
          try {
            if (!$__4 && $__1.return != null) {
              $__1.return();
            }
          } finally {
            if ($__5) {
              throw $__6;
            }
          }
        }
        orsRequestService.geocodeRequests.requests = [];
      }
    };
    orsRequestService.geocode = function(requestData) {
      var url = orsNamespaces.services.geocoding;
      var canceller = $q.defer();
      var cancel = function(reason) {
        canceller.resolve(reason);
      };
      var promise = $http.post(url, requestData, {timeout: canceller.promise}).then(function(response) {
        return response.data;
      });
      return {
        promise: promise,
        cancel: cancel
      };
    };
    orsRequestService.processResponse = function(response) {
      var data = response.data;
      return data;
    };
    return orsRequestService;
  }]);
  return {};
})();
