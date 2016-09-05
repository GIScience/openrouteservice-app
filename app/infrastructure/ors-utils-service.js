angular.module('orsApp').factory('orsUtilsService', ['$http',
    function($http) {
        var orsUtilsService = {};
        /**
         * generates XML for geocoding
         * @param {String} str: Free form address
         * @return {String} xmlRequest: XML document
         */
        orsUtilsService.generateXml = function(str) {
            //build request
            var writer = new XMLWriter('UTF-8', '1.0');
            writer.writeStartDocument();
            //<xls:XLS>
            writer.writeElementString('xls:XLS');
            writer.writeAttributeString('xmlns:xls', namespaces.xls);
            writer.writeAttributeString('xsi:schemaLocation', namespaces.schemata.locationUtilityService);
            writer.writeAttributeString('xmlns:sch', namespaces.ascc);
            writer.writeAttributeString('xmlns:gml', namespaces.gml);
            writer.writeAttributeString('xmlns:xlink', namespaces.xlink);
            writer.writeAttributeString('xmlns:xsi', namespaces.xsi);
            writer.writeAttributeString('version', '1.1');
            writer.writeAttributeString('xls:lang', 'de');
            //<xls:RequestHeader />
            writer.writeElementString('xls:RequestHeader');
            //<xls:Request>
            writer.writeStartElement('xls:Request');
            writer.writeAttributeString('methodName', 'GeocodeRequest');
            writer.writeAttributeString('version', '1.1');
            writer.writeAttributeString('requestID', '00');
            // writer.writeAttributeString('maximumResponses', '15');
            //<xls:GeocodeRequest>
            writer.writeStartElement('xls:GeocodeRequest');
            //<xls:Address>
            writer.writeStartElement('xls:Address');
            writer.writeAttributeString('countryCode', 'en');
            //<xls:freeFormAddress />
            writer.writeElementString('xls:freeFormAddress', str);
            //</xls:Address>
            writer.writeEndElement();
            //</xls:GeocodeRequest>
            writer.writeEndElement();
            //</xls:Request>
            writer.writeEndElement();
            //</xls:XLS>
            writer.writeEndDocument();
            var xmlRequest = writer.flush();
            writer.close();
            return xmlRequest;
        };
        /**
         * generates XML for route request
         * @param {Array.<Object>} routePoints: List of latLng objects
         * @return {String} xmlRequest: XML document
         */
        orsUtilsService.generateRouteXml = function(routePoints) {
            //build request
            var writer = new XMLWriter('UTF-8', '1.0');
            writer.writeStartDocument();
            //<xls:XLS>
            writer.writeElementString('xls:XLS');
            writer.writeAttributeString('xmlns:xls', namespaces.xls);
            writer.writeAttributeString('xsi:schemaLocation', namespaces.schemata.routeService);
            writer.writeAttributeString('xmlns:sch', namespaces.ascc);
            writer.writeAttributeString('xmlns:gml', namespaces.gml);
            writer.writeAttributeString('xmlns:xlink', namespaces.xlink);
            writer.writeAttributeString('xmlns:xsi', namespaces.xsi);
            writer.writeAttributeString('version', '1.1');
            writer.writeAttributeString('xls:lang', 'de');
            //<xls:RequestHeader />
            writer.writeElementString('xls:RequestHeader');
            //<xls:Request>
            writer.writeStartElement('xls:Request');
            writer.writeAttributeString('methodName', 'RouteRequest');
            writer.writeAttributeString('version', '1.1');
            writer.writeAttributeString('requestID', '00');
            writer.writeAttributeString('maximumResponses', '15');
            //<xls:DetermineRouteRequest>
            writer.writeStartElement('xls:DetermineRouteRequest');
            //<xls:RoutePlan>
            writer.writeStartElement('xls:RoutePlan');
            //<xls:RoutePreference />
            writer.writeElementString('xls:RoutePreference', 'Pedestrian');
            writer.writeStartElement('xls:ExtendedRoutePreference');
            writer.writeElementString('xls:WeightingMethod', 'Fastest');
            //</xls:ExtendedRoutePreference>            
            writer.writeEndElement();
            //<xls:WayPointList>
            writer.writeStartElement('xls:WayPointList');
            for (var i = 0; i < routePoints.length; i++) {
                if (i === 0) {
                    writer.writeStartElement('xls:StartPoint');
                } else if (i == (routePoints.length - 1)) {
                    writer.writeStartElement('xls:EndPoint');
                } else {
                    writer.writeStartElement('xls:ViaPoint');
                }
                //<xls:Position>
                writer.writeStartElement('xls:Position');
                //<gml:Point>
                writer.writeStartElement('gml:Point');
                writer.writeAttributeString('xmlns:gml', namespaces.gml);
                //<gml:pos />
                writer.writeStartElement('gml:pos');
                writer.writeAttributeString('srsName', 'EPSG:4326');
                writer.writeString(routePoints[i].lng + ' ' + routePoints[i].lat);
                writer.writeEndElement();
                //</gml:Point>
                writer.writeEndElement();
                //</xls:Position>
                writer.writeEndElement();
                writer.writeEndElement();
            }
            //</xls:WayPointList>
            writer.writeEndElement();
            //</xls:RoutePlan>
            writer.writeEndElement();
            //<xls:RouteInstructionsRequest>
            writer.writeStartElement('xls:RouteInstructionsRequest');
            writer.writeAttributeString('provideGeometry', 'true');
            //</xls:RouteInstructionsRequest>
            writer.writeEndElement();
            //</xls:RouteGeometryRequest>
            writer.writeElementString('xls:RouteGeometryRequest');
            //</xls:DetermineRouteRequest>
            writer.writeEndElement();
            //</xls:Request>
            writer.writeEndElement();
            //</xls:XLS>
            writer.writeEndDocument();
            var xmlRequest = writer.flush();
            writer.close();
            return xmlRequest;
        };
        /**
         * generates XML for reverse geocoding requests
         * @param {Object} position: LatLng Object
         * @return {String} xmlRequest: XML document
         */
        orsUtilsService.reverseXml = function(position) {
            var writer = new XMLWriter('UTF-8', '1.0');
            writer.writeStartDocument();
            //<xls:XLS>
            writer.writeElementString('xls:XLS');
            writer.writeAttributeString('xmlns:xls', namespaces.xls);
            writer.writeAttributeString('xsi:schemaLocation', namespaces.schemata.locationUtilityService);
            writer.writeAttributeString('xmlns:sch', namespaces.ascc);
            writer.writeAttributeString('xmlns:gml', namespaces.gml);
            writer.writeAttributeString('xmlns:xlink', namespaces.xlink);
            writer.writeAttributeString('xmlns:xsi', namespaces.xsi);
            writer.writeAttributeString('version', '1.1');
            writer.writeAttributeString('xls:lang', 'de');
            //<xls:RequestHeader />
            writer.writeElementString('xls:RequestHeader');
            //<xls:Request>
            writer.writeStartElement('xls:Request');
            writer.writeAttributeString('methodName', 'ReverseGeocodeRequest');
            writer.writeAttributeString('version', '1.1');
            writer.writeAttributeString('requestID', '00');
            writer.writeAttributeString('maximumResponses', '15');
            //<xls:ReverseGeocodeRequest>
            writer.writeStartElement('xls:ReverseGeocodeRequest');
            //<xls.Position>
            writer.writeStartElement('xls:Position');
            //<gml:Point>
            writer.writeStartElement('gml:Point');
            writer.writeAttributeString('xmlns:gml', namespaces.gml);
            //<gml:pos>
            writer.writeStartElement('gml:pos');
            writer.writeAttributeString('srsName', 'EPSG:4326');
            writer.writeString(position.lng + ' ' + position.lat);
            //</gml:pos>
            writer.writeEndElement();
            //</gml:Point>
            writer.writeEndElement();
            //</xls:Position>
            writer.writeEndElement();
            //</xls:ReverseGeocodeRequest>
            writer.writeEndElement();
            //</xls:Request>
            writer.writeEndElement();
            //</xls:XLS>
            writer.writeEndDocument();
            var xmlRequest = writer.flush();
            writer.close();
            return xmlRequest;
        };
        /**
         * creates DOM parser to parse string to xml
         * @param {Object} data: Response object
         * @return {Array.<Object>} dom: XML object
         */
        orsUtilsService.domParser = function(data) {
            // parse the XML string
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
        /**
         * parses geocoding response to list of address objects
         * @param {Object} data: Response object
         * @param {Boolean} reverse: Is true if we are dealing with a reverse geocoding response 
         * @return {Array.<Object>} objArray: List of objects containing address and geographic position
         */
        orsUtilsService.processAddresses = function(data, reverse) {
            var outerContainer, innerContainer;
            if (reverse) {
                outerContainer = lists.geocodingContainers.reverse.outer;
                innerContainer = lists.geocodingContainers.reverse.inner;
            } else {
                outerContainer = lists.geocodingContainers.geocoding.outer;
                innerContainer = lists.geocodingContainers.geocoding.inner;
            }
            addressData = [];
            var geocodeResponseList = orsUtilsService.getElementsByTagNameNS(data, namespaces.xls, outerContainer);
            angular.forEach(geocodeResponseList, function(geocodeResponse) {
                allAddress = orsUtilsService.getElementsByTagNameNS(geocodeResponse, namespaces.xls, innerContainer);
                angular.forEach(allAddress, function(xmlAddressContainer) {
                    var xmlAddress = orsUtilsService.getElementsByTagNameNS(xmlAddressContainer, namespaces.xls, 'Address')[0];
                    var address = orsUtilsService.parseAddress(xmlAddress);
                    var shortAddress = orsUtilsService.parseAddressShort(xmlAddress)[0];
                    var xmlAddressPosition = orsUtilsService.getElementsByTagNameNS(xmlAddressContainer, namespaces.gml, 'Point')[0];
                    var position = orsUtilsService.parseAddressPosition(xmlAddressPosition);
                    var addressContainer = {
                        address: address,
                        position: position,
                        shortAddress: shortAddress
                    };
                    addressData.push(addressContainer);
                });
            });
            console.log('addressData', addressData)
            return addressData;
        };
        /**
         * parses geocoding response to address
         * @param {Object} xmlAddress: Response object
         * @return {Array.<Object>} objArray: List of objects containig address and geographic position
         */
        orsUtilsService.parseAddress = function(xmlAddress) {
            var streetline;
            if (!xmlAddress) {
                return;
            }
            var element = '';
            var v1 = orsUtilsService.getElementsByTagNameNS(xmlAddress, namespaces.xls, 'StreetAddress');
            var StreetAddress = null;
            if (v1 !== null && v1 !== undefined) {
                StreetAddress = v1[0];
            }
            var hasStreetElement = false;
            if (StreetAddress !== null && StreetAddress !== undefined) {
                var Streets = orsUtilsService.getElementsByTagNameNS(StreetAddress, namespaces.xls, 'Street');
                var Building = orsUtilsService.getElementsByTagNameNS(StreetAddress, namespaces.xls, 'Building')[0];
                //Building line
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
                //Street line
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
            var places = orsUtilsService.getElementsByTagNameNS(xmlAddress, namespaces.xls, 'Place');
            var regionList = ['MunicipalitySubdivision', 'Municipality', 'CountrySecondarySubdivision', 'CountrySubdivision', 'Country'];
            if (places) {
                var elemCountry = null;
                var elemMunicipalitySubdivision = null;
                var elemMunicipality = null;
                var elemCountrySecondarySubdivision = null;
                var elemCountrySubdivision = null;
                //insert the value of each of the following attributes in order, if they are present
                angular.forEach(regionList, function(type) {
                    angular.forEach(places, function(place) {
                        if (place.getAttribute('type') === type) {
                            //Chrome, Firefox: place.textContent; IE: place.text
                            var content = place.textContent || place.text;
                            if (content !== undefined || content !== null) {
                                if (type == 'MunicipalitySubdivision') elemMunicipalitySubdivision = content;
                                else if (type == 'Municipality') elemMunicipality = content;
                                else if (type == 'CountrySecondarySubdivision') elemCountrySecondarySubdivision = content;
                                else if (type == 'CountrySubdivision') elemCountrySubdivision = content;
                                else if (type == 'Country') elemCountry = content;
                            }
                        }
                    });
                });
                var placesText = '';
                if (hasStreetElement) {
                    var postalCode = orsUtilsService.getElementsByTagNameNS(xmlAddress, namespaces.xls, 'PostalCode');
                    if (postalCode[0]) {
                        placesText = placesText + postalCode[0].textContent + '  ';
                    }
                    if (elemMunicipality) placesText = placesText + elemMunicipality;
                    if (elemMunicipalitySubdivision && elemMunicipalitySubdivision != elemMunicipality) placesText = placesText + ' (' + elemMunicipalitySubdivision + ') ';
                    placesText = placesText + ', ';
                } else {
                    if (elemMunicipalitySubdivision) placesText = placesText + elemMunicipalitySubdivision + ', ';
                    if (elemMunicipality && elemMunicipality != elemMunicipalitySubdivision) placesText = placesText + elemMunicipality + ', ';
                }
                if (elemCountrySecondarySubdivision && elemCountrySecondarySubdivision != elemMunicipality) placesText = placesText + elemCountrySecondarySubdivision + ', ';
                if (elemCountrySubdivision && elemCountrySubdivision != elemCountrySecondarySubdivision && elemCountrySubdivision != elemMunicipality) placesText = placesText + elemCountrySubdivision + ', ';
                element = element + placesText;
            }
            if (elemCountry) {
                element = element + elemCountry;
            } else {
                console.log(orsUtilsService.getElementsByTagNameNS(xmlAddress, namespaces.xls, 'countryCode'));
                var countryCode = xmlAddress[0].getAttribute('countryCode');
                if (countryCode !== null) {
                    element = element + countryCode.toUpperCase();
                }
            }
            return element;
        };
        /**
         * parses the XML address into short address
         * @param xmlAddress: XML encoded address result 
         * @return: address result in short
         */
        orsUtilsService.parseAddressShort = function(xmlAddress) {
            var prevContent, element = [],
                regionList = ['MunicipalitySubdivision', 'Municipality', 'CountrySecondarySubdivision', 'CountrySubdivision'];
            //1. Address
            //2. District, City, Region
            if (xmlAddress) {
                var streetAddressElement = orsUtilsService.getElementsByTagNameNS(xmlAddress, namespaces.xls, 'StreetAddress');
                var streetAddress = null;
                var placesElement = orsUtilsService.getElementsByTagNameNS(xmlAddress, namespaces.xls, 'Place');
                if (streetAddressElement !== null) {
                    streetAddress = streetAddressElement[0];
                }
                if (streetAddress !== null && streetAddress !== undefined) {
                    element[0] = '';
                    var streets = orsUtilsService.getElementsByTagNameNS(streetAddress, namespaces.xls, 'Street');
                    var building = orsUtilsService.getElementsByTagNameNS(streetAddress, namespaces.xls, 'Building')[0];
                    //Building line
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
                    //Street line
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
                        //insert the value of each of the following attributes in order, if they are present
                        angular.forEach(regionList, function(type) {
                            angular.forEach(placesElement, function(place) {
                                if (place.getAttribute('type') === type) {
                                    //Chrome, Firefox: place.textContent; IE: place.text
                                    var content = place.textContent || place.text;
                                    if (content !== undefined || content !== null) {
                                        // remove doubles, such as city states and cities
                                        if (content != prevContent) {
                                            prevContent = content
                                            element[1] += place.textContent || place.text;
                                            element[1] += ', ';
                                        }
                                    }
                                }
                            });
                        });
                        // remove last comma
                        element[1] = element[1].substring(0, element[1].length - 2);
                    }
                } else if (placesElement !== null) {
                    element[0] = '';
                    //insert the value of each of the following attributes in order, if they are present
                    angular.forEach(regionList, function(type) {
                        angular.forEach(placesElement, function(place) {
                            if (place.getAttribute('type') === type) {
                                //Chrome, Firefox: place.textContent; IE: place.text
                                var content = place.textContent || place.text;
                                if (content !== undefined || content !== null) {
                                    // remove doubles, such as city states and cities
                                    if (content != prevContent) {
                                        prevContent = content;
                                        element[0] += place.textContent || place.text;
                                        element[0] += ', ';
                                    }
                                }
                            }
                        });
                    });
                    // remove last comma
                    element[0] = element[0].substring(0, element[0].length - 2);
                }
            }
            return element;
        };
        /**
         * extracts the position of an address
         * @param xmlAddressPosition: XML encoded address result 
         * @return: address result in short
         */
        orsUtilsService.parseAddressPosition = function(xmlAddressPosition) {
            var element = null;
            if (xmlAddressPosition) {
                element = '';
                var position = orsUtilsService.getElementsByTagNameNS(xmlAddressPosition, namespaces.gml, 'pos')[0];
                position = position.textContent || position.text;
                position = position.split(" ");
                element = L.latLng(position[1], position[0]);
            }
            return element;
        };
        /**
         * Calls the Javascript functions getElementsByTagNameNS or getElementsByTagName according to the browsers capabilities.
         * Chrome and Firefox will be fine with element.getElementsByTagNameNS(ns, tagName), but IE can only cope with element.getElementsByTagName('namespaceTag': tagName)
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
         * parses the routing results of the service to a single 'path'
         * @param results: response of the service
         * @param routeString: Leaflet LineString representing the whole route
         */
        orsUtilsService.writeRouteToSingleLineString = function(results) {
            var routeString = [];
            var routeGeometry = orsUtilsService.getElementsByTagNameNS(results, namespaces.xls, 'RouteGeometry')[0];
            angular.forEach(orsUtilsService.getElementsByTagNameNS(routeGeometry, namespaces.gml, 'pos'), function(point) {
                point = point.text || point.textContent;
                point = point.split(' ');
                // if elevation contained
                if (point.length == 2) {
                    point = L.latLng(point[1], point[0]);
                } else {
                    point = L.latLng(point[1], point[0], point[2]);
                }
                routeString.push(point);
            });
            return routeString;
        };
        /**
         * the line strings represent a part of the route when driving on one street (e.g. 7km on autoroute A7)
         * we examine the lineStrings from the instruction list to get one lineString-ID per route segment so that we can support mouseover/mouseout events on the route and the instructions
         * @param {Object} results: XML response
         */
        orsUtilsService.parseResultsToLineStrings = function(results) {
            var listOfLineStrings = [];
            var heightIdx = 0;
            var routeInstructions = orsUtilsService.getElementsByTagNameNS(results, namespaces.xls, 'RouteInstructionsList')[0];
            if (routeInstructions) {
                routeInstructions = orsUtilsService.getElementsByTagNameNS(routeInstructions, namespaces.xls, 'RouteInstruction');
                $A(routeInstructions).each(function(instructionElement) {
                    var directionCode = orsUtilsService.getElementsByTagNameNS(instructionElement, namespaces.xls, 'DirectionCode')[0];
                    directionCode = directionCode.textContent;
                    //skip directionCode 100 for now
                    if (directionCode == '100') {
                        return;
                    }
                    var segment = [];
                    $A(orsUtilsService.getElementsByTagNameNS(instructionElement, namespaces.gml, 'pos')).each(function(point) {
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
        /**
         * corner points are points in the route where the direction changes (turn right at street xy...)
         * @param {Object} results: XML response
         * @param {Object} converterFunction
         */
        orsUtilsService.parseResultsToCornerPoints = function(results, converterFunction) {
            var listOfCornerPoints = [];
            var routeInstructions = orsUtilsService.getElementsByTagNameNS(results, namespaces.xls, 'RouteInstructionsList')[0];
            if (routeInstructions) {
                routeInstructions = orsUtilsService.getElementsByTagNameNS(routeInstructions, namespaces.xls, 'RouteInstruction');
                $A(routeInstructions).each(function(instructionElement) {
                    var directionCode = orsUtilsService.getElementsByTagNameNS(instructionElement, namespaces.xls, 'DirectionCode')[0];
                    directionCode = directionCode.textContent;
                    //skip directionCode 100 for now
                    if (directionCode == '100') {
                        return;
                    }
                    var point = orsUtilsService.getElementsByTagNameNS(instructionElement, namespaces.gml, 'pos')[0];
                    point = point.text || point.textContent;
                    point = point.split(' ');
                    point = L.latLng(point[1], point[0]);
                    // point = converterFunction(point);
                    listOfCornerPoints.push(point);
                });
            }
            return listOfCornerPoints;
        };
        /**
         * Returns summary of the route
         * @param {Object} results: XML response
         */
        orsUtilsService.parseRouteSummary = function(results) {
            var yardsUnit, ascentValue, ascentUnit, descentValue, descentUnit, ascentArr, descentArr, totalTimeArr = [],
                distArr = [],
                actualdistArr = [],
                routeSummary = {};
            var summaryElement = orsUtilsService.getElementsByTagNameNS(results, namespaces.xls, 'RouteSummary')[0];
            var totalTime = orsUtilsService.getElementsByTagNameNS(summaryElement, namespaces.xls, 'TotalTime')[0];
            totalTime = totalTime.textContent || totalTime.text;
            //<period>PT 5Y 2M 10D 15H 18M 43S</period>
            //The example above indicates a period of five years, two months, 10 days, 15 hours, a8 minutes and 43 seconds
            totalTime = totalTime.replace('P', '');
            totalTime = totalTime.replace('T', '');
            totalTime = totalTime.replace('D', 'days');
            totalTime = totalTime.replace('H', 'hr');
            totalTime = totalTime.replace('M', 'min');
            totalTime = totalTime.replace('S', 'seconds');
            totalTime = totalTime.match(/(\d+|[^\d]+)/g).join(',');
            totalTime = totalTime.split(',');
            routeSummary.time = totalTime;
            // get distance
            var distance = orsUtilsService.getElementsByTagNameNS(summaryElement, namespaces.xls, 'TotalDistance')[0];
            var distanceValue = distance.getAttribute('value');
            var distanceUnit = distance.getAttribute('uom');
            //use mixture of km and m
            distArr = orsUtilsService.convertDistanceFormat(distanceValue, lists.distanceUnits[0]);
            routeSummary.distance = distArr;
            // get actual distance
            var actualDistance = orsUtilsService.getElementsByTagNameNS(summaryElement, namespaces.xls, 'ActualDistance')[0];
            if (actualDistance !== undefined) {
                var actualDistanceValue = actualDistance.getAttribute('value');
                var actualDistanceUnit = actualDistance.getAttribute('uom');
                //use mixture of km and m
                actualdistArr = orsUtilsService.convertDistanceFormat(actualDistanceValue, lists.distanceUnits[0]);
                routeSummary.actualDistance = actualdistArr;
            }
            // get ascent descent summary
            var ascent = orsUtilsService.getElementsByTagNameNS(results, namespaces.xls, 'Ascent')[0];
            var descent = orsUtilsService.getElementsByTagNameNS(results, namespaces.xls, 'Descent')[0];
            if (ascent !== undefined) {
                ascentValue = ascent.getAttribute('value');
                ascentUnit = ascent.getAttribute('uom');
                //use mixture of km and m
                ascentArr = orsUtilsService.convertDistanceFormat(ascentValue, lists.distanceUnits[0]);
                routeSummary.ascent = ascentArr;
            }
            if (descent !== undefined) {
                descentValue = descent.getAttribute('value');
                descentUnit = descent.getAttribute('uom');
                //use mixture of km and m
                descentArr = orsUtilsService.convertDistanceFormat(descentValue, lists.distanceUnits[0]);
                routeSummary.descent = descentArr;
            }
            return routeSummary;
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
         * rounds a given distance to an appropriate number of digits
         * @distane: number to round
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
        return orsUtilsService;
    }
]);