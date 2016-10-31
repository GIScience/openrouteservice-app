angular.module('orsApp.route-processing-service', []).factory('orsRouteProcessingService', ['$http', 'orsErrorhandlerService',
    function($http, orsErrorhandlerService) {
        /**
         * Requests geocoding from ORS backend
         * @param {String} requestData: XML for request payload
         */
        var orsRouteProcessingService = {};
        /**
         * Requests route from ORS backend
         * @param {String} requestData: XML for request payload
         */
        orsRouteProcessingService.fetchRoute = function(requestData) {
            var url = namespaces.services.routing;
            return $http({
                method: 'POST',
                url: url,
                data: requestData
            });
        };
        orsRouteProcessingService.parseRoute = function(response) {

        };
        return orsRouteProcessingService;
    }
]);