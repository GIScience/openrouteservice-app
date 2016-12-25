var $__app_47_scripts_47_components_47_ors_45_panel_45_routing_47_ors_45_waypoints_47_ors_45_route_45_controls_47_ors_45_import_45_route_47_ors_45_import_45_route_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-import-route/ors-import-route.js";
  angular.module('orsApp.ors-importRoute-controls', []).component('orsImportRouteControls', {
    templateUrl: 'scripts/components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-import-route/import_route_tpl.html',
    controller: ['$scope', 'orsImportFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsMapFactory', 'orsSettingsFactory', function($scope, orsImportFactory, orsObjectsFactory, orsUtilsService, orsMapFactory, orsSettingsFactory) {
      var $__2 = this;
      var ctrl = this;
      ctrl.showCSVopt = false;
      ctrl.showXY = false;
      ctrl.showXYZ = false;
      ctrl.showWKT = false;
      ctrl.isCsv = false;
      ctrl.loadedPreviewLayers = [];
      ctrl.fileNameChanged = function(fileName) {
        var uploadedFiles = [];
        var fileArrayLength = fileName.files.length;
        var processedCount = 0;
        for (var i = 0; i < fileArrayLength; i++) {
          var current_fileObject = fileName.files[i];
          var reader = new FileReader();
          reader.onload = (function(theFile) {
            return function() {
              onLoadHandler($__2, theFile, processedCount, uploadedFiles);
              onLoadEndHandler();
            };
          })(current_fileObject);
          reader.readAsText(current_fileObject);
        }
        var onLoadHandler = function(e, theFile, processedCount, uploadedFiles) {
          uploadedFiles[processedCount] = {
            name: theFile.name,
            extension: (theFile.name).slice(((theFile.name).lastIndexOf(".") - 1 >>> 0) + 2),
            index: processedCount,
            content: e.result,
            preview: false
          };
        };
        var onLoadEndHandler = function() {
          processedCount++;
          if (processedCount == fileArrayLength) {
            ctrl.uploadedFiles = uploadedFiles;
            $scope.$apply();
          }
        };
      };
      ctrl.previewRoute = function(file) {
        if (file.preview) {
          var geometry = orsImportFactory.importFile(file.extension, file.content);
          var trackPadding = orsObjectsFactory.createMapAction(1, lists.layers[4], geometry.geometry.coordinates, file.index, lists.layerStyles.trackPadding());
          orsMapFactory.mapServiceSubject.onNext(trackPadding);
          var track = orsObjectsFactory.createMapAction(1, lists.layers[4], geometry.geometry.coordinates, file.index, lists.layerStyles.track());
          orsMapFactory.mapServiceSubject.onNext(track);
          var action_zoomToLayer = orsObjectsFactory.createMapAction(0, lists.layers[4], undefined, file.index);
          orsMapFactory.mapServiceSubject.onNext(action_zoomToLayer);
        } else {
          var action_removeLayer = orsObjectsFactory.createMapAction(2, lists.layers[4], undefined, file.index);
          orsMapFactory.mapServiceSubject.onNext(action_removeLayer);
        }
      };
      ctrl.importRoute = function(file) {
        var geometry = orsImportFactory.importFile(file.extension, file.content);
        var linestring = turf.linestring(geometry.geometry.coordinates);
        linestring = turf.simplify(linestring, 0.01, false);
        var waypoints = [];
        var $__6 = true;
        var $__7 = false;
        var $__8 = undefined;
        try {
          for (var $__4 = void 0,
              $__3 = (linestring.geometry.coordinates)[Symbol.iterator](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
            var coord = $__4.value;
            {
              var latLng = new L.latLng([parseFloat(coord[0]), parseFloat(coord[1])]);
              var latLngString = orsUtilsService.parseLatLngString(latLng);
              var wpObj = orsObjectsFactory.createWaypoint(latLngString, latLng, 1);
              waypoints.push(wpObj);
            }
          }
        } catch ($__9) {
          $__7 = true;
          $__8 = $__9;
        } finally {
          try {
            if (!$__6 && $__3.return != null) {
              $__3.return();
            }
          } finally {
            if ($__7) {
              throw $__8;
            }
          }
        }
        orsSettingsFactory.setWaypoints(waypoints);
        angular.forEach(waypoints, function(wp, idx) {
          orsSettingsFactory.getAddress(wp._latlng, idx, true);
        });
      };
    }]
  });
  return {};
})();
