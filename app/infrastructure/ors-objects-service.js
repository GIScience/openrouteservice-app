angular.module('orsApp.objects-service', []).factory('orsObjectsFactory', () => {
    /** Class representing a waypoint. */
    class waypoint {
        /**
         * Create a waypoint.
         * @param {string} address - The address string.
         * @param {Object} latlng - The leaflet latlng object.
         */
        constructor(address, latlng, set) {
            this._address = address;
            this._latlng = latlng;
            this._set = set;
        }
    }
    /** Class representing a map action. */
    class mapAction {
        /**
         * Create a map action.
         * @param {number} aCode - The action code.
         * @param {number} layerCode - The layer code.
         * @param {Array} geometry - List of latlng tuples.
         * @param {number} fId - Feature id to zoom to. 
         * @param {Object} style - Contains style elements. 
         */
        constructor(aCode, layerCode, geometry, fId, style) {
            this._actionCode = aCode;
            this._package = {
                layerCode: layerCode,
                geometry: geometry,
                featureId: fId,
                style: style
            };
        }
    }
    return {
        /**
         * Get new waypoint.
         * @return {Object} A new waypoint object.
         */
        createWaypoint: (address, latlng, set = 0) => {
            return new waypoint(address, latlng, set);
        },
        /** 
         * Create map interaction object.
         * @return {Object} A map interaction object.
         */
        createMapAction: (actionCode, layerCode, geometry = undefined, featureId = undefined, style = undefined) => {
            console.log(style)
            return new mapAction(actionCode, layerCode, geometry, featureId, style);
        }
    };
});