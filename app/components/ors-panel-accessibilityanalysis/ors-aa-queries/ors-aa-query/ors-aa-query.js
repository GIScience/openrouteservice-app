angular.module('orsApp.ors-aa-query', []).component('orsAaQuery', {
    templateUrl: 'components/ors-panel-accessibilityanalysis/ors-aa-queries/ors-aa-query/ors-aa-query.html',
    bindings: {
        isochroneIdx: '<',
        isochroneTotal: '<',
        attributes: '<',
        onDelete: '&',
        onToggle: '&',
        onDownload: '&',
        onEmph: '&',
        onDeEmph: '&',
        onZoom: '&'
    },
    controller: ['orsMessagingService', 'orsAaService', function(orsMessagingService, orsAaService) {
        let ctrl = this;
        ctrl.$onInit = () => {
            ctrl.showOnMap = true;
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
            ctrl.showOnMap = ctrl.showOnMap === true ? false : true;
            ctrl.onToggle({
                obj: {
                    isoidx: ctrl.isochroneIdx,
                    zoom: false
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
            if (ctrl.showOnMap) {
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