/*|-----------------------------------------------------------------------------------
 *|                                                     University of Heidelberg
 *|   _____ _____  _____      _                         Department of Geography
 *|  / ____|_   _|/ ____|    (_)                        Chair of GIScience
 *| | |  __  | | | (___   ___ _  ___ _ __   ___ ___     (C) 2018
 *| | | |_ | | |  \___ \ / __| |/ _ \ '_ \ / __/ _ \
 *| | |__| |_| |_ ____) | (__| |  __/ | | | (_|  __/    Berliner Strasse 45
 *|  \_____|_____|_____/ \___|_|\___|_| |_|\___\___|    D-69120 Heidelberg, Germany
 *|                                                     http://www.giscience.uni-hd.de
 *|------------------------------------------------------------------------------------*/
/**
 * @author: Amandus Butzer, amandus@openrouteservice.org, Timothy Ellersiek, timothy@openrouteservice.org
 * @version: 0.3.9
 */
(function(searchString, position) {
  fetchData().then(bootstrapApplication);

  function fetchData() {
    var initInjector = angular.injector(["ng"]);
    var $http = initInjector.get("$http");
    return $http.get("weathercheck.txt").then(
      function(response) {
        angular.module("orsApp").value("weathercheck", response.data);
      },
      function(errorResponse) {
        angular.module("orsApp").value("weathercheck", "");
      }
    );
  }

  function bootstrapApplication() {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ["orsApp"]);
    });
  }
  let orsApp = angular
    .module("orsApp", [
      "orsApp.ors-nav",
      "orsApp.ors-panel-routing",
      "orsApp.ors-panel-accessibilityanalysis",
      "orsApp.ors-header",
      "orsApp.ors-error",
      "orsApp.ors-loading",
      "orsApp.ors-modal",
      "ui.sortable",
      "orsApp.messaging-service",
      "orsApp.map-service",
      "orsApp.objects-service",
      "orsApp.locations-service",
      "orsApp.fuel-service",
      "orsApp.params-service",
      "orsApp.request-service",
      "orsApp.settings-service",
      "orsApp.utils-service",
      "orsApp.route-service",
      "orsApp.landmark-service",
      "orsApp.cookies-service",
      "orsApp.aa-service",
      "orsApp.apikey-factory",
      "orsApp.GeoFileHandler-service",
      "ngCookies",
      "rzModule",
      "ngAnimate",
      "ngSanitize",
      "pascalprecht.translate",
      "angular-loading-bar",
      "720kb.tooltips",
      "orsApp.ors-filters",
      "orsApp.ors-route-extras",
      "config",
      "ngclipboard"
    ])
    .config(function($locationProvider, $httpProvider) {
      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push(function(
        $q,
        $document,
        $injector,
        lists,
        orsNamespaces,
        ENV,
        orsApikeyFactory,
        weathercheck
      ) {
        return {
          request: function(config) {
            const apiKey =
              ENV.key !== undefined
                ? ENV.key
                : orsApikeyFactory.getApiKey() === undefined
                  ? weathercheck
                  : orsApikeyFactory.getApiKey();
            let ak = "?api_key=" + apiKey;
            if (
              config.url === ENV.geocode + "/search" ||
              config.url === ENV.geocode + "/reverse" ||
              config.url === ENV.directions ||
              config.url === ENV.isochrones ||
              config.url === ENV.pois ||
              config.url === ENV.matrix ||
              config.url === ENV.mapsurfer ||
              config.url === ENV.fuel
            ) {
              config.url += ak;
            }
            return config || $q.when(config);
          },
          response: function(response) {
            return response;
          },
          requestError: function(rejection) {
            return $q.reject(rejection);
          },
          responseError: function(rejection) {
            // do something on error
            let messagingService = $injector.get("orsMessagingService");
            switch (rejection.status) {
              case 400:
                messagingService.messageSubject.onNext({
                  text:
                    "Code " +
                    rejection.data.error.code +
                    ": " +
                    rejection.data.error.message,
                  color: 0
                });
                break;
              case 401:
                messagingService.messageSubject.onNext({
                  text:
                    "Code " +
                    rejection.data.error.code +
                    ": " +
                    rejection.data.error.message,
                  color: 0
                });
                break;
              case 403:
                messagingService.messageSubject.onNext({
                  text:
                    "Code " +
                    rejection.data.error.code +
                    ": " +
                    rejection.data.error.message,
                  color: 0
                });
                break;
              case 404:
                //messagingService.messageSubject.onNext(lists.errors.CONNECTION);
                messagingService.messageSubject.onNext({
                  text:
                    "Code " +
                    rejection.data.error.code +
                    ": " +
                    rejection.data.error.message,
                  color: 0
                });
                break;
              case 405:
                messagingService.messageSubject.onNext({
                  text:
                    "Code " +
                    rejection.data.error.code +
                    ": " +
                    rejection.data.error.message,
                  color: 0
                });
                break;
              case 413:
                messagingService.messageSubject.onNext({
                  text:
                    "Code " +
                    rejection.data.error.code +
                    ": " +
                    rejection.data.error.message,
                  color: 0
                });
                break;
              case 500:
                messagingService.messageSubject.onNext({
                  text:
                    "Code " +
                    rejection.data.error.code +
                    ": " +
                    rejection.data.error.message,
                  color: 0
                });
                break;
              case 503:
                messagingService.messageSubject.onNext(lists.errors.CONNECTION);
                break;
              case 0:
                messagingService.messageSubject.onNext(lists.errors.CONNECTION);
                break;
              default:
              //messagingService.messageSubject.onNext(lists.errors.CONNECTION);
            }
            return $q.reject(rejection);
          }
        };
      });
    })
    .config([
      "cfpLoadingBarProvider",
      function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;
      }
    ])
    .config([
      "tooltipsConfProvider",
      function configConf(tooltipsConfProvider) {
        tooltipsConfProvider.configure({
          smart: true,
          size: "small",
          speed: "fast",
          tooltipTemplateUrlCache: false
        });
      }
    ])
    .config([
      "$translateProvider",
      "lists",
      function($translateProvider, lists) {
        $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
        $translateProvider.useStaticFilesLoader({
          prefix: "languages/",
          suffix: ".json"
        });
        $translateProvider.preferredLanguage("en-US");
        $translateProvider.registerAvailableLanguageKeys(
          lists.userOptions.languages.all
        );
        $translateProvider.useLoaderCache("$templateCache");
      }
    ])
    .controller("RootController", function(
      orsSettingsFactory,
      orsObjectsFactory,
      orsMapFactory,
      $route,
      $interval,
      $http
    ) {
      // add map
      let ctrl = this;
      ctrl.myOrsMap = orsMapFactory.initMap("map");
    })
    .run(function($animate, $injector) {
      $animate.enabled(true);
      $injector.get("orsApikeyFactory").setApiKeyInterval();
    });
  /**
   * Directive to one-click-select all text in input fields
   * apply to <input> as attribute "select-on-click"
   */
  angular.module("orsApp").directive("selectOnClick", [
    "$window",
    function($window) {
      return {
        restrict: "A",
        link: function(scope, element, attrs) {
          element.focus(function() {
            if (!$window.getSelection().toString()) {
              // Required for mobile Safari
              this.setSelectionRange(0, this.value.length);
            }
          });
        }
      };
    }
  ]);
  /**
   * Directive to add a tri-state checkbox
   */
  angular.module("orsApp").directive("indeterminate", [
    function() {
      return {
        require: "?ngModel",
        link: function(scope, el, attrs, ctrl) {
          var truthy = true;
          var falsy = false;
          var nully = null;
          ctrl.$formatters = [];
          ctrl.$parsers = [];
          ctrl.$render = function() {
            var d = ctrl.$viewValue;
            el.data("checked", d);
            switch (d) {
              case truthy:
                el.prop("indeterminate", false);
                el.prop("checked", true);
                break;
              case falsy:
                el.prop("indeterminate", false);
                el.prop("checked", false);
                break;
              default:
                el.prop("indeterminate", true);
                el.prop("checked", false);
            }
          };
          el.bind("click", function() {
            var d;
            switch (el.data("checked")) {
              case falsy:
                d = truthy;
                break;
              // case truthy:
              //     d = nully;
              //     break;
              default:
                d = falsy;
            }
            ctrl.$setViewValue(d);
            scope.$apply(ctrl.$render);
          });
        }
      };
    }
  ]);
})();
