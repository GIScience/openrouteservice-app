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
                    layerAccessibilityAnalysis: L.featureGroup(),
                    layerEmph: L.featureGroup(),
                    layerTracks: L.featureGroup()
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
                    ctrl.mapModel.geofeatures.layerAccessibilityAnalysis.addTo(ctrl.orsMap);
                    ctrl.mapModel.geofeatures.layerEmph.addTo(ctrl.orsMap);
                    ctrl.mapModel.geofeatures.layerTracks.addTo(ctrl.orsMap);
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
                ctrl.processMapWaypoint = (idx, pos, updateWp = false, fireRequest = true) => {
                    // add waypoint to map
                    // get the address from the response
                    if (updateWp) {
                        orsSettingsFactory.updateWaypoint(idx, '', pos, fireRequest);
                    } else {
                        const waypoint = orsObjectsFactory.createWaypoint('', pos, 1);
                        orsSettingsFactory.insertWaypointFromMap(idx, waypoint, fireRequest);
                    }
                    orsRequestService.getAddress(pos, idx, updateWp);
                    // close the popup
                    ctrl.mapModel.map.closePopup();
                };
                ctrl.addWaypoint = (idx, iconIdx, pos, fireRequest = true) => {
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
                        console.log(fireRequest);
                        ctrl.processMapWaypoint(idx, pos, true, fireRequest);
                    });
                };
                ctrl.clearMap = () => {
                    ctrl.mapModel.geofeatures.layerLocationMarker.clearLayers();
                    ctrl.mapModel.geofeatures.layerRoutePoints.clearLayers();
                    ctrl.mapModel.geofeatures.layerRouteLines.clearLayers();
                    ctrl.mapModel.geofeatures.layerAccessibilityAnalysis.clearLayers();
                    ctrl.mapModel.geofeatures.layerEmph.clearLayers();
                };
                ctrl.reAddWaypoints = (waypoints, fireRequest = true) => {
                    console.info("reAddWaypoints");
                    ctrl.clearMap();
                    var idx = 0;
                    angular.forEach(waypoints, (waypoint) => {
                        var iconIdx = orsSettingsFactory.getIconIdx(idx);
                        if (waypoint._latlng.lat && waypoint._latlng.lng) ctrl.addWaypoint(idx, iconIdx, waypoint._latlng, fireRequest);
                        idx += 1;
                    });
                };
                /**
                 * Either zooms to feature, geometry or entire layer
                 */
                ctrl.zoom = (package) => {
                    if (!(package.featureId === undefined)) {
                        ctrl.mapModel.geofeatures[package.layerCode].eachLayer(function(layer) {
                            if (layer.options.index == package.featureId) {
                                ctrl.orsMap.fitBounds(layer.getBounds());
                            }
                        });
                    } else if (package.featureId === undefined) {
                        if (package.geometry !== undefined) {
                            let bounds = new L.LatLngBounds(package.geometry);
                            ctrl.orsMap.fitBounds(bounds);
                        } else {
                            ctrl.orsMap.fitBounds(new L.featureGroup(Object.keys(ctrl.mapModel.geofeatures).map(function(key) {
                                return ctrl.mapModel.geofeatures[key];
                            })).getBounds());
                        }
                    }
                };
                /** 
                 * adds features to specific layer
                 * @param {Object} package - The action package
                 */
                ctrl.add = (package) => {
                    console.log(package)
                    L.polyline(package.geometry, {
                        color: !(package.color === undefined) ? package.color : 'red',
                        index: !(package.featureId == undefined) ? package.featureId : null
                    }).addTo(ctrl.mapModel.geofeatures[package.layerCode]);
                };
                /** 
                 * adds polygon to specific layer
                 * @param {Object} package - The action package
                 */
                ctrl.addPolygon = (package) => {
                    console.log(package);
                    L.multiPolygon(package.geometry, {
                        color: 'green'
                    }).addTo(ctrl.mapModel.geofeatures[package.layerCode]);
                };
                /** 
                 * clears layer entirely or specific layer in layer
                 */
                ctrl.clear = (package) => {
                    if (!(package.featureId === undefined)) {
                        ctrl.mapModel.geofeatures[package.layerCode].eachLayer(function(layer) {
                            if (layer.options.index == package.featureId) {
                                ctrl.mapModel.geofeatures[package.layerCode].removeLayer(layer);
                            }
                        });
                    } else {
                        ctrl.mapModel.geofeatures[package.layerCode].clearLayers();
                    }
                };
                // subscribeToZoom () {ctrl.zoom()}
                let wpSubscription;
                orsSettingsFactory.subscribeToNgRoute(function onNext(route) {
                    console.log('route was changed to', route);
                    ctrl.routing = route == 'routing' ? true : false;
                    ctrl.clearMap();
                });
                orsSettingsFactory.subscribeToWaypoints(function onNext(d) {
                    console.log('changes in routing waypoints detected..', d);
                    const waypoints = d;
                    // re-add waypoints only after init
                    if (waypoints.length > 0) ctrl.reAddWaypoints(waypoints, ctrl.routing);
                });
                orsSettingsFactory.subscribeToAaWaypoints(function onNext(d) {
                    console.log('changes in aa waypoints detected..', d);
                    const waypoints = d;
                    // re-add waypoints only after init
                    if (waypoints.length > 0) ctrl.reAddWaypoints(waypoints, ctrl.routing);
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
                    switch (params._actionCode) {
                        /** zoom to features */
                        case 0:
                            ctrl.zoom(params._package);
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
                        case 4:
                            ctrl.addPolygon(params._package);
                            break;
                        case 5:
                            ctrl.clearMap();
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
                    //fourth argument to not fire a request on add waypoint
                    mapCtrl.processMapWaypoint(idx, mapCtrl.displayPos, false, false);
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