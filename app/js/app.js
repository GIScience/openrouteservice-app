/*|-----------------------------------------------------------------------------------
 *|                                                     University of Heidelberg
 *|   _____ _____  _____      _                         Department of Geography
 *|  / ____|_   _|/ ____|    (_)                        Chair of GIScience
 *| | |  __  | | | (___   ___ _  ___ _ __   ___ ___     (C) 2017
 *| | | |_ | | |  \___ \ / __| |/ _ \ '_ \ / __/ _ \
 *| | |__| |_| |_ ____) | (__| |  __/ | | | (_|  __/    Berliner Strasse 48
 *|  \_____|_____|_____/ \___|_|\___|_| |_|\___\___|    D-69120 Heidelberg, Germany
 *|                                                     http://www.giscience.uni-hd.de
 *|------------------------------------------------------------------------------------*/
/**
 * @author: Timothy Ellersiek, timothy.ellersiek@geog.uni-heidelberg.de, Hendrik Leuschner, hendrik.leuschner@uni-heidelberg.de
 * @version: 1.0
 */
(function() {
    fetchData()
        .then(bootstrapApplication);

    function fetchData() {
        var initInjector = angular.injector(["ng"]);
        var $http = initInjector.get("$http");
        return $http.get("weathercheck.txt")
            .then(function(response) {
                angular.module('orsApp')
                    .value("weathercheck", response.data);
            }, function(errorResponse) {
                console.log(errorResponse);
            });
    }

    function bootstrapApplication() {
        angular.element(document)
            .ready(function() {
                angular.bootstrap(document, ["orsApp"]);
            });
    }
    let orsApp = angular.module('orsApp', ['orsApp.ors-nav', 'orsApp.ors-panel-routing', 'orsApp.ors-panel-accessibilityanalysis', 'orsApp.ors-header', 'orsApp.ors-error', 'orsApp.ors-loading', 'orsApp.ors-modal', 'ui.sortable', 'orsApp.messaging-service', 'orsApp.map-service', 'orsApp.objects-service', 'orsApp.params-service', 'orsApp.request-service', 'orsApp.settings-service', 'orsApp.utils-service', 'orsApp.route-service', 'orsApp.cookies-service', 'orsApp.aa-service', 'orsApp.apikey-factory', 'orsApp.GeoFileHandler-service', 'ngCookies', 'rzModule', 'ngAnimate', 'ngSanitize', 'pascalprecht.translate', 'angular-loading-bar', '720kb.tooltips', 'orsApp.ors-filters', 'orsApp.ors-route-extras', 'config'])
        .config(function($locationProvider, $httpProvider) {
            $locationProvider.html5Mode(true);
            $httpProvider.interceptors.push(function($q, $document, $injector, lists, orsNamespaces, ENV, orsApikeyFactory, weathercheck) {
                return {
                    'request': function(config) {
                        const apiKey = orsApikeyFactory.getApiKey() === undefined ? weathercheck : orsApikeyFactory.getApiKey();
                        let ak = '?api_key=' + apiKey;
                        if (config.url == ENV.geocoding ||  config.url == ENV.routing || config.url == ENV.analyse) {
                            config.url = config.url + ak;
                        }
                        return config || $q.when(config);
                    },
                    'response': function(response) {
                        return response;
                    },
                    'requestError': function(rejection) {
                        console.log(rejection.status)
                        return $q.reject(rejection);
                    },
                    'responseError': function(rejection) {
                        // do something on error
                        let messagingService = $injector.get('orsMessagingService');
                        switch (rejection.status) {
                            case 400:
                                messagingService.messageSubject.onNext(lists.errors.CONNECTION);
                                break;
                            case 404:
                                messagingService.messageSubject.onNext(lists.errors.CONNECTION);
                                break;
                            case 500:
                                console.log(rejection.data.error.message);
                                messagingService.messageSubject.onNext(lists.errors.ROUTE);
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
                        console.log(rejection.status);
                        return $q.reject(rejection);
                    }
                };
            });
        })
        .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeBar = true;
            cfpLoadingBarProvider.includeSpinner = false;
        }])
        .config(['tooltipsConfProvider', function configConf(tooltipsConfProvider) {
            tooltipsConfProvider.configure({
                'smart': true,
                'size': 'small',
                'speed': 'fast',
                'tooltipTemplateUrlCache': true
            });
        }])
        .config(['$translateProvider', '$windowProvider', /* 'storageFactory',*/
            function($translateProvider, $windowProvider /*, storageFactory*/ ) {
                var $window = $windowProvider.$get();
                $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
                //get the translations local folder
                $translateProvider.useStaticFilesLoader({
                    prefix: 'languages/',
                    suffix: '.json'
                });
                // set the preferred language (default language)
                $translateProvider.preferredLanguage('en-US');
            }
        ])
        .controller('RootController', function(orsSettingsFactory, orsObjectsFactory, orsMapFactory, $route, $interval, $http) {
            // add map
            let ctrl = this;
            ctrl.myOrsMap = orsMapFactory.initMap("map");
        })
        .run(function($animate, $injector) {
            $animate.enabled(true);
            console.log('setting..')
            $injector.get('orsApikeyFactory')
                .setApiKeyInterval();
        });
}());