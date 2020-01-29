angular
  .module("orsApp.objects-service", [])
  .factory("orsObjectsFactory", () => {
    class point {
      /**
       * Create a GeoJSON point as object.
       * @param lat - latitude
       * @param lng - longitude
       */
      constructor(lat, lng) {
        this.type = "Feature";
        this.properties = {};
        this.geometry = {
          type: "Point",
          coordinates: [lng, lat]
        };
      }
    }
    /** Class representing a waypoint. */
    class waypoint {
      /**
       * Create a waypoint.
       * @param {string} address - The address string.
       * @param {Object} latLng - The leaflet latLng object.
       * @param {integer} set - TODO
       * @param {boolean} direct - if this is a direct waypoint (used to set skip_segments)
       */
      constructor(address, latLng, set, direct) {
        this._address = address;
        this._latlng = latLng;
        this._set = set;
        this._direct = direct;
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
       * @param {Object} extraInformation - TODO
       */
      constructor(
        aCode,
        layerCode,
        geometry,
        fId,
        style,
        extraInformation,
        cRI
      ) {
        this._actionCode = aCode;
        this._package = {
          layerCode: layerCode,
          geometry: geometry,
          featureId: fId,
          style: style,
          extraInformation: extraInformation,
          currentRouteIndex: cRI
        };
      }
    }
    return {
      /**
       * Get new waypoint.
       * @return {Object} A new waypoint object.
       */
      createPoint: (lat, lng) => {
        return new point(lat, lng);
      },
      /**
       * Get new waypoint.
       * @return {Object} A new waypoint object.
       */
      createWaypoint: (address, latLng, set = 0, direct = false) => {
        return new waypoint(address, latLng, set, direct);
      },
      /**
       * Create map interaction object.
       * @return {Object} A map interaction object.
       */
      createMapAction: (
        actionCode,
        layerCode,
        geometry = undefined,
        featureId = undefined,
        style = undefined,
        extraInformation = undefined,
        currentRouteIndex = 0
      ) => {
        return new mapAction(
          actionCode,
          layerCode,
          geometry,
          featureId,
          style,
          extraInformation,
          currentRouteIndex
        );
      }
    };
  });
