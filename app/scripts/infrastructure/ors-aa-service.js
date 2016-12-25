var $__app_47_scripts_47_infrastructure_47_ors_45_aa_45_service_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/infrastructure/ors-aa-service.js";
  angular.module('orsApp.aa-service', []).factory('orsAaService', ['$http', '$q', 'orsUtilsService', 'orsMapFactory', 'orsObjectsFactory', function($http, $q, orsUtilsService, orsMapFactory, orsObjectsFactory) {
    var orsAaService = {};
    orsAaService.aaSubject = new Rx.Subject();
    orsAaService.aaRequests = {};
    orsAaService.aaRequests.requests = [];
    orsAaService.aaRequests.clear = function() {
      if (orsAaService.aaRequests.requests.length > 0) {
        var $__5 = true;
        var $__6 = false;
        var $__7 = undefined;
        try {
          for (var $__3 = void 0,
              $__2 = (orsAaService.aaRequests.requests)[Symbol.iterator](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
            var req = $__3.value;
            {
              req.cancel("Cancel last request");
            }
          }
        } catch ($__8) {
          $__6 = true;
          $__7 = $__8;
        } finally {
          try {
            if (!$__5 && $__2.return != null) {
              $__2.return();
            }
          } finally {
            if ($__6) {
              throw $__7;
            }
          }
        }
        orsAaService.aaRequests.requests = [];
      }
    };
    orsAaService.orsAaObj = {
      code: 'Ok',
      bbox: [[], []],
      isochrones: [],
      info: {}
    };
    orsAaService.initAaObj = function() {
      orsAaService.orsAaObj = {
        code: 'Ok',
        bbox: [[], []],
        isochrones: [],
        info: {}
      };
    };
    orsAaService.processResponse = function(data) {
      orsAaService.initAaObj();
      orsAaService.parseResultsToBounds(data);
      orsAaService.parseResponseToPolygonJSON(data);
      orsAaService.processResponseToMap();
    };
    orsAaService.fetchAnalysis = function(requestData) {
      var url = orsNamespaces.services.analyse;
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
    orsAaService.generateAnalysisRequest = function(settings) {
      console.log(settings);
      var writer = new XMLWriter('UTF-8', '1.0');
      writer.writeStartDocument();
      writer.writeElementString('aas:AAS');
      writer.writeAttributeString('version', '1.0');
      writer.writeAttributeString('xmlns:aas', orsNamespaces.aas);
      writer.writeAttributeString('xmlns:xsi', orsNamespaces.xsi);
      writer.writeAttributeString('xsi:schemaLocation', orsNamespaces.schemata.analyseService);
      writer.writeElementString('aas:RequestHeader');
      writer.writeStartElement('aas:Request');
      writer.writeAttributeString('methodName', 'AccessibilityRequest');
      writer.writeAttributeString('version', '1.0');
      writer.writeAttributeString('requestID', '00');
      writer.writeStartElement('aas:DetermineAccessibilityRequest');
      writer.writeStartElement('aas:Accessibility');
      writer.writeStartElement('aas:AccessibilityPreference');
      writer.writeStartElement('aas:Time');
      writer.writeAttributeString('Duration', 'PT0H' + settings.profile.options.analysis_options.minutes + 'M00S');
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeStartElement('aas:AccessibilitySettings');
      writer.writeElementString('aas:RoutePreference', settings.profile.type || 'Fastest');
      writer.writeElementString('aas:Method', 'Default');
      writer.writeElementString('aas:Interval', (settings.profile.options.analysis_options.interval * 60).toString() || '1000');
      writer.writeEndElement();
      writer.writeStartElement('aas:LocationPoint');
      writer.writeStartElement('aas:Position');
      writer.writeStartElement('gml:Point');
      writer.writeAttributeString('xmlns:gml', orsNamespaces.gml);
      writer.writeAttributeString('srsName', 'EPSG:4326');
      writer.writeStartElement('gml:pos');
      writer.writeString(settings.waypoints[0]._latlng.lng + ' ' + settings.waypoints[0]._latlng.lat);
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeStartElement('aas:AccessibilityGeometryRequest');
      writer.writeStartElement('aas:PolygonPreference');
      writer.writeString('Detailed');
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeEndElement('aas:DetermineAccessibilityRequest');
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeEndDocument();
      var xmlRequest = writer.flush();
      writer.close();
      return xmlRequest;
    };
    orsAaService.parseResultsToBounds = function(response) {
      response = orsUtilsService.domParser(response);
      var boundingBox = orsUtilsService.getElementsByTagNameNS(response, orsNamespaces.aas, 'BoundingBox');
      var bounds,
          latlngs;
      if (boundingBox && boundingBox.length > 0) {
        latlngs = [];
        _.each(orsUtilsService.getElementsByTagNameNS(boundingBox[0], orsNamespaces.gml, 'pos'), function(position) {
          position = orsUtilsService.convertPositionStringToLonLat(position.firstChild.nodeValue);
          latlngs.push(position);
        });
      }
      bounds = new L.latLngBounds(latlngs);
      orsAaService.orsAaObj.bbox[0] = bounds._northEast;
      orsAaService.orsAaObj.bbox[1] = bounds._southWest;
      console.log(orsAaService.orsAaObj);
    };
    orsAaService.parseResponseToPolygonJSON = function(response) {
      response = orsUtilsService.domParser(response);
      console.log(response);
      var area = orsUtilsService.getElementsByTagNameNS(response, orsNamespaces.aas, 'AccessibilityGeometry');
      var poly,
          isoChroneTime,
          isoChroneGeometry,
          collectionArr;
      var collectionArrGeom = [];
      var element;
      if (area) {
        try {
          isoChroneTime = orsUtilsService.getElementsByTagNameNS(area[0], orsNamespaces.gml, 'Isochrone', true)[0];
          isoChroneGeometry = orsUtilsService.getElementsByTagNameNS(isoChroneTime[0], orsNamespaces.gml, 'IsochroneGeometry', true)[0];
          console.log("test");
          collectionArr = orsUtilsService.getElementsByTagNameNS(isoChroneGeometry[0], orsNamespaces.gml, 'Polygon', true)[0];
        } catch (err) {
          var collectionArr = orsUtilsService.getElementsByTagNameNS(area[0], orsNamespaces.gml, 'Polygon', true)[0];
          var areaArr = orsUtilsService.getElementsByTagNameNS(area[0], orsNamespaces.aas, 'IsochroneGeometry', true)[0];
        }
        for (var i = 0; i < collectionArr.length; i++) {
          element = {
            geometry: {
              coordinates: [],
              type: 'Polygon'
            },
            type: 'Feature',
            properties: {
              value: i,
              area: areaArr[i].attributes['area'].value
            }
          };
          if (collectionArr[i].getElementsByTagNameNS) {
            var exteriorRing = collectionArr[i].getElementsByTagNameNS(orsNamespaces.gml, 'exterior')[0];
            var interiorRingArr = orsUtilsService.getElementsByTagNameNS(collectionArr[i], orsNamespaces.gml, 'interior', true)[0];
            var extIntArr = [];
            if (exteriorRing) {
              extIntArr.push(exteriorRing);
            }
            if (interiorRingArr) {
              for (var j = 0; j < interiorRingArr.length; j++) {
                extIntArr.push(interiorRingArr[j]);
              }
            }
            poly = orsAaService.fetchPolygonGeometry(extIntArr, orsNamespaces.gml, 'pos');
            collectionArrGeom.push(poly);
            element.geometry.coordinates = poly;
          }
          orsAaService.orsAaObj.isochrones.push(element);
        }
      }
      return collectionArrGeom;
    };
    orsAaService.fetchPolygonGeometry = function(elements, ns, tag) {
      var rings = [];
      for (var i = 0; i < elements.length; i++) {
        var polyPoints = [];
        _.each(orsUtilsService.getElementsByTagNameNS(elements[i], ns, tag), function(polygonPos) {
          polygonPos = orsUtilsService.convertPositionStringToLonLat(polygonPos.firstChild.nodeValue);
          polyPoints.push(polygonPos);
        });
        rings.push(polyPoints);
      }
      return rings;
    };
    orsAaService.processResponseToMap = function() {
      var action = orsObjectsFactory.createMapAction(2, lists.layers[3], undefined, undefined);
      orsMapFactory.mapServiceSubject.onNext(action);
      var polygons = [];
      var $__5 = true;
      var $__6 = false;
      var $__7 = undefined;
      try {
        for (var $__3 = void 0,
            $__2 = (orsAaService.orsAaObj.isochrones)[Symbol.iterator](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
          poly = $__3.value;
          {
            polygons.push(poly.geometry.coordinates);
          }
        }
      } catch ($__8) {
        $__6 = true;
        $__7 = $__8;
      } finally {
        try {
          if (!$__5 && $__2.return != null) {
            $__2.return();
          }
        } finally {
          if ($__6) {
            throw $__7;
          }
        }
      }
      action = orsObjectsFactory.createMapAction(4, lists.layers[3], polygons, undefined);
      orsMapFactory.mapServiceSubject.onNext(action);
    };
    return orsAaService;
  }]);
  return {};
})();
