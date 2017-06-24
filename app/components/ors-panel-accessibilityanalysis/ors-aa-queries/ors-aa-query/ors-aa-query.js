angular.module('orsApp.ors-aa-query', [])
    .component('orsAaQuery', {
        templateUrl: 'components/ors-panel-accessibilityanalysis/ors-aa-queries/ors-aa-query/ors-aa-query.html',
        bindings: {
            isochroneIdx: '<',
            isochroneTotal: '<',
            attributes: '<',
            onDelete: '&',
            onToggle: '&',
            onToggleInterval: '&',
            onDownload: '&',
            onEmph: '&',
            onDeEmph: '&',
            onZoom: '&',
            intervalsLength: '<'
        },
        controller: ['orsMessagingService', 'orsAaService', '$timeout', function(orsMessagingService, orsAaService, $timeout) {
            let ctrl = this;
            ctrl.intervalsHidden = [];
            ctrl.$onInit = () => {
                ctrl.showOnMap = true;
                ctrl.showIntervals = Array.apply(null, Array(ctrl.intervalsLength))
                    .map(function() {
                        return true;
                    });
                ctrl.onToggle({
                    obj: {
                        isoidx: ctrl.isochroneIdx,
                        zoom: true
                    }
                });
            };
            // ctrl.$onChanges = (changesObj) => {
            //     console.log(changesObj)
            //     if (changesObj.isochroneIdx) {
            //         if (changesObj.isochroneIdx.currentValue !== changesObj.isochroneIdx.previousValue && changesObj.isochroneIdx.previousValue >= 0) {
            //             if (ctrl.showOnMap === false) {
            //             ctrl.onToggle({
            //                 obj: {
            //                     isoidx: ctrl.isochroneIdx,
            //                     zoom: false
            //                 }
            //             });
            //             }
            //         }
            //     }
            // };
            ctrl.getClass = (bool) => {
                if (bool === true) return "fa fa-fw fa-chevron-down";
                else return "fa fa-fw fa-chevron-right";
            };
            ctrl.show = () => {
                if (ctrl.showOnMap === true) return "fa fa-toggle-on";
                else return "fa fa-toggle-off";
            };
            ctrl.zoomTo = (isonum) => {
                if (ctrl.showOnMap) {
                    ctrl.onZoom({
                        isoidx: ctrl.isochroneIdx,
                        isonum: isonum
                    });
                }
            };
            ctrl.toggle = () => {
                ctrl.intervalsHidden = [];
                if (ctrl.showOnMap === true) {
                    // hide all intervals
                    for (let i = 0; i < ctrl.intervalsLength; i++) {
                        ctrl.intervalsHidden.push(i);
                    }
                    ctrl.showIntervals = Array.apply(null, Array(ctrl.intervalsLength))
                        .map(function() {
                            return false;
                        });
                    ctrl.showOnMap = false;
                } else {
                    ctrl.showIntervals = Array.apply(null, Array(ctrl.intervalsLength))
                        .map(function() {
                            return true;
                        });
                    ctrl.showOnMap = true;
                }
                ctrl.onToggle({
                    obj: {
                        isoidx: ctrl.isochroneIdx,
                        zoom: false
                    }
                });
            };
            ctrl.toggleInterval = (intervalIdx, event) => {
                event.preventDefault();
                event.stopPropagation();
                ctrl.showIntervals[intervalIdx] = ctrl.showIntervals[intervalIdx] === true ? false : true;
                if (ctrl.intervalsHidden.indexOf(intervalIdx) == -1) {
                    ctrl.intervalsHidden.push(intervalIdx);
                } else {
                    const index = ctrl.intervalsHidden.indexOf(intervalIdx);
                    ctrl.intervalsHidden.splice(index, 1);
                }
                console.log(ctrl.intervalsHidden.length ,ctrl.intervalsLength)
                if (ctrl.intervalsHidden.length == ctrl.intervalsLength) {
                    ctrl.showOnMap = false;
                } else  {
                    ctrl.showOnMap = true;
                }
                ctrl.show();
                ctrl.onToggleInterval({
                    obj: {
                        isoidx: ctrl.isochroneIdx,
                        isointervalindices: ctrl.intervalsHidden
                    }
                });
            };
            ctrl.download = () => {
                ctrl.onDownload({
                    isoidx: ctrl.isochroneIdx
                });
            };
            ctrl.remove = () => {
                ctrl.onDelete({
                    isoidx: ctrl.isochroneIdx
                });
            };
            ctrl.emph = (isonum) => {
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
        }]
    });