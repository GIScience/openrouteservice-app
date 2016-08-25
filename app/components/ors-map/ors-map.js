angular.module('orsApp').directive('orsMap', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            orsMap: '='
        },
        link: function(scope, element, attrs) {},
        controller: ['$scope', '$compile', '$timeout', 'orsSettingsFactory', 'orsObjectsFactory', 'orsMapFactory',
            function($scope, $compile, $timeout, orsSettingsFactory, orsObjectsFactory, orsMapFactory) {
                // // add map
                var ctrl = this;
                ctrl.orsMap = $scope.orsMap;
                console.log(ctrl.orsMap)
                ctrl.basemaps = {
                    basemap: L.tileLayer(namespaces.layerMapSurfer.url, {
                        attribution: namespaces.layerMapSurfer.attribution
                    })
                };
                ctrl.geofeatures = {
                    layerLocationMarker: L.featureGroup(),
                    layerRoutePoints: L.featureGroup(),
                    layerRouteLines: L.featureGroup()
                };
                ctrl.mapModel = {
                    map: ctrl.orsMap,
                    basemaps: ctrl.basemaps,
                    geofeatures: ctrl.geofeatures
                };
                ctrl.mapModel.map.on("load", function(evt) {
                    ctrl.mapModel.basemaps.basemap.addTo(ctrl.orsMap);
                    ctrl.mapModel.geofeatures.layerRoutePoints.addTo(ctrl.orsMap);
                    ctrl.mapModel.geofeatures.layerRouteLines.addTo(ctrl.orsMap);
                });
                ctrl.orsMap.setView([0, 0], 1);
                /**
                 * Listens to left mouse click on map
                 * @param {Object} e: Click event
                 */
                ctrl.mapModel.map.on('contextmenu', function(e) {
                    ctrl.displayPos = e.latlng;
                    var popupEvent = $compile('<ors-popup></ors-popup>')($scope);
                    var popup = L.popup({
                        closeButton: true,
                        className: 'cm-popup'
                    }).setContent(popupEvent[0]).setLatLng(e.latlng);
                    ctrl.mapModel.map.openPopup(popup);
                });
                ctrl.addWaypoint = (idx) => {
                    console.log('adding wp...', idx, ctrl.displayPos);
                    // add waypoint to map

                    var waypoint = orsObjectsFactory.createWaypoint('', ctrl.displayPos);
                    orsSettingsFactory.insertWaypoint(idx, waypoint);
                    // update waypoints and notify panel..
                };
                
                ctrl.waypoints = orsSettingsFactory.getWaypoints();
                
                // subscribes to change in panel
                var subscription = orsSettingsFactory.subscribe(function onNext(d) {
                	console.log('CHANGE IN PANEL!!!', d);
                    ctrl.waypoints = d;
                });
            }
        ]
    };
});
// directive to control the popup to add waypoints on the map
angular.module('orsApp').directive('orsPopup', ['$compile', '$timeout', 'orsSettingsFactory',
    function($compile, $timeout, orsSettingsFactory) {
        return {
            restrict: 'E',
            require: '^orsMap', //one directive used,
            templateUrl: 'app/components/ors-map/directive-templates/ors-popup.html',
            link: function(scope, elem, attr, mapCtrl) {
                console.log(mapCtrl)
                scope.add = (idx) => {
                    mapCtrl.addWaypoint(idx);
                };
            }
        };
    }
]);
// angular.module('orsApp.ors-map', []).component('orsMapLOOOL', {
//     transclude: true,
//     bindings: {
//         orsMap: '<',
//     },
//     controller(orsSettingsFactory, orsObjectsFactory, orsMapFactory) {
//         // // add map
//         var ctrl = this;
//         ctrl.$onInit = () => {
//             ctrl.basemaps = {
//                 basemap: L.tileLayer(namespaces.layerMapSurfer.url, {
//                     attribution: namespaces.layerMapSurfer.attribution
//                 })
//             };
//             ctrl.geofeatures = {
//                 layerLocationMarker: L.featureGroup(),
//                 layerRoutePoints: L.featureGroup(),
//                 layerRouteLines: L.featureGroup()
//             };
//             ctrl.mapModel = {
//                 map: ctrl.orsMap,
//                 basemaps: ctrl.basemaps,
//                 geofeatures: ctrl.geofeatures
//             };
//             ctrl.mapModel.map.on("load", function(evt) {
//                 ctrl.mapModel.basemaps.basemap.addTo(ctrl.orsMap);
//                 ctrl.mapModel.geofeatures.layerRoutePoints.addTo(ctrl.orsMap);
//                 ctrl.mapModel.geofeatures.layerRouteLines.addTo(ctrl.orsMap);
//             });
//             ctrl.orsMap.setView([0, 0], 1);
//         };
//         L.marker([0, 0]).addTo(ctrl.orsMap);
//     }
// });