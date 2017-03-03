angular.module('orsApp').directive('orsMap', () => {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            orsMap: '='
        },
        link: (scope, element, attrs) => {},
        controller: ['$scope', '$compile', '$timeout', 'orsSettingsFactory', 'orsObjectsFactory', 'orsRequestService', 'orsUtilsService', 'orsMapFactory', 'orsCookiesFactory', ($scope, $compile, $timeout, orsSettingsFactory, orsObjectsFactory, orsRequestService, orsUtilsService, orsMapFactory, orsCookiesFactory) => {
            const mapsurfer = L.tileLayer(orsNamespaces.layerMapSurfer.url, {
                attribution: orsNamespaces.layerMapSurfer.attribution
            });
            const openstreetmap = L.tileLayer(orsNamespaces.layerOSM.url, {
                attribution: orsNamespaces.layerOSM.attribution
            });
            const opencyclemap = L.tileLayer(orsNamespaces.layerOSMCycle.url, {
                attribution: orsNamespaces.layerOSMCycle.attribution
            });
            const stamen = L.tileLayer(orsNamespaces.layerStamen.url, {
                attribution: orsNamespaces.layerStamen.attribution
            });
            const hillshade = L.tileLayer(orsNamespaces.overlayHillshade.url, {
                format: 'image/png',
                opacity: 0.45,
                transparent: true,
                attribution: '<a href="http://srtm.csi.cgiar.org/">SRTM</a>; ASTER GDEM is a product of <a href="http://www.meti.go.jp/english/press/data/20090626_03.html">METI</a> and <a href="https://lpdaac.usgs.gov/products/aster_policies">NASA</a>'
            });
            $scope.geofeatures = {
                layerLocationMarker: L.featureGroup(),
                layerRoutePoints: L.featureGroup(),
                layerRouteLines: L.featureGroup(),
                layerAvoid: L.featureGroup(),
                layerAccessibilityAnalysis: L.featureGroup(),
                layerAccessibilityAnalysisNumberedMarkers: L.featureGroup(),
                layerEmph: L.featureGroup(),
                layerTracks: L.featureGroup(),
                layerRouteNumberedMarkers: L.featureGroup()
            };
            $scope.mapModel = {
                map: $scope.orsMap,
                geofeatures: $scope.geofeatures
            };
            $scope.mapModel.map.createPane('isochronesPane');
            /* HEIGHTGRAPH CONTROLLER */
            $scope.hg = L.control.heightgraph({
                width: 800,
                height: 280,
                margins: {
                    top: 10,
                    right: 30,
                    bottom: 55,
                    left: 50
                },
                position: "bottomright",
                mappings: mappings
            });

            console.log(lists.colorMappings)
            /* AVOID AREA CONTROLLER */
            L.NewPolygonControl = L.Control.extend({
                options: {
                    position: 'topright'
                },
                onAdd: function(map) {
                    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control', container),
                        link = L.DomUtil.create('a', 'leaflet-avoidArea', container);
                    link.href = '#';
                    link.title = 'Create a new area avoid polygon';
                    link.innerHTML = '<i class="fa fa-square-o"></i>';
                    //return container;
                    L.DomEvent.on(link, 'click', L.DomEvent.stop).on(link, 'click', function() {
                        map.editTools.startPolygon();
                    });
                    return container;
                }
            });
            $scope.mapModel.map.addControl(new L.NewPolygonControl());
            const deleteShape = function(e) {
                if ((e.originalEvent.altKey || e.originalEvent.metaKey) && this.editEnabled()) {
                    this.editor.deleteShapeAt(e.latlng);
                    $scope.mapModel.geofeatures.layerAvoid.removeLayer(e.target._leaflet_id);
                    // remove overlay in controls if no regions left
                    if ($scope.geofeatures.layerAvoid.getLayers().length === 0) $scope.layerControls.removeLayer($scope.geofeatures.layerAvoid);
                    setSettings();
                }
            };
            const deleteVertex = function(e) {
                e.vertex.delete();
            };
            const setSettings = function() {
                const polygons = $scope.geofeatures.layerAvoid.toGeoJSON();
                let avoidPolygons = {
                    type: polygons.features.length > 1 ? 'MultiPolygon' : 'Polygon'
                };
                if (polygons.features.length == 1) {
                    avoidPolygons.coordinates = [orsUtilsService.trimCoordinates(polygons.features[0].geometry.coordinates[0], 5)];
                } else {
                    avoidPolygons.coordinates = [];
                    for (let i = 0; i < polygons.features.length; i++) {
                        avoidPolygons.coordinates.push([orsUtilsService.trimCoordinates(polygons.features[i].geometry.coordinates[0], 5)]);
                    }
                }
                orsSettingsFactory.setAvoidableAreas(avoidPolygons);
            };
            const shapeDrawn = function(e) {
                $scope.layerControls.addOverlay($scope.geofeatures.layerAvoid, 'Avoidable regions');
                setSettings();
            };
            $scope.baseLayers = {
                "MapSurfer": mapsurfer,
                "OpenStreetMap": openstreetmap,
                "OpenCycleMap": opencyclemap,
                "Stamen": stamen
            };
            $scope.overlays = {
                "Hillshade": hillshade
            };
            $scope.mapModel.map.on("load", (evt) => {
                mapsurfer.addTo($scope.orsMap);
                $scope.mapModel.geofeatures.layerRoutePoints.addTo($scope.mapModel.map);
                $scope.mapModel.geofeatures.layerRouteLines.addTo($scope.mapModel.map);
                $scope.mapModel.geofeatures.layerRouteNumberedMarkers.addTo($scope.mapModel.map);
                $scope.mapModel.geofeatures.layerAvoid.addTo($scope.mapModel.map);
                $scope.mapModel.geofeatures.layerAccessibilityAnalysis.addTo($scope.mapModel.map);
                $scope.mapModel.geofeatures.layerAccessibilityAnalysisNumberedMarkers.addTo($scope.mapModel.map);
                $scope.mapModel.geofeatures.layerEmph.addTo($scope.mapModel.map);
                $scope.mapModel.geofeatures.layerTracks.addTo($scope.mapModel.map);
                // add layer control
                $scope.layerControls = L.control.layers($scope.baseLayers, $scope.overlays).addTo($scope.mapModel.map);
                $scope.mapModel.map.editTools.featuresLayer = $scope.geofeatures.layerAvoid;
                // add eventlisteners for layeravoidables only
                $scope.mapModel.geofeatures.layerAvoid.on('layeradd', function(e) {
                    if (e.layer instanceof L.Path) e.layer.on('click', L.DomEvent.stop).on('click', deleteShape, e.layer);
                    if (e.layer instanceof L.Path) e.layer.on('dblclick', L.DomEvent.stop).on('dblclick', e.layer.toggleEdit);
                });
                $scope.mapModel.map.on('editable:drawing:commit', shapeDrawn);
                $scope.mapModel.map.on('editable:vertex:deleted', setSettings);
                $scope.mapModel.map.on('editable:vertex:dragend', setSettings);
                $scope.mapModel.map.on('editable:vertex:altclick', deleteVertex);
            });
            // Check if map options set in cookies
            const mapOptions = orsCookiesFactory.getMapOptions();
            if (mapOptions) {
                if (mapOptions.mapCenter) $scope.mapModel.map.panTo(mapOptions.mapCenter);
                if (mapOptions.mapZoom) $scope.mapModel.map.setZoom(mapOptions.mapZoom);
            } else {
                // Heidelberg
                $scope.orsMap.setView([49.409445, 8.692953], 13);
            }
            /**
             * Listens to left mouse click on map
             * @param {Object} e: Click event
             */
            $scope.mapModel.map.on('contextmenu', (e) => {
                $scope.displayPos = e.latlng;
                let popupEvent;
                if ($scope.routing) {
                    popupEvent = $compile('<ors-popup></ors-popup>')($scope);
                } else {
                    popupEvent = $compile('<ors-aa-popup></ors-aa-popup>')($scope);
                }
                const popup = L.popup({
                    closeButton: true,
                    className: 'cm-popup'
                }).setContent(popupEvent[0]).setLatLng(e.latlng);
                $scope.mapModel.map.openPopup(popup);
            });
            //$scope.mapModel.map.on('baselayerchange', emitMapChangeBaseMap);
            //$scope.mapModel.map.on('overlayadd', emitMapChangeOverlay);
            //$scope.mapModel.map.on('overlayremove', emitMapChangeOverlay);
            $scope.mapModel.map.on('zoomend', (e) => {
                let layerRouteLines = $scope.mapModel.geofeatures.layerRouteLines;
                const currentZoom = $scope.mapModel.map.getZoom();
                if (currentZoom >= 15) {
                    d3.select($scope.mapModel.map.getPanes().overlayPane).style("opacity", 0.5);
                } else {
                    d3.select($scope.mapModel.map.getPanes().overlayPane).style("opacity", 1);
                }
                $scope.setMapOptions();
            });
            $scope.mapModel.map.on('moveend', (e) => {
                $scope.setMapOptions();
            });
            $scope.setMapOptions = () => {
                const mapCenter = $scope.mapModel.map.getCenter();
                const mapZoom = $scope.mapModel.map.getZoom();
                const options = {
                    mapCenter: mapCenter,
                    mapZoom: mapZoom
                };
                orsCookiesFactory.setMapOptions(options);
            };
            $scope.processMapWaypoint = (idx, pos, updateWp = false, fireRequest = true) => {
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
                $scope.mapModel.map.closePopup();
            };
            $scope.addNumberedMarker = (geom, featureId, layerCode, isIsochrones = false) => {
                const lat = geom[1] || geom.lat;
                const lng = geom[0] ||  geom.lng;
                let textLabelclass;
                if (isIsochrones) {
                    textLabelclass = 'textLabelclass-isochrones';
                } else if (featureId + 1 > 9) {
                    textLabelclass = 'textLabelclass';
                } else {
                    textLabelclass = 'textLabelclass-onedigit';
                }
                let marker = L.marker(L.latLng(lat, lng), {
                    icon: createLabelIcon(textLabelclass, parseInt(featureId) + 1),
                    index: featureId
                });
                marker.bindPopup("<b>Position</b><br>" + lat + ', ' + lng).openPopup();
                marker.addTo($scope.mapModel.geofeatures[layerCode]);
            };
            $scope.addWaypoint = (idx, iconIdx, pos, fireRequest = true, aaIcon = false) => {
                let waypointIcon = aaIcon === true ? L.divIcon(lists.waypointIcons[3]) : L.divIcon(lists.waypointIcons[iconIdx]);
                // create the waypoint marker
                let wayPointMarker = new L.marker(pos, {
                    icon: waypointIcon,
                    draggable: 'true',
                    idx: idx
                });
                wayPointMarker.addTo($scope.mapModel.geofeatures.layerRoutePoints);
                // If the waypoint is dragged
                wayPointMarker.on('dragstart', (event) => {
                    $scope.mapModel.geofeatures.layerRouteNumberedMarkers.clearLayers();
                });
                wayPointMarker.on('dragend', (event) => {
                    // idx of waypoint
                    const idx = event.target.options.idx;
                    const pos = event.target._latlng;
                    $scope.processMapWaypoint(idx, pos, true, fireRequest);
                    const waypoints = orsSettingsFactory.getWaypoints();
                    let cnt = 0;
                    angular.forEach(waypoints, (waypoint) => {
                        if (waypoint._latlng.lat && waypoint._latlng.lng) {
                            if (cnt > 0 && cnt < waypoints.length - 1) {
                                const wpTag = cnt - 1;
                                $scope.addNumberedMarker(waypoint._latlng, wpTag, lists.layers[6]);
                            }
                        }
                        cnt += 1;
                    });
                });
            };
            /** Clears the map
             * @param {boolean} switchApp: Whether accessibility layer should be cleared
             */
            $scope.clearMap = (switchApp = false) => {
                $scope.mapModel.geofeatures.layerLocationMarker.clearLayers();
                $scope.mapModel.geofeatures.layerRoutePoints.clearLayers();
                $scope.mapModel.geofeatures.layerRouteNumberedMarkers.clearLayers();
                $scope.mapModel.geofeatures.layerRouteLines.clearLayers();
                $scope.mapModel.geofeatures.layerEmph.clearLayers();
                if (switchApp) {
                    console.log('clearing isochrones')
                    $scope.mapModel.geofeatures.layerAvoid.clearLayers();
                    $scope.mapModel.geofeatures.layerAccessibilityAnalysis.clearLayers();
                    $scope.mapModel.geofeatures.layerAccessibilityAnalysisNumberedMarkers.clearLayers();
                }
            };
            $scope.reAddWaypoints = (waypoints, fireRequest = true, aaIcon = false) => {
                $scope.clearMap();
                var idx = 0;
                angular.forEach(waypoints, (waypoint) => {
                    var iconIdx = orsSettingsFactory.getIconIdx(idx);
                    if (waypoint._latlng.lat && waypoint._latlng.lng) {
                        $scope.addWaypoint(idx, iconIdx, waypoint._latlng, fireRequest, aaIcon);
                        // only add numbered markers if on app panel routing
                        if (fireRequest) {
                            if (idx > 0 && idx < waypoints.length - 1) {
                                const wpTag = idx - 1;
                                $scope.addNumberedMarker(waypoint._latlng, wpTag, lists.layers[6]);
                            }
                        }
                    }
                    idx += 1;
                });
            };
            $scope.reshuffleIndices = (actionPackage) => {
                let i = 0;
                $scope.mapModel.geofeatures[actionPackage.layerCode].eachLayer((layer) => {
                    layer.eachLayer((sublayer) => {
                        sublayer.options.index = i;
                    });
                    i++;
                });
            };
            $scope.reshuffleIndicesText = (actionPackage) => {
                let i = 0;
                $scope.mapModel.geofeatures[actionPackage.layerCode].eachLayer((layer) => {
                    let markerIcon = createLabelIcon("textLabelclass", i + 1);
                    layer.setIcon(markerIcon);
                    layer.options.index = i;
                    i++;
                });
            };
            /**
             * Either zooms to feature, geometry or entire layer
             */
            $scope.zoom = (actionPackage) => {
                if (typeof actionPackage != 'undefined') {
                    if (typeof actionPackage.featureId != 'undefined') {
                        $scope.mapModel.geofeatures[actionPackage.layerCode].eachLayer((layer) => {
                            if (layer.options.index == actionPackage.featureId) {
                                $scope.orsMap.fitBounds(layer.getBounds());
                            }
                        });
                    } else if (actionPackage.featureId === undefined) {
                        if (actionPackage.geometry !== undefined) {
                            let bounds = new L.LatLngBounds(actionPackage.geometry);
                            $scope.orsMap.fitBounds(bounds);
                        } else {
                            $scope.orsMap.fitBounds(new L.featureGroup(Object.keys($scope.mapModel.geofeatures).map((key) => {
                                return $scope.mapModel.geofeatures[key];
                            })).getBounds());
                        }
                    }
                } else {
                    $scope.orsMap.fitBounds(new L.featureGroup(Object.keys($scope.mapModel.geofeatures).map((key) => {
                        return $scope.mapModel.geofeatures[key];
                    })).getBounds());
                }
            };
            /** 
             * Highlights marker on map
             * @param {Object} actionPackage - The action actionPackage
             */
            $scope.highlightWaypoint = (actionPackage) => {
                $scope.mapModel.geofeatures[actionPackage.layerCode].eachLayer((layer) => {
                    if (layer.options.idx == actionPackage.featureId) {
                        let waypointIcon;
                        const iconIdx = orsSettingsFactory.getIconIdx(layer.options.idx);
                        if (layer.options.highlighted === true) {
                            waypointIcon = new L.divIcon(lists.waypointIcons[iconIdx]);
                            layer.options.highlighted = false;
                        } else {
                            waypointIcon = new L.divIcon(lists.waypointIcons[4 + iconIdx]);
                            layer.options.highlighted = true;
                        }
                        layer.setIcon(waypointIcon);
                    }
                });
            };
            /** 
             * adds features to specific layer
             * @param {Object} actionPackage - The action actionPackage
             */
            $scope.addFeatures = (actionPackage) => {
                let polyLine = L.polyline(actionPackage.geometry, {
                    index: !(actionPackage.featureId === undefined) ? actionPackage.featureId : null
                }).addTo($scope.mapModel.geofeatures[actionPackage.layerCode]);
                polyLine.setStyle(actionPackage.style);
            };
            /**
             * adds numbered marker if not yet added 
             * @param {Object} actionPackage - The action actionPackage
             */
            $scope.toggleNumberedMarker = (actionPackage) => {
                let add = true;
                $scope.mapModel.geofeatures[actionPackage.layerCode].eachLayer((layer) => {
                    if (layer.options.index == actionPackage.featureId) {
                        $scope.mapModel.geofeatures[actionPackage.layerCode].removeLayer(layer);
                        add = false;
                        return;
                    }
                });
                if (add) {
                    $scope.addNumberedMarker(actionPackage.geometry, actionPackage.featureId, actionPackage.layerCode, true);
                }
            };
            let createLabelIcon = function(labelClass, labelText) {
                return L.divIcon({
                    className: labelClass,
                    html: labelText,
                    iconSize: L.point(17, 17)
                });
            };
            /** 
             * adds polygon array to specific layer
             * @param {Object} actionPackage - The action actionPackage
             */
            $scope.togglePolygons = (actionPackage) => {
                // check if isochrones with this index are already on the map, if they are remove them
                let add = true;
                $scope.mapModel.geofeatures[actionPackage.layerCode].eachLayer((layer) => {
                    layer.eachLayer((isochrone) => {
                        if (isochrone.options.index == actionPackage.featureId) {
                            add = false;
                            $scope.mapModel.geofeatures[actionPackage.layerCode].removeLayer(layer);
                            return;
                        }
                    });
                });
                if (add) {
                    const getGradientColor = (rangePos) => {
                        const hsl = Math.floor(120 - 120 * rangePos);
                        return "hsl(" + hsl + ", 100%, 50%" + ")";
                    };
                    let isochrones = new L.FeatureGroup();
                    for (let i = actionPackage.geometry.length - 1; i >= 0; i--) {
                        L.polygon(actionPackage.geometry[i].geometry.coordinates[0], {
                            fillColor: actionPackage.geometry.length == 1 ? getGradientColor(1) : getGradientColor(i / (actionPackage.geometry.length - 1)),
                            color: '#FFF',
                            weight: 1,
                            fillOpacity: 1,
                            index: actionPackage.featureId,
                            pane: 'isochronesPane'
                        }).addTo(isochrones);
                    }
                    isochrones.addTo($scope.mapModel.geofeatures[actionPackage.layerCode]);
                    // hack to change opacity of entire overlaypane layer but prevent opacity of stroke
                    let svg = d3.select($scope.mapModel.map.getPanes().isochronesPane).style("opacity", 0.5);
                    svg.selectAll("path").style("stroke-opacity", 1);
                }
            };
            /** 
             * clears layer entirely or specific layer in layer
             */
            $scope.clear = (actionPackage) => {
                if (!(actionPackage.featureId === undefined)) {
                    $scope.mapModel.geofeatures[actionPackage.layerCode].eachLayer((layer) => {
                        if (layer.options.index == actionPackage.featureId) {
                            $scope.mapModel.geofeatures[actionPackage.layerCode].removeLayer(layer);
                        }
                    });
                } else {
                    $scope.mapModel.geofeatures[actionPackage.layerCode].clearLayers();
                }
            };
            /** 
             * clears featuregroup layer and checks for layers inside with specific index
             */
            $scope.clearFeaturegroup = (actionPackage) => {
                $scope.mapModel.geofeatures[actionPackage.layerCode].eachLayer((layer) => {
                    layer.eachLayer((subLayer) => {
                        if (subLayer.options.index == actionPackage.featureId) {
                            $scope.mapModel.geofeatures[actionPackage.layerCode].removeLayer(layer);
                            return;
                        }
                    });
                });
            };
            orsSettingsFactory.subscribeToNgRoute(function onNext(route) {
                //let svg = d3.select($scope.mapModel.map.getPanes().overlayPane);
                $scope.clearMap(true);
                $scope.routing = route == 'directions' ? true : false;
                //if ($scope.routing) svg.style("opacity", 1);
            });
            orsSettingsFactory.subscribeToWaypoints(function onNext(d) {
                console.log('changes in routing waypoints detected..', d);
                const waypoints = d;
                // re-add waypoints only after init
                if (waypoints.length > 0) $scope.reAddWaypoints(waypoints, $scope.routing);
            });
            orsSettingsFactory.subscribeToAaWaypoints(function onNext(d) {
                console.log('changes in aa waypoints detected..', d);
                const waypoints = d;
                // re-add waypoints only after init
                if (waypoints.length > 0) $scope.reAddWaypoints(waypoints, $scope.routing, true);
                // $scope.addWaypoint(idx, iconIdx, waypoint._latlng, fireRequest);
            });
            /**
             * Dispatches all commands sent by Mapservice by using id and then performing the corresponding function
             */
            orsMapFactory.subscribeToMapFunctions(function onNext(params) {
                

                switch (params._actionCode) {
                    case -1:
                        $scope.mapModel.map.addControl($scope.hg);
                        console.log(params._package.geometry)
                        if (params._package.geometry) {
                            $scope.hg.addData(params._package.geometry);
                        } 
                        else {
                            $scope.hg.remove();
                        }
                        break;
                    /** zoom to features */
                    case 0:
                        $scope.zoom(params._package);
                        break;
                        /** add features */
                    case 1:
                        $scope.addFeatures(params._package);
                        break;
                    case 2:
                        $scope.clear(params._package);
                        break;
                    case 3:
                        $scope.highlightWaypoint(params._package);
                        break;
                    case 4:
                        $scope.togglePolygons(params._package);
                        break;
                    case 5:
                        $scope.clearMap();
                        break;
                    case 6:
                        $scope.reshuffleIndices(params._package);
                        break;
                    case 7:
                        $scope.clearFeaturegroup(params._package);
                        break;
                    case 8:
                        $scope.toggleNumberedMarker(params._package);
                        break;
                    case 9:
                        $scope.reshuffleIndicesText(params._package);
                        break;
                    default:
                        break;
                }
            });
        }]
    };
});
// directive to control the popup to add waypoints on the map
angular.module('orsApp').directive('orsPopup', ['$compile', '$timeout', 'orsSettingsFactory', ($compile, $timeout, orsSettingsFactory) => {
    return {
        restrict: 'E',
        require: '^orsMap', //one directive used,
        templateUrl: 'components/ors-map/directive-templates/ors-popup.html',
        link: (scope, elem, attr) => {
            scope.add = (idx) => {
                scope.processMapWaypoint(idx, scope.displayPos);
            };
        }
    };
}]);
angular.module('orsApp').directive('orsAaPopup', ['$compile', '$timeout', 'orsSettingsFactory', ($compile, $timeout, orsSettingsFactory) => {
    return {
        restrict: 'E',
        require: '^orsMap', //one directive used,
        templateUrl: 'components/ors-map/directive-templates/ors-aa-popup.html',
        link: (scope, elem, attr) => {
            scope.add = (idx) => {
                //fourth argument to not fire a request on add waypoint
                scope.processMapWaypoint(idx, scope.displayPos, false, false);
            };
        }
    };
}]);