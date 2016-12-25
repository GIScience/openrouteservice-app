var $__app_47_scripts_47_components_47_ors_45_panel_45_accessibilityanalysis_47_ors_45_aa_45_waypoints_47_ors_45_aa_45_waypoint_47_ors_45_aa_45_waypoint_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-accessibilityanalysis/ors-aa-waypoints/ors-aa-waypoint/ors-aa-waypoint.js";
  angular.module('orsApp.ors-aa-waypoint', []).component('orsAaWaypoint', {
    templateUrl: 'scripts/components/ors-panel-accessibilityanalysis/ors-aa-waypoints/ors-aa-waypoint/ors-aa-waypoint.html',
    bindings: {
      idx: '<',
      waypoint: '<',
      onDelete: '&',
      onWaypointsChanged: '&',
      onAddressChanged: '&',
      waypoints: '<',
      showAdd: '=',
      addresses: '<'
    },
    controller: function(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
      var ctrl = this;
      ctrl.select = function(address) {
        ctrl.showAddresses = false;
        ctrl.waypoint._address = address.shortAddress;
        ctrl.waypoint._latlng = address.position;
        ctrl.onAddressChanged(ctrl.waypoint);
      };
      ctrl.checkForAddresses = function() {
        if (ctrl.addresses)
          ctrl.showAddresses = true;
      };
      ctrl.addressChanged = function() {
        var payload = orsUtilsService.generateXml(ctrl.waypoint._address);
        var request = orsRequestService.geocode(payload);
        orsRequestService.clearRequest(request, ctrl.idx);
        request.promise.then(function(response) {
          var data = orsUtilsService.domParser(response);
          var error = orsErrorhandlerService.parseResponse(data);
          if (!error) {
            ctrl.addresses = orsUtilsService.processAddresses(data);
            ctrl.showAddresses = true;
          } else {
            console.log('error');
          }
        }, function(response) {
          console.log(response);
        });
      };
      ctrl.getPlaceholder = function() {
        var placeholder = 'Area center';
        return placeholder;
      };
      ctrl.delete = function() {
        ctrl.onDelete({idx: ctrl.idx});
        ctrl.onWaypointsChanged();
      };
    }
  });
  return {};
})();
