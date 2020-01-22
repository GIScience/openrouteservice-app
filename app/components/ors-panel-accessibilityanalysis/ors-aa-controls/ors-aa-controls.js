angular.module("orsApp.ors-aa-controls", []).component("orsAaControls", {
  templateUrl:
    "components/ors-panel-accessibilityanalysis/ors-aa-controls/ors-aa-controls.html",
  controller: [
    "orsSettingsFactory",
    "orsObjectsFactory",
    "orsUtilsService",
    "orsRequestService",
    "orsMapFactory",
    function(
      orsSettingsFactory,
      orsObjectsFactory,
      orsUtilsService,
      orsRequestService,
      orsMapFactory
    ) {
      let ctrl = this;
      ctrl.calculate = () => {
        ctrl.onCalculate();
      };
      ctrl.callOptions = () => {
        ctrl.showOptions = ctrl.showOptions === false;
      };
      ctrl.$onInit = () => {
        ctrl.showOptions = true;
      };
      ctrl.disabled = true;
      orsSettingsFactory.subscribeToRouteRequest(function onNext(bool) {
        ctrl.disabled = ctrl.requesting = bool === true ? true : false;
      });
      orsSettingsFactory.subscribeToAaWaypoints(function onNext(d) {
        if (d.length > 0) ctrl.disabled = false;
      });
    }
  ],
  bindings: {
    onCalculate: "&",
    activeSubgroup: "<",
    activeProfile: "<",
    currentOptions: "<"
  }
});
