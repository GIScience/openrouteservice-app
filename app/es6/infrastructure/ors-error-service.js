angular.module('orsApp.error-service', []).factory('orsErrorhandlerService', ['orsUtilsService',
    (orsUtilsService) => {
        /**
         * Checks if response contains errors
         * @param {String} requestData XML for request payload
         */
        var orsErrorhandlerService = {};
        orsErrorhandlerService.parseResponse = (response) => {
            var responseError = orsUtilsService.getElementsByTagNameNS(response, orsNamespaces.xls, 'ErrorList').length;
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