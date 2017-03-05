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
angular.element(document).ready(function() {
    angular.bootstrap(document.body, ['orsApp']);
});
angular.module('orsApp', ['orsApp.ors-nav', 'orsApp.ors-panel-routing', 'orsApp.ors-panel-accessibilityanalysis', 'orsApp.ors-header', 'orsApp.ors-error', 'orsApp.ors-loading', 'orsApp.ors-modal', 'ui.sortable', 'orsApp.messaging-service', 'orsApp.map-service', 'orsApp.objects-service', 'orsApp.params-service', 'orsApp.request-service', 'orsApp.settings-service', 'orsApp.utils-service', 'orsApp.route-service', 'orsApp.cookies-service', 'orsApp.aa-service', 'orsApp.GeoFileHandler-service', 'ngCookies', 'rzModule', 'ngAnimate', 'ngSanitize', 'pascalprecht.translate', 'angular-loading-bar', '720kb.tooltips', 'orsApp.ors-filters', 'orsApp.ors-route-extras']).config(function($locationProvider, $httpProvider) {
    const ak = '?api_key=0894982ba55b12d3d3e4abd28d1838f2';
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push(function($q, $document, $injector) {
        return {
            'request': function(config) {
                for (let k in orsNamespaces.services) {
                    if (config.url == orsNamespaces.services[k]) {
                        config.url = config.url + ak;
                    }
                }
                return config || $q.when(config);
            },
            'response': function(response) {
                return response;
            },
            'requestError': function(rejection) {
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
                console.log(rejection.status)
                return $q.reject(rejection);
            }
        };
    });
}).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
}]).config(['tooltipsConfProvider', function configConf(tooltipsConfProvider) {
    tooltipsConfProvider.configure({
        'smart': true,
        'size': 'small',
        'speed': 'fast',
        'tooltipTemplateUrlCache': true
    });
}]).config(['$translateProvider', '$windowProvider', /* 'storageFactory',*/
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
]).controller('RootController', function(orsSettingsFactory, orsObjectsFactory, orsMapFactory, $route) {
    // add map
    let ctrl = this;
    ctrl.myOrsMap = orsMapFactory.initMap("map");
});
Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
    return this;
};