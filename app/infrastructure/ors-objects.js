angular.module('orsApp').factory('orsObjectsFactory', function() {
    class waypoint {
        constructor(address, latlng) {
            this._address = address;
            this._latlng = latlng;
        }
    }
    return {
        createWaypoint: (address, latlng) => {
            return new waypoint(address, latlng);
        }
    };
});