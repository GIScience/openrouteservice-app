angular.module('orsApp.request-service', []).factory('orsRequestService', ['$q', '$http', 'orsUtilsService', 'orsErrorhandlerService',
    function($q, $http, orsUtilsService, orsErrorhandlerService) {
        /**
         * Requests geocoding from ORS backend
         * @param {String} requestData: XML for request payload
         */
        let orsRequestService = {};
        orsRequestService.geocodeRequests = {};
        orsRequestService.geocodeRequests.requests = [];
        /** 
         * Updates request if new one is fired
         * @param {Object} request: xhr request
         * @param {number} idx: WP idx
         */
        orsRequestService.geocodeRequests.updateRequest = (request, idx) => {
            if (typeof orsRequestService.geocodeRequests.requests[idx] === 'undefined') {
                orsRequestService.geocodeRequests.requests[idx] = request;
            } else {
                orsRequestService.geocodeRequests.requests[idx].cancel("Cancel last request");
                orsRequestService.geocodeRequests.requests[idx] = request;
            }
        };
        /** 
         * Removes requests from the que 
         * @param {number} idx: WP idx
         */
        orsRequestService.geocodeRequests.removeRequest = (idx) => {
            orsRequestService.geocodeRequests.requests[idx].cancel("Cancel last request");
            orsRequestService.geocodeRequests.requests.splice(idx, 1);
        };
        /** clears all requests */
        orsRequestService.geocodeRequests.clear = () => {
            console.info(orsRequestService.geocodeRequests.requests)
            if (orsRequestService.geocodeRequests.requests.length > 0) {
                for (let req of orsRequestService.geocodeRequests.requests) {
                    req.cancel("Cancel last request");
                }
                orsRequestService.geocodeRequests.requests = [];
            }
        };
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
        
        return orsRequestService;
    }
]);