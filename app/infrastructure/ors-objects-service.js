angular.module('orsApp.objects-service' , []).factory('orsObjectsFactory', function() {
    class waypoint {
        constructor(address, latlng) {
            this._address = address;
            this._latlng = latlng;
        }
    }
    class uiWaypoint {
        constructor(idx) {
            this._idx = idx;
        }
    }
    return {
        createWaypoint: (address, latlng) => {
            return new waypoint(address, latlng);
        },
        createUiWaypoint: (idx) => {
            return new uiWaypoint(idx);
        }

    };
});