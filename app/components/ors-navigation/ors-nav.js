angular.module('orsApp.ors-nav', ['ngComponentRouter']).component('orsSidebar', {
    templateUrl: 'components/ors-navigation/ors-nav.html',
    transclude: true,
    bindings: {
        orsMap: '<',
    },
    controller: ['$location', function($location) {
        let ctrl = this;
        if ($location.path() == '/') {
            ctrl.activeMenu = '/routing';
        } else ctrl.activeMenu = $location.path();
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