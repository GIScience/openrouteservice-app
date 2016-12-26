angular.module('orsApp.cookies-service', ['ngCookies']).factory('orsCookiesFactory', ['$cookies', '$window', 'orsSettingsFactory',
    ($cookies, $window, orsSettingsFactory) => {
        let orsCookiesFactory = {};
        orsCookiesFactory.getCookies = () => {
            let userOptions = $cookies.getObject('userOptions');
            var lang = $window.navigator.language || $window.navigator.userLanguage;
            if (userOptions === undefined) userOptions = {
                language: lang
            };
            return userOptions;
        };
        /** 
         * Sets user specific options in cookies (language and units)
         * @param {Object} options- Consists of routing instruction language and units km/mi
         */
        orsCookiesFactory.setCookieUserOptions = (options) => {
            $cookies.putObject('userOptions', options);
        };
        /** 
         * Sets map specific options in cookies
         * @param {Object} options - Consists of map options
         */
        orsCookiesFactory.setMapOptions = (options) => {
            $cookies.putObject('mapOptions', options);
        };
        /** 
         * Gets map settings from cookies
         */
        orsCookiesFactory.getMapOptions = () => {
            return $cookies.getObject('mapOptions');
        };
        return orsCookiesFactory;
    }
]);