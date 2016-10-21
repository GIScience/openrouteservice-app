angular.module('orsApp.ors-nav', ['ngComponentRouter']).component('orsSidebar', {
    templateUrl: 'app/components/ors-navigation/ors-nav.html',
    transclude: true,
    bindings: {
        orsMap: '<',
    },
    controller($location) {
    	var ctrl = this;
    	console.log($location.url())
    	ctrl.activeMenu = $location.url();
    	console.log(ctrl.activeMenu)
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
        }
        //    {path: '/disaster', name: 'Asteroid', redirectTo: ['CrisisCenter', 'CrisisDetail', {id:3}]}
    ]
}).value('$routerRootComponent', 'orsSidebar');