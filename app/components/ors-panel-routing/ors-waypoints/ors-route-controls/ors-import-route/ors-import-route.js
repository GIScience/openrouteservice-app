angular.module('orsApp.ors-importRoute-controls', []).component('orsImportRouteControls', {
    templateUrl: '/app/components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-import-route/import_route_tpl.html',
    controller($scope, orsImportFactory, orsObjectsFactory, orsUtilsService, orsMapFactory, orsSettingsFactory) {
        let ctrl = this;
        ctrl.showCSVopt = false;
        ctrl.showXY = false;
        ctrl.showXYZ = false;
        ctrl.showWKT = false;
        ctrl.isCsv = false;
        ctrl.loadedPreviewLayers = [];
        ctrl.fileNameChanged = function(fileName) {
            var uploadedFiles = [];
            var fileArrayLength = fileName.files.length;
            // Initialize the global variable preocessedCount. This variable will be responsible to iterate and keep track of the current iteration during the on load event
            var processedCount = 0;
            //This will loop through all the opened files
            for (var i = 0; i < fileArrayLength; i++) {
                var current_fileObject = fileName.files[i];
                var reader = new FileReader();
                //On load event call.  This event is assýnc
                reader.onload = (function(theFile) {
                    return function() {
                        onLoadHandler(this, theFile, processedCount, uploadedFiles); //this will happen during the onload event
                        onLoadEndHandler(); // this happens at the end of the onload event.
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
                    //this code will run after everything has been loaded and processed
                    ctrl.uploadedFiles = uploadedFiles;
                    $scope.$apply();
                }
            };
        };
        ctrl.previewRoute = function(file) {
            if (file.preview) {
                //gets the Geometry from the opened file
                const geometry = orsImportFactory.importFile(file.extension, file.content);
                // create map action and add geom to layer tracks. Adds the track when checkbox is checked
                let trackPadding = orsObjectsFactory.createMapAction(1, lists.layers[4], geometry.geometry.coordinates, file.index, lists.layerStyles.trackPadding());
                orsMapFactory.mapServiceSubject.onNext(trackPadding);
                let track = orsObjectsFactory.createMapAction(1, lists.layers[4], geometry.geometry.coordinates, file.index, lists.layerStyles.track());
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
        ctrl.importRoute = function(file) {
            const geometry = orsImportFactory.importFile(file.extension, file.content);
            let linestring = turf.linestring(geometry.geometry.coordinates);
            linestring = turf.simplify(linestring, 0.01, false);
            let waypoints = [];
            for (let coord of linestring.geometry.coordinates) {
                const latLng = new L.latLng([parseFloat(coord[0]), parseFloat(coord[1])]);
                const latLngString = orsUtilsService.parseLatLngString(latLng);
                const wpObj = orsObjectsFactory.createWaypoint(latLngString, latLng, 1);
                waypoints.push(wpObj);
            }
            orsSettingsFactory.setWaypoints(waypoints);
            // fetch addresses afterwards
            angular.forEach(waypoints, function(wp, idx) {
                orsSettingsFactory.getAddress(wp._latlng, idx, true);
            });
        };
    }
});