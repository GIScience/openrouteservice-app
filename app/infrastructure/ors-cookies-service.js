angular.module('orsApp.cookies-service', ['ngCookies']).factory('orsCookiesFactory', ['$cookies', 'orsSettingsFactory',
    function($cookies, orsSettingsFactory) {
        let orsCookiesFactory = {};
        console.log("test");
        $cookies.put('language', 'de');
        console.log($cookies.get('language'));
        let userOptions = $cookies.getObject('userOptions');
        if (userOptions !== undefined) {
            orsSettingsFactory.setUserOptions(userOptions);
        }
        console.log(userOptions);
        orsCookiesFactory.cookieswap = () => {
            $cookies.put('language', 'de');
            console.log($cookies.get('language'));
        }
        orsCookiesFactory.setCookieUserOptions = (options) => {
            console.dir(options);
            console.log(JSON.stringify(options));
            $cookies.putObject('userOptions', options);
        }
        return orsCookiesFactory;
    }
]);