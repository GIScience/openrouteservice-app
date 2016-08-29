angular.module('orsApp').factory('orsRequestService', ['$http',
    function($http) {
        /**
         * Requests geocoding from ORS backend
         * @param {String} requestData: XML for request payload
         */
        var orsRequestService = {};

        orsRequestService.geocode = function(requestData) {
            var url = namespaces.services.geocoding;
            return $http({
                method: 'POST',
                url: url,
                data: requestData
            });
        };
        /**
         * Requests route from ORS backend
         * @param {String} requestData: XML for request payload
         */
        orsRequestService.fetchRoute = function(requestData) {
            var url = namespaces.services.routing;
            return $http({
                method: 'POST',
                url: url,
                data: requestData
            });
        };
        /**
         * Requests GeoJSON file
         * @param {String} JSONurl: location of GeoJSON file for request payload
         */
        orsRequestService.readGeoJSON = function(JSONurl){
            return $http({
                method:'GET',
                url:JSONurl
            });
        };
        /**
         * Processes response
         * @param {Object} response: response data
         */
        orsRequestService.processResponse = function(response) {
            var data = response.data;
            return data;
        };

        return orsRequestService;
    }
]);