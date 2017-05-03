angular.module('orsApp.ors-importRoute-controls', []).component('orsImportRouteControls', {
    templateUrl: 'components/ors-panel-routing/ors-import-route/import_route_tpl.html',
    controller: ['$scope', 'orsImportFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsMapFactory', 'orsSettingsFactory', 'lists', function($scope, orsImportFactory, orsObjectsFactory, orsUtilsService, orsMapFactory, orsSettingsFactory, lists) {
        let ctrl = this;
        ctrl.showCSVopt = false;
        ctrl.showXY = false;
        ctrl.showXYZ = false;
        ctrl.showWKT = false;
        ctrl.isCsv = false;
        ctrl.loadedPreviewLayers = [];
        ctrl.fileNameChanged = (fileName) => {
            var uploadedFiles = [];
            var fileArrayLength = fileName.files.length;
            // Initialize the global variable preocessedCount. This variable will be responsible to iterate and keep track of the current iteration during the on load event
            var processedCount = 0;
            //This will loop through all the opened files
            for (var i = 0; i < fileArrayLength; i++) {
                setupReader(fileName.files[i]);
            }

            function setupReader(file) {
                var reader = new FileReader();
                //On load event call.  This event is assync
                reader.onload = function(e) {
                    onLoadHandler(reader.result, file.name, processedCount, uploadedFiles); //this will happen during the onload event
                    onLoadEndHandler(); // this happens at the end of the onload event.
                };
                reader.readAsText(file, "UTF-8");
            }
            var onLoadHandler = (result, name, processedCount, uploadedFiles) => {
                uploadedFiles[processedCount] = {
                    name: name,
                    extension: name.slice(((name).lastIndexOf(".") - 1 >>> 0) + 2),
                    index: processedCount,
                    content: result,
                    preview: false
                };
            };
            var onLoadEndHandler = () => {
                processedCount++;
                if (processedCount == fileArrayLength) {
                    //this code will run after everything has been loaded and processed
                    ctrl.uploadedFiles = uploadedFiles;
                    $scope.$apply();
                }
            };
        };
        ctrl.previewRoute = (file) => {
            if (file.preview) {
                //gets the Geometry from the opened file
                const geometry = orsImportFactory.importFile(file.extension, file.content);
                // create map action and add geom to layer tracks. Adds the track when checkbox is checked
                let trackPadding = orsObjectsFactory.createMapAction(1, lists.layers[4], geometry, file.index, lists.layerStyles.trackPadding());
                orsMapFactory.mapServiceSubject.onNext(trackPadding);
                let track = orsObjectsFactory.createMapAction(1, lists.layers[4], geometry, file.index, lists.layerStyles.track());
                orsMapFactory.mapServiceSubject.onNext(track);
                // create the zoom to layer action. Zooms to layer when checkbox is checked
                let action_zoomToLayer = orsObjectsFactory.createMapAction(0, lists.layers[4], undefined, file.index);
                orsMapFactory.mapServiceSubject.onNext(action_zoomToLayer);
            } else {
                // removes the layer when unchecking the checkbox
                let action_removeLayer = orsObjectsFactory.createMapAction(2, lists.layers[4], undefined, file.index);
                orsMapFactory.mapServiceSubject.onNext(action_removeLayer);
            }
        };
        ctrl.importRoute = (file) => {
            const geometry = orsImportFactory.importFile(file.extension, file.content);
            let linestring = L.polyline(geometry).toGeoJSON();
            linestring = turf.simplify(linestring, 0.01, false);
            let waypoints = [];
            for (let coord of linestring.geometry.coordinates) {
                const latLng = new L.latLng([parseFloat(coord[1]), parseFloat(coord[0])]);
                const latLngString = orsUtilsService.parseLatLngString(latLng);
                const wpObj = orsObjectsFactory.createWaypoint(latLngString, latLng, 1);
                waypoints.push(wpObj);
            }
            orsSettingsFactory.setWaypoints(waypoints);
            // fetch addresses afterwards
            angular.forEach(waypoints, (wp, idx) => {
                orsSettingsFactory.getAddress(wp._latlng, idx, true);
            });
        };
    }]
});