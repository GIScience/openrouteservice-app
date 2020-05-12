angular.module("orsApp.ors-aa-query", []).component("orsAaQuery", {
  templateUrl:
    "components/ors-panel-accessibilityanalysis/ors-aa-queries/ors-aa-query/ors-aa-query.html",
  bindings: {
    isochroneIdx: "<",
    isochroneTotal: "<",
    attributes: "<",
    onDelete: "&",
    onToggle: "&",
    onToggleInterval: "&",
    onDownload: "&",
    onShare: "&",
    onEmph: "&",
    onDeEmph: "&",
    onZoom: "&",
    onAdd: "&",
    intervalsLength: "<"
  },
  controller: [
    "orsMessagingService",
    "orsAaService",
    "$timeout",
    "$location",
    "$scope",
    "$rootScope",
    function(
      orsMessagingService,
      orsAaService,
      $timeout,
      $location,
      $scope,
      $rootScope
    ) {
      let ctrl = this;
      ctrl.intervalsHidden = [];
      ctrl.isochroneOpacitySlider = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 5,
          vertical: true,
          translate: value => {
            return value / 100;
          },
          /**
           * Broadcasts isochrone index and value to be accessible from ors-maps.js
           */
          onChange: () => {
            $rootScope.$broadcast("isoOpacityChange", {
              idx: ctrl.isochroneIdx,
              opacity: ctrl.isochroneOpacitySlider.value
            });
          },
          hideLimitLabels: true,
          hidePointerLabels: true
        }
      };
      ctrl.$onInit = () => {
        ctrl.refreshSlider();
        ctrl.showOnMap = true;
        ctrl.showIntervals = Array.apply(null, Array(ctrl.intervalsLength)).map(
          function() {
            return true;
          }
        );
        ctrl.onAdd({
          obj: {
            isoidx: ctrl.isochroneIdx,
            zoom: true
          }
        });
        ctrl.shareUrl = $location.absUrl();
      };
      // ctrl.$onChanges = (changesObj) => {
      //
      //             }
      //         }
      //     }
      // };
      ctrl.getClass = bool => {
        if (bool === true) return "fa fa-fw fa-chevron-down";
        else return "fa fa-fw fa-chevron-right";
      };
      ctrl.show = () => {
        if (ctrl.showOnMap === true) return "fa fa-toggle-on";
        else return "fa fa-toggle-off";
      };
      ctrl.zoomTo = isonum => {
        if (ctrl.showOnMap) {
          ctrl.onZoom({
            isoidx: ctrl.isochroneIdx,
            isonum: isonum
          });
        }
      };
      ctrl.toggle = () => {
        ctrl.onToggle({
          obj: {
            isoidx: ctrl.isochroneIdx,
            toggle: ctrl.showOnMap,
            zoom: false
          }
        });
        ctrl.intervalsHidden = [];
        if (ctrl.showOnMap === true) {
          // hide all intervals
          for (let i = 0; i < ctrl.intervalsLength; i++) {
            ctrl.intervalsHidden.push(i);
          }
          ctrl.showIntervals = Array.apply(
            null,
            Array(ctrl.intervalsLength)
          ).map(function() {
            return false;
          });
          ctrl.showOnMap = false;
        } else {
          ctrl.showIntervals = Array.apply(
            null,
            Array(ctrl.intervalsLength)
          ).map(function() {
            return true;
          });
          ctrl.showOnMap = true;
        }
      };
      ctrl.toggleInterval = (intervalIdx, event) => {
        event.preventDefault();
        event.stopPropagation();
        let reverseIndex = ctrl.attributes.features.length - 1 - intervalIdx;
        ctrl.onToggleInterval({
          obj: {
            isoidx: ctrl.isochroneIdx,
            isoIidx: intervalIdx,
            revIsoIidx: reverseIndex,
            toggle: ctrl.showIntervals[intervalIdx]
          }
        });
        ctrl.showIntervals[intervalIdx] =
          ctrl.showIntervals[intervalIdx] !== true;
        if (ctrl.intervalsHidden.indexOf(intervalIdx) === -1) {
          ctrl.intervalsHidden.push(intervalIdx);
        } else {
          const index = ctrl.intervalsHidden.indexOf(intervalIdx);
          ctrl.intervalsHidden.splice(index, 1);
        }
        if (ctrl.intervalsHidden.length === ctrl.intervalsLength) {
          ctrl.showOnMap = false;
        } else {
          ctrl.showOnMap = true;
        }
        ctrl.show();
      };
      /**
       * Refreshes the angularjs-sliders
       */
      ctrl.refreshSlider = () => {
        $timeout(() => {
          $scope.$broadcast("rzSliderForceRender");
        });
      };
      ctrl.download = () => {
        ctrl.onDownload({
          isoidx: ctrl.isochroneIdx
        });
      };
      ctrl.share = () => {
        ctrl.onShare({
          shareUrl: ctrl.shareUrl
        });
      };
      ctrl.remove = () => {
        ctrl.onDelete({
          isoidx: ctrl.isochroneIdx
        });
      };
      ctrl.emph = isonum => {
        if (ctrl.showOnMap && ctrl.intervalsHidden.indexOf(isonum) == -1) {
          ctrl.onEmph({
            isoidx: ctrl.isochroneIdx,
            isonum: isonum
          });
        }
      };
      ctrl.deEmph = () => {
        if (ctrl.showOnMap) {
          ctrl.onDeEmph();
        }
      };
    }
  ]
});
