var $__app_47_scripts_47_components_47_ors_45_panel_45_accessibilityanalysis_47_ors_45_aa_45_controls_47_ors_45_aa_45_controls_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-accessibilityanalysis/ors-aa-controls/ors-aa-controls.js";
  angular.module('orsApp.ors-aa-controls', []).component('orsAaControls', {
    templateUrl: 'scripts/components/ors-panel-accessibilityanalysis/ors-aa-controls/ors-aa-controls.html',
    controller: ['orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsErrorhandlerService', 'orsMapFactory', function(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsMapFactory) {
      var ctrl = this;
      ctrl.calculate = function() {
        ctrl.onCalculate();
      };
      ctrl.reset = function() {
        ctrl.onReset();
      };
      ctrl.zoomToArea = function() {
        orsMapFactory.mapServiceSubject.onNext({_actionCode: 0});
      };
    }],
    bindings: {
      onCalculate: '&',
      onReset: '&'
    }
  });
  return {};
})();
