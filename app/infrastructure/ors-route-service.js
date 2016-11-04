angular.module('orsApp.route-processing-service', []).factory('orsRouteService', ['$http', 'orsErrorhandlerService',
    function($http, orsErrorhandlerService) {
        /**
         * Requests geocoding from ORS backend
         * @param {String} requestData: XML for request payload
         */
        let orsRouteService = {};
        /**
         * Requests route from ORS backend
         * @param {String} requestData: XML for request payload
         */
        orsRouteService.fetchRoute = function(requestData) {
            var url = namespaces.services.routing;
            return $http({
                method: 'POST',
                url: url,
                data: requestData
            });
        };
        orsRouteService.parseRouteJSON = function(response) {
           console.warn(response)
           // TODO!!!
        };
        return orsRouteService;
    }
]);