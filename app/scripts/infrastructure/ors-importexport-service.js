var $__app_47_scripts_47_infrastructure_47_ors_45_importexport_45_service_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/infrastructure/ors-importexport-service.js";
  angular.module('orsApp.GeoFileHandler-service', ['angular-jxon', 'ngFileSaver']).config(['$JXONProvider', function($JXONProvider) {
    var jxonConfig = {
      valueKey: '_',
      attrKey: '$',
      attrPrefix: '$',
      lowerCaseTags: false,
      trueIsEmpty: false,
      autoDate: false,
      ignorePrefixedNodes: false,
      parseValues: false,
      parserErrorHandler: undefined
    };
    $JXONProvider.config(jxonConfig);
  }]).factory('orsParseFactory', ['$JXON', function($JXON) {
    var orsParseFactory = {};
    orsParseFactory.parseGpx = function(gpxDocument) {
      var jxon = $JXON.xmlToJs(gpxDocument);
      var metadataObj = jxon.gpx.metadata;
      if (metadataObj != undefined) {
        var propertiesObj = {"bounds": "Minimum Latitude: " + metadataObj.bounds.$minlat + +", Maximum Latitude: " + metadataObj.bounds.$maxlat + +", Minimum Longitude: " + metadataObj.bounds.$minlon + +", Maximum Longitude: " + metadataObj.bounds.$maxlon};
      } else {
        propertiesObj = {};
      }
      var gpxCoordinates = [];
      if (jxon.gpx.wpt) {
        for (var i = 0; i < jxon.gpx.wpt.length; i++) {
          gpxCoordinates[i] = [jxon.gpx.wpt[i].$lat, jxon.gpx.wpt[i].$lon];
        }
      } else if (jxon.gpx.rte) {
        for (var i = 0; i < jxon.gpx.rte.rtept.length; i++) {
          gpxCoordinates[i] = [jxon.gpx.rte.rtept[i].$lat, jxon.gpx.rte.rtept[i].$lon];
        }
      } else if (jxon.gpx.trk) {
        for (var i = 0; i < jxon.gpx.trk.trkseg.trkpt.length; i++) {
          gpxCoordinates[i] = [jxon.gpx.trk.trkseg.trkpt[i].$lat, jxon.gpx.trk.trkseg.trkpt[i].$lon];
        }
      }
      var epsgCode = "4326";
      var crsLink = "http://spatialreference.org/ref/epsg/" + epsgCode + "/proj4/";
      var geoJSONDoc = {
        "type": "Feature",
        "properties": propertiesObj,
        "geometry": {
          "coordinates": gpxCoordinates,
          "type": "LineString"
        },
        "crs": {
          "type": "link",
          "properties": {
            "href": crsLink,
            "type": "proj4"
          }
        }
      };
      return geoJSONDoc;
    };
    orsParseFactory.parseTcx = function(tcxDocument) {
      var epsgCode = '4326';
      var jxon = $JXON.xmlToJs(tcxDocument);
      var tcxCoordinates = [];
      for (var i = 0; i < jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint.length; i++) {
        if (jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint[i].AltitudeMeters != undefined) {
          tcxCoordinates[i] = [jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint[i].Position.LatitudeDegrees, jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint[i].Position.LongitudeDegrees, jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint[i].AltitudeMeters];
        } else {
          tcxCoordinates[i] = [jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint[i].Position.LatitudeDegrees, jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint[i].Position.LongitudeDegrees, 0];
        }
      }
      var crsLink = "http://spatialreference.org/ref/epsg/" + epsgCode + "/proj4/";
      var geoJSONDoc = {
        "type": "Feature",
        "properties": undefined,
        "geometry": {
          "coordinates": tcxCoordinates,
          "type": "LineString"
        },
        "crs": {
          "type": "link",
          "properties": {
            "href": crsLink,
            "type": "proj4"
          }
        }
      };
      return geoJSONDoc;
    };
    orsParseFactory.parseKml = function(kmlDocument) {
      var epsgCode = '4326';
      var jxon = $JXON.xmlToJs(kmlDocument);
      var kmlCoordinates = jxon.kml.Document.Placemark.LineString.coordinates;
      kmlCoordinates = kmlCoordinates.split("\n");
      for (var i = 0; i < kmlCoordinates.length; i++) {
        kmlCoordinates[i] = kmlCoordinates[i].split(",");
      }
      for (var i = 0; i < kmlCoordinates.length; i++) {
        var aux = kmlCoordinates[i][0];
        kmlCoordinates[i][0] = kmlCoordinates[i][1];
        kmlCoordinates[i][1] = aux;
      }
      var crsLink = "http://spatialreference.org/ref/epsg/" + epsgCode + "/proj4/";
      var geoJSONDoc = {
        "type": "Feature",
        "properties": undefined,
        "geometry": {
          "coordinates": kmlCoordinates,
          "type": "LineString"
        },
        "crs": {
          "type": "link",
          "properties": {
            "href": crsLink,
            "type": "proj4"
          }
        }
      };
      return geoJSONDoc;
    };
    orsParseFactory.parseGml = function(gmlDocument) {
      var jxon = $JXON.xmlToJs(gmlDocument);
      var geoJSONDoc = {
        "type": "Feature",
        "properties": undefined,
        "geometry": {
          "coordinates": undefined,
          "type": undefined
        },
        "crs": {
          "type": "link",
          "properties": {
            "href": undefined,
            "type": "proj4"
          }
        }
      };
    };
    orsParseFactory.parseGeoJson = function(geoJson) {
      for (var i = 0; i < geoJson.geometry.coordinates.length; i++) {
        var aux = geoJson.geometry.coordinates[i][0];
        geoJson.geometry.coordinates[i][0] = geoJson.geometry.coordinates[i][1];
        geoJson.geometry.coordinates[i][1] = aux;
      }
      var geoJSONDoc = geoJson;
      return geoJSONDoc;
    };
    orsParseFactory.parseCsv = function(csvString, options) {
      if (options === {} || options === null || options === undefined) {
        options = {
          separator: ';',
          geometryFormat: 'xy',
          csvLatLabel: undefined,
          csvLnglabel: undefined,
          csvHeightLabel: undefined,
          csvWktLabel: undefined,
          csvSeparator: undefined,
          csvGeometryFormat: undefined
        };
      } else {
        options = options;
      }
      var csvArray = [];
      var csvAuxArray = [];
      var csvCoordinates = [];
      var csvObject = {};
      var propertiesObj = {};
      var csvRows = csvString.split('\r\n');
      var csvHeaders = csvRows.shift();
      csvHeaders = csvHeaders.split(options.separator);
      for (var i = 0; i < csvRows.length; i++) {
        var rowArray = csvRows[i].split(options.separator);
        for (var j = 0; j < rowArray.length; j++) {
          csvObject[csvHeaders[j]] = rowArray[j];
        }
        csvArray[i] = csvObject;
        csvObject = {};
      }
      var csvCoordAux;
      switch (options.geometryFormat) {
        default:
        case 'xy':
        case 'yx':
          for (var i = 0; i < csvArray.length; i++) {
            var lat = csvArray[i][options.csvLatLabel];
            var lng = csvArray[i][options.csvLnglabel];
            csvCoordinates[i] = [lat, lng];
          }
          break;
        case 'xyz':
          for (var i = 0; i < csvArray.length; i++) {
            var lat = csvArray[i][options.csvLatLabel];
            var lng = csvArray[i][options.csvLnglabel];
            var height = csvArray[i][options.csvHeightLabel];
            csvCoordinates[i] = [lat, lng, height];
          }
          break;
        case 'wkt':
          for (var i = 0; i < csvArray.length; i++) {
            csvCoordinates[i] = (csvArray[i][options.csvWktLabel]).toUpperCase();
            csvCoordinates[i] = csvCoordinates[i].replace("LINESTRING(", "");
            csvCoordinates[i] = csvCoordinates[i].replace(")", "");
          }
          for (var i = 0; i < csvCoordinates.length; i++) {
            csvCoordinates[i] = csvCoordinates[i].split(" ");
            csvCoordAux = csvCoordinates[i][0];
            csvCoordinates[i][0] = csvCoordinates[i][1];
            csvCoordinates[i][1] = csvCoordAux;
          }
          break;
        case 'wktWaypoints':
          for (var i = 0; i < csvArray.length; i++) {
            csvCoordinates[i] = (csvArray[i][options.csvWktLabel]).toUpperCase();
            csvCoordinates[i] = csvCoordinates[i].replace("POINT(", "");
            csvCoordinates[i] = csvCoordinates[i].replace(")", "");
          }
          for (var i = 0; i < csvCoordinates.length; i++) {
            csvCoordinates[i] = csvCoordinates[i].split(" ");
            csvCoordAux = csvCoordinates[i][0];
            csvCoordinates[i][0] = csvCoordinates[i][1];
            csvCoordinates[i][1] = csvCoordAux;
          }
          break;
      }
      for (var property in csvArray[0]) {
        if (property != userDefinedValues.latLabel || property != userDefinedValues.lngLabel || property != userDefinedValues.heightLabel || property != userDefinedValues.wktLabel || property != userDefinedValues.crsLabel) {
          propertiesObj[property] = csvArray[0][property];
        }
      }
      if (options.crsLabel != undefined) {
        var epsgCode = "4326";
      } else {
        epsgCode = "4326";
      }
      var crsLink = "http://spatialreference.org/ref/epsg/" + epsgCode + "/proj4/";
      var geoJSONDoc = {
        "type": "Feature",
        "properties": propertiesObj,
        "geometry": {
          "coordinates": csvCoordinates,
          "type": "LineString"
        },
        "crs": {
          "type": "link",
          "properties": {
            "href": crsLink,
            "type": "proj4"
          }
        }
      };
      return geoJSONDoc;
    };
    return orsParseFactory;
  }]).factory('orsWriterFactory', ['$JXON', function($JXON) {
    var date = new Date();
    var routeGlobalVars = function(route) {
      route = L.polyline(route);
      var geoJSONRoute = route.toGeoJSON();
      var routeBounds = route.getBounds();
      var routeVars = {
        routeObj: geoJSONRoute,
        routeGeometry: geoJSONRoute.geometry.type,
        routeCoords: route.getLatLngs(),
        routeMinLat: routeBounds._southWest.lat,
        routeMaxLat: routeBounds._northEast.lat,
        routeMinLon: routeBounds._southWest.lng,
        routeMaxLon: routeBounds._northEast.lng,
        routeTotalDist: turf.lineDistance(geoJSONRoute, 'kilometers') / 0.001
      };
      return routeVars;
    };
    var orsWriterFactory = {};
    orsWriterFactory.writeGpx = function(route, options, avgSpeed, coordinatePrecision) {
      if (options === {} || options === null || options === undefined) {
        options = {
          gpxWaypoint: true,
          gpxRoute: undefined,
          gpxTrack: undefined
        };
      } else {
        options = options;
      }
      var routeVars = routeGlobalVars(route);
      var gpx = {"gpx": {
          "metadata": [],
          "wpt": [],
          "rte": [],
          "trk": [],
          "$version": "1.1",
          "$creator": orsNamespaces.metadata.authorName,
          "$xmlns:gpx": orsNamespaces.gpx,
          "$xmlns:xsi": orsNamespaces.xsi,
          "$xsi:schemaLocation": orsNamespaces.schemata.gpxService
        }};
      var metadata = {
        "name": orsNamespaces.metadata.name,
        "desc": orsNamespaces.metadata.description,
        "author": {
          "name": orsNamespaces.metadata.authorName,
          "email": {
            "$id": orsNamespaces.metadata.authorEmailId,
            "$domain": orsNamespaces.metadata.authorEmailDomain
          },
          "link": {"$href": orsNamespaces.metadata.link}
        },
        "copyright": {
          "year": date.year,
          "license": orsNamespaces.metadata.license,
          "$author": orsNamespaces.metadata.authorName
        },
        "link": {"$href": orsNamespaces.metadata.link},
        "time": date.toISOString(),
        "keywords": orsNamespaces.metadata.keywords,
        "bounds": {
          "$minlat": (routeVars.routeMinLat).toFixed(coordinatePrecision),
          "$maxlat": (routeVars.routeMaxLat).toFixed(coordinatePrecision),
          "$minlon": (routeVars.routeMinLon).toFixed(coordinatePrecision),
          "$maxlon": (routeVars.routeMaxLon).toFixed(coordinatePrecision)
        }
      };
      gpx.gpx.metadata.push(metadata);
      var distanceCovered = 0;
      var altitude;
      for (var i = 0; i < routeVars.routeCoords.length; i++) {
        if (routeVars.routeCoords[i].alt != undefined) {
          altitude = routeVars.routeCoords[i].alt;
          altitude = altitude.toFixed(3);
        } else {
          altitude = 0;
          altitude = altitude.toFixed(3);
        }
        var wpt_pt = {
          "ele": i,
          "time": date.toISOString(),
          "name": "Waypoint #" + i,
          "extensions": {
            "TrackPointExtension": {"height": altitude},
            "distance": (distanceCovered).toFixed(3)
          },
          "$lat": (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision),
          "$lon": (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision)
        };
        if (i < (routeVars.routeCoords.length) - 1) {
          var from = new L.marker([routeVars.routeCoords[i].lat, routeVars.routeCoords[i].lng]).toGeoJSON();
          var to = new L.marker([routeVars.routeCoords[i + 1].lat, routeVars.routeCoords[i + 1].lng]).toGeoJSON();
        }
        var pointDistance = turf.distance(from, to, 'kilometers') / 0.001;
        distanceCovered = distanceCovered + pointDistance;
        var timeCovered = (pointDistance / (Number(avgSpeed) * 1000 / (3600 * 1000)));
        date.setMilliseconds(date.getMilliseconds() + timeCovered);
        gpx.gpx.wpt.push(wpt_pt);
      }
      var rte = {
        "src": orsNamespaces.metadata.src,
        "link": {
          "text": orsNamespaces.metadata.authorName,
          "$href": orsNamespaces.metadata.link
        },
        "rtept": []
      };
      for (var i = 0; i < routeVars.routeCoords.length; i++) {
        if (routeVars.routeCoords[i].alt != undefined) {
          altitude = routeVars.routeCoords[i].alt;
          altitude = altitude.toFixed(3);
        } else {
          altitude = 0;
          altitude = altitude.toFixed(3);
        }
        var rtept_pt = {
          "ele": i,
          "time": date.toISOString(),
          "name": "Route point #" + i,
          "extensions": {
            "TrackPointExtension": {"cad": altitude},
            "distance": (distanceCovered).toFixed(3)
          },
          "$lat": (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision),
          "$lon": (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision)
        };
        if (i < (routeVars.routeCoords.length) - 1) {
          var from = new L.marker([routeVars.routeCoords[i].lat, routeVars.routeCoords[i].lng]).toGeoJSON();
          var to = new L.marker([routeVars.routeCoords[i + 1].lat, routeVars.routeCoords[i + 1].lng]).toGeoJSON();
        }
        var pointDistance = turf.distance(from, to, 'kilometers') / 0.001;
        var timeCovered = (pointDistance / (Number(avgSpeed) * 1000 / (3600 * 1000)));
        date.setMilliseconds(date.getMilliseconds() + timeCovered);
        rte.rtept.push(rtept_pt);
      }
      var trk = {
        "src": orsNamespaces.metadata.src,
        "link": {
          "text": orsNamespaces.metadata.authorName,
          "$href": orsNamespaces.metadata.link
        },
        "trkseg": {"trkpt": []}
      };
      for (var i = 0; i < routeVars.routeCoords.length; i++) {
        if (routeVars.routeCoords[i].alt != undefined) {
          altitude = routeVars.routeCoords[i].alt;
          altitude = altitude.toFixed(3);
        } else {
          altitude = 0;
          altitude = altitude.toFixed(3);
        }
        var trkpt_pt = {
          "ele": i,
          "time": date.toISOString(),
          "name": "Track point #" + i,
          "extensions": {
            "TrackPointExtension": {"cad": altitude},
            "distance": (distanceCovered).toFixed(3)
          },
          "$lat": (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision),
          "$lon": (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision)
        };
        if (i < (routeVars.routeCoords.length) - 1) {
          var from = new L.marker([routeVars.routeCoords[i].lat, routeVars.routeCoords[i].lng]).toGeoJSON();
          var to = new L.marker([routeVars.routeCoords[i + 1].lat, routeVars.routeCoords[i + 1].lng]).toGeoJSON();
        }
        var pointDistance = turf.distance(from, to, 'kilometers') / 0.001;
        distanceCovered = distanceCovered + pointDistance;
        var timeCovered = (pointDistance / (Number(avgSpeed) * 1000 / (3600 * 1000)));
        date.setMilliseconds(date.getMilliseconds() + timeCovered);
        trk.trkseg.trkpt.push(trkpt_pt);
      }
      if (options.gpxRoute) {
        gpx.gpx.rte.push(rte);
      } else {
        delete gpx.gpx.rte;
      }
      if (options.gpxTrack) {
        gpx.gpx.trk.push(trk);
      } else {
        delete gpx.gpx.trk;
      }
      var jxonObj = gpx;
      jxonObj = JSON.stringify(jxonObj);
      jxonObj = JSON.parse(jxonObj);
      var outputGpx = $JXON.jsToXml(jxonObj);
      return outputGpx;
    };
    orsWriterFactory.writeTcx = function(route, options, avgSpeed, coordinatePrecision) {
      if (options === {} || options === null || options === undefined) {
        options = {tcxOptions: undefined};
      } else {
        options = options;
      }
      var routeVars = routeGlobalVars(route);
      var tcx = {"TrainingCenterDatabase": {
          "Folders": [],
          "Courses": [],
          "$xmlns:tcx": orsNamespaces.tcx,
          "$xmlns:xsi": orsNamespaces.xsi,
          "$xsi:schemaLocation": orsNamespaces.schemata.tcxService
        }};
      var Folders = {"Courses": {"CourseFolder": {
            "CourseNameRef": {"Id": "0"},
            "$Name": orsNamespaces.metadata.name
          }}};
      tcx.TrainingCenterDatabase.Folders.push(Folders);
      var Courses = {"Course": {
          "Name": orsNamespaces.metadata.name,
          "Lap": {
            "TotalTimeSeconds": (Number(routeVars.routeTotalDist) / ((Number(avgSpeed) * 1000) / 3600)).toFixed(3),
            "DistanceMeters": (routeVars.routeTotalDist).toFixed(3),
            "BeginPosition": {
              "LatitudeDegrees": (routeVars.routeCoords[0].lat).toFixed(coordinatePrecision),
              "LongitudeDegrees": (routeVars.routeCoords[0].lng).toFixed(coordinatePrecision)
            },
            "EndPosition": {
              "LatitudeDegrees": (routeVars.routeCoords[routeVars.routeCoords.length - 1].lat).toFixed(coordinatePrecision),
              "LongitudeDegrees": (routeVars.routeCoords[routeVars.routeCoords.length - 1].lng).toFixed(coordinatePrecision)
            },
            "Intensity": "Active"
          },
          "Track": {"TrackPoint": []}
        }};
      tcx.TrainingCenterDatabase.Courses.push(Courses);
      var distanceCovered = 0;
      var altitude;
      for (var i = 0; i < routeVars.routeCoords.length; i++) {
        if (routeVars.routeCoords[i].alt != undefined) {
          altitude = routeVars.routeCoords[i].alt;
          altitude = altitude.toFixed(3);
        } else {
          altitude = 0;
          altitude = altitude.toFixed(3);
        }
        var trackPoint = {
          "Time": date.toISOString(),
          "Position": {
            "LatitudeDegrees": (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision),
            "LongitudeDegrees": (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision)
          },
          "AltitudeMeters": altitude,
          "DistanceMeters": (distanceCovered).toFixed(3)
        };
        if (i < (routeVars.routeCoords.length) - 1) {
          var from = new L.marker([routeVars.routeCoords[i].lat, routeVars.routeCoords[i].lng]).toGeoJSON();
          var to = new L.marker([routeVars.routeCoords[i + 1].lat, routeVars.routeCoords[i + 1].lng]).toGeoJSON();
        }
        var pointDistance = turf.distance(from, to, 'kilometers') / 0.001;
        distanceCovered = distanceCovered + pointDistance;
        var timeCovered = (pointDistance / (Number(avgSpeed) * 1000 / (3600 * 1000)));
        date.setMilliseconds(date.getMilliseconds() + timeCovered);
        Courses.Course.Track.TrackPoint.push(trackPoint);
      }
      var jxonObj = tcx;
      jxonObj = JSON.stringify(jxonObj);
      jxonObj = JSON.parse(jxonObj);
      var outputTcx = $JXON.jsToXml(jxonObj);
      return outputTcx;
    };
    orsWriterFactory.writeKml = function(route, options, avgSpeed, coordinatePrecision) {
      if (options === {} || options === null || options === undefined) {
        options = {altitudeMode: 'clampedToGround'};
      } else {
        options = options;
      }
      var routeVars = routeGlobalVars(route);
      var kml = {"kml": {
          "Document": {
            "name": orsNamespaces.metadata.name,
            "description": orsNamespaces.metadata.description + "\nAuthor: " + orsNamespaces.metadata.authorName + "\nAuthor eMail: " + orsNamespaces.metadata.authorEmailId + "@" + orsNamespaces.metadata.authorEmailDomain + "\nAuthor Link: " + orsNamespaces.metadata.link + "\nCopyright: " + orsNamespaces.metadata.copyright + "\nDate: " + date.toISOString() + "\nKeywords:" + orsNamespaces.metadata.keywords,
            "Placemark": []
          },
          "$xmlns:kml": orsNamespaces.kml,
          "$xmlns:xsi": orsNamespaces.xsi,
          "$xsi:schemaLocation": orsNamespaces.schemata.kmlService
        }};
      var altitude;
      var kmlCoordinates = [];
      for (var i = 0; i < routeVars.routeCoords.length; i++) {
        var lat = (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision);
        var lng = (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision);
        if (routeVars.routeCoords[i].alt !== undefined) {
          altitude = routeVars.routeCoords[i].alt;
          altitude = altitude.toFixed(3);
        } else {
          altitude = 0;
          altitude = altitude.toFixed(3);
        }
        kmlCoordinates[i] = lng + "," + lat + "," + altitude;
      }
      kmlCoordinates = kmlCoordinates.join('\r\n');
      var placemark = {
        "name": orsNamespaces.metadata.name,
        "visibility": "1",
        "open": "1",
        "Snippet": {"$maxLines": "0"},
        "description": orsNamespaces.metadata.description,
        "LineString": {
          "extrude": "true",
          "tesselate": "true",
          "altitudeMode": options.altitudeMode,
          "coordinates": kmlCoordinates
        }
      };
      kml.kml.Document.Placemark.push(placemark);
      var jxonObj = kml;
      jxonObj = JSON.stringify(jxonObj);
      jxonObj = JSON.parse(jxonObj);
      var outputKml = $JXON.jsToXml(jxonObj);
      return outputKml;
    };
    orsWriterFactory.writeGml = function(route, options, avgSpeed, coordinatePrecision) {
      if (options === {} || options === null || options === undefined) {
        options = {gmlOptions: undefined};
      } else {
        options = options;
      }
      ;
      var routeVars = routeGlobalVars(route);
    };
    orsWriterFactory.writeGeoJSON = function(route, options, avgSpeed, coordinatePrecision) {
      if (options === {} || options === null || options === undefined) {
        options = {geojsonOptions: undefined};
      } else {
        options = options;
      }
      ;
      var routeVars = routeGlobalVars(route);
      var outputGeoJSON = routeVars.routeObj;
      return outputGeoJSON;
    };
    orsWriterFactory.writeCsv = function(route, options, avgSpeed, coordinatePrecision) {
      if (options === {} || options === null || options === undefined) {
        options = {
          csvSeparator: 'semicolon',
          csvFormat: 'xy'
        };
      } else {
        options = options;
      }
      var routeVars = routeGlobalVars(route);
      var geojsonObj = routeVars.routeObj;
      var sep;
      switch (options.csvSeparator) {
        default:
        case 'comma':
          sep = ',';
          break;
        case 'semicolon':
          sep = ';';
          break;
        case 'tab':
          sep = '\t';
          break;
      }
      var headerProperties = Object.keys(geojsonObj.properties);
      var headerGeometry = [];
      var header = [];
      switch (options.csvFormat) {
        default:
        case 'xy':
          headerGeometry = ["X", "Y"];
          break;
        case 'yx':
          headerGeometry = ["Y", "X"];
          break;
        case 'xyz':
          headerGeometry = ["X", "Y", "Z"];
          break;
        case 'wktWaypoints':
        case 'wkt':
          headerGeometry = ["WKT"];
          break;
      }
      header = headerProperties.concat(headerGeometry);
      header = header.join(sep);
      var aux;
      var altitude;
      var csvBody = [];
      switch (options.csvFormat) {
        default:
        case 'xy':
          for (var i = 0; i < routeVars.routeCoords.length; i++) {
            aux = ["Waypoint #" + i, "Waypoint exported using GIScience Universität Heidelberg OpenRouteService", orsNamespaces.metadata.authorName, orsNamespaces.metadata.authorEmailId + "@" + orsNamespaces.metadata.authorEmailDomain, orsNamespaces.metadata.copyright, orsNamespaces.metadata.link, date.toISOString(), orsNamespaces.metadata.keywords, (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision), (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision)];
            csvBody[i] = aux.join(sep);
          }
          csvBody = csvBody.join('\r\n');
          break;
        case 'yx':
          for (var i = 0; i < routeVars.routeCoords.length; i++) {
            aux = ["Waypoint #" + i, "Waypoint exported using GIScience Universität Heidelberg OpenRouteService", orsNamespaces.metadata.authorName, orsNamespaces.metadata.authorEmailId + "@" + orsNamespaces.metadata.authorEmailDomain, orsNamespaces.metadata.copyright, orsNamespaces.metadata.link, date.toISOString(), orsNamespaces.metadata.keywords, (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision), (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision)];
            csvBody[i] = aux.join(sep);
          }
          csvBody = csvBody.join('\r\n');
          break;
        case 'xyz':
          for (var i = 0; i < routeVars.routeCoords.length; i++) {
            if (routeVars.routeCoords[i].alt != undefined) {
              altitude = routeVars.routeCoords[i].alt;
              altitude = altitude.toFixed(3);
            } else {
              altitude = 0;
              altitude = altitude.toFixed(3);
            }
            ;
            aux = ["Waypoint #" + i, "Waypoint exported using GIScience Universität Heidelberg OpenRouteService", orsNamespaces.metadata.authorName, orsNamespaces.metadata.authorEmailId + "@" + orsNamespaces.metadata.authorEmailDomain, orsNamespaces.metadata.copyright, orsNamespaces.metadata.link, date.toISOString(), orsNamespaces.metadata.keywords, (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision), (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision), altitude];
            csvBody[i] = aux.join(sep);
          }
          csvBody = csvBody.join('\r\n');
          break;
        case 'wkt':
          var LatLngAux = [];
          for (var i = 0; i < routeVars.routeCoords.length; i++) {
            LatLngAux[i] = [(routeVars.routeCoords[i].lat).toFixed(coordinatePrecision) + ' ' + (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision)];
          }
          ;
          aux = [orsNamespaces.metadata.name, orsNamespaces.metadata.description, orsNamespaces.metadata.authorName, orsNamespaces.metadata.authorEmailId + "@" + orsNamespaces.metadata.authorEmailDomain, orsNamespaces.metadata.copyright, orsNamespaces.metadata.link, date.toISOString(), orsNamespaces.metadata.keywords, (routeVars.routeGeometry).toUpperCase() + "(" + LatLngAux.join(',') + ")"];
          csvBody = aux.join(sep);
          break;
        case 'wktWaypoints':
          for (var i = 0; i < routeVars.routeCoords.length; i++) {
            aux = ["Waypoint #" + i, "Waypoint exported using GIScience Universität Heidelberg OpenRouteService", orsNamespaces.metadata.authorName, orsNamespaces.metadata.authorEmailId + "@" + orsNamespaces.metadata.authorEmailDomain, orsNamespaces.metadata.copyright, orsNamespaces.metadata.link, date.toISOString(), orsNamespaces.metadata.keywords, "POINT(" + (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision) + ", " + (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision) + ")"];
            csvBody[i] = aux.join(sep);
          }
          csvBody = csvBody.join('\r\n');
          break;
      }
      var csv = [header, csvBody];
      csv = csv.join('\r\n');
      var outputCSV = csv;
      return outputCSV;
    };
    return orsWriterFactory;
  }]).factory('orsExportFactory', ['FileSaver', 'Blob', 'orsWriterFactory', function(FileSaver, Blob, orsWriterFactory) {
    var orsExportFactory = {};
    orsExportFactory.exportFile = function(route, options, format, avgSpeed, coordinatePrecision) {
      var xmlObj,
          xmlType,
          isCsv,
          geoJSONstring,
          extension,
          xmlDeclaration;
      extension = '.' + format;
      switch (format) {
        default:
        case 'gpx':
          xmlObj = orsWriterFactory.writeGpx(route, options, avgSpeed, coordinatePrecision);
          xmlType = true;
          isCsv = false;
          break;
        case 'tcx':
          xmlObj = orsWriterFactory.writeTcx(route, options, avgSpeed, coordinatePrecision);
          xmlType = true;
          isCsv = false;
          break;
        case 'kml':
          xmlObj = orsWriterFactory.writeKml(route, options, avgSpeed, coordinatePrecision);
          xmlType = true;
          isCsv = false;
          break;
        case 'gml':
          xmlObj = orsWriterFactory.writeGml(route, options, avgSpeed, coordinatePrecision);
          xmlType = true;
          isCsv = false;
          break;
        case 'geojson':
          xmlObj = orsWriterFactory.writeGeoJSON(route, options, avgSpeed, coordinatePrecision);
          xmlType = false;
          isCsv = false;
          break;
        case 'csv':
          xmlObj = orsWriterFactory.writeCsv(route, options, avgSpeed, coordinatePrecision);
          xmlType = false;
          isCsv = true;
          break;
      }
      if (xmlType) {
        var outputString = (new XMLSerializer()).serializeToString(xmlObj);
        outputString = vkbeautify.xml(outputString);
        var data = new Blob([outputString], {type: 'application/xml;charset=utf-8'});
      } else {
        if (!isCsv) {
          outputString = JSON.stringify(xmlObj);
          outputString = vkbeautify.json(outputString);
          var data = new Blob([outputString], {type: 'application/geo+json;charset=utf-8'});
        } else {
          outputString = xmlObj;
          var data = new Blob([outputString], {type: 'text/csv;charset=utf-8'});
        }
      }
      FileSaver.saveAs(data, 'exportedRoute' + extension);
    };
    return orsExportFactory;
  }]).factory('orsImportFactory', ['orsParseFactory', function(orsParseFactory) {
    var orsImportFactory = {};
    orsImportFactory.importFile = function(fileExt, fileContent) {
      switch (fileExt) {
        case 'gpx':
          var responseObj = new DOMParser().parseFromString(fileContent, 'application/xml');
          var geoJSONImportDoc = orsParseFactory.parseGpx(responseObj);
          break;
        case 'tcx':
          var responseObj = new DOMParser().parseFromString(fileContent, 'application/xml');
          var geoJSONImportDoc = orsParseFactory.parseTcx(responseObj);
          break;
        case 'kml':
          var responseObj = new DOMParser().parseFromString(fileContent, 'application/xml');
          var geoJSONImportDoc = orsParseFactory.parseKml(responseObj);
          break;
        case 'gml':
          var responseObj = new DOMParser().parseFromString(fileContent, 'application/xml');
          var geoJSONImportDoc = orsParseFactory.parseGml(responseObj);
          break;
        case 'geojson':
          var responseObj = JSON.parse(fileContent);
          var geoJSONImportDoc = orsParseFactory.parseGeoJson(responseObj);
          break;
        case 'csv':
          var responseObj = fileContent;
          var geoJSONImportDoc = orsParseFactory.parseCsv(responseObj);
          break;
        default:
          alert("Error: file extension not is valid");
      }
      ;
      return geoJSONImportDoc;
    };
    return orsImportFactory;
  }]);
  return {};
})();
