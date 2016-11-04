angular.module('orsApp.cookies-service', ['ngCookies']).factory('orsCookiesFactory', ['$cookies', 'orsSettingsFactory',
    function($cookies, orsSettingsFactory) {
        let orsCookiesFactory = {};
        let userOptions = $cookies.getObject('userOptions');
        if (userOptions !== undefined) {
            orsSettingsFactory.setUserOptions(userOptions);
        }
        /** 
         * Sets user specific options in cookies (language and units)
         * @param {Object} options- Consists of routing instruction language and units km/mi
         */
        orsCookiesFactory.setCookieUserOptions = (options) => {
            $cookies.putObject('userOptions', options);
        }
        return orsCookiesFactory;
    }
]);