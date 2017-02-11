angular.module('orsApp.GeoFileHandler-service', ['angular-jxon', 'ngFileSaver'])
    /* angular-JXON config */
    .config(['$JXONProvider', ($JXONProvider) => {
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
    }])
    /**
    /*** Parser Factory
    **/
    .factory('orsParseFactory', ['$JXON', ($JXON) => {
        var orsParseFactory = {};
        /**
         * Parses GPX 1.1
         * @param {Object} gpxDocument: a GPX file in a XMLDocument object notation
         * @return {Object} geoJSONDoc: a geoJSON object
         */
        orsParseFactory.parseGpx = (gpxDocument) => {
            console.log(gpxDocument)
            //Get the JXON object
            var jxon = $JXON.xmlToJs(gpxDocument);
            // get the metadata information
            var metadataObj = jxon.gpx.metadata;
            if (metadataObj != undefined) {
                var propertiesObj = {
                    "bounds": "Minimum Latitude: " + metadataObj.bounds.$minlat + +", Maximum Latitude: " + metadataObj.bounds.$maxlat + +", Minimum Longitude: " + metadataObj.bounds.$minlon + +", Maximum Longitude: " + metadataObj.bounds.$maxlon
                };
            } else {
                propertiesObj = {};
            }
            //Get the coordinates (those are taken from wpt, trk or rte)
            var gpxCoordinates = [];
            if (jxon.gpx.wpt) {
                //just get the coordinates from the wpt key
                for (var i = 0; i < jxon.gpx.wpt.length; i++) {
                    gpxCoordinates[i] = [jxon.gpx.wpt[i].$lat, jxon.gpx.wpt[i].$lon];
                }
            } else if (jxon.gpx.rte) {
                //get the coordinates from the rte key
                for (var i = 0; i < jxon.gpx.rte.rtept.length; i++) {
                    gpxCoordinates[i] = [jxon.gpx.rte.rtept[i].$lat, jxon.gpx.rte.rtept[i].$lon];
                }
            } else if (jxon.gpx.trk) {
                //get the coordinates from the trk key
                for (var i = 0; i < jxon.gpx.trk.trkseg.trkpt.length; i++) {
                    gpxCoordinates[i] = [jxon.gpx.trk.trkseg.trkpt[i].$lat, jxon.gpx.trk.trkseg.trkpt[i].$lon];
                }
            }
            //get the CRS link
            var epsgCode = "4326";
            var crsLink = "http://spatialreference.org/ref/epsg/" + epsgCode + "/proj4/";
            //Create the GeoJSON object
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
        /**
         * Parses TCX 1.1
         * @param {Object} tcxDocument: a TCX file in a XMLDocument object notation
         * @return {Object} geoJSONDoc: a geoJSON object
         **/
        orsParseFactory.parseTcx = (tcxDocument) => {
            //get the EPSG code //must be defined by the user
            var epsgCode = '4326';
            //Get the JXON object
            var jxon = $JXON.xmlToJs(tcxDocument);
            //Get the properties
            /* TODO */
            //Get the coordinates
            var tcxCoordinates = [];
            for (var i = 0; i < jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint.length; i++) {
                if (jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint[i].AltitudeMeters != undefined) {
                    tcxCoordinates[i] = [jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint[i].Position.LatitudeDegrees, jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint[i].Position.LongitudeDegrees, jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint[i].AltitudeMeters];
                } else {
                    tcxCoordinates[i] = [jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint[i].Position.LatitudeDegrees, jxon.TrainingCenterDatabase.Courses.Course.Track.TrackPoint[i].Position.LongitudeDegrees, 0];
                }
            }
            //get the crs link
            var crsLink = "http://spatialreference.org/ref/epsg/" + epsgCode + "/proj4/";
            //Create the GeoJSON object
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
        /**
         * Parses KML 2.3
         * @param {Object} kmlDocument: a KML file in a XMLDocument object notation
         * @return {Object} geoJSONDoc: a geoJSON object
         */
        orsParseFactory.parseKml = (kmlDocument) => {
            //get the EPSG code //must be defined by the user
            var epsgCode = '4326';
            //Get the JXON object
            var jxon = $JXON.xmlToJs(kmlDocument);
            //Get the properties
            /* TODO */
            //Get the coordinates
            var kmlCoordinates = jxon.kml.Document.Placemark.LineString.coordinates;
            kmlCoordinates = kmlCoordinates.split("\n");
            for (var i = 0; i < kmlCoordinates.length; i++) {
                kmlCoordinates[i] = kmlCoordinates[i].split(",");
            }
            //switch kmlCoordinates position 0 with position 1 (lat and lon)
            for (var i = 0; i < kmlCoordinates.length; i++) {
                var aux = kmlCoordinates[i][0];
                kmlCoordinates[i][0] = kmlCoordinates[i][1];
                kmlCoordinates[i][1] = aux;
            }
            //get the crs link
            var crsLink = "http://spatialreference.org/ref/epsg/" + epsgCode + "/proj4/";
            //Create the GeoJSON object
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
        /**
         * Parses GML 3.3
         * @param {Object} gmlDocument: a GML file in a XMLDocument object notation
         * @return {Object} geoJSONDoc: a geoJSON object
         */
        orsParseFactory.parseGml = (gmlDocument) => {
            //Get the JXON object
            var jxon = $JXON.xmlToJs(gmlDocument);
            //Create the GeoJSON object
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
        /**
         * Parses GeoJSON
         * @param {Object} geoJson: a JSON object with geoJSON structure
         * @return {Object} geoJSONDoc: a GeoJSON object
         */
        orsParseFactory.parseGeoJson = (geoJson) => {
            for (var i = 0; i < geoJson.geometry.coordinates.length; i++) {
                var aux = geoJson.geometry.coordinates[i][0];
                geoJson.geometry.coordinates[i][0] = geoJson.geometry.coordinates[i][1];
                geoJson.geometry.coordinates[i][1] = aux;
            }
            var geoJSONDoc = geoJson;
            return geoJSONDoc;
        };
        /**
         * Parses CSV
         * @param {String} csvString: the CSV text file
         * @param {Object} options: this are the column names to get specifici information from the CSV file
         * Available options:
         *      @param {String} separator: character used to separate the CSV columns
         *      @param {String} geometryFormat: the format used to represent the geometry
         * @return {Object} geoJSONDoc: a geojson object
         */
        orsParseFactory.parseCsv = (csvString, options) => {
            //get the options
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
            //create an empty array to store the csv objects
            var csvArray = [];
            var csvAuxArray = [];
            //create an empty array to store the coordinates
            var csvCoordinates = [];
            //create a new object to store each row
            var csvObject = {};
            //Create a new object to store the properties
            var propertiesObj = {};
            //Split the csv string into just one row
            var csvRows = csvString.split('\r\n');
            //Take the first line to get the header of the CSV
            var csvHeaders = csvRows.shift(); //by doing a shift, the first line in the csvRows is discarded. it remains stored in csvHeaders
            //Split the header entries into an array, taking the type of separator into consideration
            csvHeaders = csvHeaders.split(options.separator);
            // Loop through the rows 
            for (var i = 0; i < csvRows.length; i++) {
                var rowArray = csvRows[i].split(options.separator);
                for (var j = 0; j < rowArray.length; j++) {
                    //Fill the object with the headers as the keys and the row entries as the values
                    csvObject[csvHeaders[j]] = rowArray[j];
                }
                //Add the object to i position of the array
                csvArray[i] = csvObject;
                //reset the csv object
                csvObject = {};
            }
            // get the coordinates
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
            // get the other csv columns as properties
            for (var property in csvArray[0]) {
                if (property != userDefinedValues.latLabel || property != userDefinedValues.lngLabel || property != userDefinedValues.heightLabel || property != userDefinedValues.wktLabel || property != userDefinedValues.crsLabel) {
                    //add the entries to the properties object
                    propertiesObj[property] = csvArray[0][property];
                }
            }
            //get the link for the Coordinate reference system associated with this object. If is not defined, then use the default value (it's users's fault if not specified)
            if (options.crsLabel != undefined) {
                var epsgCode = "4326";
            } else {
                epsgCode = "4326";
            }
            var crsLink = "http://spatialreference.org/ref/epsg/" + epsgCode + "/proj4/";
            //Create the GeoJSON object
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
    }])
    /**
    /*** Writer Factory
    **/
    .factory('orsWriterFactory', ['$JXON', ($JXON) => {
        var date = new Date(); //remove
        var routeGlobalVars = (route) => { //remove
            route = L.polyline(route);
            //get the GeoJson object of the geo object
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
                routeTotalDist: turf.lineDistance(geoJSONRoute, 'kilometers') / 0.001,
            };
            return routeVars;
        };
        var orsWriterFactory = {};
        /**
         * Writes a GPX 1.1 document
         * @param {Object} route: the leaflet route object
         * @param {Object} options: options for creating the GML document
         * Available options:
         *      @param {Boolean} gpxWaypoint: if waypoints should be written [default:true]
         *      @param {Boolean} gpxRoute: if route should be written [default:false]
         *      @param {Boolean} gpxTrack: if track should be written [default:false]
         * @return {Object} outputGpx: object containing the GPX document
         */
        orsWriterFactory.writeGpx = (route, options, avgSpeed, coordinatePrecision) => {
            //get the options
            if (options === {} || options === null || options === undefined) {
                options = {
                    gpxWaypoint: true,
                    gpxRoute: undefined,
                    gpxTrack: undefined
                };
            } else {
                options = options;
            }
            //get the route global variable
            var routeVars = routeGlobalVars(route);
            //create the gpx object 
            var gpx = {
                "gpx": {
                    "metadata": [],
                    "wpt": [],
                    "rte": [],
                    "trk": [],
                    "$version": "1.1",
                    "$creator": orsNamespaces.metadata.authorName,
                    "$xmlns:gpx": orsNamespaces.gpx,
                    "$xmlns:xsi": orsNamespaces.xsi,
                    "$xsi:schemaLocation": orsNamespaces.schemata.gpxService,
                },
            };
            // create the metadata object
            var metadata = {
                "name": orsNamespaces.metadata.name,
                "desc": orsNamespaces.metadata.description,
                "author": {
                    "name": orsNamespaces.metadata.authorName,
                    "email": {
                        "$id": orsNamespaces.metadata.authorEmailId,
                        "$domain": orsNamespaces.metadata.authorEmailDomain,
                    },
                    "link": {
                        "$href": orsNamespaces.metadata.link,
                    },
                },
                "copyright": {
                    "year": date.year,
                    "license": orsNamespaces.metadata.license,
                    "$author": orsNamespaces.metadata.authorName,
                },
                "link": {
                    "$href": orsNamespaces.metadata.link,
                },
                "time": date.toISOString(),
                "keywords": orsNamespaces.metadata.keywords,
                "bounds": {
                    "$minlat": (routeVars.routeMinLat).toFixed(coordinatePrecision),
                    "$maxlat": (routeVars.routeMaxLat).toFixed(coordinatePrecision),
                    "$minlon": (routeVars.routeMinLon).toFixed(coordinatePrecision),
                    "$maxlon": (routeVars.routeMaxLon).toFixed(coordinatePrecision),
                },
            };
            // push the metadata object into the gpx object
            gpx.gpx.metadata.push(metadata);
            // create the "wpt" object
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
                        "TrackPointExtension": {
                            "height": altitude,
                        },
                        "distance": (distanceCovered).toFixed(3),
                    },
                    "$lat": (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision),
                    "$lon": (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision),
                };
                //set the date to each point based on the distance between points and average speed do reach from one point to the next one
                if (i < (routeVars.routeCoords.length) - 1) {
                    var from = new L.marker([routeVars.routeCoords[i].lat, routeVars.routeCoords[i].lng]).toGeoJSON();
                    var to = new L.marker([routeVars.routeCoords[i + 1].lat, routeVars.routeCoords[i + 1].lng]).toGeoJSON();
                }
                var pointDistance = turf.distance(from, to, 'kilometers') / 0.001;
                distanceCovered = distanceCovered + pointDistance;
                var timeCovered = (pointDistance / (Number(avgSpeed) * 1000 / (3600 * 1000)));
                date.setMilliseconds(date.getMilliseconds() + timeCovered);
                // push the waypoint into the gpx.waypoint object
                gpx.gpx.wpt.push(wpt_pt);
            }
            // create the "rte" object
            var rte = {
                "src": orsNamespaces.metadata.src,
                "link": {
                    "text": orsNamespaces.metadata.authorName,
                    "$href": orsNamespaces.metadata.link,
                },
                "rtept": [],
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
                            "TrackPointExtension": {
                                "cad": altitude,
                            },
                            "distance": (distanceCovered).toFixed(3),
                        },
                        "$lat": (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision),
                        "$lon": (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision),
                    }
                    //set the date to each point based on the distance between points and average speed do reach from one point to the next one
                if (i < (routeVars.routeCoords.length) - 1) {
                    var from = new L.marker([routeVars.routeCoords[i].lat, routeVars.routeCoords[i].lng]).toGeoJSON();
                    var to = new L.marker([routeVars.routeCoords[i + 1].lat, routeVars.routeCoords[i + 1].lng]).toGeoJSON();
                }
                var pointDistance = turf.distance(from, to, 'kilometers') / 0.001;
                var timeCovered = (pointDistance / (Number(avgSpeed) * 1000 / (3600 * 1000)));
                date.setMilliseconds(date.getMilliseconds() + timeCovered);
                // push the route point into the route object
                rte.rtept.push(rtept_pt);
            }
            // create the "trk" object
            var trk = {
                "src": orsNamespaces.metadata.src,
                "link": {
                    "text": orsNamespaces.metadata.authorName,
                    "$href": orsNamespaces.metadata.link,
                },
                "trkseg": {
                    "trkpt": [],
                },
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
                            "TrackPointExtension": {
                                "cad": altitude,
                            },
                            "distance": (distanceCovered).toFixed(3),
                        },
                        "$lat": (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision),
                        "$lon": (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision),
                    }
                    //set the date to each point based on the distance between points and average speed do reach from one point to the next one
                if (i < (routeVars.routeCoords.length) - 1) {
                    var from = new L.marker([routeVars.routeCoords[i].lat, routeVars.routeCoords[i].lng]).toGeoJSON();
                    var to = new L.marker([routeVars.routeCoords[i + 1].lat, routeVars.routeCoords[i + 1].lng]).toGeoJSON();
                }
                var pointDistance = turf.distance(from, to, 'kilometers') / 0.001;
                distanceCovered = distanceCovered + pointDistance;
                var timeCovered = (pointDistance / (Number(avgSpeed) * 1000 / (3600 * 1000)));
                date.setMilliseconds(date.getMilliseconds() + timeCovered);
                // push the track point into the trk.trkpt object
                trk.trkseg.trkpt.push(trkpt_pt);
            }
            // in case the gpxRoute our gpxTrack are false in the options, remove from the gpx object. gpx Waypoint will always be present
            if (options.gpxRoute) {
                // add "rte" to the gpx object
                gpx.gpx.rte.push(rte);
            } else {
                delete gpx.gpx.rte;
            }
            if (options.gpxTrack) {
                // add "trk" to the gpx object
                gpx.gpx.trk.push(trk);
            } else {
                delete gpx.gpx.trk;
            }
            //create the jxon object
            var jxonObj = gpx;
            //Convert the JXON object into a readable string and then convert again to a JXON object
            jxonObj = JSON.stringify(jxonObj);
            jxonObj = JSON.parse(jxonObj);
            //Convert the JXON object into a XML object
            var outputGpx = $JXON.jsToXml(jxonObj);
            return outputGpx;
        };
        /**
         * Writes a TCX 1.1 document
         * @param {Object} route: the leaflet route object
         * @param {Object} options: options for creating the TCX document
         * Available options:
         *      
         * @return {Object} outputTcx: object containing the TCX document
         */
        orsWriterFactory.writeTcx = (route, options, avgSpeed, coordinatePrecision) => {
            //get the options
            if (options === {} || options === null || options === undefined) {
                options = {
                    tcxOptions: undefined
                };
            } else {
                options = options;
            }
            //get the route global variable
            var routeVars = routeGlobalVars(route);
            var tcx = {
                "TrainingCenterDatabase": {
                    "Folders": [],
                    "Courses": [],
                    "$xmlns:tcx": orsNamespaces.tcx,
                    "$xmlns:xsi": orsNamespaces.xsi,
                    "$xsi:schemaLocation": orsNamespaces.schemata.tcxService,
                },
            };
            //Create the "Folders" object
            var Folders = {
                "Courses": {
                    "CourseFolder": {
                        "CourseNameRef": {
                            "Id": "0",
                        },
                        "$Name": orsNamespaces.metadata.name,
                    },
                },
            };
            // push the Folder object into the tcx object
            tcx.TrainingCenterDatabase.Folders.push(Folders);
            // Create the "Courses" object
            var Courses = {
                "Course": {
                    "Name": orsNamespaces.metadata.name,
                    "Lap": {
                        "TotalTimeSeconds": (Number(routeVars.routeTotalDist) / ((Number(avgSpeed) * 1000) / 3600)).toFixed(3),
                        "DistanceMeters": (routeVars.routeTotalDist).toFixed(3),
                        "BeginPosition": {
                            "LatitudeDegrees": (routeVars.routeCoords[0].lat).toFixed(coordinatePrecision),
                            "LongitudeDegrees": (routeVars.routeCoords[0].lng).toFixed(coordinatePrecision),
                        },
                        "EndPosition": {
                            "LatitudeDegrees": (routeVars.routeCoords[routeVars.routeCoords.length - 1].lat).toFixed(coordinatePrecision),
                            "LongitudeDegrees": (routeVars.routeCoords[routeVars.routeCoords.length - 1].lng).toFixed(coordinatePrecision),
                        },
                        "Intensity": "Active",
                    },
                    "Track": {
                        "TrackPoint": [],
                    }
                }
            };
            // push the Courses object into the tcx object
            tcx.TrainingCenterDatabase.Courses.push(Courses);
            // create the "Track" object:
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
                    "DistanceMeters": (distanceCovered).toFixed(3),
                };
                if (i < (routeVars.routeCoords.length) - 1) {
                    var from = new L.marker([routeVars.routeCoords[i].lat, routeVars.routeCoords[i].lng]).toGeoJSON();
                    var to = new L.marker([routeVars.routeCoords[i + 1].lat, routeVars.routeCoords[i + 1].lng]).toGeoJSON();
                }
                var pointDistance = turf.distance(from, to, 'kilometers') / 0.001;
                distanceCovered = distanceCovered + pointDistance;
                var timeCovered = (pointDistance / (Number(avgSpeed) * 1000 / (3600 * 1000)));
                date.setMilliseconds(date.getMilliseconds() + timeCovered);
                //push the "track" object into tcx.TrainingCenterDatabase.Courses.Track
                Courses.Course.Track.TrackPoint.push(trackPoint);
            }
            //create the jxon object
            var jxonObj = tcx;
            //Convert the JXON object into a readable string and then convert again to a JXON object
            jxonObj = JSON.stringify(jxonObj);
            jxonObj = JSON.parse(jxonObj);
            //Convert the JXON object into a XML object
            var outputTcx = $JXON.jsToXml(jxonObj);
            return outputTcx;
        };
        /**
         * Writes a KML 2.3 based document
         * @param {Object} route: the leaflet route object
         * @param {Object} options: options for creating the KML document
         * Available options:
         *      @param {String} altitudeMode: altitude mode attributed to the kml file [default: clampedToGround]
         * @return {Object} outputKml: object containing the KML document
         */
        orsWriterFactory.writeKml = (route, options, avgSpeed, coordinatePrecision) => {
            //get the options
            if (options === {} || options === null || options === undefined) {
                options = {
                    altitudeMode: 'clampedToGround'
                };
            } else {
                options = options;
            }
            //get the route global variable
            var routeVars = routeGlobalVars(route);
            var kml = {
                "kml": {
                    "Document": {
                        "name": orsNamespaces.metadata.name,
                        "description": orsNamespaces.metadata.description + "\nAuthor: " + orsNamespaces.metadata.authorName + "\nAuthor eMail: " + orsNamespaces.metadata.authorEmailId + "@" + orsNamespaces.metadata.authorEmailDomain + "\nAuthor Link: " + orsNamespaces.metadata.link + "\nCopyright: " + orsNamespaces.metadata.copyright + "\nDate: " + date.toISOString() + "\nKeywords:" + orsNamespaces.metadata.keywords,
                        //"Style":[],
                        //"StyleMap":[],
                        "Placemark": []
                    },
                    "$xmlns:kml": orsNamespaces.kml,
                    "$xmlns:xsi": orsNamespaces.xsi,
                    "$xsi:schemaLocation": orsNamespaces.schemata.kmlService,
                }
            };
            /*// create the style object
            var style = {
                "IconStyle":{
                    "scale":"0.8",
                    "Icon":{
                        "href":""
                    }
                },
                "LineStyle":{
                    "colorMode":"random",
                    "width":"5"
                },
                "$id" :
            };
            //push the "style" object into kml.kml.Style
            kml.kml.Document.Style.push(style);*/
            /*// create the stylesmap object
            var styleMap = {
                "Pair":{
                    "key":"",
                    "styleUrl":"#"
                }
                "$id":
            };
            //push the "stylemap" object into kml.kml.StyleMap
            kml.kml.Document.StyleMap.push(styleMap);*/
            //loop through route coordinates and store them on an array
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
            //join coordinates into a string separates by "new line"
            kmlCoordinates = kmlCoordinates.join('\r\n');
            //create the placemark object
            var placemark = {
                "name": orsNamespaces.metadata.name,
                "visibility": "1",
                "open": "1",
                "Snippet": {
                    "$maxLines": "0"
                },
                "description": orsNamespaces.metadata.description,
                //"styleUrl":"#",
                "LineString": {
                    "extrude": "true",
                    "tesselate": "true",
                    "altitudeMode": options.altitudeMode,
                    "coordinates": kmlCoordinates,
                }
            };
            //push the "placemark" object into kml.kml.Placemark
            kml.kml.Document.Placemark.push(placemark);
            //create the jxon object
            var jxonObj = kml;
            //Convert the JXON object into a readable string and then convert again to a JXON object
            jxonObj = JSON.stringify(jxonObj);
            jxonObj = JSON.parse(jxonObj);
            //Convert the JXON object into a XML object
            var outputKml = $JXON.jsToXml(jxonObj);
            return outputKml;
        };
        /**
         * Writes a GML 3.2 document
         * @param {Object} route: the leaflet route object
         * @param {Object} options: options for creating the GPX document
         * Available options:
         *     
         * @return {Object} outputGml: object containing the GML document
         */
        orsWriterFactory.writeGml = (route, options, avgSpeed, coordinatePrecision) => {
            //get the options
            if (options === {} || options === null || options === undefined) {
                options = {
                    gmlOptions: undefined
                };
            } else {
                options = options;
            }
            //get the route global variable
            var routeVars = routeGlobalVars(route);
            //TODO
        };
        /**
         * Writes a GeoJSON document
         * @param {Object} geometry: array of coordinates
         * @param {Object} options: options for creating the GeoJSON document
         * Available options:
         *      
         * @return {Object} geojsonObj: object containing the GeoJSON
         */
        orsWriterFactory.writeGeoJSON = (geometry, geomType, options) => {
            var outputGeoJSON;
            if (geomType == 'linestring') {
                //get the options
                if (options === {} || options === null || options === undefined) {
                    options = {
                        geojsonOptions: undefined
                    };
                } else {
                    options = options;
                }
                //get the route global variable
                var routeVars = routeGlobalVars(geometry);
                // gets the geoJSON object
                outputGeoJSON = routeVars.routeObj;
            } else if (geomType == 'polygon') {
                let isochrones = new L.FeatureGroup();
                for (let i = 0; i < geometry.length; i++) {
                    L.polygon(geometry[i].geometry.coordinates).addTo(isochrones);
                }
                outputGeoJSON = isochrones.toGeoJSON();
            }
            return outputGeoJSON;
        };
        /**
         * Writes a CSV document
         * @param {Object} route: the leaflet route object
         * @param {Object} options: options for creating the CSV document
         * Available options:
         *      @param {String} csvSeparator: separator character that makes the division between columns in the csv file [default: semicolon]
         *      @param {String} csvFormat: format used to represent the geometry as text [default: wkt]
         * @return {Object} outputCSV: Object containing the CSV document
         */
        orsWriterFactory.writeCsv = (route, options, avgSpeed, coordinatePrecision) => {
            //get the options
            if (options === {} || options === null || options === undefined) {
                options = {
                    csvSeparator: 'semicolon',
                    csvFormat: 'xy'
                };
            } else {
                options = options;
            }
            //get the route global variable
            var routeVars = routeGlobalVars(route);
            // gets the geoJSON object
            var geojsonObj = routeVars.routeObj;
            //choose the character to separate columns
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
            //create the header for the csv file
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
            //create the csv body
            var aux;
            var altitude;
            var csvBody = [];
            switch (options.csvFormat) {
                default:
                    case 'xy':
                    for (var i = 0; i < routeVars.routeCoords.length; i++) {
                    aux = ["Waypoint #" + i, "Waypoint exported using GIScience Universität Heidelberg OpenRouteService",
                        orsNamespaces.metadata.authorName,
                        orsNamespaces.metadata.authorEmailId + "@" + orsNamespaces.metadata.authorEmailDomain,
                        orsNamespaces.metadata.copyright,
                        orsNamespaces.metadata.link,
                        date.toISOString(),
                        orsNamespaces.metadata.keywords, (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision), (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision)
                    ];
                    csvBody[i] = aux.join(sep);
                }
                csvBody = csvBody.join('\r\n');
                break;
                case 'yx':
                        for (var i = 0; i < routeVars.routeCoords.length; i++) {
                        aux = ["Waypoint #" + i, "Waypoint exported using GIScience Universität Heidelberg OpenRouteService",
                            orsNamespaces.metadata.authorName,
                            orsNamespaces.metadata.authorEmailId + "@" + orsNamespaces.metadata.authorEmailDomain,
                            orsNamespaces.metadata.copyright,
                            orsNamespaces.metadata.link,
                            date.toISOString(),
                            orsNamespaces.metadata.keywords, (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision), (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision)
                        ];
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
                        };
                        aux = ["Waypoint #" + i, "Waypoint exported using GIScience Universität Heidelberg OpenRouteService",
                            orsNamespaces.metadata.authorName,
                            orsNamespaces.metadata.authorEmailId + "@" + orsNamespaces.metadata.authorEmailDomain,
                            orsNamespaces.metadata.copyright,
                            orsNamespaces.metadata.link,
                            date.toISOString(),
                            orsNamespaces.metadata.keywords, (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision), (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision),
                            altitude
                        ];
                        csvBody[i] = aux.join(sep);
                    }
                    csvBody = csvBody.join('\r\n');
                    break;
                case 'wkt':
                        var LatLngAux = [];
                    for (var i = 0; i < routeVars.routeCoords.length; i++) {
                        LatLngAux[i] = [(routeVars.routeCoords[i].lat).toFixed(coordinatePrecision) + ' ' + (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision)];
                    };
                    aux = [
                        orsNamespaces.metadata.name,
                        orsNamespaces.metadata.description,
                        orsNamespaces.metadata.authorName,
                        orsNamespaces.metadata.authorEmailId + "@" + orsNamespaces.metadata.authorEmailDomain,
                        orsNamespaces.metadata.copyright,
                        orsNamespaces.metadata.link,
                        date.toISOString(),
                        orsNamespaces.metadata.keywords, (routeVars.routeGeometry).toUpperCase() + "(" + LatLngAux.join(',') + ")"
                    ];
                    csvBody = aux.join(sep);
                    break;
                case 'wktWaypoints':
                        for (var i = 0; i < routeVars.routeCoords.length; i++) {
                        aux = ["Waypoint #" + i, "Waypoint exported using GIScience Universität Heidelberg OpenRouteService",
                            orsNamespaces.metadata.authorName,
                            orsNamespaces.metadata.authorEmailId + "@" + orsNamespaces.metadata.authorEmailDomain,
                            orsNamespaces.metadata.copyright,
                            orsNamespaces.metadata.link,
                            date.toISOString(),
                            orsNamespaces.metadata.keywords, "POINT(" + (routeVars.routeCoords[i].lat).toFixed(coordinatePrecision) + ", " + (routeVars.routeCoords[i].lng).toFixed(coordinatePrecision) + ")"
                        ];
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
    }])
    /**
    /*** Export Factory
    **/
    .factory('orsExportFactory', ['FileSaver', 'Blob', 'orsWriterFactory', (FileSaver, Blob, orsWriterFactory) => {
        var orsExportFactory = {};
        /**
         * Export any vector element on the map to GPX
         * @param {Object} geometry: the route object (leaflet object) to export
         * @param {String} geomType: the type of geometry which is passed 
         * @param {Object} options: export options 
         * @param {String} format: the file format to export
         * @param {String} avgSpeed: average speed 
         * @param {String} coordinatePrecision: precision of the coordinates
         */
        orsExportFactory.exportFile = (geometry, geomType, options, format, avgSpeed, coordinatePrecision) => {
            //get the xml object
            var xmlObj, xmlType, isCsv, geoJSONstring, extension, xmlDeclaration;
            extension = '.' + format;
            //xmlDeclaration = '<?xml version="1.0" encoding="UTF-8" ?>';
            switch (format) {
                default:
                    case 'gpx':
                    xmlObj = orsWriterFactory.writeGpx(geometry, options, avgSpeed, coordinatePrecision);
                xmlType = true;
                isCsv = false;
                break;
                case 'tcx':
                        xmlObj = orsWriterFactory.writeTcx(geometry, options, avgSpeed, coordinatePrecision);
                    xmlType = true;
                    isCsv = false;
                    break;
                case 'kml':
                        xmlObj = orsWriterFactory.writeKml(geometry, options, avgSpeed, coordinatePrecision);
                    xmlType = true;
                    isCsv = false;
                    break;
                case 'gml':
                        xmlObj = orsWriterFactory.writeGml(geometry, options, avgSpeed, coordinatePrecision);
                    xmlType = true;
                    isCsv = false;
                    break;
                case 'geojson':
                        xmlObj = orsWriterFactory.writeGeoJSON(geometry, geomType, options);
                    xmlType = false;
                    isCsv = false;
                    break;
                case 'csv':
                        xmlObj = orsWriterFactory.writeCsv(geometry, options, avgSpeed, coordinatePrecision);
                    xmlType = false;
                    isCsv = true;
                    break;
            }
            if (xmlType) {
                //convert the XML object into a string
                var outputString = (new XMLSerializer()).serializeToString(xmlObj);
                //add the XML declaration to the string
                //outputString = xmlDeclaration + outputString;
                //beautify the XML string
                outputString = vkbeautify.xml(outputString);
                //prepare the data to be saved
                var data = new Blob([outputString], {
                    type: 'application/xml;charset=utf-8'
                });
            } else {
                if (!isCsv) {
                    //Convert the JSON object into a string
                    outputString = JSON.stringify(xmlObj);
                    //beautify the JSON string
                    outputString = vkbeautify.json(outputString);
                    //prepare the data to be saved
                    var data = new Blob([outputString], {
                        type: 'application/geo+json;charset=utf-8'
                    });
                } else {
                    outputString = xmlObj;
                    //prepare the data to be saved
                    var data = new Blob([outputString], {
                        type: 'text/csv;charset=utf-8'
                    });
                }
            }
            //save the data
            FileSaver.saveAs(data, 'ors-export-' + geomType + extension);
        };
        return orsExportFactory;
    }])
    /**
    /*** Import Factory
    **/
    .factory('orsImportFactory', ['orsParseFactory', (orsParseFactory) => {
        var orsImportFactory = {};
        /**
         * Import a file and load to the map as a vector element
         * @param {String} fileExt: file extension
         * @param {String} fileContent: content of the file
         * @return {Object} LeafletLayer: returns a leaflet layer
         */
        orsImportFactory.importFile = (fileExt, fileContent) => {
            switch (fileExt) {
                case 'gpx':
                    // convert gpx string to a gpx object
                    var responseObj = new DOMParser().parseFromString(fileContent, 'application/xml');
                    //Call the orsParseFactory to convert the XML object to geojson
                    var geoJSONImportDoc = orsParseFactory.parseGpx(responseObj);
                    break;
                case 'tcx':
                    // convert tcx string to a tcx object
                    var responseObj = new DOMParser().parseFromString(fileContent, 'application/xml');
                    //Call the orsParseFactory to convert the XML object to geojson
                    var geoJSONImportDoc = orsParseFactory.parseTcx(responseObj);
                    break;
                case 'kml':
                    // convert kml string to a kml object
                    var responseObj = new DOMParser().parseFromString(fileContent, 'application/xml');
                    //Call the orsParseFactory to convert the XML object to geojson
                    var geoJSONImportDoc = orsParseFactory.parseKml(responseObj);
                    break;
                case 'gml':
                    // convert gml string to a gml object
                    var responseObj = new DOMParser().parseFromString(fileContent, 'application/xml');
                    //Call the orsParseFactory to convert the XML object to geojson
                    var geoJSONImportDoc = orsParseFactory.parseGml(responseObj);
                    break;
                case 'geojson':
                    // convert geojson string to a geojson object
                    var responseObj = JSON.parse(fileContent);
                    //Call the orsParseFactory to convert the XML object to geojson
                    var geoJSONImportDoc = orsParseFactory.parseGeoJson(responseObj);
                    break;
                case 'csv':
                    var responseObj = fileContent;
                    //Call the orsParseFactory to convert the XML object to geojson
                    var geoJSONImportDoc = orsParseFactory.parseCsv(responseObj);
                    break;
                default:
                    alert("Error: file extension not is valid");
            };
            // add the leaflet geojson constructor
            return geoJSONImportDoc;
        }
        return orsImportFactory
    }]);