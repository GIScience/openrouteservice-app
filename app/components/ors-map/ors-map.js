angular.module('orsApp').directive('orsMap', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            orsMap: '='
        },
        link: function(scope, element, attrs) {},
        controller: ['$scope', '$compile', '$timeout', 'orsSettingsFactory', 'orsObjectsFactory', 'orsRequestService', 'orsUtilsService', 'orsMapFactory', 'orsErrorhandlerService', 'orsCookiesFactory',
            function($scope, $compile, $timeout, orsSettingsFactory, orsObjectsFactory, orsRequestService, orsUtilsService, orsMapFactory, orsErrorhandlerService, orsCookiesFactory) {
                // // add map
                var ctrl = this;
                ctrl.orsMap = $scope.orsMap;
                const mapsurfer = L.tileLayer(namespaces.layerMapSurfer.url, {
                    attribution: namespaces.layerMapSurfer.attribution
                });
                const openstreetmap = L.tileLayer(namespaces.layerOSM.url, {
                    attribution: namespaces.layerOSM.attribution
                });
                const opencyclemap = L.tileLayer(namespaces.layerOSMCycle.url, {
                    attribution: namespaces.layerOSMCycle.attribution
                });
                const stamen = L.tileLayer(namespaces.layerStamen.url, {
                    attribution: namespaces.layerStamen.attribution
                });
                const hillshade = L.tileLayer(namespaces.overlayHillshade.url, {
                    format: 'image/png',
                    opacity: 0.45,
                    transparent: true,
                    attribution: '<a href="http://srtm.csi.cgiar.org/">SRTM</a>; ASTER GDEM is a product of <a href="http://www.meti.go.jp/english/press/data/20090626_03.html">METI</a> and <a href="https://lpdaac.usgs.gov/products/aster_policies">NASA</a>'
                });
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
                    geofeatures: ctrl.geofeatures
                };
                ctrl.baseLayers = {
                    "MapSurfer": mapsurfer,
                    "OpenStreetMap": openstreetmap,
                    "OpenCycleMap": opencyclemap,
                    "Stamen": stamen
                };
                ctrl.overlays = {
                    "Hillshade": hillshade
                };
                ctrl.mapModel.map.on("load", function(evt) {
                    mapsurfer.addTo(ctrl.orsMap);
                    ctrl.mapModel.geofeatures.layerRoutePoints.addTo(ctrl.orsMap);
                    ctrl.mapModel.geofeatures.layerRouteLines.addTo(ctrl.orsMap);
                    ctrl.mapModel.geofeatures.layerAccessibilityAnalysis.addTo(ctrl.orsMap);
                    ctrl.mapModel.geofeatures.layerEmph.addTo(ctrl.orsMap);
                    ctrl.mapModel.geofeatures.layerTracks.addTo(ctrl.orsMap);
                    //Add layer control
                    L.control.layers(ctrl.baseLayers, ctrl.overlays).addTo(ctrl.orsMap);
                });
                // Check if map options set in cookies
                const mapOptions = orsCookiesFactory.getMapOptions();
                if (mapOptions) {
                    if (mapOptions.mapCenter) ctrl.mapModel.map.panTo(mapOptions.mapCenter);
                    if (mapOptions.mapZoom) ctrl.mapModel.map.setZoom(mapOptions.mapZoom);
                } else {
                    // Heidelberg
                    ctrl.orsMap.setView([49.409445, 8.692953], 13);
                }
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
                //ctrl.mapModel.map.on('baselayerchange', emitMapChangeBaseMap);
                //ctrl.mapModel.map.on('overlayadd', emitMapChangeOverlay);
                //ctrl.mapModel.map.on('overlayremove', emitMapChangeOverlay);
                //ctrl.mapModel.map.on('zoomend', emitMapChangedEvent);
                //ctrl.mapModel.map.on('zoomend', emitMapChangedZoom);
                ctrl.mapModel.map.on('moveend', (e) => {
                    const mapCenter = ctrl.mapModel.map.getCenter();
                    const mapZoom = ctrl.mapModel.map.getZoom();
                    const options = {
                        mapCenter: mapCenter,
                        mapZoom: mapZoom
                    };
                    orsCookiesFactory.setMapOptions(options);
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
                    orsSettingsFactory.getAddress(pos, idx, updateWp);
                    orsUtilsService.parseSettingsToPermalink(orsSettingsFactory.getSettings(), orsSettingsFactory.getUserOptions());
                    // close the popup
                    ctrl.mapModel.map.closePopup();
                };
                ctrl.addWaypoint = (idx, iconIdx, pos, fireRequest = true, aaIcon = false) => {
                    let waypointIcon = aaIcon === true ? new L.icon(lists.waypointIcons[3]) : new L.icon(lists.waypointIcons[iconIdx]);
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
                ctrl.reAddWaypoints = (waypoints, fireRequest = true, aaIcon = false) => {
                    console.info("reAddWaypoints");
                    ctrl.clearMap();
                    var idx = 0;
                    angular.forEach(waypoints, (waypoint) => {
                        var iconIdx = orsSettingsFactory.getIconIdx(idx);
                        if (waypoint._latlng.lat && waypoint._latlng.lng) ctrl.addWaypoint(idx, iconIdx, waypoint._latlng, fireRequest, aaIcon);
                        idx += 1;
                    });
                };
                /**
                 * Either zooms to feature, geometry or entire layer
                 */
                ctrl.zoom = (package) => {
                    if (!(package === undefined)) {
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
                    } else {
                        ctrl.orsMap.fitBounds(new L.featureGroup(Object.keys(ctrl.mapModel.geofeatures).map(function(key) {
                            return ctrl.mapModel.geofeatures[key];
                        })).getBounds());
                    }
                };
                /** 
                 * Highlights marker on map
                 * @param {Object} package - The action package
                 */
                ctrl.highlightWaypoint = (package) => {
                    ctrl.mapModel.geofeatures[package.layerCode].eachLayer(function(layer) {
                        if (layer.options.idx == package.featureId) {
                            let waypointIcon;
                            if (layer.options.highlighted === true) {
                                const iconIdx = orsSettingsFactory.getIconIdx(layer.options.idx);
                                waypointIcon = new L.icon(lists.waypointIcons[iconIdx]);
                                layer.options.highlighted = false;
                            } else {
                                waypointIcon = new L.icon(lists.waypointIcons[3]);
                                layer.options.highlighted = true;
                            }
                            layer.setIcon(waypointIcon);
                        }
                    });
                };
                /** 
                 * adds features to specific layer
                 * @param {Object} package - The action package
                 */
                ctrl.add = (package) => {
                    let polyLine = L.polyline(package.geometry, {
                        index: !(package.featureId === undefined) ? package.featureId : null
                    }).addTo(ctrl.mapModel.geofeatures[package.layerCode]);
                    polyLine.setStyle(package.style);
                };
                /** 
                 * adds polygon array to specific layer
                 * @param {Object} package - The action package
                 */
                ctrl.addPolygons = (package) => {
                    function getGradientColor(rangePos) {
                        hsl = Math.floor(120 - 120 * rangePos);
                        return "hsl(" + hsl + ", 100%, 50%" + ")";
                    }
                    for (var i = package.geometry.length - 1; i >= 0; i--) {
                        L.polygon(package.geometry[i], {
                            fillColor: package.geometry.length == 1 ? getGradientColor(1) : getGradientColor(i / (package.geometry.length - 1)),
                            color: '#000',
                            weight: 1,
                            fillOpacity: 1
                        }).addTo(ctrl.mapModel.geofeatures[package.layerCode]);
                    }
                    // hack to change opacity of entire overlaypane layer but prevent opacity of stroke
                    let svg = d3.select(ctrl.mapModel.map.getPanes().overlayPane).style("opacity", 0.5);
                    svg.selectAll("path").style("stroke-opacity", 1);
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
                orsSettingsFactory.subscribeToNgRoute(function onNext(route) {
                    let svg = d3.select(ctrl.mapModel.map.getPanes().overlayPane);
                    ctrl.clearMap();
                    ctrl.routing = route == 'routing' ? true : false;
                    if (ctrl.routing) svg.style("opacity", 1);
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
                    if (waypoints.length > 0) ctrl.reAddWaypoints(waypoints, ctrl.routing, true);
                    // ctrl.addWaypoint(idx, iconIdx, waypoint._latlng, fireRequest);
                });
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
                            ctrl.highlightWaypoint(params._package);
                            break;
                        case 4:
                            ctrl.addPolygons(params._package);
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