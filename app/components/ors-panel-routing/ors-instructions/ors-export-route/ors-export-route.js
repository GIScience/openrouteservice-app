angular.module('orsApp.ors-exportRoute-controls', []).component('orsExportRouteControls', {
    templateUrl: '/app/components/ors-panel-routing/ors-instructions/ors-export-route/ors-export-route.html',
    controller: ['orsExportFactory', 'orsRouteService', function(orsExportFactory, orsRouteService) {
        let ctrl = this;
        ctrl.gpxOptShow = true;
        ctrl.tcxOptShow = false;
        ctrl.kmlOptShow = false;
        ctrl.gmlOptShow = false;
        ctrl.geojsonOptShow = false;
        ctrl.csvOptShow = false;
        ctrl.fileFormat = [{
            text: "GPS eXchange Format (.gpx)",
            value: "gpx"
        }, {
            text: "Training Center XML (.tcx)",
            value: "tcx"
        }, {
            text: "Keyhole Markup Language (.kml)",
            value: "kml"
        }, {
            text: "GeoJSON (.geojson)",
            value: "geojson"
        }, {
            text: "Comma Separated Value (.csv)",
            value: "csv"
        }];
        ctrl.selected_fileformat = ctrl.fileFormat[0]; //this is the default selected value on the dropdown menu
        ctrl.currentFileFormat = ctrl.selected_fileformat.value; //this is the default value for the current selected option
        ctrl.change_fileFormat = (fileformat) => {
            switch (fileformat.value) {
                default:
                    case 'gpx':
                    ctrl.gpxOptShow = true;
                ctrl.tcxOptShow = false;
                ctrl.kmlOptShow = false;
                ctrl.gmlOptShow = false;
                ctrl.geojsonOptShow = false;
                ctrl.csvOptShow = false;
                break;
                case 'tcx':
                        ctrl.gpxOptShow = false;
                    ctrl.tcxOptShow = true;
                    ctrl.kmlOptShow = false;
                    ctrl.gmlOptShow = false;
                    ctrl.geojsonOptShow = false;
                    ctrl.csvOptShow = false;
                    break;
                case 'kml':
                        ctrl.gpxOptShow = false;
                    ctrl.tcxOptShow = false;
                    ctrl.kmlOptShow = true;
                    ctrl.gmlOptShow = false;
                    ctrl.geojsonOptShow = false;
                    ctrl.csvOptShow = false;
                    break;
                case 'gml':
                        ctrl.gpxOptShow = false;
                    ctrl.tcxOptShow = false;
                    ctrl.kmlOptShow = false;
                    ctrl.gmlOptShow = true;
                    ctrl.geojsonOptShow = false;
                    ctrl.csvOptShow = false;
                    break;
                case 'geojson':
                        ctrl.gpxOptShow = false;
                    ctrl.tcxOptShow = false;
                    ctrl.kmlOptShow = false;
                    ctrl.gmlOptShow = false;
                    ctrl.geojsonOptShow = true;
                    ctrl.csvOptShow = false;
                    break;
                case 'csv':
                        ctrl.gpxOptShow = false;
                    ctrl.tcxOptShow = false;
                    ctrl.kmlOptShow = false;
                    ctrl.gmlOptShow = false;
                    ctrl.geojsonOptShow = false;
                    ctrl.csvOptShow = true;
                    break;
            }
            ctrl.currentFileFormat = fileformat.value;
        };
        ctrl.writeGpxRouteOrTrack = [{
            text: "Yes",
            value: true
        }, {
            text: "No",
            value: false
        }];
        ctrl.selected_gpxOpt1 = ctrl.writeGpxRouteOrTrack[1];
        ctrl.selected_gpxOpt2 = ctrl.writeGpxRouteOrTrack[1];
        ctrl.current_gpxOpt1 = ctrl.selected_gpxOpt1.value; //this is the default selected value on the dropdown menu
        ctrl.current_gpxOpt2 = ctrl.selected_gpxOpt2.value; //this is the default value for the current selected option
        ctrl.change_gpxOpt1 = (gpxOpt) => {
            ctrl.current_gpxOpt1 = gpxOpt.value;
        };
        ctrl.change_gpxOpt2 = (gpxOpt) => {
            ctrl.current_gpxOpt2 = gpxOpt.value;
        };
        ctrl.kmlAltitudeMode = [{
            text: "absolute",
            value: "absolute"
        }, {
            text: "clampToGround",
            value: "clampToGround"
        }, {
            text: "clampToSeaFloor",
            value: "clampToSeaFloor"
        }, {
            text: "relativeToGround",
            value: "relativeToGround"
        }, {
            text: "relativeToSeaFloor",
            value: "relativeToSeaFloor"
        }];
        ctrl.selected_kmlAltitudeMode = ctrl.kmlAltitudeMode[1];
        ctrl.current_altitudeMode = ctrl.selected_kmlAltitudeMode.value
        ctrl.change_kmlOpt = (kmlOpt) => {
            ctrl.current_altitudeMode = kmlOpt.value;
        };
        ctrl.csvGeometry = [{
            text: "As XY",
            value: "xy"
        }, {
            text: "As YX",
            value: "yx"
        }, {
            text: "As XYZ",
            value: "xyz"
        }, {
            text: "As WKT",
            value: "wkt"
        }, {
            text: "As WKT Waypoints",
            value: "wktWaypoints"
        }];
        ctrl.selected_csvGeoFormat = ctrl.csvGeometry[0];
        ctrl.current_csvGeometry = ctrl.selected_csvGeoFormat.value;
        ctrl.change_csvGeomFormat = (csvGeom) => {
            ctrl.current_csvGeometry = csvGeom.value;
        };
        ctrl.csvSeparator = [{
            text: "Comma",
            value: ","
        }, {
            text: "Semicolon",
            value: ";"
        }, {
            text: "Tab",
            value: "tab"
        }];
        ctrl.selected_csvSeparator = ctrl.csvSeparator[1];
        ctrl.current_csvSeparator = ctrl.selected_csvSeparator.value;
        ctrl.change_csvSeparator = (csvSep) => {
            ctrl.current_csvSeparator = csvSep.value;
        };
        ctrl.userDefined = {
            avgSpeed: 15,
            coordPrecision: 10
        };
        ctrl.exportRoute = () => {
            switch (ctrl.currentFileFormat) {
                default:
                    case 'gpx':
                    var options = {};
                options.gpxWaypoint = true;
                options.gpxRoute = ctrl.current_gpxOpt1;
                options.gpxTrack = ctrl.current_gpxOpt2;
                break;
                case 'tcx':
                        options = {};
                    break;
                case 'kml':
                        options = {};
                    options.altitudeMode = ctrl.current_altitudeMode;
                    break;
                case 'gml':
                        options = {};
                    break;
                case 'geojson':
                        options = {};
                    break;
                case 'csv':
                        options = {};
                    options.csvSeparator = ctrl.current_csvSeparator;
                    options.csvFormat = ctrl.current_csvGeometry;
                    break;
            }
            let currentRoute = orsRouteService.routeObj.routes[orsRouteService.getCurrentRouteIdx()].points;
            orsExportFactory.exportFile(currentRoute, options, ctrl.currentFileFormat, ctrl.userDefined.avgSpeed, ctrl.userDefined.coordPrecision);
        };
    }]
});