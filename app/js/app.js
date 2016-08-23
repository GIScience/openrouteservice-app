angular.module('orsApp', ['orsApp.ors-nav', 'orsApp.ors-panel-routing', 'orsApp.ors-panel-accessibilityanalysis', 'orsApp.ors-panel-download', 'orsApp.ors-map'])

.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
})

.component('orsHeader', {
    template: '<p>Header, {{$ctrl.user.name}} !</p>',
    transclude: true,
    controller: function() {
        this.user = {
            name: 'Timothy'
        };
    }
});

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
    return this;
};