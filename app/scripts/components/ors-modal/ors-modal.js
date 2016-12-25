var $__app_47_scripts_47_components_47_ors_45_modal_47_ors_45_modal_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-modal/ors-modal.js";
  angular.module('orsApp.ors-modal', []).component('orsModal', {
    template: "\n\t\t\t<div class=\"ors-modal-container\">\n\t\t\t\t<form class=\"ors-dialog\">\n\t\t\t\t<ng-transclude></ng-transclude>\n\t\t\t\t<button class=\"ors-button close\" data-ng-click=\"$ctrl.show = !$ctrl.show\">\n\t\t\t\t    <i class=\"fa fa-lg fa-remove\">\n\t\t\t\t    </i>\n\t\t\t\t</button>\n\t\t\t\t</form>\n\t\t\t</div>\n    ",
    transclude: true,
    bindings: {show: '='},
    controller: function() {
      var ctrl = this;
    }
  });
  return {};
})();
