angular.module('orsApp.ors-nav', ['ngComponentRouter']).component('orsSidebar', {
    templateUrl: 'components/ors-navigation/ors-nav.html',
    transclude: true,
    bindings: {
        orsMap: '<',
    },
    controller: ['$location', function($location) {
        let ctrl = this;
        if ($location.path() == '/') {
            ctrl.activeMenu = '/directions';
        } else ctrl.activeMenu = $location.path();
        ctrl.version = '0.2.2';
    }],
    $routeConfig: [{
        path: '/directions',
        name: 'Directions',
        component: 'orsRoute',
        useAsDefault: true
    }, {
        path: '/reach',
        name: 'Reach',
        component: 'orsAnalysis'
    }]
}).value('$routerRootComponent', 'orsSidebar');