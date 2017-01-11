angular.module('orsApp.ors-aa-queries', ['orsApp.ors-aa-query']).component('orsAaQueries', {
    templateUrl: 'components/ors-panel-accessibilityanalysis/ors-aa-queries/ors-aa-queries.html',
    bindings: {},
    controller: ['orsMessagingService', 'orsAaService', function(orsMessagingService, orsAaService) {
        let ctrl = this;
        ctrl.aaQueries = orsAaService.aaQueries;
        orsAaService.subscribeToAaQueries(function onNext(d) {
            ctrl.aaQueries.push(d);
            console.log(ctrl.aaQueries);
            // add newest isochrone to map with addToMap()
            ctrl.toggleQuery(ctrl.aaQueries.length - 1);
        });
        ctrl.deleteQuery = (isoidx) => {
            // turn off isochrones with this index
            ctrl.removeQuery(isoidx);
            // remove from ng repeat
            ctrl.aaQueries.splice(isoidx, 1);
            // re-add all indices as custom indices won't correspond anymore
            orsAaService.reshuffle();
        };
        ctrl.toggleQuery = (isoidx) => {
            orsAaService.toggleQuery(isoidx, ctrl.aaQueries[isoidx].isochrones, ctrl.aaQueries[isoidx].info.latlng);
        };
        ctrl.removeQuery = (isoidx) => {
            orsAaService.removeQuery(isoidx);
        };
        ctrl.downloadQuery = (isoidx) => {};
        ctrl.zoomTo = (isoidx, isonum = -1) => {
            let geometry;
            if (isonum == -1) {
                geometry = ctrl.aaQueries[isoidx].bbox;
            } else {
                geometry = ctrl.aaQueries[isoidx].isochrones[isonum].geometry.coordinates[0];
            }
            orsAaService.zoomTo(geometry);
        };
        ctrl.emph = (isoidx, isonum = -1) => {
            let geometry;
            if (isonum > -1) {
                geometry = ctrl.aaQueries[isoidx].isochrones[isonum].geometry.coordinates[0];
            } else {
                let isolargest = ctrl.aaQueries[isoidx].isochrones.length - 1;
                geometry = ctrl.aaQueries[isoidx].isochrones[isolargest].geometry.coordinates[0];
            }
            orsAaService.Emph(geometry);
        };
        ctrl.deEmph = () => {
            orsAaService.DeEmph();
        };
        // coming back?
        if (ctrl.aaQueries.length > 0) {
            for (let i = 0; i < ctrl.aaQueries.length; i++) {
                orsAaService.toggleQuery(i, ctrl.aaQueries[i].isochrones, ctrl.aaQueries[i].info.latlng);
            }
        }
    }]
});