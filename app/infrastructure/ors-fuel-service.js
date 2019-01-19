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
        angular.isDefined(orsRouteService.data.routes)
      ) {
        if (orsRouteService.data.routes.length > 0) {
          let data = orsRouteService.data;
          route = data.routes[idx];
        }
      }
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
          route.summary.ofs = response.data;
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
