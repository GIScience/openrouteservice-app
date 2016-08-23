angular.module('orsApp.ors-panel-routing', ['orsApp.ors-waypoints', 'orsApp.ors-profiles-options']).component('orsRoute', {
    templateUrl: 'app/components/ors-panel-routing/ors-panel-routing.html',
    controller: function() {
        var ctrl = this;
        ctrl.$onInit = function() {
            
        };
        ctrl.$routerOnActivate = function(next) {
            console.log(next)
        };
    },
    require: {
        parent: '^orsSidebar'
    }
});