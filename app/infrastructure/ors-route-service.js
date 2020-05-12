angular.module("orsApp.route-service", []).factory("orsRouteService", [
  "$rootScope",
  "$q",
  "$http",
  "orsUtilsService",
  "orsLandmarkService",
  "orsMapFactory",
  "orsObjectsFactory",
  "lists",
  "mappings",
  "ENV",
  // "mockResponse", // uncomment to mock response using mock.js constant
  (
    $rootScope,
    $q,
    $http,
    orsUtilsService,
    orsLandmarkService,
    orsMapFactory,
    orsObjectsFactory,
    lists,
    mappings,
    ENV
    // mockResponse // uncomment to mock response using mock.js constant
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
    orsRouteService.addRoute = (route, focusIdx, routeIdx) => {
      const routePadding = orsObjectsFactory.createMapAction(
        1,
        lists.layers[1],
        route.geometry,
        undefined,
        lists.layerStyles.routePadding(),
        undefined,
        routeIdx
      );
      orsMapFactory.mapServiceSubject.onNext(routePadding);
      const routeLine = orsObjectsFactory.createMapAction(
        40,
        lists.layers[1],
        route.geometry,
        undefined,
        routeIdx !== orsRouteService.getCurrentRouteIdx()
          ? lists.layerStyles.routeAlternative()
          : lists.layerStyles.route(),
        undefined,
        routeIdx
      );
      orsMapFactory.mapServiceSubject.onNext(routeLine);
      if (routeIdx === orsRouteService.getCurrentRouteIdx()) {
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
      }

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
      orsRouteService.setCurrentRouteIdx(0);
      orsRouteService.data = data;
      let cnt = 0;
      for (let route of orsRouteService.data.features) {
        if (cnt > 0) {
          // alternative route difference
          let firstRouteSummary =
            orsRouteService.data.features[0].properties.summary;
          let distance = route.properties.summary.distance;
          let duration = route.properties.summary.duration;
          route.properties.summary.distanceDelta =
            distance - firstRouteSummary.distance;
          route.properties.summary.durationDelta =
            duration - firstRouteSummary.duration;
        }
        route.geometryRaw = JSON.parse(
          JSON.stringify(route.geometry.coordinates)
        );
        let coordinates = route.geometry.coordinates;
        // reverse order, needed as leaflet ISO 6709
        for (let i = 0; i < coordinates.length; i++) {
          let lng = coordinates[i][0];
          coordinates[i][0] = coordinates[i][1];
          coordinates[i][1] = lng;
        }
        route.geometry = coordinates;
        route.point_information = orsRouteService.processPointExtras(
          route,
          profile
        );
        // landmark stuff here
        orsLandmarkService.clearAll();
        if (includeLandmarks) {
          const lmPayload = orsLandmarkService.prepareQuery(
            route.geometry,
            route.properties.segments
          );
          const lmRequest = orsLandmarkService.promise(lmPayload);
          lmRequest.promise.then(
            response => {
              // save to route object ...
              // attach the landmarks to the corresponding segment
              let lmCnt = 0;
              for (let i = 0; i < route.properties.segments.length; i++) {
                const segment = route.properties.segments[i];
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
            response => {}
          );
        }
        if (cnt === 0) {
          if (route.geometry[0].length === 3) {
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
        }

        orsRouteService.addRoute(route, focusIdx, cnt);
        cnt += 1;
      }
      orsRouteService.routesSubject.onNext(orsRouteService.data);
      $rootScope.$broadcast("activeRouteChanged", 0);
    };
    /** process point information */
    orsRouteService.processPointExtras = (route, profile) => {
      const fetchExtrasAtPoint = (extrasObj, idx) => {
        const extrasAtPoint = {};
        for (const [key, values] of Object.entries(extrasObj)) {
          // if (mappings[key][values[idx]] === undefined) {
          //   console.log(values, idx, key, mappings[key], values[idx]);
          // }
          if (key === "traildifficulty" && profile === "Pedestrian") {
            extrasAtPoint[key] = mappings[key][values[idx]].text_hiking;
          } else if (mappings[key][values[idx]].type === -1) {
            // green
            extrasAtPoint[key] =
              '<strong><span style="color: green;">' +
              "~ " +
              mappings[key][values[idx]].text +
              "</span></strong>";
          } else if (mappings[key][values[idx]].type === 1) {
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
        }
        return extrasAtPoint;
      };
      // prepare extras object
      function generateExtrasObj() {
        let result = {};
        for (const [key, val] of Object.entries(route.properties.extras)) {
          let list = [];

          function repairExtras(extraElement) {
            let skipped = orsRouteService.data.metadata.query.skip_segments;
            for (let skippedSegment of skipped) {
              let count = 0;
              // get faulty segment,
              let skipNode = route.properties.way_points[skippedSegment];
              if (extraElement.values.length === 0) {
                extraElement.values.push([0, skipNode, "false"]);
                extraElement.summary.push({
                  value: "false",
                  distance: 0,
                  amount: 0
                });
                continue;
              }
              let justSkipped = false;
              for (const [
                index,
                extraSegment
              ] of extraElement.values.entries()) {
                extraSegment[0] += count;
                extraSegment[1] += count;
                if (justSkipped) {
                  justSkipped = false;
                  continue;
                }
                // between case
                if (extraSegment[1] >= skipNode && skipNode > extraSegment[0]) {
                  justSkipped = true;
                  count++;
                  let upper = extraSegment[1];
                  let category = extraSegment[2];
                  extraSegment[1] = skipNode - 1;
                  extraElement.values.splice(index + 1, 0, [
                    skipNode - 1,
                    upper,
                    extraSegment[2]
                  ]);
                  if (extraSegment[0] === extraSegment[1]) {
                    extraSegment[1] = skipNode;
                    extraSegment[2] = "false";
                  } else {
                    extraElement.values.splice(index + 1, 0, [
                      skipNode - 2,
                      skipNode - 1,
                      "false"
                    ]);
                  }
                  let i = skipNode;
                  // no need to handle multiple routes as only works without skipped segments
                  let geomReference =
                    orsRouteService.data.features[0].geometryRaw;
                  while (geomReference[i][2] === 0) {
                    i++;
                  }
                  geomReference[skipNode][2] = geomReference[i][2];

                  if (skipNode === 1) {
                    geomReference[0][2] = geomReference[i][2];
                  }
                  if (
                    !extraElement.summary.some(
                      summary => summary.value === "false"
                    )
                  ) {
                    extraElement.summary.push({
                      value: "false",
                      distance: 0,
                      amount: 0
                    });
                  }
                }
              }
              if (skipNode === route.geometry.length - 1) {
                extraElement.values.push([
                  extraElement.values[extraElement.values.length - 1][1],
                  skipNode,
                  "false"
                ]);
                let i = skipNode;
                let geomReference =
                  orsRouteService.data.features[0].geometryRaw;
                while (geomReference[i][2] === 0) {
                  i--;
                }
                geomReference[skipNode][2] = geomReference[i][2];

                if (skipNode === 1) {
                  geomReference[0][2] = geomReference[i][2];
                }
              }
            }
          }
          let skip_segments = orsRouteService.data.metadata.query.skip_segments;
          if (skip_segments) {
            repairExtras(val);
          }

          for (let extraList of val.values) {
            for (let i = extraList[0]; i <= extraList[1]; i++) {
              list[i] = extraList[2];
            }
          }
          result[key] = list;
        }
        return result;
      }
      let extrasObj = generateExtrasObj();
      const info_array = [];
      const geometry = route.geometry;
      const segments = route.properties.segments;
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
        if (i > route.properties.way_points[segment_id + 1]) {
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
        if (i === segments[segment_id].steps[step_id].way_points[1]) {
          segments[segment_id].steps[step_id].distanceTurf = parseFloat(
            step_distance.toFixed(1)
          ); // this would override steps distance with turf value
          step_id += 1;
          step_distance = 0;
        }
        // advances to next route segment
        if (i === route.properties.way_points[segment_id + 1]) {
          segment_id += 1;
          segment_distance = 0;
          step_id = 0;
          point_id = 0;
        }
        const pointObject = {
          coords: [lat, lng],
          extras: fetchExtrasAtPoint(extrasObj, i),
          distance: parseFloat(distance.toFixed(1)),
          segment_index: segment_id,
          point_id: i,
          heights: geometry[0].length === 3 && {
            height: parseFloat(geometry[i][2].toFixed(1))
          }
        };
        point_id += 1;
        info_array.push(pointObject);
      }
      return info_array;
    };
    /* generate heightgraph geojson object */
    orsRouteService.processHeightgraphData = orsResponse => {
      let collections = [];
      let responseObject =
        typeof orsResponse === "string" ? JSON.parse(orsResponse) : orsResponse;
      // extract coordinates and extras from ors response
      let {
        geometryRaw: coordinates,
        properties: { extras: extras }
      } = responseObject;
      if (!coordinates && responseObject.geometry) {
        coordinates = responseObject.geometry;
      }
      if (extras) {
        Object.entries(extras).forEach(([extraKey, extraData]) => {
          let features = [];
          for (let extraSegment of extraData.values) {
            let [startIdx, endIdx, attributeType] = extraSegment;
            features.push({
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: coordinates.slice(startIdx, endIdx + 1)
              },
              properties: {
                attributeType: attributeType
              }
            });
          }
          collections.push({
            type: "FeatureCollection",
            features: features,
            properties: {
              summary: extraKey
            }
          });
        });
      }
      return collections;
    };
    return orsRouteService;
  }
]);
