angular.module("orsApp.request-service", []).factory("orsRequestService", [
  "$q",
  "$http",
  "orsUtilsService",
  "orsObjectsFactory",
  "orsMapFactory",
  "lists",
  "orsNamespaces",
  "ENV",
  (
    $q,
    $http,
    orsUtilsService,
    orsObjectsFactory,
    orsMapFactory,
    lists,
    orsNamespaces,
    ENV
  ) => {
    /**
     * Requests geocoding from ORS backend
     * @param {String} requestData: XML for request payload
     */
    let orsRequestService = {};
    orsRequestService.geocodeRequests = {};
    orsRequestService.geocodeRequests.aaRequests = [];
    orsRequestService.geocodeRequests.routeRequests = [];
    orsRequestService.requestSubject = new Rx.Subject();
    orsRequestService.savedRequests = {
      directions: [],
      geocoding: []
    };
    /** Subscription function to geocoding request. */
    orsRequestService.subscribeToGeocodingRequest = o => {
      return orsRequestService.requestSubject.subscribe(o);
    };
    /**
     * Replaces request if new one is fired on same index
     * @param {Object} request: xhr request
     * @param {number} idx: WP idx
     * @param {string} requestsQueue: Current requests queue
     */
    orsRequestService.geocodeRequests.updateRequest = (
      request,
      idx,
      requestsQueue
    ) => {
      if (
        typeof orsRequestService.geocodeRequests[requestsQueue][idx] ===
        "undefined"
      ) {
        orsRequestService.geocodeRequests[requestsQueue][idx] = request;
      } else {
        orsRequestService.geocodeRequests[requestsQueue][idx].cancel(
          "Cancel last request"
        );
        orsRequestService.geocodeRequests[requestsQueue][idx] = request;
      }
    };
    /**
     * Removes requests from the queue, used if waypoints are removed from list
     * @param {number} idx: WP idx
     * @param {string} requestsQue: Current requests queue
     */
    orsRequestService.geocodeRequests.removeRequest = (idx, requestsQue) => {
      if (
        typeof orsRequestService.geocodeRequests[requestsQue][idx] !==
        "undefined"
      ) {
        orsRequestService.geocodeRequests[requestsQue][idx].cancel(
          "Cancel last request"
        );
        orsRequestService.geocodeRequests[requestsQue].splice(idx, 1);
      }
    };
    /** cancels all requests if there are any outstanding */
    orsRequestService.geocodeRequests.clear = () => {
      for (let req of orsRequestService.geocodeRequests.routeRequests) {
        if ("cancel" in req) req.cancel("Cancel last request");
      }
      for (let req of orsRequestService.geocodeRequests.aaRequests) {
        if ("cancel" in req) req.cancel("Cancel last request");
      }
    };
    orsRequestService.zoomTo = geom => {
      let action = orsObjectsFactory.createMapAction(
        0,
        lists.layers[0],
        geom,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    /**
     *
     * @param requestData -
     * @param reverse - true for reverse geocoding request
     * @returns {{promise: *, cancel: cancel}}
     */
    orsRequestService.geocode = (requestData, reverse = false) => {
      var url = ENV.geocode;
      url += reverse ? "/reverse" : "/autocomplete";
      var canceller = $q.defer();
      var cancel = function(reason) {
        canceller.resolve(reason);
      };
      var promise = $http
        .get(url, {
          params: requestData,
          timeout: canceller.promise
        })
        .then(function(response) {
          return response.data;
        });
      return {
        promise: promise,
        cancel: cancel
      };
    };
    /**
     * Processes response
     * @param {Object} response: response data
     */
    orsRequestService.processResponse = response => {
      let data = response.data;
      return data;
    };
    return orsRequestService;
  }
]);
