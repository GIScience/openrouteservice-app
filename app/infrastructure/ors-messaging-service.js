angular.module("orsApp.messaging-service", []).factory("orsMessagingService", [
  "$http",
  "$timeout",
  ($http, $timeout) => {
    /**
     * Checks if response contains errors
     * @param {String} requestData XML for request payload
     */
    let orsMessagingService = {};
    orsMessagingService.messageSubject = new Rx.BehaviorSubject({});
    /** Subscription function to current route object. */
    orsMessagingService.subscribeToMessage = o => {
      return orsMessagingService.messageSubject.subscribe(o);
    };
    return orsMessagingService;
  }
]);
