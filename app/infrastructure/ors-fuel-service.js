angular.module("orsApp.fuel-service", []).factory("orsFuelService", [
  "$q",
  "$http",
  "orsUtilsService",
  "orsMapFactory",
  "orsObjectsFactory",
  "lists",
  "ENV",
  "orsRouteService",
  (
    $q,
    $http,
    orsUtilsService,
    orsMapFactory,
    orsObjectsFactory,
    lists,
    ENV,
    orsRouteService
  ) => {
    let orsFuelService = {};
    orsFuelService.requests = [];
    orsFuelService.clear = () => {
      for (let req of orsFuelService.requests) {
        if ("cancel" in req) req.cancel("Cancel last request");
      }
      orsFuelService.requests = [];
    };
    /**
     *
     * @param geometry
     * @param ofsSettings
     * @returns {{promise: *, cancel: cancel}}
     */
    orsFuelService.getConsumption = ofsSettings => {
      let idx =
        orsRouteService.getCurrentRouteIdx() === undefined
          ? 0
          : orsRouteService.getCurrentRouteIdx();
      let route;
      if (
        angular.isDefined(orsRouteService.data) &&
        angular.isDefined(orsRouteService.data.features)
      ) {
        if (orsRouteService.data.features.length > 0) {
          let data = orsRouteService.data;
          route = data.features[idx];
        }
      }
      if (route && route.geometryRaw) {
        let geometry = {
          coordinates: route.geometryRaw,
          type: "LineString"
        };
        let parameters = {
          request: "route"
        };
        let url = ENV.fuel;
        let canceller = $q.defer();
        let requestData = {
          request: "route",
          geometry: {
            geojson: geometry,
            filters: ofsSettings.filters
          }
        };
        let cancel = reason => {
          canceller.resolve(reason);
        };
        let promise = $http
          .post(
            url,
            requestData,
            { params: parameters },
            {
              timeout: canceller.promise
            }
          )
          .then(response => {
            let fuelSubject = null;
            if (
              Object.keys(response.data.fuel_stats).length === 1 &&
              response.data.fuel_stats.individual
            ) {
              fuelSubject = response.data.fuel_stats.individual;
            } else {
              let category = response.data.general.vehicle_categories[0];
              fuelSubject = response.data.fuel_stats[category];
            }
            fuelSubject.total_cost.price_date = fuelSubject.total_cost.price_date
              .split("T")[0]
              .split("-")
              .reverse()
              .join(".");
            if (fuelSubject.category_info.calculation_errors === "No Errors") {
              route.properties.summary.consumption =
                fuelSubject.total_consumption.liters;
              route.properties.summary.emission =
                fuelSubject.total_emissions.co2_kg;
              route.properties.summary.fuelCost =
                fuelSubject.total_cost.w_tax_euro;
            }
            route.properties.summary.ofs = response.data;
            return response.data;
          });
      }
    };
    orsFuelService.getBrands = () => {
      let url = ENV.fuel;
      let canceller = $q.defer();
      let parameters = {
        request: "brands",
        source: "cfd"
      };
      let cancel = reason => {
        canceller.resolve(reason);
      };
      let promise = $http
        .get(
          url,
          { params: parameters },
          {
            timeout: canceller.promise
          }
        )
        .then(response => {
          return response.data;
        });
      return {
        promise: promise,
        cancel: cancel
      };
    };
    orsFuelService.getCars = brand => {
      let url = ENV.fuel;
      let canceller = $q.defer();
      let parameters = {
        request: "cars",
        brand: brand,
        source: "cfd"
      };
      let cancel = reason => {
        canceller.resolve(reason);
      };
      let promise = $http
        .get(
          url,
          { params: parameters },
          {
            timeout: canceller.promise
          }
        )
        .then(response => {
          return response.data;
        });
      return {
        promise: promise,
        cancel: cancel
      };
    };

    return orsFuelService;
  }
]);
