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
        ctrl.showOnMap = true;
        console.log(ctrl.attributes);
        ctrl.getClass = (bool) => {
            if (bool === true) return "fa fa-fw fa-chevron-down";
            else return "fa fa-fw fa-chevron-right";
        };
        ctrl.show = (bool) => {
            if (bool === true) return "fa fa-eye";
            else return "fa fa-eye-slash";
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
                isoidx: ctrl.isochroneIdx
            });
        };
        ctrl.download = () => {
            console.log('download')
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