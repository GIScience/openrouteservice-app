angular.module("orsApp.landmark-service", []).factory("orsLandmarkService", [
  "$q",
  "$http",
  "orsUtilsService",
  "orsObjectsFactory",
  "orsMapFactory",
  "lists",
  "orsNamespaces",
  "ENV",
  (
    $q,
    $http,
    orsUtilsService,
    orsObjectsFactory,
    orsMapFactory,
    lists,
    orsNamespaces,
    ENV
  ) => {
    let orsLandmarkService = {};

    orsLandmarkService.promise = requestData => {
      var url = ENV.landmarks;
      var canceller = $q.defer();
      var cancel = function(reason) {
        canceller.resolve(reason);
      };
      var promise = $http
        .post(url, requestData, {
          timeout: canceller.promise
        })
        .then(function(response) {
          return response.data;
        });
      return {
        promise: promise,
        cancel: cancel
      };
    };

    orsLandmarkService.prepareQuery = (geom, segments) => {
      var wpArrStr = "";
      // segments contains a list of all segments along the route for turning points
      if (segments.length > 0) {
        var segStrs = [];
        for (var j = 0; j < segments.length; j++) {
          // construct a compound instruction request
          var segment = segments[j];
          var wps = [];
          for (var i = 1; i < segment.steps.length; i++) {
            // dont do the first line segmetn as there is no "instruction" for that
            var step = segment.steps[i];
            var pStep = segment.steps[i - 1];
            var wp = geom[step.way_points[0]];
            // work out the node of the previous route which is closest to xx m away
            var prevNodes = [];
            var best = undefined;
            for (var n = pStep.way_points[0]; n < pStep.way_points[1]; n++) {
              prevNodes.push(geom[n]);
            }

            const desired = 0.0005;
            const endNode = prevNodes[prevNodes.length - 1];
            for (let node in prevNodes) {
              var x = Math.pow(endNode[1] - node[1], 2);
              var y = Math.pow(endNode[0] - node[0], 2);
              var dist = Math.sqrt(x + y);
              if (!best)
                best = {
                  node: node,
                  dist: dist
                };
              else {
                if (dist > desired && dist < best.dist) {
                  best.node = node;
                  best.dist = dist;
                } else {
                  // break out of the loop as we have the best
                  break;
                }
              }
            }
            var pr = best.node;
            var np = geom[step.way_points[1]];
            wps.push(
              pr[0] +
                "," +
                pr[1] +
                "|" +
                wp[0] +
                "," +
                wp[1] +
                "|" +
                np[0] +
                "," +
                np[1]
            );
          }
          segStrs.push(wps.join("||"));
        }
        wpArrStr = segStrs.join("||");
      }
      return {
        coords: wpArrStr
      };
    };

    orsLandmarkService.showLandmarks = landmarks => {
      let action = orsObjectsFactory.createMapAction(
        10,
        lists.layers[9],
        landmarks,
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };

    orsLandmarkService.addLandmark = landmark => {
      let action = orsObjectsFactory.createMapAction(
        13,
        lists.layers[9],
        landmark,
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };

    orsLandmarkService.clearAll = () => {
      let action = orsObjectsFactory.createMapAction(
        2,
        lists.layers[9],
        undefined,
        undefined,
        undefined
      );
      orsMapFactory.mapServiceSubject.onNext(action);
    };

    orsLandmarkService.processResponse = landmarkCandidatesArray => {
      var data = response.data;
      return data;
    };

    return orsLandmarkService;
  }
]);
