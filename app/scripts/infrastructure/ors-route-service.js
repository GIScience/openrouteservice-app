var $__app_47_scripts_47_infrastructure_47_ors_45_route_45_service_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/infrastructure/ors-route-service.js";
  angular.module('orsApp.route-service', []).factory('orsRouteService', ['$q', '$http', 'orsUtilsService', 'orsMapFactory', 'orsObjectsFactory', function($q, $http, orsUtilsService, orsMapFactory, orsObjectsFactory) {
    var orsRouteService = {};
    orsRouteService.routesSubject = new Rx.Subject();
    orsRouteService.resetRoute = function() {
      orsRouteService.routeObj = {};
      orsRouteService.routesSubject.onNext([]);
      var action = orsObjectsFactory.createMapAction(2, lists.layers[1], undefined, undefined);
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.routingRequests = {};
    orsRouteService.routingRequests.requests = [];
    orsRouteService.routingRequests.clear = function() {
      if (orsRouteService.routingRequests.requests.length > 0) {
        var $__4 = true;
        var $__5 = false;
        var $__6 = undefined;
        try {
          for (var $__2 = void 0,
              $__1 = (orsRouteService.routingRequests.requests)[Symbol.iterator](); !($__4 = ($__2 = $__1.next()).done); $__4 = true) {
            var req = $__2.value;
            {
              console.log(req);
              req.cancel("Cancel last request");
            }
          }
        } catch ($__7) {
          $__5 = true;
          $__6 = $__7;
        } finally {
          try {
            if (!$__4 && $__1.return != null) {
              $__1.return();
            }
          } finally {
            if ($__5) {
              throw $__6;
            }
          }
        }
        orsRouteService.routingRequests.requests = [];
      }
    };
    orsRouteService.fetchRoute = function(requestData) {
      var url = orsNamespaces.services.routing;
      var canceller = $q.defer();
      var cancel = function(reason) {
        canceller.resolve(reason);
      };
      var promise = $http.post(url, requestData, {timeout: canceller.promise}).then(function(response) {
        return response.data;
      });
      return {
        promise: promise,
        cancel: cancel
      };
    };
    orsRouteService.setCurrentRouteIdx = function(idx) {
      orsRouteService.currentRouteIdx = idx;
    };
    orsRouteService.getCurrentRouteIdx = function() {
      return orsRouteService.currentRouteIdx;
    };
    orsRouteService.DeEmph = function() {
      var action = orsObjectsFactory.createMapAction(2, lists.layers[2], undefined, undefined);
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.Emph = function(geom) {
      var action = orsObjectsFactory.createMapAction(1, lists.layers[2], geom, undefined, lists.layerStyles.routeEmph());
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.zoomTo = function(geom) {
      var action = orsObjectsFactory.createMapAction(0, lists.layers[2], geom, undefined);
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    orsRouteService.addRoute = function(geometry) {
      var routePadding = orsObjectsFactory.createMapAction(1, lists.layers[1], geometry, undefined, lists.layerStyles.routePadding());
      orsMapFactory.mapServiceSubject.onNext(routePadding);
      var routeLine = orsObjectsFactory.createMapAction(1, lists.layers[1], geometry, undefined, lists.layerStyles.route());
      orsMapFactory.mapServiceSubject.onNext(routeLine);
    };
    orsRouteService.processRoutes = function(response) {
      _.each(orsRouteService.routeObj.routes, function(route) {
        orsRouteService.addRoute(route.points);
      });
      orsRouteService.routesSubject.onNext(orsRouteService.routeObj.routes);
    };
    orsRouteService.processResponse = function(data, profile) {
      var response = orsUtilsService.domParser(data);
      orsRouteService.routeObj = {
        status: 'Ok',
        routes: [{}]
      };
      orsRouteService.routeObj.routes[0].profile = profile;
      orsRouteService.routeObj.routes[0].summary = orsRouteService.parseSummary(orsUtilsService.getElementsByTagNameNS(response, orsNamespaces.xls, 'RouteSummary')[0]);
      orsRouteService.routeObj.routes[0].pointsEncoded = false;
      if (lists.profiles[profile].elevation) {
        orsRouteService.routeObj.routes[0].pointsElevation = true;
      } else {
        orsRouteService.routeObj.routes[0].pointsElevation = false;
      }
      orsRouteService.routeObj.routes[0].points = orsRouteService.parseLinestring(orsUtilsService.getElementsByTagNameNS(response, orsNamespaces.xls, 'RouteGeometry')[0]);
      var segmentsObj = orsRouteService.parseInstructions(orsUtilsService.getElementsByTagNameNS(response, orsNamespaces.xls, 'RouteInstructionsList')[0]);
      orsRouteService.routeObj.routes[0].segments = segmentsObj.segments;
      orsRouteService.routeObj.routes[0].wayPoints = _.flatten([0, segmentsObj.viapoints, orsRouteService.routeObj.routes[0].points.length - 1]);
      var extrasObj = orsRouteService.parseExtras(response);
      if (extrasObj !== false)
        orsRouteService.routeObj.routes[0].extras = extrasObj;
      orsRouteService.processRoutes();
    };
    orsRouteService.parseExtras = function(response) {
      var extras = false;
      var steepnessXML = orsUtilsService.getElementsByTagNameNS(response, orsNamespaces.xls, 'WaySteepnessList')[0];
      if (!(_.isUndefined(steepnessXML))) {
        extras = {};
        steepnessXML = orsUtilsService.getElementsByTagNameNS(steepnessXML, orsNamespaces.xls, 'WaySteepness');
        extras.gradients = [];
        _.each(steepnessXML, function(elem, i) {
          chunk = {};
          var fr = orsUtilsService.getElementsByTagNameNS(elem, orsNamespaces.xls, 'From')[0];
          chunk.fr = parseInt(fr.textContent);
          var to = orsUtilsService.getElementsByTagNameNS(elem, orsNamespaces.xls, 'To')[0];
          chunk.to = parseInt(to.textContent);
          var value = orsUtilsService.getElementsByTagNameNS(elem, orsNamespaces.xls, 'Type')[0];
          chunk.value = value.textContent;
          extras.gradients.push(chunk);
        });
        return extras;
      }
      return extras;
    };
    orsRouteService.parseLinestring = function(routeGeometry) {
      var routeString = [];
      _.each(orsUtilsService.getElementsByTagNameNS(routeGeometry, orsNamespaces.gml, 'pos'), function(point, i) {
        point = point.text || point.textContent;
        point = point.split(' ');
        if (point.length == 2) {
          point = [parseFloat(point[1]), parseFloat(point[0])];
        } else {
          point = [parseFloat(point[1]), parseFloat(point[0]), parseFloat(point[2])];
        }
        routeString.push(point);
      });
      return routeString;
    };
    orsRouteService.parseInstructions = function(instructions) {
      var viaPoints = [],
          segments = [],
          segment = {},
          lastStepPoint;
      segment.duration = 0;
      segment.distance = 0;
      segment.ascent = null;
      segment.descent = null;
      segment.direct = false;
      segment.steps = [];
      var instructionsList = orsUtilsService.getElementsByTagNameNS(instructions, orsNamespaces.xls, 'RouteInstruction');
      _.each(instructionsList, function(instruction, idx) {
        var directionCode = orsUtilsService.getElementsByTagNameNS(instruction, orsNamespaces.xls, 'DirectionCode')[0];
        directionCode = directionCode.textContent;
        if (directionCode == '100') {
          _.each(orsRouteService.routeObj.routes[0].points, function(elem, i) {
            if (lastStepPoint[0] == elem[0] && lastStepPoint[1] == elem[1])
              viaPoints.push(i);
          });
          segments.push(segment$__8);
          var segment$__8 = {};
          segment$__8.duration = 0;
          segment$__8.distance = 0;
          segment$__8.ascent = 0;
          segment$__8.descent = 0;
          segment$__8.direct = false;
          segment$__8.steps = [];
        } else {
          var step = {};
          var text = orsUtilsService.getElementsByTagNameNS(instruction, orsNamespaces.xls, 'Instruction')[0];
          step.text = text.text || text.textContent;
          var duration = instruction.getAttribute('duration');
          duration = duration.replace('P', '');
          duration = duration.replace('T', '');
          duration = duration.match(/\d+\D+/g);
          step.duration = 0;
          var ms;
          _.each(duration, function(elem, i) {
            if (duration[i].slice(-1) == "D") {
              ms = parseInt(duration[i].match(/\d+/g) * 60 * 60 * 60 * 1000);
              step.duration += ms;
            }
            if (duration[i].slice(-1) == "H") {
              ms = parseInt(duration[i].match(/\d+/g) * 60 * 60 * 1000);
              step.duration += ms;
            }
            if (duration[i].slice(-1) == "M") {
              ms = parseInt(duration[i].match(/\d+/g) * 60 * 1000);
              step.duration += ms;
            }
            if (duration[i].slice(-1) == "S") {
              ms = parseInt(duration[i].match(/\d+/g) * 1000);
              step.duration += ms;
            }
          });
          segment.duration += step.duration;
          var distance = orsUtilsService.getElementsByTagNameNS(instruction, orsNamespaces.xls, 'Distance')[0];
          distance = distance.getAttribute('value');
          step.distance = parseInt(distance);
          segment.distance += step.distance;
          step.code = parseInt(directionCode);
          var tmcMessage = orsUtilsService.getElementsByTagNameNS(instruction, orsNamespaces.xls, 'Message')[0];
          if (!(_.isUndefined(tmcMessage))) {
            tmcMessage = tmcMessage.text || tmcMessage.textContent;
            var tmcText = tmcMessage.split(" | ")[1];
            var tmcCode = tmcMessage.split(" | ")[0];
            step.message = [tmcText, tmcCode];
          }
          step.interval = [];
          var geom = orsUtilsService.getElementsByTagNameNS(instruction, orsNamespaces.gml, 'pos');
          _.each(geom, function(point, i) {
            if (i == 0 || i == geom.length - 1) {
              point = point.text || point.textContent;
              point = point.split(' ');
              point = [point[1], point[0]];
              _.each(orsRouteService.routeObj.routes[0].points, function(elem, i) {
                if (point[0] == elem[0] && point[1] == elem[1])
                  step.interval.push(i);
              });
              lastStepPoint = point;
            }
          });
          segment.steps.push(step);
        }
        if (idx == instructionsList.length - 1)
          segments.push(segment);
      });
      return {
        segments: segments,
        viapoints: viaPoints
      };
    };
    orsRouteService.parseSummary = function(summary) {
      var obj = {};
      var totalTime = orsUtilsService.getElementsByTagNameNS(summary, orsNamespaces.xls, 'TotalTime')[0];
      totalTime = totalTime.textContent || totalTime.text;
      totalTime = totalTime.match(/(\d+|[^\d]+)/g).join(',');
      totalTime = totalTime.split(',');
      var timeMs = 0;
      _.each(totalTime, function(k, i) {
        switch (k) {
          case 'D':
            timeMs += totalTime[i - 1] * 24 * 60 * 60 * 1000;
            break;
          case 'H':
            timeMs += totalTime[i - 1] * 60 * 60 * 1000;
            break;
          case 'M':
            timeMs += totalTime[i - 1] * 60 * 1000;
            break;
          case 'S':
            timeMs += totalTime[i - 1] * 1000;
            break;
          default:
        }
      });
      obj.duration = timeMs;
      var distance = orsUtilsService.getElementsByTagNameNS(summary, orsNamespaces.xls, 'TotalDistance')[0];
      if (!(_.isUndefined(distance))) {
        distance = distance.getAttribute('value');
        obj.distance = distance;
      }
      var actualDistance = orsUtilsService.getElementsByTagNameNS(summary, orsNamespaces.xls, 'ActualDistance')[0];
      if (!(_.isUndefined(actualDistance))) {
        actualDistance = actualDistance.getAttribute('value');
        obj.actualDistance = actualDistance;
      }
      var ascent = orsUtilsService.getElementsByTagNameNS(summary, orsNamespaces.xls, 'Ascent')[0];
      var descent = orsUtilsService.getElementsByTagNameNS(summary, orsNamespaces.xls, 'Descent')[0];
      if (!(_.isUndefined(ascent))) {
        ascent = ascent.getAttribute('value');
        obj.ascent = ascent;
      }
      if (!(_.isUndefined(descent))) {
        descent = descent.getAttribute('value');
        obj.descent = descent;
      }
      var boundingBoxXML = orsUtilsService.getElementsByTagNameNS(summary, orsNamespaces.xls, 'BoundingBox')[0],
          boundingBox = [];
      _.each(orsUtilsService.getElementsByTagNameNS(boundingBoxXML, orsNamespaces.gml, 'pos'), function(point, i) {
        point = point.text || point.textContent;
        point = point.split(' ');
        point = [point[1], point[0]];
        boundingBox.push(point);
      });
      obj.bbox = boundingBox;
      return obj;
    };
    return orsRouteService;
  }]);
  return {};
})();
