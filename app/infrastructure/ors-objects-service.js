angular.module('orsApp.objects-service', []).factory('orsObjectsFactory', function() {
    /** Class representing a waypoint. */
    class waypoint {
        /**
         * Create a waypoint.
         * @param {string} address - The address string.
         * @param {Object} latlng - The leaflet latlng object.
         */
        constructor(address, latlng) {
            this._address = address;
            this._latlng = latlng;
        }
    }
    return {
        /**
         * Get new waypoint.
         * @return {Object} A new waypoint object.
         */
        createWaypoint: (address, latlng) => {
            return new waypoint(address, latlng);
        }
    };
});