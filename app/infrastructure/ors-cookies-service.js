angular.module('orsApp.cookies-service', ['ngCookies']).factory('orsCookiesFactory', ['$cookies', '$window', 'orsSettingsFactory', 'lists', ($cookies, $window, orsSettingsFactory, lists) => {
    let orsCookiesFactory = {};
    orsCookiesFactory.getCookies = () => {
        let userOptions = $cookies.getObject('userOptions');
        let lang = $window.navigator.language || $window.navigator.userLanguage;
        lang = lang.split('-');
        if (lang.length == 1) lang = lang[0] + '-' + lang[0].toUpperCase();
        else lang = lang[0] + '-' + lang[1].toUpperCase();
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
}]);