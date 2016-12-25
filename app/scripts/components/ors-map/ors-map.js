var $__app_47_scripts_47_components_47_ors_45_map_47_ors_45_map_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-map/ors-map.js";
  angular.module('orsApp').directive('orsMap', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {orsMap: '='},
      link: function(scope, element, attrs) {},
      controller: ['$scope', '$compile', '$timeout', 'orsSettingsFactory', 'orsObjectsFactory', 'orsRequestService', 'orsUtilsService', 'orsMapFactory', 'orsErrorhandlerService', 'orsCookiesFactory', function($scope, $compile, $timeout, orsSettingsFactory, orsObjectsFactory, orsRequestService, orsUtilsService, orsMapFactory, orsErrorhandlerService, orsCookiesFactory) {
        var mapsurfer = L.tileLayer(orsNamespaces.layerMapSurfer.url, {attribution: orsNamespaces.layerMapSurfer.attribution});
        var openstreetmap = L.tileLayer(orsNamespaces.layerOSM.url, {attribution: orsNamespaces.layerOSM.attribution});
        var opencyclemap = L.tileLayer(orsNamespaces.layerOSMCycle.url, {attribution: orsNamespaces.layerOSMCycle.attribution});
        var stamen = L.tileLayer(orsNamespaces.layerStamen.url, {attribution: orsNamespaces.layerStamen.attribution});
        var hillshade = L.tileLayer(orsNamespaces.overlayHillshade.url, {
          format: 'image/png',
          opacity: 0.45,
          transparent: true,
          attribution: '<a href="http://srtm.csi.cgiar.org/">SRTM</a>; ASTER GDEM is a product of <a href="http://www.meti.go.jp/english/press/data/20090626_03.html">METI</a> and <a href="https://lpdaac.usgs.gov/products/aster_policies">NASA</a>'
        });
        $scope.geofeatures = {
          layerLocationMarker: L.featureGroup(),
          layerRoutePoints: L.featureGroup(),
          layerRouteLines: L.featureGroup(),
          layerAccessibilityAnalysis: L.featureGroup(),
          layerEmph: L.featureGroup(),
          layerTracks: L.featureGroup()
        };
        $scope.mapModel = {
          map: $scope.orsMap,
          geofeatures: $scope.geofeatures
        };
        $scope.baseLayers = {
          "MapSurfer": mapsurfer,
          "OpenStreetMap": openstreetmap,
          "OpenCycleMap": opencyclemap,
          "Stamen": stamen
        };
        $scope.overlays = {"Hillshade": hillshade};
        $scope.mapModel.map.on("load", function(evt) {
          mapsurfer.addTo($scope.orsMap);
          $scope.mapModel.geofeatures.layerRoutePoints.addTo($scope.orsMap);
          $scope.mapModel.geofeatures.layerRouteLines.addTo($scope.orsMap);
          $scope.mapModel.geofeatures.layerAccessibilityAnalysis.addTo($scope.orsMap);
          $scope.mapModel.geofeatures.layerEmph.addTo($scope.orsMap);
          $scope.mapModel.geofeatures.layerTracks.addTo($scope.orsMap);
          L.control.layers($scope.baseLayers, $scope.overlays).addTo($scope.orsMap);
        });
        var mapOptions = orsCookiesFactory.getMapOptions();
        if (mapOptions) {
          if (mapOptions.mapCenter)
            $scope.mapModel.map.panTo(mapOptions.mapCenter);
          if (mapOptions.mapZoom)
            $scope.mapModel.map.setZoom(mapOptions.mapZoom);
        } else {
          $scope.orsMap.setView([49.409445, 8.692953], 13);
        }
        $scope.mapModel.map.on('contextmenu', function(e) {
          $scope.displayPos = e.latlng;
          var popupEvent;
          if ($scope.routing) {
            popupEvent = $compile('<ors-popup></ors-popup>')($scope);
          } else {
            popupEvent = $compile('<ors-aa-popup></ors-aa-popup>')($scope);
          }
          var popup = L.popup({
            closeButton: true,
            className: 'cm-popup'
          }).setContent(popupEvent[0]).setLatLng(e.latlng);
          $scope.mapModel.map.openPopup(popup);
        });
        $scope.mapModel.map.on('moveend', function(e) {
          var mapCenter = $scope.mapModel.map.getCenter();
          var mapZoom = $scope.mapModel.map.getZoom();
          var options = {
            mapCenter: mapCenter,
            mapZoom: mapZoom
          };
          orsCookiesFactory.setMapOptions(options);
        });
        $scope.processMapWaypoint = function(idx, pos) {
          var updateWp = arguments[2] !== (void 0) ? arguments[2] : false;
          var fireRequest = arguments[3] !== (void 0) ? arguments[3] : true;
          if (updateWp) {
            orsSettingsFactory.updateWaypoint(idx, '', pos, fireRequest);
          } else {
            var waypoint = orsObjectsFactory.createWaypoint('', pos, 1);
            orsSettingsFactory.insertWaypointFromMap(idx, waypoint, fireRequest);
          }
          orsSettingsFactory.getAddress(pos, idx, updateWp);
          orsUtilsService.parseSettingsToPermalink(orsSettingsFactory.getSettings(), orsSettingsFactory.getUserOptions());
          $scope.mapModel.map.closePopup();
        };
        $scope.addWaypoint = function(idx, iconIdx, pos) {
          var fireRequest = arguments[3] !== (void 0) ? arguments[3] : true;
          var aaIcon = arguments[4] !== (void 0) ? arguments[4] : false;
          var waypointIcon = aaIcon === true ? new L.icon(lists.waypointIcons[3]) : new L.icon(lists.waypointIcons[iconIdx]);
          var wayPointMarker = new L.marker(pos, {
            icon: waypointIcon,
            draggable: 'true',
            idx: idx
          });
          wayPointMarker.addTo($scope.mapModel.geofeatures.layerRoutePoints);
          wayPointMarker.on('dragend', function(event) {
            var idx = event.target.options.idx;
            var pos = event.target._latlng;
            console.log(fireRequest);
            $scope.processMapWaypoint(idx, pos, true, fireRequest);
          });
        };
        $scope.clearMap = function() {
          $scope.mapModel.geofeatures.layerLocationMarker.clearLayers();
          $scope.mapModel.geofeatures.layerRoutePoints.clearLayers();
          $scope.mapModel.geofeatures.layerRouteLines.clearLayers();
          $scope.mapModel.geofeatures.layerAccessibilityAnalysis.clearLayers();
          $scope.mapModel.geofeatures.layerEmph.clearLayers();
        };
        $scope.reAddWaypoints = function(waypoints) {
          var fireRequest = arguments[1] !== (void 0) ? arguments[1] : true;
          var aaIcon = arguments[2] !== (void 0) ? arguments[2] : false;
          console.info("reAddWaypoints");
          $scope.clearMap();
          var idx = 0;
          angular.forEach(waypoints, function(waypoint) {
            var iconIdx = orsSettingsFactory.getIconIdx(idx);
            if (waypoint._latlng.lat && waypoint._latlng.lng)
              $scope.addWaypoint(idx, iconIdx, waypoint._latlng, fireRequest, aaIcon);
            idx += 1;
          });
        };
        $scope.zoom = function(actionPackage) {
          if (typeof actionPackage != 'undefined') {
            if (typeof actionPackage.featureId != 'undefined') {
              $scope.mapModel.geofeatures[actionPackage.layerCode].eachLayer(function(layer) {
                if (layer.options.index == actionPackage.featureId) {
                  $scope.orsMap.fitBounds(layer.getBounds());
                }
              });
            } else if (actionPackage.featureId === undefined) {
              if (actionPackage.geometry !== undefined) {
                var bounds = new L.LatLngBounds(actionPackage.geometry);
                $scope.orsMap.fitBounds(bounds);
              } else {
                $scope.orsMap.fitBounds(new L.featureGroup(Object.keys($scope.mapModel.geofeatures).map(function(key) {
                  return $scope.mapModel.geofeatures[key];
                })).getBounds());
              }
            }
          } else {
            $scope.orsMap.fitBounds(new L.featureGroup(Object.keys($scope.mapModel.geofeatures).map(function(key) {
              return $scope.mapModel.geofeatures[key];
            })).getBounds());
          }
        };
        $scope.highlightWaypoint = function(actionPackage) {
          $scope.mapModel.geofeatures[actionPackage.layerCode].eachLayer(function(layer) {
            if (layer.options.idx == actionPackage.featureId) {
              var waypointIcon;
              if (layer.options.highlighted === true) {
                var iconIdx = orsSettingsFactory.getIconIdx(layer.options.idx);
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
        $scope.addFeatures = function(actionPackage) {
          var polyLine = L.polyline(actionPackage.geometry, {index: !(actionPackage.featureId === undefined) ? actionPackage.featureId : null}).addTo($scope.mapModel.geofeatures[actionPackage.layerCode]);
          polyLine.setStyle(actionPackage.style);
        };
        $scope.addPolygons = function(actionPackage) {
          var getGradientColor = function(rangePos) {
            hsl = Math.floor(120 - 120 * rangePos);
            return "hsl(" + hsl + ", 100%, 50%" + ")";
          };
          for (var i = actionPackage.geometry.length - 1; i >= 0; i--) {
            L.polygon(actionPackage.geometry[i], {
              fillColor: actionPackage.geometry.length == 1 ? getGradientColor(1) : getGradientColor(i / (actionPackage.geometry.length - 1)),
              color: '#000',
              weight: 1,
              fillOpacity: 1
            }).addTo($scope.mapModel.geofeatures[actionPackage.layerCode]);
          }
          var svg = d3.select($scope.mapModel.map.getPanes().overlayPane).style("opacity", 0.5);
          svg.selectAll("path").style("stroke-opacity", 1);
        };
        $scope.clear = function(actionPackage) {
          if (!(actionPackage.featureId === undefined)) {
            $scope.mapModel.geofeatures[actionPackage.layerCode].eachLayer(function(layer) {
              if (layer.options.index == actionPackage.featureId) {
                $scope.mapModel.geofeatures[actionPackage.layerCode].removeLayer(layer);
              }
            });
          } else {
            $scope.mapModel.geofeatures[actionPackage.layerCode].clearLayers();
          }
        };
        orsSettingsFactory.subscribeToNgRoute(function onNext(route) {
          var svg = d3.select($scope.mapModel.map.getPanes().overlayPane);
          $scope.clearMap();
          $scope.routing = route == 'routing' ? true : false;
          if ($scope.routing)
            svg.style("opacity", 1);
        });
        orsSettingsFactory.subscribeToWaypoints(function onNext(d) {
          console.log('changes in routing waypoints detected..', d);
          var waypoints = d;
          if (waypoints.length > 0)
            $scope.reAddWaypoints(waypoints, $scope.routing);
        });
        orsSettingsFactory.subscribeToAaWaypoints(function onNext(d) {
          console.log('changes in aa waypoints detected..', d);
          var waypoints = d;
          if (waypoints.length > 0)
            $scope.reAddWaypoints(waypoints, $scope.routing, true);
        });
        orsMapFactory.subscribeToMapFunctions(function onNext(params) {
          switch (params._actionCode) {
            case 0:
              $scope.zoom(params._package);
              break;
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
              $scope.addPolygons(params._package);
              break;
            case 5:
              $scope.clearMap();
              break;
            default:
              break;
          }
        });
      }]
    };
  });
  angular.module('orsApp').directive('orsPopup', ['$compile', '$timeout', 'orsSettingsFactory', function($compile, $timeout, orsSettingsFactory) {
    return {
      restrict: 'E',
      require: '^orsMap',
      templateUrl: 'scripts/components/ors-map/directive-templates/ors-popup.html',
      link: function(scope, elem, attr) {
        scope.add = function(idx) {
          scope.processMapWaypoint(idx, scope.displayPos);
        };
      }
    };
  }]);
  angular.module('orsApp').directive('orsAaPopup', ['$compile', '$timeout', 'orsSettingsFactory', function($compile, $timeout, orsSettingsFactory) {
    return {
      restrict: 'E',
      require: '^orsMap',
      templateUrl: 'scripts/components/ors-map/directive-templates/ors-aa-popup.html',
      link: function(scope, elem, attr) {
        scope.add = function(idx) {
          scope.processMapWaypoint(idx, scope.displayPos, false, false);
        };
      }
    };
  }]);
  return {};
})();
