angular.module('orsApp', ['ngComponentRouter', 'panel-center'])
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true);
    })
    .value('$routerRootComponent', 'orsSidebar')
    .component('orsHeader', {
        template: '<p>Header, {{user.name}} !</p>',
        transclude: true,
        controller: function() {
            this.user = {
                name: 'Timothy'
            };
        }
    })
    .component('orsSidebar', {
        templateUrl: 'app/template/ors_navigation_tpl.html'   ,
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
    });