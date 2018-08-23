angular.module("orsApp.route-service", []).factory("orsRouteService", [
  "$q",
  "$http",
  "orsUtilsService",
  "orsLandmarkService",
  "orsMapFactory",
  "orsObjectsFactory",
  "lists",
  "mappings",
  "ENV",
  (
    $q,
    $http,
    orsUtilsService,
    orsLandmarkService,
    orsMapFactory,
    orsObjectsFactory,
    lists,
    mappings,
    ENV
  ) => {
    /**
     * Requests geocoding from ORS backend
     * @param {String} requestData: XML for request payload
     */
    let orsRouteService = {};
    orsRouteService.routesSubject = new Rx.BehaviorSubject({});
    orsRouteService.resetRoute = () => {
      orsRouteService.routeObj = {};
      orsRouteService.routesSubject.onNext([]);
      let action = orsObjectsFactory.createMapAction(
        2,
        lists.layers[1],
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(action);
      action = orsObjectsFactory.createMapAction(
        2,
        lists.layers[9],
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(action);
      orsRouteService.DeColor();
    };
    orsRouteService.routingRequests = {};
    orsRouteService.routingRequests.requests = [];
    orsRouteService.routingRequests.clear = () => {
      for (let req of orsRouteService.routingRequests.requests) {
        if ("cancel" in req) req.cancel("Cancel last request");
      }
      orsRouteService.routingRequests.requests = [];
    };
    /**
     * Requests route from ORS backend
     * @param {String} requestData: XML for request payload
     */
    orsRouteService.fetchRoute = requestData => {
      const url = ENV.directions;
      const canceller = $q.defer();
      const cancel = reason => {
        canceller.resolve(reason);
      };
      const promise = $http
        .get(url, {
          params: requestData,
          timeout: canceller.promise
        })
        .then(response => {
          return response.data;
        });
      return {
        promise: promise,
        cancel: cancel
      };
    };
    orsRouteService.setCurrentRouteIdx = idx => {
      orsRouteService.currentRouteIdx = idx;
    };
    orsRouteService.getCurrentRouteIdx = () => {
      return orsRouteService.currentRouteIdx;
    };
    orsRouteService.DeEmph = () => {
      let action = orsObjectsFactory.createMapAction(
        2,
        lists.layers[2],
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.DeColor = () => {
      let action = orsObjectsFactory.createMapAction(
        2,
        lists.layers[7],
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.Emph = geom => {
      let action = orsObjectsFactory.createMapAction(
        1,
        lists.layers[2],
        geom,
        undefined,
        lists.layerStyles.routeEmph()
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.EmphLandmark = geom => {
      let action = orsObjectsFactory.createMapAction(
        13,
        lists.layers[10],
        geom,
        undefined,
        lists.landmarkIconEmph
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.DeEmphLandmark = () => {
      let action = orsObjectsFactory.createMapAction(
        2,
        lists.layers[10],
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.Color = (geom, color) => {
      let style = lists.layerStyles.getStyle(color, 6, 1);
      let action = orsObjectsFactory.createMapAction(
        1,
        lists.layers[7],
        geom,
        undefined,
        style
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.zoomTo = geom => {
      let action = orsObjectsFactory.createMapAction(
        0,
        lists.layers[2],
        geom,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.addRoute = (route, focusIdx) => {
      const routePadding = orsObjectsFactory.createMapAction(
        1,
        lists.layers[1],
        route.geometry,
        undefined,
        lists.layerStyles.routePadding()
      );
      orsMapFactory.mapServiceSubject.onNext(routePadding);
      const routeLine = orsObjectsFactory.createMapAction(
        40,
        lists.layers[1],
        route.geometry,
        undefined,
        lists.layerStyles.route()
      );
      orsMapFactory.mapServiceSubject.onNext(routeLine);
      const routeHover = orsObjectsFactory.createMapAction(
        41,
        lists.layers[1],
        route.geometry,
        undefined,
        lists.layerStyles.routeHovering(),
        {
          pointInformation: route.point_information
        }
      );
      orsMapFactory.mapServiceSubject.onNext(routeHover);
      if (focusIdx) {
        const zoomTo = orsObjectsFactory.createMapAction(
          0,
          lists.layers[1],
          route.geometry,
          undefined,
          undefined
        );
        orsMapFactory.mapServiceSubject.onNext(zoomTo);
      }
    };
    orsRouteService.addHeightgraph = geometry => {
      const heightgraph = orsObjectsFactory.createMapAction(
        -1,
        undefined,
        geometry,
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(heightgraph);
    };
    orsRouteService.removeHeightgraph = () => {
      const heightgraph = orsObjectsFactory.createMapAction(
        -1,
        undefined,
        undefined,
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(heightgraph);
    };
    /** prepare route to json */
    orsRouteService.processResponse = (
      data,
      profile,
      focusIdx,
      includeLandmarks
    ) => {
      orsRouteService.data = data;
      let cnt = 0;
      angular.forEach(orsRouteService.data.routes, function(route) {
        //const geometry = orsUtilsService.decodePolyline(route.geometry, route.elevation);
        route.geometryRaw = angular.copy(route.geometry.coordinates);
        let geometry = route.geometry.coordinates;
        // reverse order, needed as leaflet ISO 6709
        for (let i = 0; i < geometry.length; i++) {
          let lng = geometry[i][0];
          geometry[i][0] = geometry[i][1];
          geometry[i][1] = lng;
        }
        route.geometry = geometry;
        route.point_information = orsRouteService.processPointExtras(
          route,
          profile
        );
        // landmark stuff here
        orsLandmarkService.clearAll();
        if (includeLandmarks) {
          const lmPayload = orsLandmarkService.prepareQuery(
            route.geometry,
            route.segments
          );
          const lmRequest = orsLandmarkService.promise(lmPayload);
          lmRequest.promise.then(
            function(response) {
              // save to route object ...
              // attach the landmarks to the corresponding segment
              let lmCnt = 0;
              for (let i = 0; i < route.segments.length; i++) {
                const segment = route.segments[i];
                for (let j = 1; j < segment.steps.length; j++) {
                  // Don't attach to the start of the segment
                  const step = segment.steps[j];
                  step["landmarks"] = response[lmCnt];
                  // update the instruction
                  if (
                    step.landmarks &&
                    step.landmarks.features &&
                    step.landmarks.features.length > 0
                  ) {
                    // show the feature in the instruction
                    const lm = step.landmarks.features[0];
                    let instr = step.instruction;
                    if (lm.properties.suitability > 0) {
                      const lmStr =
                        (lm.properties.position === "before"
                          ? "after "
                          : "before ") +
                        "the " +
                        (lm.properties.name && lm.properties.name !== "Unknown"
                          ? "&quot;" + lm.properties.name + "&quot; "
                          : "") +
                        lm.properties.type.replace(/_/, " ");
                      instr = instr + " " + lmStr;
                      orsLandmarkService.addLandmark(lm);
                    }
                    step.instruction = instr;
                  } else {
                  }
                  lmCnt++;
                }
              }
            },
            function(response) {}
          );
        }
        if (cnt === 0) {
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
          orsRouteService.addRoute(route, focusIdx);
        }
        cnt += 1;
      });
      orsRouteService.routesSubject.onNext(orsRouteService.data);
    };
    /** process point information */
    orsRouteService.processPointExtras = (route, profile) => {
      const fetchExtrasAtPoint = (extrasObj, idx) => {
        const extrasAtPoint = {};
        angular.forEach(extrasObj, function(values, key) {
          if (key == "traildifficulty" && profile == "Pedestrian") {
            extrasAtPoint[key] = mappings[key][values[idx]].text_hiking;
          } else if (mappings[key][values[idx]].type == -1) {
            // green
            extrasAtPoint[key] =
              '<strong><span style="color: green;">' +
              "~ " +
              mappings[key][values[idx]].text +
              "</span></strong>";
          } else if (mappings[key][values[idx]].type == 1) {
            // red
            extrasAtPoint[key] =
              '<strong><span style="color: red;">' +
              "~ " +
              mappings[key][values[idx]].text +
              "</span></strong>";
          } else if (mappings[key][values[idx]].type === 0) {
            extrasAtPoint[key] =
              "<strong><span>" +
              "~ " +
              mappings[key][values[idx]].text +
              "</span></strong>";
          } else {
            extrasAtPoint[key] = mappings[key][values[idx]].text;
          }
        });
        return extrasAtPoint;
      };
      // prepare extras object
      let extrasObj = {};
      (extrasObj = () => {
        angular.forEach(route.extras, function(val, key) {
          const list = [];
          angular.forEach(val.values, function(extraList, keyIdx) {
            for (let start = extraList[0]; start < extraList[1]; start++) {
              list.push(extraList[2]);
            }
          });
          // push last extra, not considered in above loop
          list.push(val.values[val.values.length - 1][2]);
          extrasObj[key] = list;
        });
      }).call();
      const info_array = [];
      const geometry = route.geometry;
      const segments = route.segments;
      // declare cumulative statistic variables
      let descent = 0,
        ascent = 0,
        distance = 0,
        segment_distance = 0,
        step_distance = 0,
        point_distance = 0;
      // declare incrementing ids
      let segment_id = 0,
        step_id = 0,
        point_id = 0;
      // loop the geometry and calculate distances
      for (let i = 0; i < geometry.length; i++) {
        const lat = geometry[i][0];
        const lng = geometry[i][1];
        // store the segment_id of the point and reset the step_id
        if (i > route.way_points[segment_id + 1]) {
          segment_id += 1;
          step_id = 0;
        }
        if (i > 0) {
          let last_lat = geometry[i - 1][0];
          let last_lng = geometry[i - 1][1];
          // calculate point distance to last point in meters
          point_distance =
            turf.distance(
              orsObjectsFactory.createPoint(last_lat, last_lng),
              orsObjectsFactory.createPoint(lat, lng)
            ) * 1000;
          // add to to the step distance
          step_distance += point_distance;
          segment_distance += point_distance;
          distance += point_distance;
        }
        // if last point of a step is reached
        if (i == segments[segment_id].steps[step_id].way_points[1]) {
          segments[segment_id].steps[step_id].distanceTurf = parseFloat(
            step_distance.toFixed(1)
          ); // this would override steps distance with turf value
          step_id += 1;
          step_distance = 0;
        }
        // advances to next route segment
        if (i == route.way_points[segment_id + 1]) {
          segment_id += 1;
          segment_distance = 0;
          step_id = 0;
          point_id = 0;
        }
        const pointobject = {
          coords: [lat, lng],
          extras: fetchExtrasAtPoint(extrasObj, i),
          distance: parseFloat(distance.toFixed(1)),
          segment_index: segment_id,
          point_id: i,
          heights: route.elevation && {
            height: parseFloat(geometry[i][2].toFixed(1))
          }
        };
        point_id += 1;
        info_array.push(pointobject);
      }
      return info_array;
    };
    /* process heightgraph geojson object */
    orsRouteService.processHeightgraphData = route => {
      const routeString = route.geometryRaw;
      let hgData = [];
      // default
      let extra = [];
      let chunk = {};
      const geometry = routeString;
      chunk.line = geometry;
      chunk.attributeType = -1;
      extra.push(chunk);
      extra = GeoJSON.parse(extra, {
        LineString: "line",
        extraGlobal: {
          Creator: "openrouteservice.org",
          records: extra.length,
          summary: "default"
        }
      });
      hgData.push(extra);
      for (let key in route.extras) {
        extra = [];
        if (key !== "waycategory") {
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
            LineString: "line",
            extraGlobal: {
              Creator: "openrouteservice.org",
              records: extra.length,
              summary: key
            }
          });
          hgData.push(extra);
        }
      }
      return hgData;
    };
    return orsRouteService;
  }
]);
