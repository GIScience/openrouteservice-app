angular.module('orsApp.cookies-service', ['ngCookies'])
    .factory('orsCookiesFactory', ['$cookies', '$window', '$translate', 'orsSettingsFactory', 'lists', ($cookies, $window, $translate, orsSettingsFactory, lists) => {
        let orsCookiesFactory = {};
        orsCookiesFactory.getCookies = () => {
            let routinglang, language, units;
            let cookieUserOptions = $cookies.getObject('userOptions') ? $cookies.getObject('userOptions') : {};
            console.warn(cookieUserOptions)
            if ('language' in cookieUserOptions) {
                language = cookieUserOptions.language;
            } else {
                const locale = orsCookiesFactory.getLocale();
                // if language is not available in ngtranslate use default
                if ($translate.getAvailableLanguageKeys()
                    .indexOf(locale) == -1) {
                    language = lists.userOptions.languages.default;
                } else {
                    language = locale;
                }
            }
            if ('routinglang' in cookieUserOptions) {
                routinglang = cookieUserOptions.routinglang;
            } else {
                routinglang = lists.userOptions.routinglanguages.default;
            }
            if ('units' in cookieUserOptions) {
                units = cookieUserOptions.units;
            } else {
                units = lists.userOptions.units.default;
            }
            let currentUserOptions = {
                language: language,
                routinglang: routinglang,
                units: units
            };
            return currentUserOptions;
        };
        orsCookiesFactory.getLocale = () => {
            // get localization
            let locale = $window.navigator.language || $window.navigator.userLanguage;
            locale = locale.split('-');
            if (locale.length == 1) locale = locale[0] + '-' + locale[0].toUpperCase();
            else locale = locale[0] + '-' + locale[1].toUpperCase();
            return locale;
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