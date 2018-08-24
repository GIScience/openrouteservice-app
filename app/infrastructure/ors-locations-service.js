angular.module("orsApp.locations-service", []).factory("orsLocationsService", [
  "$q",
  "$http",
  "orsUtilsService",
  "orsMapFactory",
  "orsObjectsFactory",
  "lists",
  "ENV",
  (
    $q,
    $http,
    orsUtilsService,
    orsMapFactory,
    orsObjectsFactory,
    lists,
    ENV
  ) => {
    /**
     * Requests geocoding from ORS backend
     * @param {String} requestData: XML for request payload
     */
    let orsLocationsService = {};
    orsLocationsService.requests = [];
    orsLocationsService.clear = () => {
      for (let req of orsLocationsService.requests) {
        if ("cancel" in req) req.cancel("Cancel last request");
      }
      orsLocationsService.requests = [];
    };
    /**
     * Requests locations
     * @param {String} requestData: XML for request payload
     */
    orsLocationsService.fetchLocations = requestData => {
      var url = ENV.pois;
      var canceller = $q.defer();
      var cancel = reason => {
        canceller.resolve(reason);
      };
      var promise = $http
        .post(url, requestData, {
          timeout: canceller.promise
        })
        .then(response => {
          return response.data;
        });
      return {
        promise: promise,
        cancel: cancel
      };
    };
    orsLocationsService.panTo = geometry => {
      let action = orsObjectsFactory.createMapAction(
        0,
        lists.layers[2],
        {
          lat: geometry[1],
          lng: geometry[0]
        },
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsLocationsService.emphPoi = (geometry, category) => {
      let action = orsObjectsFactory.createMapAction(
        11,
        lists.layers[2],
        {
          lat: geometry[1],
          lng: geometry[0]
        },
        undefined,
        category
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsLocationsService.DeEmphPoi = () => {
      let action = orsObjectsFactory.createMapAction(
        2,
        lists.layers[2],
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    /**
     * Saves a lookup table to resolve parent category of subcategory
     * @param {Object} dict: lookup table
     */
    orsLocationsService.setSubcategoriesLookup = dict => {
      orsLocationsService.subcategoriesLookup = dict;
    };
    orsLocationsService.getSubcategoriesLookup = () => {
      return orsLocationsService.subcategoriesLookup;
    };
    orsLocationsService.addLocationsToMap = data => {
      const locations = orsObjectsFactory.createMapAction(
        10,
        lists.layers[8],
        data,
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(locations);
    };
    orsLocationsService.clearLocationsToMap = data => {
      const locations = orsObjectsFactory.createMapAction(
        2,
        lists.layers[8],
        undefined,
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(locations);
    };
    return orsLocationsService;
  }
]);
