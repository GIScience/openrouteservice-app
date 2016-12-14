angular.module('orsApp.request-service', []).factory('orsRequestService', ['$q', '$http', 'orsUtilsService', 'orsErrorhandlerService', 'orsSettingsFactory',
    function($q, $http, orsUtilsService, orsErrorhandlerService, orsSettingsFactory) {
        /**
         * Requests geocoding from ORS backend
         * @param {String} requestData: XML for request payload
         */
        let orsRequestService = {};
        orsRequestService.geocodeRequests = [];
        orsRequestService.geocode = function(requestData) {
            var url = namespaces.services.geocoding;
            var canceller = $q.defer();
            var cancel = function(reason) {
                canceller.resolve(reason);
            };
            var promise = $http.post(url, requestData, {
                timeout: canceller.promise
            }).then(function(response) {
                return response.data;
            });
            return {
                promise: promise,
                cancel: cancel
            };
        };
        /**
         * Processes response
         * @param {Object} response: response data
         */
        orsRequestService.processResponse = function(response) {
            var data = response.data;
            return data;
        };
        /** 
         * Removes requests from the que 
         * @param {number} idx: WP idx
         */
        orsRequestService.removeRequest = (idx) => {
            orsRequestService.geocodeRequests.splice(idx, 1);
        };
        /** 
         * Cancels or adds request to que
         * @param {Object} request: xhr request
         * @param {number} idx: WP idx
         
         */
        orsRequestService.clearRequests = (request, idx) => {
            if (typeof orsRequestService.geocodeRequests[idx] === 'undefined') {
                orsRequestService.geocodeRequests[idx] = request;
            } else {
                orsRequestService.geocodeRequests[idx].cancel("Cancel last request");
                orsRequestService.geocodeRequests[idx] = request;
            }
        };
        orsRequestService.getAddress = function(pos, idx, init) {
            const latLngString = orsUtilsService.parseLatLngString(pos);
            orsSettingsFactory.updateWaypointAddress(idx, latLngString, init);
            const payload = orsUtilsService.reverseXml(pos);
            const request = orsRequestService.geocode(payload);
            orsRequestService.clearRequests(request, idx);
            request.promise.then(function(response) {
                const data = orsUtilsService.domParser(response);
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