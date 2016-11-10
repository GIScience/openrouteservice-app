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
                    layerRouteLines: L.featureGroup(),
                    layerEmph: L.featureGroup()
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
                    ctrl.mapModel.geofeatures.layerEmph.addTo(ctrl.orsMap);
                });
                ctrl.orsMap.setView([49.409445, 8.692953], 13);
                /**
                 * Listens to left mouse click on map
                 * @param {Object} e: Click event
                 */
                ctrl.mapModel.map.on('contextmenu', function(e) {
                    ctrl.displayPos = e.latlng;
                    let popupEvent;
                    if (ctrl.routing) {
                        popupEvent = $compile('<ors-popup></ors-popup>')($scope);
                    } else {
                        popupEvent = $compile('<ors-aa-popup></ors-aa-popup>')($scope);
                    }
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
                        const waypoint = orsObjectsFactory.createWaypoint('', pos, 1);
                        orsSettingsFactory.insertWaypointFromMap(idx, waypoint);
                    }
                    orsRequestService.getAddress(pos, idx, updateWp);
                    // close the popup
                    ctrl.mapModel.map.closePopup();
                };
                ctrl.addWaypoint = (idx, iconIdx, pos) => {
                    console.log('adding waypoint')
                    var waypointIcon = new L.icon(lists.waypointIcons[iconIdx]);
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
                ctrl.reAddWaypoints = (waypoints) => {
                    ctrl.clearMap();
                    var idx = 0;
                    angular.forEach(waypoints, (waypoint) => {
                        var iconIdx = orsSettingsFactory.getIconIdx(idx);
                        if (waypoint._latlng.lat && waypoint._latlng.lng) ctrl.addWaypoint(idx, iconIdx, waypoint._latlng);
                        idx += 1;
                    });
                };
                /**
                 * zooms the map so that the whole route becomes visible (i.e. all features of the route line layer)
                 */
                ctrl.zoom = () => {
                    ctrl.orsMap.fitBounds(new L.featureGroup(Object.keys(ctrl.mapModel.geofeatures).map(function(key) {
                        return ctrl.mapModel.geofeatures[key];
                    })).getBounds());
                };
                /** 
                 * adds features to specific layer
                 * @param {Object} package - The action package
                 */
                ctrl.add = (package) => {
                    L.polyline(package.geometry, {
                        color: 'red'
                    }).addTo(ctrl.mapModel.geofeatures[package.layerCode]);
                };
                /** 
                 * clears specific layer
                 */
                ctrl.clear = (package) => {
                    ctrl.mapModel.geofeatures[package.layerCode].clearLayers();
                };
                // subscribeToZoom () {ctrl.zoom()}
                orsSettingsFactory.subscribeToNgRoute(function onNext(route) {
                    console.log('route was changed to', route);
                    ctrl.routing = route == 'routing' ? true : false;
                    ctrl.clearMap();
                    /** 
                     * subscribes to changes on in waypoint settings, this
                     * must be called on every route change to update subscription
                     */
                    if (route !== undefined) {
                        orsSettingsFactory.subscribeToWaypoints(function onNext(d) {
                            console.log('changes in routing waypoints detected..', d);
                            const waypoints = d;
                            // re-add waypoints only after init
                            if (waypoints.length > 0) ctrl.reAddWaypoints(waypoints);
                        });
                    }
                });
                /** highlights a geometry */
                ctrl.highlight = (package) => {
                    L.polyline(package.geometry, {
                        color: '#b5152b'
                    }).addTo(ctrl.mapModel.geofeatures[package.layerCode]);
                };
                /**
                 * Dispatches all commands sent by Mapservice by using id and then performing the corresponding function
                 */
                orsMapFactory.subscribeToMapFunctions(function onNext(params) {
                    console.log(params)
                    switch (params._actionCode) {
                        /** zoom to features */
                        case 0:
                            ctrl.zoom();
                            break;
                            /** add features */
                        case 1:
                            ctrl.add(params._package);
                            break;
                        case 2:
                            ctrl.clear(params._package);
                            break;
                        case 3:
                            ctrl.highlight(params._package);
                            break;
                        default:
                            break;
                    }
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
                scope.add = (idx) => {
                    mapCtrl.processMapWaypoint(idx, mapCtrl.displayPos);
                };
            }
        };
    }
]);
angular.module('orsApp').directive('orsAaPopup', ['$compile', '$timeout', 'orsSettingsFactory',
    function($compile, $timeout, orsSettingsFactory) {
        return {
            restrict: 'E',
            require: '^orsMap', //one directive used,
            templateUrl: 'app/components/ors-map/directive-templates/ors-aa-popup.html',
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