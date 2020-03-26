angular
  .module("orsApp.cookies-service", ["ngCookies"])
  .factory("orsCookiesFactory", [
    "$cookies",
    "$window",
    "$translate",
    "orsSettingsFactory",
    "lists",
    "ENV",
    ($cookies, $window, $translate, orsSettingsFactory, lists, ENV) => {
      let orsCookiesFactory = {};
      orsCookiesFactory.getCookies = () => {
        let routinglang,
          language,
          units,
          showHeightgraph,
          randomIsoColor,
          distanceMarkers,
          env,
          alternativeRoutes;
        let cookieUserOptions = $cookies.getObject("userOptions")
          ? $cookies.getObject("userOptions")
          : {};
        if ("language" in cookieUserOptions) {
          language = cookieUserOptions.language;
        } else {
          const locale = orsCookiesFactory.getLocale();
          // if language is not available in ngtranslate use default
          if ($translate.getAvailableLanguageKeys().indexOf(locale) === -1) {
            language = lists.userOptions.languages.default;
          } else {
            language = locale;
          }
        }
        if ("routinglang" in cookieUserOptions) {
          routinglang = cookieUserOptions.routinglang;
        } else {
          routinglang = lists.userOptions.routinglanguages.default;
        }
        if ("units" in cookieUserOptions) {
          units = cookieUserOptions.units;
        } else {
          units = lists.userOptions.units.default;
        }
        if ("showHeightgraph" in cookieUserOptions) {
          showHeightgraph = cookieUserOptions.showHeightgraph;
        } else {
          showHeightgraph = angular.element($window).width() > 720;
        }
        if ("randomIsoColor" in cookieUserOptions) {
          randomIsoColor = cookieUserOptions.randomIsoColor;
        } else {
          randomIsoColor = lists.userOptions.randomIsoColor.default;
        }
        if ("distanceMarkers" in cookieUserOptions) {
          distanceMarkers = cookieUserOptions.distanceMarkers;
        } else {
          distanceMarkers = lists.userOptions.distanceMarkers.default;
        }
        if ("alternativeRoutes" in cookieUserOptions) {
          alternativeRoutes = cookieUserOptions.alternativeRoutes;
        } else {
          alternativeRoutes = lists.userOptions.alternativeRoutes.default;
        }
        // save a copy of the default endpoint setup to ENV once
        if (typeof ENV.default === "undefined") {
          ENV.default = {
            geocode: JSON.parse(JSON.stringify(ENV)).geocode,
            directions: JSON.parse(JSON.stringify(ENV)).directions,
            isochrones: JSON.parse(JSON.stringify(ENV)).isochrones,
            matrix: JSON.parse(JSON.stringify(ENV)).matrix,
            pois: JSON.parse(JSON.stringify(ENV)).pois,
            fuel: JSON.parse(JSON.stringify(ENV)).fuel
          };
        }
        if ("env" in cookieUserOptions) {
          env = cookieUserOptions.env;
        } else {
          env = {
            geocode: ENV.geocode,
            directions: ENV.directions,
            isochrones: ENV.isochrones,
            matrix: ENV.matrix,
            pois: ENV.pois,
            fuel: ENV.fuel
          };
        }
        return {
          language: language,
          routinglang: routinglang,
          units: units,
          showHeightgraph: showHeightgraph,
          randomIsoColor: randomIsoColor,
          distanceMarkers: distanceMarkers,
          env: env,
          alternativeRoutes: alternativeRoutes
        };
      };
      orsCookiesFactory.getLocale = () => {
        // get localization
        let locale = $window.navigator.language;
        locale = locale.split("-");
        if (locale.length === 1)
          locale = locale[0] + "-" + locale[0].toUpperCase();
        else locale = locale[0] + "-" + locale[1].toUpperCase();
        return locale;
      };
      /**
       * Sets user specific options in cookies (language and units)
       * @param {Object} options - Consists of routing instruction language and units km/mi
       */
      orsCookiesFactory.setCookieUserOptions = options => {
        $cookies.putObject("userOptions", options);
      };
      /**
       * Sets map specific options in cookies
       * @param {Object} options - Consists of map options
       */
      orsCookiesFactory.setMapOptions = options => {
        $cookies.putObject("mapOptions", options);
      };
      /**
       * Gets map settings from cookies
       */
      orsCookiesFactory.getMapOptions = () => {
        return $cookies.getObject("mapOptions");
      };
      return orsCookiesFactory;
    }
  ]);
