var $__app_47_scripts_47_infrastructure_47_ors_45_utils_45_service_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/infrastructure/ors-utils-service.js";
  angular.module('orsApp.utils-service', []).factory('orsUtilsService', ['$http', '$timeout', '$location', function($http, $timeout, $location) {
    var orsUtilsService = {};
    orsUtilsService.isCoordinate = function(lat, lng) {
      var ck_lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
      var ck_lng = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
      var validLat = ck_lat.test(lat);
      var validLon = ck_lng.test(lng);
      if (validLat && validLon) {
        return true;
      } else {
        return false;
      }
    };
    orsUtilsService.roundCoordinate = function(coord) {
      coord = Math.round(coord * 1000000) / 1000000;
      return coord;
    };
    orsUtilsService.parseLatLngString = function(latlng) {
      latlng = Math.round(latlng.lat * 1000000) / 1000000 + ', ' + Math.round(latlng.lng * 1000000) / 1000000;
      return latlng;
    };
    orsUtilsService.generateXml = function(str) {
      var writer = new XMLWriter('UTF-8', '1.0');
      writer.writeStartDocument();
      writer.writeElementString('xls:XLS');
      writer.writeAttributeString('xmlns:xls', orsNamespaces.xls);
      writer.writeAttributeString('xsi:schemaLocation', orsNamespaces.schemata.locationUtilityService);
      writer.writeAttributeString('xmlns:sch', orsNamespaces.ascc);
      writer.writeAttributeString('xmlns:gml', orsNamespaces.gml);
      writer.writeAttributeString('xmlns:xlink', orsNamespaces.xlink);
      writer.writeAttributeString('xmlns:xsi', orsNamespaces.xsi);
      writer.writeAttributeString('version', '1.1');
      writer.writeAttributeString('xls:lang', 'de');
      writer.writeElementString('xls:RequestHeader');
      writer.writeStartElement('xls:Request');
      writer.writeAttributeString('methodName', 'GeocodeRequest');
      writer.writeAttributeString('version', '1.1');
      writer.writeAttributeString('requestID', '00');
      writer.writeStartElement('xls:GeocodeRequest');
      writer.writeStartElement('xls:Address');
      writer.writeAttributeString('countryCode', 'en');
      writer.writeElementString('xls:freeFormAddress', str);
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeEndDocument();
      var xmlRequest = writer.flush();
      writer.close();
      return xmlRequest;
    };
    orsUtilsService.generateRouteXml = function(userOptions, settings) {
      var writer = new XMLWriter('UTF-8', '1.0');
      writer.writeStartDocument();
      writer.writeElementString('xls:XLS');
      writer.writeAttributeString('xmlns:xls', orsNamespaces.xls);
      writer.writeAttributeString('xsi:schemaLocation', orsNamespaces.schemata.routeService);
      writer.writeAttributeString('xmlns:sch', orsNamespaces.ascc);
      writer.writeAttributeString('xmlns:gml', orsNamespaces.gml);
      writer.writeAttributeString('xmlns:xlink', orsNamespaces.xlink);
      writer.writeAttributeString('xmlns:xsi', orsNamespaces.xsi);
      writer.writeAttributeString('version', '1.1');
      writer.writeAttributeString('xls:lang', userOptions.routinglang);
      writer.writeElementString('xls:RequestHeader');
      writer.writeStartElement('xls:Request');
      writer.writeAttributeString('methodName', 'RouteRequest');
      writer.writeAttributeString('version', '1.1');
      writer.writeAttributeString('requestID', '00');
      writer.writeAttributeString('maximumResponses', '15');
      writer.writeStartElement('xls:DetermineRouteRequest');
      writer.writeStartElement('xls:RoutePlan');
      writer.writeElementString('xls:RoutePreference', lists.profiles[settings.profile.type].subgroup);
      writer.writeStartElement('xls:ExtendedRoutePreference');
      writer.writeElementString('xls:WeightingMethod', settings.profile.options.weight);
      if (lists.profiles[settings.profile.type].elevation === true) {
        writer.writeElementString('xls:SurfaceInformation', 'true');
        writer.writeElementString('xls:ElevationInformation', 'true');
      }
      if (settings.profile.options.maxspeed > 0) {
        writer.writeElementString('xls:MaxSpeed', settings.profile.options.maxspeed.toString());
      }
      if (lists.profiles[settings.profile.type].subgroup == 'HeavyVehicle') {
        writer.writeElementString('xls:VehicleType', settings.profile.type);
        if (!angular.isUndefined(settings.profile.options.width))
          writer.writeElementString('xls:Width', settings.profile.options.width.toString());
        if (!angular.isUndefined(settings.profile.options.height))
          writer.writeElementString('xls:Height', settings.profile.options.height.toString());
        if (!angular.isUndefined(settings.profile.options.weight))
          writer.writeElementString('xls:Weight', settings.profile.options.hgvWeight.toString());
        if (!angular.isUndefined(settings.profile.options.length))
          writer.writeElementString('xls:Length', settings.profile.options.length.toString());
        if (!angular.isUndefined(settings.profile.options.axleload))
          writer.writeElementString('xls:AxleLoad', settings.profile.options.axleload.toString());
        if (!angular.isUndefined(settings.profile.options.hazardous)) {
          writer.writeStartElement('xls:LoadCharacteristics');
          writer.writeElementString('xls:LoadCharacteristic', settings.profile.options.hazardous.toString());
          writer.writeEndElement();
        }
      }
      if (lists.profiles[settings.profile.type].subgroup == 'Wheelchair') {
        writer.writeStartElement('xls:SurfaceTypes');
        writer.writeElementString('xls:SurfaceType', settings.profile.options.surface.toString());
        writer.writeEndElement();
        writer.writeElementString('xls:Incline', settings.profile.options.incline.toString());
        writer.writeElementString('xls:SlopedCurb', settings.profile.options.curb.toString());
      }
      if (lists.profiles[settings.profile.type].subgroup == 'Bicycle' || lists.profiles[settings.profile.type].subgroup == 'Pedestrian' || lists.profiles[settings.profile.type].subgroup == 'Wheelchair') {
        if (settings.profile.options.steepness >= 0 & settings.profile.options.steepness <= 15) {
          writer.writeElementString('xls:MaxSteepness', settings.profile.options.steepness.toString());
        }
        if (settings.profile.options.fitness >= 0 & settings.profile.options.fitness <= 3) {
          writer.writeElementString('xls:DifficultyLevel', settings.profile.options.fitness.toString());
        }
      }
      writer.writeEndElement();
      writer.writeStartElement('xls:WayPointList');
      var waypoints = [];
      angular.forEach(settings.waypoints, function(waypoint) {
        if (waypoint._set == 1)
          waypoints.push(waypoint);
      });
      for (var j = 0,
          i = 0; i < waypoints.length; i++) {
        if (i === 0) {
          writer.writeStartElement('xls:StartPoint');
        } else if (i == (waypoints.length - 1)) {
          writer.writeStartElement('xls:EndPoint');
        } else {
          writer.writeStartElement('xls:ViaPoint');
        }
        writer.writeStartElement('xls:Position');
        writer.writeStartElement('gml:Point');
        writer.writeAttributeString('xmlns:gml', orsNamespaces.gml);
        writer.writeStartElement('gml:pos');
        writer.writeAttributeString('srsName', 'EPSG:4326');
        writer.writeString(waypoints[i]._latlng.lng + ' ' + waypoints[i]._latlng.lat);
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
      }
      writer.writeEndElement();
      writer.writeStartElement('xls:AvoidList');
      var subgroup = lists.profiles[settings.profile.type].subgroup;
      angular.forEach(settings.profile.options.avoidables, function(value, key) {
        if (value === true) {
          var avSubgroups = lists.optionList.avoidables[key].subgroups;
          if (_.includes(avSubgroups, subgroup))
            writer.writeElementString('xls:AvoidFeature', lists.optionList.avoidables[key].name);
        }
      });
      if (!angular.isUndefined(settings.profile.options.difficulty)) {
        if (settings.profile.options.difficulty.avoidhills === true)
          writer.writeElementString('xls:AvoidFeature', 'Hills');
      }
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeStartElement('xls:RouteInstructionsRequest');
      writer.writeAttributeString('provideGeometry', 'true');
      writer.writeEndElement();
      writer.writeElementString('xls:RouteGeometryRequest');
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeEndDocument();
      var xmlRequest = writer.flush();
      writer.close();
      return xmlRequest;
    };
    orsUtilsService.reverseXml = function(position) {
      var writer = new XMLWriter('UTF-8', '1.0');
      writer.writeStartDocument();
      writer.writeElementString('xls:XLS');
      writer.writeAttributeString('xmlns:xls', orsNamespaces.xls);
      writer.writeAttributeString('xsi:schemaLocation', orsNamespaces.schemata.locationUtilityService);
      writer.writeAttributeString('xmlns:sch', orsNamespaces.ascc);
      writer.writeAttributeString('xmlns:gml', orsNamespaces.gml);
      writer.writeAttributeString('xmlns:xlink', orsNamespaces.xlink);
      writer.writeAttributeString('xmlns:xsi', orsNamespaces.xsi);
      writer.writeAttributeString('version', '1.1');
      writer.writeAttributeString('xls:lang', 'de');
      writer.writeElementString('xls:RequestHeader');
      writer.writeStartElement('xls:Request');
      writer.writeAttributeString('methodName', 'ReverseGeocodeRequest');
      writer.writeAttributeString('version', '1.1');
      writer.writeAttributeString('requestID', '00');
      writer.writeAttributeString('maximumResponses', '15');
      writer.writeStartElement('xls:ReverseGeocodeRequest');
      writer.writeStartElement('xls:Position');
      writer.writeStartElement('gml:Point');
      writer.writeAttributeString('xmlns:gml', orsNamespaces.gml);
      writer.writeStartElement('gml:pos');
      writer.writeAttributeString('srsName', 'EPSG:4326');
      writer.writeString(position.lng + ' ' + position.lat);
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeEndElement();
      writer.writeEndDocument();
      var xmlRequest = writer.flush();
      writer.close();
      return xmlRequest;
    };
    orsUtilsService.domParser = function(data) {
      var dom;
      if (typeof DOMParser != "undefined") {
        var parser = new DOMParser();
        dom = parser.parseFromString(data, "text/xml");
      } else {
        var doc = new ActiveXObject("Microsoft.XMLDOM");
        doc.async = false;
        dom = doc.loadXML(data);
      }
      return dom;
    };
    orsUtilsService.processAddresses = function(data, reverse) {
      var outerContainer,
          innerContainer;
      if (reverse) {
        outerContainer = lists.geocodingContainers.reverse.outer;
        innerContainer = lists.geocodingContainers.reverse.inner;
      } else {
        outerContainer = lists.geocodingContainers.geocoding.outer;
        innerContainer = lists.geocodingContainers.geocoding.inner;
      }
      var addressData = [];
      var geocodeResponseList = orsUtilsService.getElementsByTagNameNS(data, orsNamespaces.xls, outerContainer);
      angular.forEach(geocodeResponseList, function(geocodeResponse) {
        var allAddress = orsUtilsService.getElementsByTagNameNS(geocodeResponse, orsNamespaces.xls, innerContainer);
        angular.forEach(allAddress, function(xmlAddressContainer) {
          var xmlAddress = orsUtilsService.getElementsByTagNameNS(xmlAddressContainer, orsNamespaces.xls, 'Address')[0];
          var address = orsUtilsService.parseAddress(xmlAddress);
          var shortAddress = orsUtilsService.parseAddressShort(xmlAddress)[0];
          var xmlAddressPosition = orsUtilsService.getElementsByTagNameNS(xmlAddressContainer, orsNamespaces.gml, 'Point')[0];
          var position = orsUtilsService.parseAddressPosition(xmlAddressPosition);
          var addressContainer = {
            address: address,
            position: position,
            shortAddress: shortAddress
          };
          addressData.push(addressContainer);
        });
      });
      return addressData;
    };
    orsUtilsService.parseAddress = function(xmlAddress) {
      var streetline;
      if (!xmlAddress) {
        return;
      }
      var element = '';
      var v1 = orsUtilsService.getElementsByTagNameNS(xmlAddress, orsNamespaces.xls, 'StreetAddress');
      var StreetAddress = null;
      if (v1 !== null && v1 !== undefined) {
        StreetAddress = v1[0];
      }
      var hasStreetElement = false;
      if (StreetAddress !== null && StreetAddress !== undefined) {
        var Streets = orsUtilsService.getElementsByTagNameNS(StreetAddress, orsNamespaces.xls, 'Street');
        var Building = orsUtilsService.getElementsByTagNameNS(StreetAddress, orsNamespaces.xls, 'Building')[0];
        if (Building) {
          var buildingName = Building.getAttribute('buildingName');
          var buildingSubdivision = Building.getAttribute('subdivision');
          if (buildingName !== null) {
            element = element + buildingName + ', ';
          }
          if (buildingSubdivision !== null) {
            element = element + buildingSubdivision + ', ';
          }
        }
        if (Streets) {
          streetline = 0;
          angular.forEach(Streets, function(street) {
            var officialName = street.getAttribute('officialName');
            if (officialName !== null) {
              element = element + officialName + ' ';
              streetline++;
            }
          });
        }
        if (Building) {
          var buildingNumber = Building.getAttribute('number');
          if (buildingNumber != null) {
            element = element + buildingNumber;
            streetline++;
          }
        }
        if (streetline > 0) {
          hasStreetElement = true;
        }
        element = element + ', ';
      }
      var separator = ',';
      var places = orsUtilsService.getElementsByTagNameNS(xmlAddress, orsNamespaces.xls, 'Place');
      var regionList = ['MunicipalitySubdivision', 'Municipality', 'CountrySecondarySubdivision', 'CountrySubdivision', 'Country'];
      if (places) {
        var elemCountry = null;
        var elemMunicipalitySubdivision = null;
        var elemMunicipality = null;
        var elemCountrySecondarySubdivision = null;
        var elemCountrySubdivision = null;
        angular.forEach(regionList, function(type) {
          angular.forEach(places, function(place) {
            if (place.getAttribute('type') === type) {
              var content = place.textContent || place.text;
              if (content !== undefined || content !== null) {
                if (type == 'MunicipalitySubdivision')
                  elemMunicipalitySubdivision = content;
                else if (type == 'Municipality')
                  elemMunicipality = content;
                else if (type == 'CountrySecondarySubdivision')
                  elemCountrySecondarySubdivision = content;
                else if (type == 'CountrySubdivision')
                  elemCountrySubdivision = content;
                else if (type == 'Country')
                  elemCountry = content;
              }
            }
          });
        });
        var placesText = '';
        if (hasStreetElement) {
          var postalCode = orsUtilsService.getElementsByTagNameNS(xmlAddress, orsNamespaces.xls, 'PostalCode');
          if (postalCode[0]) {
            placesText = placesText + postalCode[0].textContent + '  ';
          }
          if (elemMunicipality)
            placesText = placesText + elemMunicipality;
          if (elemMunicipalitySubdivision && elemMunicipalitySubdivision != elemMunicipality)
            placesText = placesText + ' (' + elemMunicipalitySubdivision + ') ';
          placesText = placesText + ', ';
        } else {
          if (elemMunicipalitySubdivision)
            placesText = placesText + elemMunicipalitySubdivision + ', ';
          if (elemMunicipality && elemMunicipality != elemMunicipalitySubdivision)
            placesText = placesText + elemMunicipality + ', ';
        }
        if (elemCountrySecondarySubdivision && elemCountrySecondarySubdivision != elemMunicipality)
          placesText = placesText + elemCountrySecondarySubdivision + ', ';
        if (elemCountrySubdivision && elemCountrySubdivision != elemCountrySecondarySubdivision && elemCountrySubdivision != elemMunicipality)
          placesText = placesText + elemCountrySubdivision + ', ';
        element = element + placesText;
      }
      if (elemCountry) {
        element = element + elemCountry;
      } else {
        console.log(orsUtilsService.getElementsByTagNameNS(xmlAddress, orsNamespaces.xls, 'countryCode'));
        var countryCode = xmlAddress[0].getAttribute('countryCode');
        if (countryCode !== null) {
          element = element + countryCode.toUpperCase();
        }
      }
      return element;
    };
    orsUtilsService.parseAddressShort = function(xmlAddress) {
      var prevContent,
          element = [],
          regionList = ['MunicipalitySubdivision', 'Municipality', 'CountrySecondarySubdivision', 'CountrySubdivision'];
      if (xmlAddress) {
        var streetAddressElement = orsUtilsService.getElementsByTagNameNS(xmlAddress, orsNamespaces.xls, 'StreetAddress');
        var streetAddress = null;
        var placesElement = orsUtilsService.getElementsByTagNameNS(xmlAddress, orsNamespaces.xls, 'Place');
        if (streetAddressElement !== null) {
          streetAddress = streetAddressElement[0];
        }
        if (streetAddress !== null && streetAddress !== undefined) {
          element[0] = '';
          var streets = orsUtilsService.getElementsByTagNameNS(streetAddress, orsNamespaces.xls, 'Street');
          var building = orsUtilsService.getElementsByTagNameNS(streetAddress, orsNamespaces.xls, 'Building')[0];
          if (building) {
            var buildingName = building.getAttribute('buildingName');
            var buildingSubdivision = building.getAttribute('subdivision');
            if (buildingName !== null) {
              element[0] += buildingName + ' ';
            }
            if (buildingSubdivision !== null) {
              element[0] += buildingSubdivision + ' ';
            }
          }
          angular.forEach(streets, function(street) {
            var officialName = street.getAttribute('officialName');
            if (officialName !== null) {
              element[0] += officialName + ' ';
            }
          });
          if (building) {
            var buildingNumber = building.getAttribute('number');
            if (buildingNumber !== null) {
              element[0] += buildingNumber + ' ';
            }
          }
          if (placesElement !== null) {
            element[1] = '';
            angular.forEach(regionList, function(type) {
              angular.forEach(placesElement, function(place) {
                if (place.getAttribute('type') === type) {
                  var content = place.textContent || place.text;
                  if (content !== undefined || content !== null) {
                    if (content != prevContent) {
                      prevContent = content;
                      element[1] += place.textContent || place.text;
                      element[1] += ', ';
                    }
                  }
                }
              });
            });
            element[1] = element[1].substring(0, element[1].length - 2);
          }
        } else if (placesElement !== null) {
          element[0] = '';
          angular.forEach(regionList, function(type) {
            angular.forEach(placesElement, function(place) {
              if (place.getAttribute('type') === type) {
                var content = place.textContent || place.text;
                if (content !== undefined || content !== null) {
                  if (content != prevContent) {
                    prevContent = content;
                    element[0] += place.textContent || place.text;
                    element[0] += ', ';
                  }
                }
              }
            });
          });
          element[0] = element[0].substring(0, element[0].length - 2);
        }
      }
      return element;
    };
    orsUtilsService.parseAddressPosition = function(xmlAddressPosition) {
      var element = null;
      if (xmlAddressPosition) {
        element = '';
        var position = orsUtilsService.getElementsByTagNameNS(xmlAddressPosition, orsNamespaces.gml, 'pos')[0];
        position = position.textContent || position.text;
        position = position.split(" ");
        element = L.latLng(position[1], position[0]);
      }
      return element;
    };
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
    orsUtilsService.writeRouteToSingleLineString = function(results) {
      var routeString = [];
      var routeGeometry = orsUtilsService.getElementsByTagNameNS(results, orsNamespaces.xls, 'RouteGeometry')[0];
      angular.forEach(orsUtilsService.getElementsByTagNameNS(routeGeometry, orsNamespaces.gml, 'pos'), function(point) {
        point = point.text || point.textContent;
        point = point.split(' ');
        if (point.length == 2) {
          point = L.latLng(point[1], point[0]);
        } else {
          point = L.latLng(point[1], point[0], point[2]);
        }
        routeString.push(point);
      });
      return routeString;
    };
    orsUtilsService.parseResultsToLineStrings = function(results) {
      var listOfLineStrings = [];
      var heightIdx = 0;
      var routeInstructions = orsUtilsService.getElementsByTagNameNS(results, orsNamespaces.xls, 'RouteInstructionsList')[0];
      if (routeInstructions) {
        routeInstructions = orsUtilsService.getElementsByTagNameNS(routeInstructions, orsNamespaces.xls, 'RouteInstruction');
        $A(routeInstructions).each(function(instructionElement) {
          var directionCode = orsUtilsService.getElementsByTagNameNS(instructionElement, orsNamespaces.xls, 'DirectionCode')[0];
          directionCode = directionCode.textContent;
          if (directionCode == '100') {
            return;
          }
          var segment = [];
          $A(orsUtilsService.getElementsByTagNameNS(instructionElement, orsNamespaces.gml, 'pos')).each(function(point) {
            point = point.text || point.textContent;
            point = point.split(' ');
            point = L.latLng(point[1], point[0]);
            segment.push(point);
          });
          listOfLineStrings.push(segment);
        });
      }
      return listOfLineStrings;
    };
    orsUtilsService.parseResultsToCornerPoints = function(results, converterFunction) {
      var listOfCornerPoints = [];
      var routeInstructions = orsUtilsService.getElementsByTagNameNS(results, orsNamespaces.xls, 'RouteInstructionsList')[0];
      if (routeInstructions) {
        routeInstructions = orsUtilsService.getElementsByTagNameNS(routeInstructions, orsNamespaces.xls, 'RouteInstruction');
        $A(routeInstructions).each(function(instructionElement) {
          var directionCode = orsUtilsService.getElementsByTagNameNS(instructionElement, orsNamespaces.xls, 'DirectionCode')[0];
          directionCode = directionCode.textContent;
          if (directionCode == '100') {
            return;
          }
          var point = orsUtilsService.getElementsByTagNameNS(instructionElement, orsNamespaces.gml, 'pos')[0];
          point = point.text || point.textContent;
          point = point.split(' ');
          point = L.latLng(point[1], point[0]);
          listOfCornerPoints.push(point);
        });
      }
      return listOfCornerPoints;
    };
    orsUtilsService.parseRouteSummary = function(results) {
      var yardsUnit,
          ascentValue,
          ascentUnit,
          descentValue,
          descentUnit,
          ascentArr,
          descentArr,
          totalTimeArr = [],
          distArr = [],
          actualdistArr = [],
          routeSummary = {};
      var summaryElement = orsUtilsService.getElementsByTagNameNS(results, orsNamespaces.xls, 'RouteSummary')[0];
      var totalTime = orsUtilsService.getElementsByTagNameNS(summaryElement, orsNamespaces.xls, 'TotalTime')[0];
      totalTime = totalTime.textContent || totalTime.text;
      totalTime = totalTime.replace('P', '');
      totalTime = totalTime.replace('T', '');
      totalTime = totalTime.replace('D', 'days');
      totalTime = totalTime.replace('H', 'hr');
      totalTime = totalTime.replace('M', 'min');
      totalTime = totalTime.replace('S', 'seconds');
      totalTime = totalTime.match(/(\d+|[^\d]+)/g).join(',');
      totalTime = totalTime.split(',');
      routeSummary.time = totalTime;
      var distance = orsUtilsService.getElementsByTagNameNS(summaryElement, orsNamespaces.xls, 'TotalDistance')[0];
      var distanceValue = distance.getAttribute('value');
      var distanceUnit = distance.getAttribute('uom');
      distArr = orsUtilsService.convertDistanceFormat(distanceValue, lists.distanceUnits[0]);
      routeSummary.distance = distArr;
      var actualDistance = orsUtilsService.getElementsByTagNameNS(summaryElement, orsNamespaces.xls, 'ActualDistance')[0];
      if (actualDistance !== undefined) {
        var actualDistanceValue = actualDistance.getAttribute('value');
        var actualDistanceUnit = actualDistance.getAttribute('uom');
        actualdistArr = orsUtilsService.convertDistanceFormat(actualDistanceValue, lists.distanceUnits[0]);
        routeSummary.actualDistance = actualdistArr;
      }
      var ascent = orsUtilsService.getElementsByTagNameNS(results, orsNamespaces.xls, 'Ascent')[0];
      var descent = orsUtilsService.getElementsByTagNameNS(results, orsNamespaces.xls, 'Descent')[0];
      if (ascent !== undefined) {
        ascentValue = ascent.getAttribute('value');
        ascentUnit = ascent.getAttribute('uom');
        ascentArr = orsUtilsService.convertDistanceFormat(ascentValue, lists.distanceUnits[0]);
        routeSummary.ascent = ascentArr;
      }
      if (descent !== undefined) {
        descentValue = descent.getAttribute('value');
        descentUnit = descent.getAttribute('uom');
        descentArr = orsUtilsService.convertDistanceFormat(descentValue, lists.distanceUnits[0]);
        routeSummary.descent = descentArr;
      }
      return routeSummary;
    };
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
    orsUtilsService.convertPositionStringToLonLat = function(positionString) {
      var pos = positionString.split(' ');
      pos = L.latLng(pos[1], pos[0]);
      return pos;
    };
    orsUtilsService.round = function(distance) {
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
    orsUtilsService.parseSettingsToPermalink = function(settings, userOptions) {
      console.info("parseSettingsToPermalink", settings);
      if (settings.profile === undefined)
        return;
      var link = '';
      var profile = angular.fromJson(angular.toJson(settings.profile));
      var waypoints = angular.fromJson(angular.toJson(settings.waypoints));
      function getProp(obj) {
        for (var o in obj) {
          if ($traceurRuntime.typeof(obj[o]) == "object") {
            getProp(obj[o]);
          } else {
            if (typeof obj[o] != "function" && o.toString().charAt(0) != '_' && (lists.permalinkFilters[settings.profile.type].includes(o) || lists.permalinkFilters.avoidables.includes(o) || lists.permalinkFilters.analysis.includes(o))) {
              link = link.concat('&' + o + '=' + obj[o]);
            }
          }
        }
      }
      if (waypoints[0] !== undefined) {
        if (waypoints[0]._latlng.lat !== undefined) {
          link = link.concat("wps=");
          var $__4 = true;
          var $__5 = false;
          var $__6 = undefined;
          try {
            for (var $__2 = void 0,
                $__1 = (waypoints)[Symbol.iterator](); !($__4 = ($__2 = $__1.next()).done); $__4 = true) {
              var waypoint = $__2.value;
              {
                if (waypoint._latlng.lng == undefined)
                  continue;
                link = link.concat(Math.round(waypoint._latlng.lat * 1000000) / 1000000);
                link = link.concat(',');
                link = link.concat(Math.round(waypoint._latlng.lng * 1000000) / 1000000);
                link = link.concat(',');
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
          link = link.slice(0, -1);
        }
      }
      getProp(profile);
      if (userOptions.routinglang !== undefined)
        link = link.concat('&routinglang=' + userOptions.routinglang);
      if (userOptions.units !== undefined)
        link = link.concat('&units=' + userOptions.units);
      $timeout(function() {
        $location.search(link);
      });
    };
    return orsUtilsService;
  }]);
  return {};
})();
