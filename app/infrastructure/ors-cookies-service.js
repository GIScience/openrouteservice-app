angular.module('orsApp.cookies-service', ['ngCookies']).factory('orsCookiesFactory', ['$cookies', 'orsSettingsFactory',
    function($cookies, orsSettingsFactory) {
        let orsCookiesFactory = {};
        orsCookiesFactory.getCookies = () => {
                let userOptions = $cookies.getObject('userOptions');
                console.log("cookies-service getting cookies");
                if (userOptions !== undefined) {
                    return userOptions;
                }
                return undefined;
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