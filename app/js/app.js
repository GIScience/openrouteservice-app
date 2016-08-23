angular.module('orsApp', ['orsApp.ors-nav', 'orsApp.ors-panel-routing', 'orsApp.ors-panel-accessibilityanalysis', 'orsApp.ors-panel-download', 'orsApp.ors-map'])

.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
})


.controller('RootController', function(orsSettingsFactory, orsObjectsFactory, orsMapFactory) {

    // add map
    var ctrl = this;
    ctrl.myOrsMap = orsMapFactory.initMapA("map");
    // orsMapFactory.map.then(function(map) {
    //     ctrl.myOrsMap = map
    //     console.log(ctrl.myOrsMap)
    //     /* pass ctrl.map down to menu and map component!!! */
    //     // var tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    //     //     maxZoom: 18
    //     // }).addTo(ctrl.map);
    //     // ctrl.map.setView([0, 0], 1);
    //     // L.marker([0, 0]).addTo(ctrl.map);
    //     // console.log(ctrl.map);
    // });


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