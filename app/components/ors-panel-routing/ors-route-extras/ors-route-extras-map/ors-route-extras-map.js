angular
  .module("orsApp.ors-route-extras-map", [])
  .component("orsRouteExtrasMap", {
    //replace: true,
    templateUrl:
      "components/ors-panel-routing/ors-route-extras/ors-route-extras-map/ors-route-extras-map.html",
    bindings: {
      routeIndex: "<",
      i: "<",
      extra: "<", //needed for translation in the template
      types: "<",
      checkboxes: "<"
    },
    controller: [
      "orsRouteService",
      function(orsRouteService) {
        let ctrl = this;
        let currentRoute = orsRouteService.data.features;
        ctrl.calculateExtraColorSegments = () => {
          angular.forEach(ctrl.types, function(value, key) {
            const color = value.color;
            angular.forEach(ctrl.types[key].intervals, function(v, k) {
              const geom = currentRoute[ctrl.routeIndex].geometry.slice(
                v[0],
                v[1] + 1
              );
              orsRouteService.Color(geom, color);
            });
          });
        };
        ctrl.$onInit = () => {
          //orsRouteService.DeColor();
          angular.forEach(ctrl.checkboxes, function(checked, idx) {
            if (ctrl.i === idx) {
              if (checked) {
                ctrl.calculateExtraColorSegments();
              }
            }
          });
        };
        ctrl.updateExtrasColor = () => {
          ctrl.checkboxes[ctrl.i] = !ctrl.checkboxes[ctrl.i];
          angular.forEach(ctrl.checkboxes, function(checked, idx) {
            if (ctrl.i === idx) {
              if (ctrl.checkboxes[ctrl.i]) {
                ctrl.calculateExtraColorSegments();
              } else {
                orsRouteService.DeColor();
              }
            } else {
              ctrl.checkboxes[idx] = false;
            }
          });
        };
      }
    ]
  });
