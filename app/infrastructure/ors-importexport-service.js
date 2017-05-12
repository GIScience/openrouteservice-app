angular.module('orsApp.GeoFileHandler-service', ['ngFileSaver'])
    /**
    /*** Export Factory
    **/
    .factory('orsExportFactory', ['FileSaver', 'Blob', 'orsNamespaces', (FileSaver, Blob, orsNamespaces) => {
        var orsExportFactory = {};
        /**
         * Export any vector element on the map to GPX
         * @param {Object} geometry: the route object (leaflet object) to export
         * @param {String} geomType: the type of geometry which is passed 
         * @param {Object} options: export options 
         * @param {String} format: the file format to export
         */
        orsExportFactory.exportFile = (geometry, geomType, options, format) => {
            let exportData, geojsonData, extension;
            extension = '.' + format;
            switch (format) {
                case 'gpx':
                    geojsonData = L.polyline(geometry).toGeoJSON();
                    exportData = togpx(geojsonData, {
                        creator: "OpenRouteService.org"
                    });
                    break;
                case 'kml':
                    geojsonData = L.polyline(geometry).toGeoJSON();
                    exportData = tokml(geojsonData);
                    break;
                case 'geojson':
                    if (geomType == 'linestring') {
                        exportData = JSON.stringify(L.polyline(geometry).toGeoJSON());
                    } else if (geomType == 'polygon') {
                        let isochrones = [];
                        for (let i = 0; i < geometry.length; i++) {
                            console.log(geometry[i]);
                            let properties = geometry[i].properties;
                            properties.id = i;
                            let c = geometry[i].geometry.coordinates;
                            for (let k = 0; k < c[0].length; k++) {
                                let store = c[0][k][0];
                                c[0][k][0] = c[0][k][1];
                                c[0][k][1] = store;
                            }
                            geojsonpolygon = {
                                "type": "Feature",
                                "properties": properties,
                                "geometry": {
                                    "type": "Polygon",
                                    "coordinates": c
                                }
                            };
                            isochrones.push(geojsonpolygon);
                        }
                        exportData = JSON.stringify(isochrones);
                        exportData = "{\"type\":\"FeatureCollection\",\"features\":"+exportData+"}";
                    }
                    break;
                default:
            }
            exportData = new Blob([exportData], {
                type: 'application/xml;charset=utf-8'
            });
            FileSaver.saveAs(exportData, 'ors-export-' + geomType + extension);
        };
        return orsExportFactory;
    }])
    /**
    /*** Import Factory
    **/
    .factory('orsImportFactory', ['orsNamespaces', (orsNamespaces) => {
        var orsImportFactory = {};
        /**
         * Import a file and load to the map as a vector element
         * @param {String} fileExt: file extension
         * @param {String} fileContent: content of the file
         * @return {Object} geometry: returns the geometry
         */
        orsImportFactory.importFile = (fileExt, fileContent) => {
            let latlngs, features, geometry, i;
            switch (fileExt) {
                case 'gpx':
                    features = omnivore.gpx.parse(fileContent);
                    break;
                case 'kml':
                    features = omnivore.kml.parse(fileContent);
                    break;
                case 'geojson':
                    features = L.geoJson(JSON.parse(fileContent));
                    break;
                case 'csv':
                    features = omnivore.csv.parse(fileContent);
                    // TO DO
                    break;
                case 'wkt':
                    features = omnivore.wkt.parse(fileContent);
                    // TO DO
                    break;
                default:
                    alert("Error: file extension not is valid");
            }
            latlngs = features.getLayers()[0]._latlngs;
            geometry = [];
            for (i = 0; i < latlngs.length; i++) {
                geometry.push([latlngs[i].lat, latlngs[i].lng]);
            }
            return geometry;
        };
        return orsImportFactory;
    }]);