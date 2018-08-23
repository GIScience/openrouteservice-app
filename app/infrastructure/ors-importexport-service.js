angular
  .module("orsApp.GeoFileHandler-service", ["ngFileSaver"])
  /**
 /*** Export Factory
 **/
  .factory("orsExportFactory", [
    "FileSaver",
    "Blob",
    "orsNamespaces",
    (FileSaver, Blob, orsNamespaces) => {
      var orsExportFactory = {};
      /**
       * Export any vector element on the map to GPX
       * @param {Object} geometry: the route object (leaflet object) to export
       * @param {String} geomType: the type of geometry which is passed
       * @param {Object} options: export options
       * @param {String} format: the file format to export
       * @param {String} filename: the filename of the exported file
       */
      orsExportFactory.exportFile = (
        geometry,
        geomType,
        options,
        format,
        filename
      ) => {
        let exportData, geojsonData, extension;
        extension = "." + format;
        switch (format) {
          case "gpx":
            geojsonData = L.polyline(geometry).toGeoJSON();
            geojsonData.properties.name = filename; // togpx is looking for name tag https://www.npmjs.com/package/togpx#gpx
            exportData = togpx(geojsonData, {
              creator: "OpenRouteService.org"
            });
            break;
          case "kml":
            geojsonData = L.polyline(geometry).toGeoJSON();
            exportData = tokml(geojsonData);
            break;
          case "rawjson":
            // removing nodes from the geometry data that is for sure not needed
            // by 3'rd party...
            delete geometry.extras;
            delete geometry.geometryRaw;
            delete geometry.$$hashKey;

            // MARQ24: point_information have an massive effect on the actual file size!
            // So I am not 100% sure if this should be included or not in the exported
            // json data - personally I do not have any need for this info on my mobile
            // client - that's why IMHO it can/should be removed from the raw output
            delete geometry.point_information;

            exportData = JSON.stringify(geometry);
            extension = ".json";
            break;
          case "geojson":
            if (geomType == "linestring") {
              if (!options.elevation) {
                angular.forEach(geometry, function(value) {
                  value = value.splice(2, 1);
                });
              }
              exportData = JSON.stringify(L.polyline(geometry).toGeoJSON());
            } else if (geomType == "polygon") {
              let isochrones = [];
              for (let i = 0; i < geometry.length; i++) {
                let properties = geometry[i].properties;
                properties.id = i;
                let c = geometry[i].geometry.coordinates;
                for (let k = 0; k < c[0].length; k++) {
                  let store = c[0][k][0];
                  c[0][k][0] = c[0][k][1];
                  c[0][k][1] = store;
                }
                const geojsonpolygon = {
                  type: "Feature",
                  properties: properties,
                  geometry: {
                    type: "Polygon",
                    coordinates: c
                  }
                };
                isochrones.push(geojsonpolygon);
              }
              exportData = JSON.stringify(isochrones);
              exportData =
                '{"type":"FeatureCollection","features":' + exportData + "}";
            }
            break;
          default:
        }
        exportData = new Blob([exportData], {
          type: "application/xml;charset=utf-8"
        });
        FileSaver.saveAs(exportData, filename + extension);
      };
      return orsExportFactory;
    }
  ])
  /**
     /*** Import Factory
     **/
  .factory("orsImportFactory", [
    "orsNamespaces",
    orsNamespaces => {
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
          case "gpx":
            features = omnivore.gpx.parse(fileContent);
            break;
          case "kml":
            features = omnivore.kml.parse(fileContent);
            break;
          case "geojson":
            features = L.geoJson(JSON.parse(fileContent));
            break;
          case "csv":
            features = omnivore.csv.parse(fileContent);
            // TO DO
            break;
          case "wkt":
            features = omnivore.wkt.parse(fileContent);
            // TO DO
            break;
          default:
            alert("Error: file extension not is valid");
        }
        latlngs = features.getLayers()[0]._latlngs;
        geometry = [];
        // multi dimensional
        if (latlngs[0].constructor === Array) {
          for (i = 0; i < latlngs.length; i++) {
            for (let j = 0; j < latlngs[i].length; j++) {
              geometry.push([latlngs[i][j].lat, latlngs[i][j].lng]);
            }
          }
          // one dimensional
        } else {
          for (i = 0; i < latlngs.length; i++) {
            geometry.push([latlngs[i].lat, latlngs[i].lng]);
          }
        }
        return geometry;
      };
      return orsImportFactory;
    }
  ]);
