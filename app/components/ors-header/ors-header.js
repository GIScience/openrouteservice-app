angular.module("orsApp.ors-header", []).component("orsHeader", {
  templateUrl: "components/ors-header/ors-header.html",
  controller: [
    "$rootScope",
    "$timeout",
    "$translate",
    "orsUtilsService",
    "orsSettingsFactory",
    "orsCookiesFactory",
    "lists",
    "ENV",
    function(
      $rootScope,
      $timeout,
      $translate,
      orsUtilsService,
      orsSettingsFactory,
      orsCookiesFactory,
      lists,
      ENV
    ) {
      let ctrl = this;

      ctrl.$onInit = () => {
        // uncomment for settings development
        // ctrl.showSettings = ctrl.showDev = ctrl.editEndpoints =  true;

        /* initialize endpoint urls from cookies */
        ctrl.currentOptions.env = orsCookiesFactory.getCookies().env;
        ctrl.setENV();
        ctrl.envBase = ctrl.currentOptions.env.directions
          .split("/")
          .slice(0, 3)
          .join("/");
        ctrl.backup = JSON.parse(JSON.stringify(ctrl.currentOptions.env));
        ctrl.extra_infos = {
          steepness: true,
          waytype: true,
          surface: true
        };
        ctrl.lists_extra_info = lists.extra_info;
        ctrl.getActiveProfile = orsSettingsFactory.getActiveProfile;
        ctrl.optionList = lists.userOptions;
        ctrl.changeExtras();
      };

      ctrl.changeExtras = () => {
        orsUtilsService.setExtraInformation(ctrl.extra_infos);
      };
      /**
       * Presets for setting Requests to a Local ORS server or directly to the ORS API
       * Overwrites the current ctrl.env object
       * @param {String} fill - name of the preset to apply
       */
      ctrl.presetEndpoints = fill => {
        if (fill === "local") {
          angular.forEach(Object.keys(ctrl.currentOptions.env), key => {
            ctrl.envBase = "http://localhost:8082/openrouteservice-4.5.0";
            ctrl.currentOptions.env[key] =
              key === "directions"
                ? ctrl.envBase + "/routes"
                : ctrl.envBase + "/" + key; // backend directions endpoint is called routes...
          });
        } else if (fill === "api") {
          angular.forEach(Object.keys(ctrl.currentOptions.env), key => {
            ctrl.envBase = "https://api.openrouteservice.org";
            ctrl.currentOptions.env[key] = ctrl.envBase + "/" + key;
          });
        } else if (fill === "default") {
          angular.forEach(Object.keys(ctrl.currentOptions.env), key => {
            ctrl.currentOptions.env[key] = ENV.default[key];
          });

          ctrl.envBase = ctrl.currentOptions.env.directions
            .split("/")
            .slice(0, 3)
            .join("/");
        }
      };

      /**
       * Set baseURL for every endpoint with value from input field
       * @param {String} value - the baseURL
       */
      ctrl.setDefaultValues = value => {
        angular.forEach(Object.keys(ctrl.currentOptions.env), key => {
          let pre = ctrl.currentOptions.env[key].split("/");
          ctrl.currentOptions.env[key] = [value, pre[pre.length - 1]].join("/");
        });
      };
      /**
       * Writes the endpoint settings to app/js/config.js to take immediate effect
       */
      ctrl.setENV = () => {
        ENV.directions = ctrl.currentOptions.env.directions;
        ENV.isochrones = ctrl.currentOptions.env.isochrones;
        ENV.geocode = ctrl.currentOptions.env.geocode;
        ENV.matrix = ctrl.currentOptions.env.matrix;
        ENV.pois = ctrl.currentOptions.env.pois;
        ENV.fuel = ctrl.currentOptions.env.fuel;
      };
      /**
       * Informs the user about changed Endpoints
       */
      ctrl.showPopup = () => {
        alert(`Endpoints have been changed to
geocode:     ${ENV.geocode}
directions:   ${ENV.directions}
isochrones:  ${ENV.isochrones}
matrix:        ${ENV.matrix}
pois:            ${ENV.pois}
fuel:            ${ENV.fuel}`);
      };
      /**
       * Save Endpoints to cookies
       */
      ctrl.saveEndpoints = () => {
        if (ctrl.saveCookies)
          orsCookiesFactory.setCookieUserOptions(ctrl.currentOptions);
      };
      /**
       * Reset all endpoint URLs to their initial state
       */
      ctrl.resetEndpoints = () => {
        ctrl.currentOptions.env = JSON.parse(JSON.stringify(ctrl.backup));
        ctrl.envBase = ctrl.currentOptions.env.directions
          .split("/")
          .slice(0, 3)
          .join("/");
        if (ctrl.saveCookies)
          orsCookiesFactory.setCookieUserOptions(ctrl.currentOptions);
      };

      /**
       * Save the apikey for this session to ENV
       */
      ctrl.saveKey = () => {
        ENV.key = ctrl.apikey;
      };

      /** subscription to settings, when permalink is used with lang params
             we have to update language settings. This is called before panel settings
             object is defined, this is why we have two subscriptions */
      orsSettingsFactory.userOptionsSubject.subscribe(settings => {
        ctrl.currentOptions = settings;
        $translate.use(ctrl.currentOptions.language);
      });
      ctrl.changeOptions = setting => {
        if (setting === "language")
          $translate.use(ctrl.currentOptions.language);
        orsSettingsFactory.setUserOptions(ctrl.currentOptions);
        // if endpoints should not be saved to cookies pass current options without them
        if (!ctrl.saveCookies) {
          let withoutEnv = JSON.parse(JSON.stringify(ctrl.currentOptions));
          delete withoutEnv.env;
          orsCookiesFactory.setCookieUserOptions(withoutEnv);
        } else {
          orsCookiesFactory.setCookieUserOptions(ctrl.currentOptions);
        }
        orsUtilsService.parseSettingsToPermalink(
          orsSettingsFactory.getSettings(),
          orsSettingsFactory.getUserOptions()
        );
        let payload = {
          options: ctrl.currentOptions,
          setting: setting
        };
        $rootScope.$broadcast("changeOptions", payload);
        // TODO: Reload site if site language is changed, we need this due to translations
        // update slider units!
        $timeout(() => {
          $rootScope.$broadcast("rzSliderForceRender");
        });
      };
    }
  ],
  bindings: {}
});
