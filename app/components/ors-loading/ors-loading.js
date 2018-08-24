angular.module("orsApp.ors-loading", []).component("orsLoading", {
  templateUrl: "components/ors-loading/ors-loading.html",
  controller: [
    "orsSettingsFactory",
    "orsRequestService",
    function(orsSettingsFactory, orsRequestService) {
      let ctrl = this;
      ctrl.requesting = false;
      orsSettingsFactory.subscribeToRouteRequest(function onNext(bool) {
        ctrl.requesting = bool === true ? true : false;
      });
      orsRequestService.subscribeToGeocodingRequest(function onNext(bool) {
        ctrl.requesting = bool === true ? true : false;
      });
    }
  ],
  bindings: {}
});
