angular.module('orsApp.request-service', []).factory('orsRequestService', ['$http', 'orsUtilsService', 'orsErrorhandlerService', 'orsSettingsFactory',
    function($http, orsUtilsService, orsErrorhandlerService, orsSettingsFactory) {
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
        orsRequestService.readGeoJSON = function(JSONurl) {
            return $http({
                method: 'GET',
                url: JSONurl
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
        orsRequestService.getAddress = function(pos, idx, init) {
            var requestData = orsUtilsService.reverseXml(pos);
            orsRequestService.geocode(requestData).then(function(response) {
                const data = orsUtilsService.domParser(response.data);
                const error = orsErrorhandlerService.parseResponse(data);
                if (!error) {
                    const addressData = orsUtilsService.processAddresses(data, true);
                    orsSettingsFactory.updateWaypointAddress(idx, addressData[0].address, init);
                } else {
                    console.log('Not able to find address!');
                }
            }, function(response) {
                console.log('It was not possible to get the address of the current waypoint. Sorry for the inconvenience!');
            });
        };
        return orsRequestService;
    }
]);