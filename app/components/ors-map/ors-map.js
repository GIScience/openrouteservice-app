angular.module('orsApp').directive('orsMap', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            orsMap: '='
        },
        link: function(scope, element, attrs) {},
        controller: ['$scope', '$compile', '$timeout', 'orsSettingsFactory', 'orsObjectsFactory', 'orsRequestService', 'orsUtilsService', 'orsMapFactory', 'orsErrorhandlerService',
            function($scope, $compile, $timeout, orsSettingsFactory, orsObjectsFactory, orsRequestService, orsUtilsService, orsMapFactory, orsErrorhandlerService) {
                // // add map
                var ctrl = this;
                ctrl.orsMap = $scope.orsMap;
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
                ctrl.orsMap.setView([49.409445, 8.692953], 13);
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
                ctrl.processMapWaypoint = (idx, pos, updateWp) => {
                    // add waypoint to map
                    // get the address from the response
                    if (updateWp) {
                        orsSettingsFactory.updateWaypoint(idx, '', pos);
                    } else {
                        const waypoint = orsObjectsFactory.createWaypoint('', pos);
                        orsSettingsFactory.insertWaypointFromMap(idx, waypoint);
                    }
                    orsRequestService.getAddress(pos, idx, updateWp);
                    // close the popup
                    ctrl.mapModel.map.closePopup();
                };
                ctrl.addWaypoint = (idx, iconIdx, pos) => {
                    console.log(lists.waypointIcons[iconIdx])
                    var waypointIcon = new L.icon(lists.waypointIcons[iconIdx]);
                    console.log('icon', waypointIcon)
                        // create the waypoint marker
                    wayPointMarker = new L.marker(pos, {
                        icon: waypointIcon,
                        draggable: 'true',
                        idx: idx
                    });
                    wayPointMarker.addTo(ctrl.mapModel.geofeatures.layerRoutePoints);
                    // If the waypoint is dragged
                    wayPointMarker.on('dragend', function(event) {
                        // idx of waypoint
                        const idx = event.target.options.idx;
                        const pos = event.target._latlng;
                        ctrl.processMapWaypoint(idx, pos, true);
                    });
                };
                ctrl.clearMap = () => {
                    ctrl.mapModel.geofeatures.layerRoutePoints.clearLayers();
                };
                orsSettingsFactory.subscribeToNgRoute(function onNext(d) {
                    console.log('route was changed to', d);
                    ctrl.clearMap();
                });
                ctrl.reAddWaypoints = (waypoints) => {
                    ctrl.clearMap();
                    var idx = 0;
                    angular.forEach(waypoints, (waypoint) => {
                        console.log(waypoints)
                        var iconIdx = orsSettingsFactory.getIconIdx(idx);
                        if (waypoint._latlng.lat && waypoint._latlng.lng) ctrl.addWaypoint(idx, iconIdx, waypoint._latlng);
                        idx += 1;
                    });
                };
                /** 
                 * subscribes to changes on in waypoint settings
                 * for now wrapped in timeout because waiting for routerActivate
                 */
                $timeout(function() {
                    orsSettingsFactory.subscribeToWaypoints(function onNext(d) {
                        console.log('changes in routing waypoints detected..', d);
                        const waypoints = d;
                        // re-add waypoints
                        ctrl.reAddWaypoints(waypoints);
                    });
                }, 1000);
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
                scope.add = (idx) => {
                    mapCtrl.processMapWaypoint(idx, mapCtrl.displayPos);
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