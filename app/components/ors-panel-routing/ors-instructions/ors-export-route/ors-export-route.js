angular.module('orsApp.ors-exportRoute-controls', []).component('orsExportRouteControls', {
    templateUrl: 'components/ors-panel-routing/ors-instructions/ors-export-route/ors-export-route.html',
    controller: ['orsExportFactory', 'orsRouteService', function(orsExportFactory, orsRouteService) {
        let ctrl = this;
        ctrl.gpxOptShow = true;
        ctrl.tcxOptShow = false;
        ctrl.kmlOptShow = false;
        ctrl.gmlOptShow = false;
        ctrl.geojsonOptShow = false;
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
                break;
                case 'tcx':
                        ctrl.gpxOptShow = false;
                    ctrl.tcxOptShow = true;
                    ctrl.kmlOptShow = false;
                    ctrl.gmlOptShow = false;
                    ctrl.geojsonOptShow = false;
                    break;
                case 'kml':
                        ctrl.gpxOptShow = false;
                    ctrl.tcxOptShow = false;
                    ctrl.kmlOptShow = true;
                    ctrl.gmlOptShow = false;
                    ctrl.geojsonOptShow = false;
                    break;
                case 'gml':
                        ctrl.gpxOptShow = false;
                    ctrl.tcxOptShow = false;
                    ctrl.kmlOptShow = false;
                    ctrl.gmlOptShow = true;
                    ctrl.geojsonOptShow = false;
                    break;
                case 'geojson':
                        ctrl.gpxOptShow = false;
                    ctrl.tcxOptShow = false;
                    ctrl.kmlOptShow = false;
                    ctrl.gmlOptShow = false;
                    ctrl.geojsonOptShow = true;
                    break;
                case 'csv':
                        ctrl.gpxOptShow = false;
                    ctrl.tcxOptShow = false;
                    ctrl.kmlOptShow = false;
                    ctrl.gmlOptShow = false;
                    ctrl.geojsonOptShow = false;
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
        ctrl.current_altitudeMode = ctrl.selected_kmlAltitudeMode.value;
        ctrl.change_kmlOpt = (kmlOpt) => {
            ctrl.current_altitudeMode = kmlOpt.value;
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
            }
            let currentRoute = orsRouteService.data.routes[orsRouteService.getCurrentRouteIdx()].geometry;
            orsExportFactory.exportFile(currentRoute, 'linestring', options, ctrl.currentFileFormat, ctrl.userDefined.avgSpeed, ctrl.userDefined.coordPrecision);
        };
    }]
});