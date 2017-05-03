angular.module('orsApp.utils-service', []).factory('orsUtilsService', ['$q', '$http', '$timeout', '$location', 'lists', 'ENV', ($q, $http, $timeout, $location, lists, ENV) => {
    let orsUtilsService = {};
    /**
     * trims coordinates
     * @param {Array} coords: List of untrimmed coords
     * @param {number} length: Amount of decimals
     * @return {list} coordsTrimmed: List of trimmed coords
     */
    orsUtilsService.trimCoordinates = (coords, length) => {
        let coordsTrimmed = [];
        for (let i = 0; i < coords.length; i++) {
            let pair = coords[i];
            if (pair !== undefined) {
                let ptA = pair[0].toString().split('.');
                let ptB = pair[1].toString().split('.');
                ptA = ptA[0] + '.' + ptA[1].substr(0, 5);
                ptB = ptB[0] + '.' + ptB[1].substr(0, 5);
                coordsTrimmed.push([ptA, ptB]);
            }
        }
        return coordsTrimmed;
    };
    orsUtilsService.isInt = (n) => {
        return Number(n) === n && n % 1 === 0;
    };
    orsUtilsService.isFloat = (n) => {
        return Number(n) === n && n % 1 !== 0;
    };
    /**
     * checks whether position are valid coordinates
     * @param {String} lat: Latitude as string
     * @param {String} lng: Longitude as string
     * @return {boolean}: true or false
     */
    orsUtilsService.isCoordinate = (lat, lng) => {
        const ck_lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
        const ck_lng = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
        const validLat = ck_lat.test(lat);
        const validLon = ck_lng.test(lng);
        if (validLat && validLon) {
            return true;
        } else {
            return false;
        }
    };
    /**
     * Rounds decimal of coordinate
     * @param {String} coord: Coordinate
     * @return {String} latlng: String latLng representation "lat, lng"
     */
    orsUtilsService.roundCoordinate = (coord) => {
        coord = Math.round(coord * 1000000) / 1000000;
        console.log(coord)
        return coord;
    };
    /**
     * parses leaflet latlng to string representation
     * @param {Object} latlng: Leaflet latLng Object
     * @return {String} latlng: String latLng representation "lat, lng"
     */
    orsUtilsService.parseLatLngString = function(latlng) {
        return Math.round(latlng.lat * 1000000) / 1000000 + ', ' + Math.round(latlng.lng * 1000000) / 1000000;
    };
    /**
     * parses leaflet latlng to string representation
     * @param {Object} latlng: Leaflet latLng Object
     * @return {String} latlng: String latLng representation "lat, lng"
     */
    orsUtilsService.parseLngLatString = function(latlng) {
        return Math.round(latlng.lng * 1000000) / 1000000 + ', ' + Math.round(latlng.lat * 1000000) / 1000000;
    };
    /**
     * Decodes to a [latitude, longitude] coordinates array.
     * @param {String} str
     * @param {Boolean} elevation
     * @param {Number} precision
     * @returns {Array}
     */
    orsUtilsService.decodePolyline = function(str, elevation, precision) {
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, precision || 5);
        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length) {
            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;
            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
            shift = result = 0;
            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += latitude_change;
            lng += longitude_change;
            coordinates.push([lat / factor, lng / factor]);
        }
        return coordinates;
    };
    /**
     * Requests shorten link
     * @param {String} requestData: XML for request payload
     */
    orsUtilsService.getShortenlink = (location) => {
        let requestData = {
            access_token: 'd9c484e2c240975de02bfd2f2f4211ad3a0bab6d',
            longUrl: location
        };
        var url = ENV.shortenlink;
        var canceller = $q.defer();
        var cancel = (reason) => {
            canceller.resolve(reason);
        };
        var promise = $http.get(url, {
            params: requestData,
            timeout: canceller.promise
        }).then((response) => {
            return response.data;
        });
        return {
            promise: promise,
            cancel: cancel
        };
    };
    /** 
     * generates object for request and serializes it to http parameters   
     * @param {Object} settings: route settings object
     * @param {Object} userSettings: To limit the amount of responses
     * @return {Object} payload: Paylod object used in xhr request
     */
    orsUtilsService.routingPayload = (settings, userSettings) => {
        console.log(settings, userSettings);
        let payload;
        payload = {
            profile: lists.profiles[settings.profile.type].request,
            preference: settings.profile.options.weight.toLowerCase(),
            language: userSettings.routinglang,
            geometry_format: 'geojson',
            instructions: true,
            geometry: true,
            units: 'm',
            instructions_format: 'html',
            elevation: lists.profiles[settings.profile.type].elevation,
            options: JSON.stringify(orsUtilsService.generateOptions(settings))
        };
        const subgroup = lists.profiles[settings.profile.type].subgroup;
        /** prepare waypoints */
        let waypoints = [];
        angular.forEach(settings.waypoints, function(waypoint) {
            if (waypoint._set == 1) waypoints.push(waypoint);
        });
        payload.coordinates = '';
        for (let j = 0, i = 0; i < waypoints.length; i++) {
            payload.coordinates += orsUtilsService.roundCoordinate(waypoints[i]._latlng.lng) + ',' + orsUtilsService.roundCoordinate(waypoints[i]._latlng.lat) + '|';
        }
        payload.coordinates = payload.coordinates.slice(0, -1);
        //  extras
        if (lists.profiles[settings.profile.type].elevation === true) {
            payload.extra_info = 'surface|waytype|suitability|steepness';
        } else {
            payload.extra_info = 'surface|waytype|suitability';
        }
        return payload;
    };
    /** 
     * generates object for request and serializes it to http parameters   
     * @param {String} str: Free form address
     * @param {boolean} reverse: if reversed geocoding, default false
     * @param {string} language: Desired language of response
     * @param {number} limit: To limit the amount of responses
     * @return {Object} payload: Paylod object used in xhr request
     */
    orsUtilsService.geocodingPayload = function(obj, reverse = false, language = 'en', limit = 20) {
        let payload;
        if (!reverse) {
            payload = {
                query: obj,
                lang: language,
                limit: limit
            };
        } else {
            payload = {
                location: obj,
                lang: language,
                limit: limit
            };
        }
        return payload;
    };
    orsUtilsService.generateOptions = (settings) => {
        const subgroup = lists.profiles[settings.profile.type].subgroup;
        let options = {
            avoid_features: '',
            profile_params: {}
        };
        angular.forEach(settings.profile.options.avoidables, function(value, key) {
            if (value === true) {
                const avSubgroups = lists.optionList.avoidables[key].subgroups;
                if (avSubgroups.indexOf(subgroup) !== -1) {
                    options.avoid_features += lists.optionList.avoidables[key].name + '|';
                }
            }
        });
        if (subgroup == 'Bicycle') {
            if (!angular.isUndefined(settings.profile.options.difficulty)) {
                if (settings.profile.options.difficulty.avoidhills === true) options.avoid_features += 'hills' + '|';
            }
        }
        if (options.avoid_features.length == 0) {
            delete options.avoid_features;
        } else {
            options.avoid_features = options.avoid_features.slice(0, -1);
        }
        if (subgroup == 'HeavyVehicle') {
            options.vehicle_type = settings.profile.type;
            if (!angular.isUndefined(settings.profile.options.width)) options.profile_params.width = settings.profile.options.width.toString();
            if (!angular.isUndefined(settings.profile.options.height)) options.profile_params.height = settings.profile.options.height.toString();
            if (!angular.isUndefined(settings.profile.options.weight)) options.profile_params.weight = settings.profile.options.hgvWeight.toString();
            if (!angular.isUndefined(settings.profile.options.length)) options.profile_params.length = settings.profile.options.length.toString();
            if (!angular.isUndefined(settings.profile.options.axleload)) options.profile_params.axleload = settings.profile.options.axleload.toString();
            if (!angular.isUndefined(settings.profile.options.hazardous)) options.profile_params.hazmat = true;
        }
        if (settings.profile.options.maxspeed) options.maximum_speed = settings.profile.options.maxspeed.toString();
        // fitness
        if (subgroup == 'Bicycle') {
            if (settings.profile.options.steepness > 0 & settings.profile.options.steepness <= 15) {
                options.profile_params.maximum_gradient = settings.profile.options.steepness.toString();
            }
            if (settings.profile.options.fitness >= 0 & settings.profile.options.fitness <= 3) {
                options.profile_params.difficulty_level = settings.profile.options.fitness.toString();
            }
        }
        // if avoid area polygon
        if (settings.avoidable_polygons && settings.avoidable_polygons.coordinates.length > 0) {
            options.avoid_polygons = settings.avoidable_polygons;
        }
        if (subgroup == 'Wheelchair') {
            if (settings.profile.options.surface) options.profile_params.surface_type = settings.profile.options.surface.toString();
            //options.profile_params.track_type = '';
            //options.profile_params.smoothness_type = '';
            if (settings.profile.options.curb) options.profile_params.maximum_sloped_curb = settings.profile.options.curb.toString();
            if (settings.profile.options.incline) options.profile_params.maximum_incline = settings.profile.options.incline.toString();
        }
        if (angular.equals(options.profile_params, {})) delete options.profile_params;
        return options;
    };
    /** 
     * generates object for request and serializes it to http parameters   
     * @param {Object} settings: Settings object for payload
     * @return {Object} payload: Paylod object used in xhr request
     */
    orsUtilsService.isochronesPayload = function(settings) {
        let payload;
        payload = {
            format: 'json',
            locations: settings.waypoints[0]._latlng.lng + ',' + settings.waypoints[0]._latlng.lat,
            range_type: settings.profile.options.analysis_options.method == 0 ? 'time' : 'distance',
            range: settings.profile.options.analysis_options.method == 0 ? settings.profile.options.analysis_options.isovalue * 60 : settings.profile.options.analysis_options.isovalue * 1000,
            interval: settings.profile.options.analysis_options.method == 0 ? settings.profile.options.analysis_options.isointerval * 60 : settings.profile.options.analysis_options.isointerval * 1000,
            location_type: settings.profile.options.analysis_options.reverseflow == true ? lists.isochroneOptionList.reverseFlow.destination : lists.isochroneOptionList.reverseFlow.start,
            profile: lists.profiles[settings.profile.type].request,
            attributes: 'area|reachfactor',
            options: JSON.stringify(orsUtilsService.generateOptions(settings))
        };
        // if avoid area polygon
        if (settings.avoidable_polygons && settings.avoidable_polygons.coordinates.length > 0) {
            payload.options.avoid_polygons = settings.avoidable_polygons;
        }
        return payload;
    };
    orsUtilsService.addShortAddresses = function(features) {
        angular.forEach(features, function(feature) {
            const properties = feature.properties;
            let shortAddress = '';
            if ('name' in properties) {
                shortAddress += properties.name;
                shortAddress += ', ';
            }
            if ('street' in properties) {
                // street and name can be the same, just needed once
                if (properties.street && properties.street !== properties.name) {
                    shortAddress += properties.street;
                }
                if ('house_number' in properties) {
                    shortAddress += ' ' + properties.house_number;
                }
                shortAddress += ', ';
            }
            //if ('postal_code' in properties) shortAddress += properties.postal_code;
            if ('city' in properties) {
                shortAddress += properties.city;
                shortAddress += ', ';
            }
            if ('state' in properties) {
                shortAddress += properties.state;
                shortAddress += ', ';
            } else if ('county' in properties) {
                shortAddress += properties.county;
                shortAddress += ', ';
            } else if ('district' in properties) {
                shortAddress += properties.district;
                shortAddress += ', ';
            }
            // if ('country' in properties) {
            //     shortAddress += properties.country;
            //     shortAddress += ', ';
            // }
            shortAddress = shortAddress.slice(0, -2);
            feature.shortaddress = shortAddress;
        });
        return features;
    };
    /**
     * Calls the Javascript functions getElementsByTagNameNS
     * @param element: XML element to retrieve the information from
     * @param ns: Namespace to operate in
     * @param tagName: attribute name of the child elements to return
     * @param collection: if a collection of features is to be returned
     * @return suitable elements of the given input element that match the tagName
     */
    orsUtilsService.getElementsByTagNameNS = function(element, ns, tagName, collection) {
        if (element.getElementsByTagNameNS) {
            if (collection) {
                var collectionArr = [];
                collectionArr.push(element.getElementsByTagNameNS(ns, tagName));
                return collectionArr;
            }
            return element.getElementsByTagNameNS(ns, tagName);
        }
    };
    /**
     * convert a distance to an easy to read format.
     * @param distance: a number
     * @param uom: distance unit; one of m/yd
     */
    orsUtilsService.convertDistanceFormat = function(distance, uom) {
        uom = uom.toLowerCase();
        var origDistance = parseFloat(distance);
        distance = parseFloat(distance);
        if (distance >= 1000) {
            uom = 'km';
            distance = distance / 1000;
            distance = orsUtilsService.round(distance);
        } else {
            uom = 'm';
        }
        distance = orsUtilsService.round(distance);
        return [origDistance, distance, uom];
    };
    /**
     * positions are often set as data-attributes in the Ui/ HTML file. Converts them to OpenLayers.LonLat position
     * @param positionString: String containing the coordinates
     * @return: OpenLayers.LonLat with these coordinates 
     */
    orsUtilsService.convertPositionStringToLonLat = function(positionString) {
        var pos = positionString.split(' ');
        pos = L.latLng(pos[1], pos[0]);
        return pos;
    };
    /**
     * rounds a given distance to an appropriate number of digits
     * @distance: number to round
     */
    orsUtilsService.round = function(distance) {
        //precision - set the number of fractional digits to round to
        var precision = 4;
        if (distance < 0.3) {
            precision = 3;
        }
        if (distance >= 0.3) {
            precision = 2;
        }
        if (distance > 2) {
            precision = 1;
        }
        if (distance > 100) {
            precision = 0;
        }
        if (distance > 300) {
            precision = -1;
        }
        if (distance > 2000) {
            precision = -2;
        }
        var p = Math.pow(10, precision);
        return Math.round(distance * p) / p;
    };
    /**
     * generates a string of current settings to be used in permalink
     * @settings: route/analysis settings
     * @useroptions: useroptions
     */
    orsUtilsService.parseSettingsToPermalink = function(settings, userOptions) {
        console.info("parseSettingsToPermalink", settings);
        if (settings.profile === undefined) return;
        let link = '';
        // Hack to remove angular properties that do not have to be saved
        let profile = angular.fromJson(angular.toJson(settings.profile));
        let waypoints = angular.fromJson(angular.toJson(settings.waypoints));

        function getProp(obj) {
            for (let o in obj) {
                if (typeof obj[o] == "object") {
                    getProp(obj[o]);
                } else {
                    // Filter functions and properties of other types
                    if (typeof obj[o] != "function" && o.toString().charAt(0) != '_' && (lists.permalinkFilters[settings.profile.type].includes(o) || lists.permalinkFilters.analysis.includes(o))) {
                        if (obj[o] in lists.profiles) {
                            link = link.concat('&' + lists.permalinkKeys[o] + '=' + lists.profiles[obj[o]].shortValue);
                        } else if (obj[o] in lists.optionList.weight) {
                            link = link.concat('&' + lists.permalinkKeys[o] + '=' + lists.optionList.weight[obj[o]].shortValue);
                        } else if (obj[o] === true) {
                            link = link.concat('&' + lists.permalinkKeys[o] + '=1');
                        } else if (obj[o] === false) {} else {
                            link = link.concat('&' + lists.permalinkKeys[o] + '=' + obj[o]);
                        }
                    }
                    if (lists.optionList.avoidables[o]) {
                        if (lists.optionList.avoidables[o].subgroups.includes(settings.profile.type)) {
                            if (obj[o] === true) {
                                link = link.concat('&' + lists.permalinkKeys[o] + '=1');
                            } else if (obj[o] === false) {} else {
                                link = link.concat('&' + lists.permalinkKeys[o] + '=' + obj[o]);
                            }
                        }
                    }
                }
            }
        }
        if (waypoints[0] !== undefined) {
            link = link.concat(lists.permalinkKeys["wps"] + '=');
            for (let waypoint of waypoints) {
                let lat = typeof(waypoint._latlng.lat) === 'number' ? (Math.round(waypoint._latlng.lat * 1000000) / 1000000) : 'null';
                let lng = typeof(waypoint._latlng.lng) === 'number' ? (Math.round(waypoint._latlng.lng * 1000000) / 1000000) : 'null';
                link = link.concat(lat);
                link = link.concat(',');
                link = link.concat(lng);
                link = link.concat(',');
            }
            link = link.slice(0, -1);
        }
        getProp(profile);
        if (userOptions.routinglang !== undefined) link = link.concat('&' + lists.permalinkKeys["routinglang"] + '=' + userOptions.routinglang);
        if (userOptions.units !== undefined) link = link.concat('&' + lists.permalinkKeys["units"] + '=' + userOptions.units);
        // This timeout is neccessariliy needed to update the permalink on router reuse !!!
        $timeout(function() {
            $location.search(link);
        });
    };
    return orsUtilsService;
}]);