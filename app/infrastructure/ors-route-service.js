angular.module('orsApp.route-service', []).factory('orsRouteService', ['$http', 'orsUtilsService', 'orsMapFactory', 'orsObjectsFactory',
    function($http, orsUtilsService, orsMapFactory, orsObjectsFactory) {
        /**
         * Requests geocoding from ORS backend
         * @param {String} requestData: XML for request payload
         */
        let orsRouteService = {};
        orsRouteService.routesSubject = new Rx.Subject();
        orsRouteService.resetRoute = () => {
            orsRouteService.routeObj = {};
            orsRouteService.routesSubject.onNext([]);
            let action = orsObjectsFactory.createMapAction(2, lists.layers[1], undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        /**
         * Requests route from ORS backend
         * @param {String} requestData: XML for request payload
         */
        orsRouteService.fetchRoute = function(requestData) {
            var url = namespaces.services.routing;
            return $http({
                method: 'POST',
                url: url,
                data: requestData
            });
        };
        orsRouteService.setCurrentRouteIdx = (idx) => {
            orsRouteService.currentRouteIdx = idx;
        };
        orsRouteService.getCurrentRouteIdx = () => {
            return orsRouteService.currentRouteIdx;
        };
        orsRouteService.DeEmph = function() {
            let action = orsObjectsFactory.createMapAction(2, lists.layers[2], undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        orsRouteService.Emph = function(geom) {
            let action = orsObjectsFactory.createMapAction(3, lists.layers[2], geom, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        orsRouteService.zoomTo = function(geom) {
            let action = orsObjectsFactory.createMapAction(0, lists.layers[2], geom, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        };
        orsRouteService.processRoutes = function(response) {
            _.each(orsRouteService.routeObj.routes, function(route) {
                /** add layers */
                let action = orsObjectsFactory.createMapAction(1, lists.layers[1], route.points, undefined);
                orsMapFactory.mapServiceSubject.onNext(action);
            });
            /** update summary */
            orsRouteService.routesSubject.onNext(orsRouteService.routeObj.routes);
        };
        /** prepare route to json */
        orsRouteService.processResponse = function(response, profile) {
            response = orsUtilsService.domParser(response.data); /** later this xml parsing can be skipped as json is returned.. */
            orsRouteService.routeObj = {
                status: 'Ok',
                routes: [{}]
            };
            /** This is a mock, will be returned in JSON response one day.. */
            orsRouteService.routeObj.routes[0].profile = profile;
            orsRouteService.routeObj.routes[0].summary = orsRouteService.parseSummary(orsUtilsService.getElementsByTagNameNS(response, namespaces.xls, 'RouteSummary')[0]);
            orsRouteService.routeObj.routes[0].pointsEncoded = false;
            /** This is a mock, will be returned in JSON response one day.. */
            if (lists.profiles[profile].elevation) {
                orsRouteService.routeObj.routes[0].pointsElevation = true;
            } else {
                orsRouteService.routeObj.routes[0].pointsElevation = false;
            }
            orsRouteService.routeObj.routes[0].points = orsRouteService.parseLinestring(orsUtilsService.getElementsByTagNameNS(response, namespaces.xls, 'RouteGeometry')[0]);
            const segmentsObj = orsRouteService.parseInstructions(orsUtilsService.getElementsByTagNameNS(response, namespaces.xls, 'RouteInstructionsList')[0]);
            orsRouteService.routeObj.routes[0].segments = segmentsObj.segments;
            orsRouteService.routeObj.routes[0].wayPoints = _.flatten([0, segmentsObj.viapoints, orsRouteService.routeObj.routes[0].points.length - 1]);
            const extrasObj = orsRouteService.parseExtras(response);
            if (extrasObj !== false) orsRouteService.routeObj.routes[0].extras = extrasObj;
            orsRouteService.processRoutes();
        };
        orsRouteService.parseExtras = function(response) {
            extras = false;
            let steepnessXML = orsUtilsService.getElementsByTagNameNS(response, namespaces.xls, 'WaySteepnessList')[0];
            if (!(_.isUndefined(steepnessXML))) {
                extras = {};
                steepnessXML = orsUtilsService.getElementsByTagNameNS(steepnessXML, namespaces.xls, 'WaySteepness');
                /** extract gradients */
                extras.gradients = [];
                _.each(steepnessXML, function(elem, i) {
                    chunk = {};
                    let fr = orsUtilsService.getElementsByTagNameNS(elem, namespaces.xls, 'From')[0];
                    chunk.fr = parseInt(fr.textContent);
                    let to = orsUtilsService.getElementsByTagNameNS(elem, namespaces.xls, 'To')[0];
                    chunk.to = parseInt(to.textContent);
                    let value = orsUtilsService.getElementsByTagNameNS(elem, namespaces.xls, 'Type')[0];
                    chunk.value = value.textContent;
                    extras.gradients.push(chunk);
                });
                return extras
            }
            return extras;
        };
        orsRouteService.parseLinestring = function(routeGeometry) {
            let routeString = [];
            _.each(orsUtilsService.getElementsByTagNameNS(routeGeometry, namespaces.gml, 'pos'), function(point, i) {
                point = point.text || point.textContent;
                point = point.split(' ');
                // if elevation contained
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
            let viaPoints = [],
                segments = [],
                segment = {},
                lastStepPoint;
            segment.duration = 0;
            segment.distance = 0;
            /** dummy keys */
            segment.ascent = null;
            segment.descent = null;
            segment.direct = false;
            segment.steps = [];
            const instructionsList = orsUtilsService.getElementsByTagNameNS(instructions, namespaces.xls, 'RouteInstruction');
            _.each(instructionsList, function(instruction, idx) {
                let directionCode = orsUtilsService.getElementsByTagNameNS(instruction, namespaces.xls, 'DirectionCode')[0];
                directionCode = directionCode.textContent;
                if (directionCode == '100') {
                    /** Find via points */
                    _.each(orsRouteService.routeObj.routes[0].points, function(elem, i) {
                        if (lastStepPoint[0] == elem[0] && lastStepPoint[1] == elem[1]) viaPoints.push(i);
                    });
                    segments.push(segment);
                    /** reset */
                    segment = {};
                    segment.duration = 0;
                    segment.distance = 0;
                    /** dummy keys */
                    segment.ascent = 0;
                    segment.descent = 0;
                    segment.direct = false;
                    segment.steps = [];
                } else {
                    /** empty step */
                    step = {};
                    /** step text */
                    let text = orsUtilsService.getElementsByTagNameNS(instruction, namespaces.xls, 'Instruction')[0];
                    step.text = text.text || text.textContent;
                    /** step duration */
                    let duration = instruction.getAttribute('duration');
                    duration = duration.replace('P', '');
                    duration = duration.replace('T', '');
                    duration = duration.match(/\d+\D+/g);
                    step.duration = 0;
                    let ms;
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
                    /** add to segment duration */
                    segment.duration += step.duration;
                    /** step distance */
                    let distance = orsUtilsService.getElementsByTagNameNS(instruction, namespaces.xls, 'Distance')[0];
                    distance = distance.getAttribute('value');
                    step.distance = parseInt(distance);
                    /** add to segment distance */
                    segment.distance += step.distance;
                    /** step direction */
                    step.code = parseInt(directionCode);
                    /** step message */
                    let tmcMessage = orsUtilsService.getElementsByTagNameNS(instruction, namespaces.xls, 'Message')[0];
                    if (!(_.isUndefined(tmcMessage))) {
                        tmcMessage = tmcMessage.text || tmcMessage.textContent;
                        const tmcText = tmcMessage.split(" | ")[1];
                        const tmcCode = tmcMessage.split(" | ")[0];
                        step.message = [tmcText, tmcCode];
                        //tmcCode = tmcCode.split(',');
                    }
                    step.interval = [];
                    const geom = orsUtilsService.getElementsByTagNameNS(instruction, namespaces.gml, 'pos');
                    _.each(geom, function(point, i) {
                        /** get index of first point and push to interval */
                        if (i == 0 || i == geom.length - 1) {
                            point = point.text || point.textContent;
                            point = point.split(' ');
                            point = [point[1], point[0]];
                            _.each(orsRouteService.routeObj.routes[0].points, function(elem, i) {
                                if (point[0] == elem[0] && point[1] == elem[1]) step.interval.push(i);
                            });
                            /** save this in case this is a via point */
                            lastStepPoint = point;
                        }
                    });
                    segment.steps.push(step);
                }
                if (idx == instructionsList.length - 1) segments.push(segment);
            });
            return {
                segments: segments,
                viapoints: viaPoints
            };
        };
        orsRouteService.parseSummary = function(summary) {
            obj = {};
            /** Calculate duration in milliseconds */
            let totalTime = orsUtilsService.getElementsByTagNameNS(summary, namespaces.xls, 'TotalTime')[0];
            totalTime = totalTime.textContent || totalTime.text;
            //<period>PT 5Y 2M 10D 15H 18M 43S</period>
            //The example above indicates a period of five years, two months, 10 days, 15 hours, a8 minutes and 43 seconds
            totalTime = totalTime.match(/(\d+|[^\d]+)/g).join(',');
            totalTime = totalTime.split(',');
            let timeMs = 0;
            //D H M S 
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
            /** Distance */
            let distance = orsUtilsService.getElementsByTagNameNS(summary, namespaces.xls, 'TotalDistance')[0];
            if (!(_.isUndefined(distance))) {
                distance = distance.getAttribute('value');
                obj.distance = distance;
            }
            /** Actual distance */
            let actualDistance = orsUtilsService.getElementsByTagNameNS(summary, namespaces.xls, 'ActualDistance')[0];
            if (!(_.isUndefined(actualDistance))) {
                actualDistance = actualDistance.getAttribute('value');
                obj.actualDistance = actualDistance;
            }
            /** Ascent and Descent */
            let ascent = orsUtilsService.getElementsByTagNameNS(summary, namespaces.xls, 'Ascent')[0];
            let descent = orsUtilsService.getElementsByTagNameNS(summary, namespaces.xls, 'Descent')[0];
            if (!(_.isUndefined(ascent))) {
                ascent = ascent.getAttribute('value');
                obj.ascent = ascent;
            }
            if (!(_.isUndefined(descent))) {
                descent = descent.getAttribute('value');
                obj.descent = descent;
            }
            /** Bounding box */
            let boundingBoxXML = orsUtilsService.getElementsByTagNameNS(summary, namespaces.xls, 'BoundingBox')[0],
                boundingBox = [];
            _.each(orsUtilsService.getElementsByTagNameNS(boundingBoxXML, namespaces.gml, 'pos'), function(point, i) {
                point = point.text || point.textContent;
                point = point.split(' ');
                point = [point[1], point[0]];
                boundingBox.push(point);
            });
            obj.bbox = boundingBox;
            return obj;
        };
        return orsRouteService;
    }
]);