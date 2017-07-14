angular.module('orsApp.route-service', [])
    .factory('orsRouteService', ['$q', '$http', 'orsUtilsService', 'orsMapFactory', 'orsObjectsFactory', 'lists', 'ENV', ($q, $http, orsUtilsService, orsMapFactory, orsObjectsFactory, lists, ENV) => {
        /**
         * Requests geocoding from ORS backend
         * @param {String} requestData: XML for request payload
         */
        let orsRouteService = {};
        orsRouteService.routesSubject = new Rx.BehaviorSubject({});
        orsRouteService.resetRoute = () => {
            orsRouteService.routeObj = {};
            orsRouteService.routesSubject.onNext([]);
            let action = orsObjectsFactory.createMapAction(2, lists.layers[1], undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
            orsRouteService.DeColor();
        };
        orsRouteService.routingRequests = {};
        orsRouteService.routingRequests.requests = [];
        orsRouteService.routingRequests.clear = () => {
            for (let req of orsRouteService.routingRequests.requests) {
                if ('cancel' in req) req.cancel("Cancel last request");
            }
            orsRouteService.routingRequests.requests = [];
        };
        /**
         * Requests route from ORS backend
         * @param {String} requestData: XML for request payload
         */
        orsRouteService.fetchRoute = (requestData) => {
            var url = ENV.routing;
            var canceller = $q.defer();
            var cancel = (reason) => {
                canceller.resolve(reason);
            };
            var promise = $http.get(url, {
                    params: requestData,
                    timeout: canceller.promise
                })
                .then((response) => {
                    return response.data;
                });
            return {
                promise: promise,
                cancel: cancel
            };
        };
        orsRouteService.setCurrentRouteIdx = (idx) => {
            orsRouteService.currentRouteIdx = idx;
        };
        orsRouteService.getCurrentRouteIdx = () => {
            return orsRouteService.currentRouteIdx;
        };
        orsRouteService.DeEmph = () => {
            let action = orsObjectsFactory.createMapAction(2, lists.layers[2], undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        orsRouteService.DeColor = () => {
            let action = orsObjectsFactory.createMapAction(2, lists.layers[7], undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        orsRouteService.Emph = (geom) => {
            let action = orsObjectsFactory.createMapAction(1, lists.layers[2], geom, undefined, lists.layerStyles.routeEmph());
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        orsRouteService.Color = (geom, color) => {
            let style = lists.layerStyles.getStyle(color, 6, 1);
            let action = orsObjectsFactory.createMapAction(1, lists.layers[7], geom, undefined, style);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        orsRouteService.zoomTo = (geom) => {
            let action = orsObjectsFactory.createMapAction(0, lists.layers[2], geom, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        orsRouteService.addRoute = (geometry, focusIdx) => {
            const routePadding = orsObjectsFactory.createMapAction(1, lists.layers[1], geometry, undefined, lists.layerStyles.routePadding());
            orsMapFactory.mapServiceSubject.onNext(routePadding);
            const routeLine = orsObjectsFactory.createMapAction(1, lists.layers[1], geometry, undefined, lists.layerStyles.route());
            orsMapFactory.mapServiceSubject.onNext(routeLine);
            if (focusIdx) {
                const zoomTo = orsObjectsFactory.createMapAction(0, lists.layers[1], geometry, undefined, undefined);
                orsMapFactory.mapServiceSubject.onNext(zoomTo);
            }
        };
        orsRouteService.addHeightgraph = (geometry) => {
            const heightgraph = orsObjectsFactory.createMapAction(-1, undefined, geometry, undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(heightgraph);
        };
        orsRouteService.removeHeightgraph = () => {
            const heightgraph = orsObjectsFactory.createMapAction(-1, undefined, undefined, undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(heightgraph);
        };
        orsRouteService.calculateDistance = (lat1, lon1, lat2, lon2) => { // generally used geo measurement function
            var R = 6371; // 8.137; // Radius of earth in KM // Turf uses 6373.0
            var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
            var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d * 1000; // meters
        };
        /** prepare route to json */
        orsRouteService.processResponse = (data, profile, focusIdx) => {
            orsRouteService.data = data;
            let cnt = 0;
            angular.forEach(orsRouteService.data.routes, function(route) {
                //const geometry = orsUtilsService.decodePolyline(route.geometry, route.elevation);
                route.geometryRaw = angular.copy(route.geometry.coordinates);
                let geometry = route.geometry.coordinates;
                // reverse order, needed as leaflet ISO 6709
                for (let i = 0; i < geometry.length; i++) {
                    let lng = geometry[i][0];
                    let lat = geometry[i][1];
                    geometry[i][0] = lat;
                    geometry[i][1] = lng;
                }
                route.geometry = geometry;
                if (cnt == 0) {
                    if (route.elevation) {
                        // get max and min elevation from nested array
                        // var values = actionPackage.geometry.map(function(elt) {
                        //     return elt[2];
                        // });
                        // var max = Math.max.apply(null, values);
                        // var min = Math.min.apply(null, values);
                        // process heightgraph data
                        const hgGeojson = orsRouteService.processHeightgraphData(route);
                        orsRouteService.addHeightgraph(hgGeojson);
                    } else {
                        orsRouteService.removeHeightgraph();
                    }
                    orsRouteService.addRoute(geometry, focusIdx);
                }
                cnt += 1;
            });
            orsRouteService.routesSubject.onNext(orsRouteService.data);
        };
        /** process point information */
        orsRouteService.processResponseRich = (data, profile, focusIdx) => {
            orsRouteService.data = data;
            angular.forEach(orsRouteService.data.routes, function(route) {
                let geometry = route.geometry;

                // creates counting index for each extra
                let indices = {};
                angular.forEach(route.extras, function(val, key) {
                    indices[key] = 0;
                });
                // initiate addup variables
                let descent = ascent = distance = step_distance = point_distance = segment_id = steps_id = 0;
                let info_array = [];
                let distances = [
                    []
                ];
                let factors = [
                    []
                ];
                let segments = route.segments;
                // because of graphhopper approximation extend the distance value with factor (graphhopper dist/ dist calculated)
                                // reverse order, needed as leaflet ISO 6709
                for (let i = 0; i < geometry.length; i++) {
                    let lng = geometry[i][0];
                    let lat = geometry[i][1];
                    geometry[i][0] = lat;
                    geometry[i][1] = lng;
                    if (i > route.way_points[segment_id + 1]) {
                        segment_id += 1;
                        steps_id = 0;
                        factors.push([]);
                        distances.push([]);
                    }
                    // at first point
                    if (i === 0) {
                        distances[0].push([0, 0, 0]);
                    } else {
                        let last_lat = geometry[i - 1][0];
                        let last_lng = geometry[i - 1][1];
                        // calcualte point distance to last point
                        point_distance = orsRouteService.calculateDistance(last_lat, last_lng, lat, lng);
                        // add to to the step distacce
                        step_distance += point_distance;
                        let store = [step_distance, point_distance, steps_id];
                        distances[segment_id].push(store);
                    }
                    // if at last point of a step
                    if (i == segments[segment_id].steps[steps_id].way_points[1]) {
                        // divide backend step distance with calculated step distance
                        let g_factor = segments[segment_id].steps[steps_id].distance / distances[segment_id][distances[segment_id].length - 1][0];
                        factors[segment_id].push([i, g_factor]);
                        steps_id += 1;
                        step_distance = 0;
                    }
                }
                distance = sum_up = step_distance = point_distance = segment_id = steps_id = point_id = 0;
                console.log(distances)
                for (let i = 0; i < geometry.length; i++) {
                    // advances to next extra segment
                    angular.forEach(route.extras, function(val, $key) {
                        if (i > val.values[indices[$key]][1]) {
                            indices[$key] += 1;
                        }
                    });
                    // advances to next route segment
                    if (i > route.way_points[segment_id + 1]) {
                        segment_id += 1;
                        steps_id = 0;
                        point_id = 0;
                    }
                    // console.log(point_id)
                    let lng = geometry[i][1];
                    let lat = geometry[i][0];
                    // calculate point distance
                    if (i > 0) {
                        point_distance = distances[segment_id][point_id][1] * factors[segment_id][steps_id][1]; // * g_factor;
                        distance += point_distance;
                    }
                    // last point of a step
                    if (i == segments[segment_id].steps[steps_id].way_points[1]) {
                        step_distance = distances[segment_id][point_id][0] * factors[segment_id][steps_id][1]; // * g_factor;
                        // override calculated distance with backend distance at step change.
                        sum_up += step_distance;
                        distance = sum_up;
                        steps_id += 1;
                    }
                    // creating object
                    let pointobject = {
                        coords: [lat, lng],
                        extras: {
                            suitability: route.extras.suitability.values[indices.suitability][2],
                            waytype: route.extras.waytypes.values[indices.waytypes][2],
                            surface: route.extras.surface.values[indices.surface][2]
                        },
                        distance: parseFloat(distance.toFixed(1)),
                        point_distance: parseFloat(point_distance.toFixed(1)),
                        duration: null, // todo
                        segment_index: segment_id,
                        point_id: i
                    };
                    // if elevation = true calculate heights and add z value
                    if (route.elevation) {
                        let z = geometry[i][2];
                        pointobject.coords[2] = z;
                        pointobject.extras.steepness = route.extras.steepness.values[indices.steepness][2];
                        let relative = z - geometry[0][2];
                        relative = parseFloat(relative.toFixed(1));
                        pointobject['heights'] = {
                            relative_elevation: relative,
                        };
                        if (i > 0) {
                            let last_z = geometry[(i - 1)][2];
                            if (z < last_z) {
                                let minus = last_z - z;
                                descent += minus;
                            } else if (z > last_z) {
                                let plus = z - last_z;
                                ascent += plus;
                            }
                            if (ascent > 0) {
                                pointobject.heights.ascent = parseFloat(ascent.toFixed(1));
                            }
                            if (descent > 0) {
                                pointobject.heights.descent = parseFloat(descent.toFixed(1));
                            }
                        }
                    }
                    point_id += 1;
                    console.log(pointobject)
                    info_array.push(pointobject);
                }
                route.point_information = info_array;
            });
            orsRouteService.routesSubject.onNext(orsRouteService.data);
        };
        /* process heightgraph geojson object */
        orsRouteService.processHeightgraphData = (route) => {
            const routeString = route.geometryRaw;
            let hgData = [];
            for (let key in route.extras) {
                let extra = [];
                for (let item of route.extras[key].values) {
                    let chunk = {};
                    const from = item[0];
                    const to = item[1];
                    const geometry = routeString.slice(from, to + 1);
                    chunk.line = geometry;
                    const typenumber = item[2];
                    chunk.attributeType = typenumber;
                    extra.push(chunk);
                }
                extra = GeoJSON.parse(extra, {
                    LineString: 'line',
                    extraGlobal: {
                        'Creator': 'OpenRouteService.org',
                        'records': extra.length,
                        'summary': key
                    }
                });
                // console.log(JSON.stringify(extra))
                hgData.push(extra);
            }
            return hgData;
        };
        return orsRouteService;
    }]);