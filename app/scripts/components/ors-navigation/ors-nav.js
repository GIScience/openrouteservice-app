var $__app_47_scripts_47_components_47_ors_45_navigation_47_ors_45_nav_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-navigation/ors-nav.js";
  angular.module('orsApp.ors-nav', ['ngComponentRouter']).component('orsSidebar', {
    templateUrl: 'scripts/components/ors-navigation/ors-nav.html',
    transclude: true,
    bindings: {orsMap: '<'},
    controller: ['$location', function($location) {
      var ctrl = this;
      if ($location.path() == '/') {
        ctrl.activeMenu = '/routing';
      } else
        ctrl.activeMenu = $location.path();
    }],
    $routeConfig: [{
      path: '/routing',
      name: 'Routing',
      component: 'orsRoute',
      useAsDefault: true
    }, {
      path: '/analysis',
      name: 'Analysis',
      component: 'orsAnalysis'
    }]
  }).value('$routerRootComponent', 'orsSidebar');
  return {};
})();
