angular
  .module("orsApp.ors-exportRoute-controls", [])
  .component("orsExportRouteControls", {
    templateUrl:
      "components/ors-panel-routing/ors-export-route/ors-export-route.html",
    controller: [
      "orsExportFactory",
      "orsRouteService",
      function(orsExportFactory, orsRouteService) {
        let ctrl = this;
        ctrl.elevation = true;
        ctrl.instructions = false;
        ctrl.toGpx = true;
        ctrl.speedInKmh = 9.5;
        ctrl.filename = "ors-export-linestring";
        ctrl.gpxOptShow = true;
        ctrl.tcxOptShow = false;
        ctrl.kmlOptShow = false;
        ctrl.gmlOptShow = false;
        ctrl.geojsonOptShow = false;
        ctrl.fileFormat = [
          {
            text: "GPS eXchange Format (.gpx)",
            value: "gpx"
          },
          {
            text: "Keyhole Markup Language (.kml)",
            value: "kml"
          },
          {
            text: "GarminTCX (.tcx)",
            value: "tcx"
          },
          {
            text: "GeoJSON (.geojson)",
            value: "geojson"
          },
          {
            text: "RawJSON (.json)",
            value: "rawjson"
          }
        ];
        ctrl.selected_fileformat = ctrl.fileFormat[0]; //this is the default selected value on the dropdown menu
        ctrl.currentFileFormat = ctrl.selected_fileformat.value; //this is the default value for the current selected option
        ctrl.change_fileFormat = fileformat => {
          switch (fileformat.value) {
            case "gpx":
              ctrl.gpxOptShow = true;
              ctrl.tcxOptShow = false;
              ctrl.kmlOptShow = false;
              ctrl.gmlOptShow = false;
              ctrl.geojsonOptShow = false;
              break;
            case "tcx":
              ctrl.gpxOptShow = false;
              ctrl.tcxOptShow = true;
              ctrl.kmlOptShow = false;
              ctrl.gmlOptShow = false;
              ctrl.geojsonOptShow = false;
              break;
            case "kml":
              ctrl.gpxOptShow = false;
              ctrl.tcxOptShow = false;
              ctrl.kmlOptShow = true;
              ctrl.gmlOptShow = false;
              ctrl.geojsonOptShow = false;
              break;
            case "gml":
              ctrl.gpxOptShow = false;
              ctrl.tcxOptShow = false;
              ctrl.kmlOptShow = false;
              ctrl.gmlOptShow = true;
              ctrl.geojsonOptShow = false;
              break;
            case "geojson":
            case "rawjson":
              ctrl.gpxOptShow = false;
              ctrl.tcxOptShow = false;
              ctrl.kmlOptShow = false;
              ctrl.gmlOptShow = false;
              ctrl.geojsonOptShow = true;
              break;
            case "csv":
              ctrl.gpxOptShow = false;
              ctrl.tcxOptShow = false;
              ctrl.kmlOptShow = false;
              ctrl.gmlOptShow = false;
              ctrl.geojsonOptShow = false;
              break;
            default:
          }
          ctrl.currentFileFormat = fileformat.value;
        };
        ctrl.exportRoute = () => {
          let options = {
            elevation: ctrl.elevation,
            instructions: ctrl.instructions,
            toGpx: ctrl.toGpx,
            speedInKmh: ctrl.speedInKmh
          };
          let currentRoute = null;
          if (ctrl.currentFileFormat === "rawjson") {
            currentRoute =
              orsRouteService.data.features[
                orsRouteService.getCurrentRouteIdx()
              ];
          } else {
            currentRoute =
              orsRouteService.data.features[
                orsRouteService.getCurrentRouteIdx()
              ].geometry;
          }
          orsExportFactory.exportFile(
            currentRoute,
            "linestring",
            options,
            ctrl.currentFileFormat,
            ctrl.filename
          );
        };
      }
    ]
  });
