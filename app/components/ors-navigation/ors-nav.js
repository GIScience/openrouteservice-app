angular.module('orsApp.ors-nav', ['ngComponentRouter']).component('orsSidebar', {
    templateUrl: 'app/components/ors-navigation/ors-nav.html',
    transclude: true,
    $routeConfig: [{
            path: '/routing',
            name: 'Routing',
            component: 'orsRoute',
            useAsDefault: true
        }, {
            path: '/analysis',
            name: 'Analysis',
            component: 'orsAnalysis'
        }, {
            path: '/download',
            name: 'Download',
            component: 'orsDownload'
        }
        //    {path: '/disaster', name: 'Asteroid', redirectTo: ['CrisisCenter', 'CrisisDetail', {id:3}]}
    ]
}).value('$routerRootComponent', 'orsSidebar');