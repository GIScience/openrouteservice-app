angular
  .module("orsApp.GeoFileHandler-service", ["ngFileSaver"])
  /**
 /*** Export Factory
 **/ .factory("orsExportFactory", [
    "FileSaver",
    "Blob",
    "$translate",
    "orsNamespaces",
    "orsRequestService",
    "orsSettingsFactory",
    "orsUtilsService",
    "orsRouteService",
    (
      FileSaver,
      Blob,
      $translate,
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
        const request = orsUtilsService.createRequest("directions", payload);
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
        let version = "0.7.2";
        let pointInformation =
          orsRouteService.data.features[orsRouteService.getCurrentRouteIdx()]
            .point_information;
        let [majorV, minorV, patchV] = version.split(".");
        let garminPartNumber = `ORS-0${majorV}${minorV}${patchV}0-DE`;
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
              LangID: "DE",
              PartNumber: garminPartNumber // The formatted XXX-XXXXX-XX Garmin part number of a PC application
            }
          }
        };

        let speedInMPerS = speedInKmPerH / 3.6; // need to convert in m per sec
        let courseObj = {
          Name: name,
          Lap: {
            TotalTimeSeconds: "",
            DistanceMeters:
              pointInformation[pointInformation.length - 1].distance,
            BeginPosition: {
              LatitudeDegrees: pointInformation[0].coords[0],
              LongitudeDegrees: pointInformation[0].coords[1]
            },
            EndPosition: {
              LatitudeDegrees:
                pointInformation[pointInformation.length - 1].coords[0],
              LongitudeDegrees:
                pointInformation[pointInformation.length - 1].coords[1]
            },
            Intensity: "Active"
          },
          Track: { Trackpoint: [] },
          CoursePoint: []
        };
        let duration;
        for (const data of pointInformation) {
          if (data.distance !== undefined) {
            duration = data.distance / speedInMPerS;
            const seconds = duration.toFixed(3) || 0;
            const milliSeconds = seconds.split(".")[1] || 0;
            let durationDate = new Date(
              2010,
              0,
              1,
              12,
              0,
              seconds,
              milliSeconds
            );
            let tp = {
              Time: durationDate.toISOString(),
              Position: {
                LatitudeDegrees: data.coords[0],
                LongitudeDegrees: data.coords[1]
              }
            };
            if (data.heights && data.heights.height !== undefined) {
              tp.AltitudeMeters = data.heights.height;
            }
            tp.DistanceMeters = data.distance;
            courseObj.Track.Trackpoint.push(tp);
          }
        }
        courseObj.Lap.TotalTimeSeconds = duration.toFixed(1);

        // adding now the navigation info...
        const turnInstructions =
          orsRouteService.data.features[orsRouteService.getCurrentRouteIdx()]
            .properties.segments;

        // for the timing we need to sum up the distance of the steps...
        // (to be able to calculate the time of the 'CoursePoint')
        let totalDistance = 0;
        let segmentCount = 0;
        for (const segment of turnInstructions) {
          for (const step of segment.steps) {
            totalDistance = totalDistance + step.distance;
            duration = totalDistance / speedInMPerS;
            const seconds = duration.toFixed(3) || 0;
            const milliSeconds = seconds.split(".")[1] || 0;
            let durationDate = new Date(
              2010,
              0,
              1,
              12,
              0,
              seconds,
              milliSeconds
            );

            let alternativeName;
            let pointType;
            // see org.heigit.ors.routing.instructions.InstructionType
            switch (step.type) {
              case 0:
              case 2:
              case 4:
              case 12:
                pointType = "Left";
                break;

              case 1:
              case 3:
              case 5:
              case 13:
                pointType = "Right";
                break;

              case 6:
                // Continue...
                pointType = "Straight";
                break;

              case 7:
                pointType = "Right"; // not valid in LeftSide Traffic countries...
                alternativeName =
                  $translate.instant("TURN_INFO_RDB_EXIT") +
                  " " +
                  step.exit_number;
                break;

              case 9:
                pointType = "Generic";
                alternativeName = $translate.instant("TURN_INFO_UTURN");
                break;

              case 10: // finish
              case 11: // depart
                if (
                  (step.type === 11 && segmentCount === 0) ||
                  (step.type === 10 && segmentCount === turnInstructions.length)
                ) {
                  pointType = "Generic";
                }
                break;

              default:
                break;
            }

            if (step.type !== undefined) {
              // the index of the coordinate of the "step" start...
              let coordIndex = step.way_points[0];

              // get rid of the possible present HTML tags...
              let inst = step.instruction.replace(/<[^>]+>/g, "").trim();

              // adding the Turn-Instructions...
              let coursePointObj = {
                Name:
                  alternativeName !== undefined
                    ? alternativeName
                    : inst.substr(0, 10).trim(),
                Time: durationDate.toISOString(),
                Position: {
                  LatitudeDegrees: pointInformation[coordIndex].coords[0],
                  LongitudeDegrees: pointInformation[coordIndex].coords[1]
                },
                PointType: pointType,
                Notes: inst
              };
              courseObj.CoursePoint.push(coursePointObj);
            }
          }
          segmentCount++;
        }
        tcx.TrainingCenterDatabase.Courses.Course.push(courseObj);

        JXON.config({ attrPrefix: "@" });
        const tcx_str = JXON.stringify(tcx);
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
            let jsonOutput = {
              bbox: geometry.bbox,
              geometry: geometry.geometry,
              properties: geometry.properties,
              type: geometry.type
            };
            exportData = JSON.stringify(jsonOutput);
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
