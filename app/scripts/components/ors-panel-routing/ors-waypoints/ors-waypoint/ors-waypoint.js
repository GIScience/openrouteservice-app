var $__app_47_scripts_47_components_47_ors_45_panel_45_routing_47_ors_45_waypoints_47_ors_45_waypoint_47_ors_45_waypoint_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-routing/ors-waypoints/ors-waypoint/ors-waypoint.js";
  angular.module('orsApp.ors-waypoint', []).component('orsWaypoint', {
    templateUrl: 'scripts/components/ors-panel-routing/ors-waypoints/ors-waypoint/ors-waypoint.html',
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
    controller: ['orsSettingsFactory', 'orsMapFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsErrorhandlerService', function(orsSettingsFactory, orsMapFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
      var ctrl = this;
      ctrl.select = function(address) {
        ctrl.showAddresses = false;
        ctrl.waypoint._address = address.shortAddress;
        ctrl.waypoint._latlng = address.position;
        ctrl.waypoint._set = 1;
        ctrl.onAddressChanged(ctrl.waypoint);
      };
      ctrl.getIdx = function() {
        if (ctrl.idx == 0)
          return 'A';
        else if (ctrl.idx == ctrl.waypoints.length - 1)
          return 'B';
        else
          return ctrl.idx;
      };
      ctrl.emph = function() {
        var highlightWaypoint = orsObjectsFactory.createMapAction(3, lists.layers[0], undefined, ctrl.idx, undefined);
        orsMapFactory.mapServiceSubject.onNext(highlightWaypoint);
      };
      ctrl.checkForAddresses = function() {
        if (ctrl.addresses)
          ctrl.showAddresses = true;
      };
      ctrl.addressChanged = function() {
        var inputCoordinates = ctrl.waypoint._address;
        inputCoordinates = inputCoordinates.split(/[\s,;]+/);
        if (inputCoordinates.length == 2) {
          var lat = inputCoordinates[0];
          var lng = inputCoordinates[1];
          if (orsUtilsService.isCoordinate(lat, lng)) {
            var position = L.latLng(lat, lng);
            var positionString = orsUtilsService.parseLatLngString(position);
            ctrl.addresses = [{
              address: positionString,
              position: position,
              shortAddress: positionString
            }];
            ctrl.showAddresses = true;
          }
        } else {
          var payload = orsUtilsService.generateXml(ctrl.waypoint._address);
          var request = orsRequestService.geocode(payload);
          orsRequestService.geocodeRequests.removeRequest(request, ctrl.idx);
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
        }
      };
      ctrl.getPlaceholder = function() {
        var placeholder;
        if (ctrl.idx == 0)
          placeholder = 'Start';
        else if (ctrl.idx == ctrl.waypoints.length - 1)
          placeholder = 'End';
        else
          placeholder = 'Via';
        return placeholder;
      };
      ctrl.delete = function() {
        ctrl.onDelete({idx: ctrl.idx});
        ctrl.onWaypointsChanged();
      };
    }]
  });
  return {};
})();
