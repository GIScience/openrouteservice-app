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
let orsApp = angular.module('orsApp', ['orsApp.ors-nav', 'orsApp.ors-panel-routing', 'orsApp.ors-panel-accessibilityanalysis', 'orsApp.ors-header', 'orsApp.ors-modal', 'ui.sortable', 'orsApp.error-service', 'orsApp.map-service', 'orsApp.objects-service', 'orsApp.params-service', 'orsApp.request-service', 'orsApp.settings-service', 'orsApp.utils-service', 'orsApp.route-service', 'orsApp.cookies-service', 'orsApp.aa-service', 'orsApp.GeoFileHandler-service', 'ngCookies', 'rzModule', 'ngAnimate', 'ngSanitize', 'pascalprecht.translate', 'angular-loading-bar', '720kb.tooltips', 'orsApp.ors-filters', 'orsApp.ors-route-extras']).config(function($locationProvider, $httpProvider) {
    const ak = '?api_key=0894982ba55b12d3d3e4abd28d1838f2';
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push(function($q, $document) {
        return {
            'request': function(config) {
                for (let k in namespaces.services) {
                    if (config.url == namespaces.services[k]) {
                        config.url = config.url + ak;
                    }
                }
                return config || $q.when(config);
            },
            'response': function(response) {
                return response;
            }
        };
    });
}).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>';
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
        $translateProvider.useSanitizeValueStrategy('sanitize');
        //get the translations local folder
        $translateProvider.useStaticFilesLoader({
            prefix: 'app/languages/',
            suffix: '.json'
        });
        // set the preferred language (default language)
        $translateProvider.preferredLanguage('en-US');
    }
]).controller('RootController', function(orsSettingsFactory, orsObjectsFactory, orsMapFactory, $route) {
    // add map
    let ctrl = this;
    ctrl.myOrsMap = orsMapFactory.initMapA("map");
});
Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
    return this;
};