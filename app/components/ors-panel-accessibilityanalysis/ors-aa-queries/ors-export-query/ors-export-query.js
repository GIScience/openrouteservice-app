angular.module("orsApp.ors-export-query", []).component("orsExportQuery", {
  templateUrl:
    "components/ors-panel-accessibilityanalysis/ors-aa-queries/ors-export-query/ors-export-query.html",
  bindings: {
    isochroneData: "<"
  },
  controller: [
    "orsExportFactory",
    "orsAaService",
    function(orsExportFactory, orsRouteService) {
      let ctrl = this;
      ctrl.filename = "ors-export-polygon";
      ctrl.geojsonOptShow = false;
      ctrl.fileFormat = [
        {
          text: "GeoJSON (.geojson)",
          value: "geojson"
        }
      ];
      ctrl.selected_fileformat = ctrl.fileFormat[0]; //this is the default selected value on the dropdown menu
      ctrl.currentFileFormat = ctrl.selected_fileformat.value; //this is the default value for the current selected option
      ctrl.change_fileFormat = fileformat => {
        switch (fileformat.value) {
          case "geojson":
            ctrl.geojsonOptShow = true;
            break;
        }
        ctrl.currentFileFormat = fileformat.value;
      };
      ctrl.exportRoute = () => {
        let options;
        switch (ctrl.currentFileFormat) {
          case "geojson":
            options = {};
            break;
        }
        orsExportFactory.exportFile(
          ctrl.isochroneData.features,
          "polygon",
          options,
          ctrl.currentFileFormat,
          ctrl.filename
        );
      };
    }
  ]
});
