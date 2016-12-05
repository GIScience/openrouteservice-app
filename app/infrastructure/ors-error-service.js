angular.module('orsApp.error-service', []).factory('orsErrorhandlerService', ['orsUtilsService',
    function(orsUtilsService) {
        /**
         * Checks if response contains errors
         * @param {String} requestData XML for request payload
         */
        var orsErrorhandlerService = {};
        orsErrorhandlerService.parseResponse = function(response) {
            var responseError = orsUtilsService.getElementsByTagNameNS(response, namespaces.xls, 'ErrorList').length;
            if (parseInt(responseError) > 0) {
                //if error exists return true
                return true;
            } else {
                return false;
            }
        };
        return orsErrorhandlerService;
    }
]);