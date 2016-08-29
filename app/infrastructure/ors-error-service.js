angular.module('orsApp').factory('orsErrorhandlerService', ['orsUtilsService',
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
        /**
         * Writes a message if an error occurs and displays it on the client with a modal
         * @param {String} Error message to be displayed
         */
        orsErrorhandlerService.generalErrors = function(errorMsg) {
            $('#error-modal').openModal();
            return errorMsg
        };
        return orsErrorhandlerService;
    }
]);