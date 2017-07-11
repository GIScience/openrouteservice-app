angular.module('orsApp.ors-aa-queries', ['orsApp.ors-aa-query', 'orsApp.ors-export-query']).component('orsAaQueries', {
    templateUrl: 'components/ors-panel-accessibilityanalysis/ors-aa-queries/ors-aa-queries.html',
    bindings: {},
    controller: ['$rootScope', 'orsMessagingService', 'orsAaService', function($rootScope, orsMessagingService, orsAaService) {
        let ctrl = this;
        ctrl.aaQueries = orsAaService.aaQueries;
        ctrl.showExport = false;
        ctrl.showShare = false;
        try {
            $rootScope.isochronesSubscription.dispose();
        } catch (error) {
            console.warn(error);
        }
        $rootScope.isochronesSubscription = orsAaService.subscribeToAaQueries(function onNext(d) {
            ctrl.aaQueries.push(d);
        });
        ctrl.deleteQuery = (isoidx) => {
            // turn off isochrones with this index
            ctrl.removeQuery(isoidx);
            // remove from ng repeat
            ctrl.aaQueries.splice(isoidx, 1);
            // re-add all indices as custom indices won't correspond anymore
            orsAaService.reshuffle();
        };
        ctrl.add = (obj) => {
            orsAaService.add(obj.isoidx, ctrl.aaQueries[obj.isoidx], obj.zoom);
        };
        ctrl.toggle = (obj) => {
            orsAaService.toggle(obj.isoidx, obj.toggle, obj.zoom);
        };
        ctrl.toggleInterval = (obj) => {
            console.log(obj)
            orsAaService.toggleInterval(obj.isoidx, obj.isoIidx, obj.toggle);
        };
        ctrl.removeQuery = (isoidx) => {
            orsAaService.remove(isoidx);
        };
        ctrl.downloadQuery = (isoidx) => {
            ctrl.selectedIsochroneData = ctrl.aaQueries[isoidx];
            ctrl.showExport = !ctrl.showExport;
        };
        ctrl.shareQuery = (shareUrl) => {
            ctrl.shareUrl = shareUrl;
            ctrl.showShare = !ctrl.showShare;
        };
        ctrl.zoomTo = (isoidx, isonum = -1) => {
            let geometry;
            geometry = ctrl.aaQueries[isoidx].features[isonum].geometry.coordinates[0];
            orsAaService.zoomTo(geometry);
        };
        ctrl.emph = (isoidx, isonum = -1) => {
            let geometry;
            if (isonum > -1) {
                geometry = ctrl.aaQueries[isoidx].features[isonum].geometry.coordinates[0];
            } else {
                let isolargest = ctrl.aaQueries[isoidx].features.length - 1;
                geometry = ctrl.aaQueries[isoidx].features[isolargest].geometry.coordinates[0];
            }
            orsAaService.Emph(geometry);
        };
        ctrl.deEmph = () => {
            orsAaService.DeEmph();
        };
    }]
});