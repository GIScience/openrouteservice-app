angular.module('orsApp.cookies-service', ['ngCookies']).factory('orsCookiesFactory', ['$cookies', '$window', 'orsSettingsFactory',
    function($cookies, $window, orsSettingsFactory) {
        let orsCookiesFactory = {};
        orsCookiesFactory.getCookies = () => {
            let userOptions = $cookies.getObject('userOptions');
            var lang = $window.navigator.language || $window.navigator.userLanguage;
            console.log(lang);
            console.log(userOptions);
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
        return orsCookiesFactory;
    }
]);