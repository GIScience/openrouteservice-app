angular.module('orsApp.ors-route-controls', []).component('orsRouteControls', {
    templateUrl: 'app/components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-route-controls.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsMapFactory, orsCookiesFactory) {
        let ctrl = this;
        ctrl.showImport = false;
        console.log(ctrl.activeSubgroup)
        ctrl.showOptions = false;
        ctrl.add = () => {
            ctrl.onAdd();
            ctrl.showAdd = true;
        };
        ctrl.reset = () => {
            ctrl.onReset();
        };
        ctrl.reversing = () => {
            ctrl.onReverse();
            ctrl.onWaypointsChanged();
        };
        ctrl.callOptions = () => {
            ctrl.showOptions = ctrl.showOptions == false ? true : false;
        };
        /**
         * Called when clicking the zoom button. Forwards zoom command to mapservice
         */
        ctrl.zoom = () => {
            orsMapFactory.mapServiceSubject.onNext({
                _actionCode: 0
            });
        };
        ctrl.showImportFiles = () => {
            ctrl.showImport = ctrl.showImport === false ? true: false;
        };
    },
    bindings: {
        onAdd: '&',
        setRoundtrip: '&',
        onReset: '&',
        onReverse: '&',
        onWaypointsChanged: '&',
        showAdd: '=',
        activeSubgroup: '<',
        activeProfile: '<'
    }
});