angular
  .module("orsApp.GeoFileHandler-service", ["ngFileSaver"])
  /**
 /*** Export Factory
 **/ .factory("orsExportFactory", [
    "FileSaver",
    "Blob",
    "orsNamespaces",
    "orsRequestService",
    "orsSettingsFactory",
    "orsUtilsService",
    "orsRouteService",
    (
      FileSaver,
      Blob,
      orsNamespaces,
      orsRequestService,
      orsSettingsFactory,
      orsUtilsService,
      orsRouteService
    ) => {
      /**
       * Creates the GPX data to export from the vector geometries on the map
       * using togpx: https://github.com/tyrasd/togpx
       * @param geometry - geometry to convert
       * @param filename - filename of the export file
       * @returns - the gpx data in xml format
       */
      let gpxExportFromMap = (geometry, filename) => {
        let geojsonData = L.polyline(geometry).toGeoJSON();
        geojsonData.properties.name = filename; // togpx is looking for name tag https://www.npmjs.com/package/togpx#gpx
        return togpx(geojsonData, {
          creator: "OpenRouteService.org"
        });
      };
      /**
       * Save GPX file by doing an additional api call
       * using format=gpx with the same options
       * @param options - route options
       * @param filename - filename of the export file
       */
      let saveGpxFromApi = (options, filename) => {
        let userOptions = orsSettingsFactory.getUserOptions();
        let settings = orsSettingsFactory.getSettings();
        let payload = orsUtilsService.routingPayload(settings, userOptions);
        payload.geometry_format = "gpx";
        if (!options.instructions) payload.instructions = false;
        const request = orsRouteService.fetchRoute(payload);
        orsRouteService.routingRequests.requests.push(request);
        request.promise.then(
          function(response) {
            // parsing xml to js object using https://www.npmjs.com/package/xml-js
            let exportData = xml2js(response);
            let metadata = exportData.elements[0].elements[0].elements;
            metadata[0].elements[0].text = filename;
            // description node can be <desc></desc> so the parsed object wont have an elements array
            if (metadata[1].elements == null) {
              metadata[1].elements = [{ text: "", type: "text" }];
            }
            // this will suppress the jshint error for linebreak before ternary
            /*jshint -W014 */
            metadata[1].elements[0].text = options.instruction
              ? "This route and instructions were generated from maps.openrouteservice"
              : "This route was generated from maps.openrouteservice";
            // parsing back to xml string + saving
            exportData = js2xml(exportData);
            exportData = new Blob([exportData], {
              type: "application/xml;charset=utf-8"
            });
            FileSaver.saveAs(exportData, filename + ".gpx");
          },
          function(error) {
            orsSettingsFactory.requestSubject.onNext(false);
            alert("There was an error generating the gpx file: " + error);
          }
        );
      };

      // create a simple Course TCX file (MARQ24)
      // see https://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd
      let toTcx = (name, speedInKmPerH) => {
        let version = "0.4.1"
        let pointInformation = orsRouteService.data.features[orsRouteService.getCurrentRouteIdx()].point_information
        let [majorV, minorV, patchV] = version.split('.')
        let garminPartNumber = `ORS-0${majorV}${minorV}${patchV}0-DE`
        let tcx = {
          TrainingCenterDatabase: {
            "@xsi:schemaLocation":
              "http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd",
            "@xmlns":
              "http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2",
            "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            Courses: { Course: [] },
            Author: {
              "@xsi:type": "Application_t",
              Name: "openrouteservice.org",
              Build: {
                Version: {
                  VersionMajor: majorV,
                  VersionMinor: minorV,
                  BuildMajor: patchV,
                  BuildMinor: "0"
                },
                Type: "Release",
                Time: "Jan 26 2020, 10:00:00",
                Builder: "mcp"
              },
              LangID: "DE", PartNumber: garminPartNumber // The formatted XXX-XXXXX-XX Garmin part number of a PC application
            }
          }
        };

        let speedInMPerS = speedInKmPerH / 3.6; // need to convert in m per sec
        let courseObj = {
          Name: name,
          Lap: {
            TotalTimeSeconds: "",
            DistanceMeters: pointInformation[pointInformation.length - 1].distance,
            BeginPosition: {
              LatitudeDegrees: pointInformation[0].coords[0],
              LongitudeDegrees: pointInformation[0].coords[1]
            },
            EndPosition: {
              LatitudeDegrees: pointInformation[pointInformation.length - 1].coords[0],
              LongitudeDegrees: pointInformation[pointInformation.length - 1].coords[1]
            },
            Intensity: "Active"
          },
          Track: { Trackpoint: [] }
        }
        let duration
        for (const data of pointInformation) {
          if (data.distance !== undefined) {
            duration = data.distance / speedInMPerS;
            const seconds = duration.toFixed(3) || 0
            const milliSeconds = seconds.split('.')[1] || 0
            let durationDate = new Date(2010,0,1,0,0,seconds, milliSeconds)
            let tp = {
              Time: durationDate.toISOString(),
              Position: {
                LatitudeDegrees: data.coords[0],
                LongitudeDegrees: data.coords[1]
              },
              DistanceMeters: data.distance
            }
            if (
              data.heights &&
              data.heights.height !== undefined
            ) {
              tp.AltitudeMeters = data.heights.height;
            }
            courseObj.Track.Trackpoint.push(tp);
          }
        }
        courseObj.Lap.TotalTimeSeconds = duration.toFixed(1);
        tcx.TrainingCenterDatabase.Courses.Course.push(courseObj);

        JXON.config({ attrPrefix: "@" });
        const tcx_str = JXON.stringify(tcx)
        return '<?xml version="1.0" encoding="UTF-8"?>' + tcx_str;
      };

      let orsExportFactory = {};
      /**
       * Export any vector element on the map to file
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
          /**
           * To generate the gpx file the ORS API is called with format=gpx and current settings.
           * Instructions can be included when needed.
           */
          case "gpx":
            if (options.toGpx) {
              exportData = gpxExportFromMap(geometry, filename);
            } else {
              saveGpxFromApi(options, filename, extension);
            }
            break;
          case "kml":
            geojsonData = L.polyline(geometry).toGeoJSON();
            exportData = tokml(geojsonData);
            break;
          case "tcx":
            exportData = toTcx(filename, options.speedInKmh);
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
            if (geomType === "linestring") {
              if (!options.elevation) {
                angular.forEach(geometry, value => {
                  value = value.splice(2, 1);
                });
              }
              exportData = JSON.stringify(L.polyline(geometry).toGeoJSON());
            } else if (geomType === "polygon") {
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
                const geoJsonPolygon = {
                  type: "Feature",
                  properties: properties,
                  geometry: {
                    type: "Polygon",
                    coordinates: c
                  }
                };
                isochrones.push(geoJsonPolygon);
              }
              exportData = JSON.stringify(isochrones);
              exportData =
                '{"type":"FeatureCollection","features":' + exportData + "}";
            }
            break;
          default:
        }
        // as API gpx generation is async we have to save it upon returned promise
        // therefore skipping saving for gpx here
        if (!(format === "gpx" && !options.toGpx)) {
          exportData = new Blob([exportData], {
            type: "application/xml;charset=utf-8"
          });
          FileSaver.saveAs(exportData, filename + extension);
        }
      };
      return orsExportFactory;
    }
  ])
  /**
 /*** Import Factory
 **/ .factory("orsImportFactory", [
    "orsNamespaces",
    orsNamespaces => {
      let orsImportFactory = {};
      /**
       * Import a file and load to the map as a vector element
       * @param {String} fileExt: file extension
       * @param {String} fileContent: content of the file
       * @return {Object} geometry: returns the geometry
       */
      orsImportFactory.importFile = (fileExt, fileContent) => {
        let latLngs, features, geometry, i;
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
        latLngs = features.getLayers()[0]._latlngs;
        geometry = [];
        // multi dimensional
        if (latLngs[0].constructor === Array) {
          for (i = 0; i < latLngs.length; i++) {
            for (let j = 0; j < latLngs[i].length; j++) {
              geometry.push([latLngs[i][j].lat, latLngs[i][j].lng]);
            }
          }
          // one dimensional
        } else {
          for (i = 0; i < latLngs.length; i++) {
            geometry.push([latLngs[i].lat, latLngs[i].lng]);
          }
        }
        return geometry;
      };
      return orsImportFactory;
    }
  ]);
