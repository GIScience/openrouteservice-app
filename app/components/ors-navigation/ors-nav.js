angular.module('orsApp.ors-nav', ['ngComponentRouter']).component('orsSidebar', {
    templateUrl: 'app/components/ors-navigation/ors-nav.html',
    transclude: true,
    bindings: {
        orsMap: '<',
    },
    controller($location) {
        var ctrl = this;
        ctrl.activeMenu = $location.url();
    },
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