// locations control
let locationsControl = L.control.angular({
    position: 'topright',
    template: `
                     <a ng-click="show = !show" class="leaflet-locations">
                     </a>
                     <div ng-show="show" class="locations">
                        <div>
                            <div class="categories" ng-show="!showSubcategories">
                                <div class="c-nav">
                                    <div>Locations</div>
                                    <div ng-click="show = !show">
                                        <i class="fa fa-remove"></i>
                                    </div>
                                </div>
                                <div class="c-list">
                                    <div class="ui grid">
                                      <div class="four wide column category" ng-repeat="(category, obj) in categories" ng-click="toggleSubcategories(category)">
                                        <div tooltip-side="top" tooltip-template="{{(obj.name | translate)}}" tooltips="" ng-bind-html="categoryIcons[category]">
                                        </div>
                                        <div class="category-checkbox">
                                            <input type="checkbox" ng-model="obj.selected" ng-click="setSubcategories(category); $event.stopPropagation();" indeterminate/>
                                            <!--{{obj.selected}}-->    
                                        </div>
                                      </div>
                                    </div>
                                </div>
                            </div>
                            <div class="sub-categories" ng-show="showSubcategories">
                                <div class="sc-nav">
                                    <div ng-click="toggleSubcategories()">
                                        <i class="fa fa-lg fa-arrow-left"></i>
                                    </div>
                                    <div>
                                        <div class="ui compact menu">
                                          <div class="ui simple dropdown item">
                                            Categories
                                            <i class="dropdown icon"></i>
                                            <div class="menu">
                                              <div class="item" ng-repeat="(category, obj) in categories" ng-click="selectCategory(category);">{{obj.name}}</div>
                                            </div>
                                          </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="sc-list">
                                    <ul>
                                        <li ng-repeat="(scId, scObj) in categories[selectedCategoryId].subCategories">
                                            <div class="ui checkbox">
                                                <input id="{{scId}}" name="subcategory" ng-click="verifySubcategory(selectedCategoryId)" ng-model="scObj.selected" type="checkbox">
                                                    <label for="{{scId}}" ng-bind-html="(scObj.name | translate)">
                                                    </label>
                                                </input>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="search-input">
                           <div class="ui fluid action input">
                                <input ng-model="namefilter" placeholder="{{getPlaceholder()}}" select-on-click="" type="text">  
                                </input>
                                <div ng-class="{'ui primary button': !loading, 'ui primary loading button': loading, 'ui primary disabled button': disabled}" ng-click="callLocations();">Search</div>
                            </div>
                        </div>
                        <div class="result-list" ng-show="results.length > 0">
                            <div class="poi-items">
                                <div class="poi-item" ng-repeat="feature in results" ng-click="panTo(feature.geometry.coordinates);" ng-mouseout="DeEmphPoi();" ng-mouseover="EmphPoi(feature.geometry.coordinates, feature.properties.category);">
                                    <div class="poi-row">
                                        <div class="icon" ng-bind-html='categoryIcons[subcategoriesLookup[feature.properties.category]]'></div>
                                        <div class="text" ng-bind-html='feature.properties.name'></div>   
                                        <div class="icon pointer" ng-click="poiDetails = !poiDetails; $event.stopPropagation();" ng-show='feature.properties.address || feature.properties.phone || feature.properties.wheelchair || feature.properties.website'>
                                            <div tooltip-side="left" tooltip-template="{{('DETAILS' | translate)}}" tooltips="">
                                                <i ng-class="getClass(poiDetails)" >
                                                </i>
                                            </div>  
                                        </div>
                                        <div class="icon pointer">
                                             <div tooltip-side="left" tooltip-template="OSM" tooltips="">
                                                <a target="_blank" ng-href="{{makeUrl(feature.properties.osm_id)}}">
                                                    <i class="fa fa-map">
                                                    </i>
                                                </a> 
                                            </div>  
                                        </div>
                                    </div>
                                    <div class="collapsable poi-details" ng-class="{ showMe: poiDetails }">    
                                        <div class="poi-row" ng-if="feature.properties.address">
                                            <div class="icon">
                                                <i class="fa fa-address-card"></i>
                                            </div>

                                            <div class="text">
                                                <span ng-repeat="(addressItem, addressObj) in feature.properties.address" ng-bind-html="addressObj + ', '"></span>
                                            </div>                                        
                                        </div>
                                         <div class="poi-row" ng-if="feature.properties.phone">
                                            <div class="icon">
                                                <i class="fa fa-phone"></i>
                                            </div>
                                            <div class="text" ng-bind-html='feature.properties.phone'></div>                                        
                                        </div>
                                         <div class="poi-row" ng-if="feature.properties.website">
                                            <div class="icon">
                                                <i class="fa fa-globe"></i>
                                            </div> 
                                            <div class="text" ng-bind-html="feature.properties.website">
                                            </div>
                                        </div>
                                        <div class="poi-row" ng-if="feature.properties.wheelchair">
                                             <div ng-if="feature.properties.wheelchair">
                                                <i class="fa fa-wheelchair-alt"></i>
                                            </div>                                       
                                        </div> 
                                    </div> 
                                </div>
                            </div>     
                        </div>
                     </div>
                     `,
    controllerAs: 'leaflet',
    controller: function($scope, $element, $map, lists, orsUtilsService, orsLocationsService, $timeout) {
        const lControl = angular.element(document.querySelector('.angular-control-leaflet'))
            .addClass('leaflet-bar')[0];
        if (!L.Browser.touch) {
            L.DomEvent.disableClickPropagation(lControl)
                .disableScrollPropagation(lControl);
        } else {
            L.DomEvent.disableClickPropagation(lControl)
                .disableScrollPropagation(lControl);
        }
        $scope.getClass = (bool) => {
            if (bool === true) return "fa fa-minus";
            else return "fa fa-plus";
        };
        $scope.makeUrl = (osmId) => {
            return "http://www.openstreetmap.org/node/" + osmId;
        };
        $scope.callLocations = () => {
            $scope.loading = true;
            settings = {
                categories: [],
                subCategories: []
            };
            angular.forEach($scope.categories, function(cObj, index) {
                if (cObj.selected === true) {
                    settings.categories.push(index);
                }
                if (cObj.selected.length === 0) {
                    angular.forEach(cObj.subCategories, function(scObj, index) {
                        console.log(scObj)
                        if (scObj.selected) {
                            console.log(index)
                            settings.subCategories.push(index);
                        }
                    });
                }
            });
            if ($scope.namefilter && $scope.namefilter.length > 0) settings.nameFilter = $scope.namefilter;
            settings.bbox = $map.getBounds()
                .toBBoxString();
            orsLocationsService.clear();
            const payload = orsUtilsService.locationsPayload(settings);
            const request = orsLocationsService.fetchLocations(payload);
            orsLocationsService.requests.push(request);
            request.promise.then(function(response) {
                // parse address string to json object
                angular.forEach(response.features, function(feature) {
                    if (feature.properties.address) feature.properties.address = JSON.parse(feature.properties.address);
                });
                orsLocationsService.addLocationsToMap(response);
                $scope.results = response.features;
                $scope.loading = false;
            }, function(response) {
                console.error(response);
                $scope.loading = false;
            });
        };
        $scope.categoryIcons = lists.locations_icons;
        $scope.getPlaceholder = () => {
            // get set lang
            return 'Optional filter, e.g. shell*';
        };
        $scope.selectCategory = (id) => {
            $scope.selectedCategoryId = id;
        };
        $scope.verifySubcategory = (selectedCategoryId) => {
            let cnt = 0;
            angular.forEach($scope.categories[selectedCategoryId].subCategories, (subCategoryObj, subCategoryId) => {
                if (subCategoryObj.selected) cnt += 1;
            });
            const scLength = Object.keys($scope.categories[selectedCategoryId].subCategories)
                .length;
            if (cnt == scLength) {
                $scope.categories[selectedCategoryId].selected = true;
                $scope.isIntermediate = false;
            } else if (cnt > 0 && cnt < scLength) {
                $scope.categories[selectedCategoryId].selected = '';
                $scope.isIntermediate = true;
            } else {
                $scope.categories[selectedCategoryId].selected = false;
                $scope.isIntermediate = false;
            }
            // wait for intermediate directive to execute, next cycle
            $timeout(function() {
                $scope.isAnySelected();
            }, 0);
        };
        $scope.setSubcategories = function(categoryId) {
            angular.forEach($scope.categories[categoryId].subCategories, (subCategoryObj, subCategoryId) => {
                if ($scope.isIntermediate) {
                    subCategoryObj.selected = false;
                } else {
                    subCategoryObj.selected = $scope.categories[categoryId].selected;
                }
            });
            $scope.isIntermediate = false;
            // wait for intermediate directive to execute, next cycle
            $timeout(function() {
                $scope.isAnySelected();
            }, 0);
        };
        //10 seconds delay
        $scope.isAnySelected = () => {
            let active = false;
            angular.forEach($scope.categories, (categoryObj, categoryName) => {
                if (categoryObj.selected || categoryObj.selected.length === 0) {
                    active = true;
                }
            });
            if (active) $scope.disabled = false;
            else $scope.disabled = true;
        };
        $scope.toggleSubcategories = function(categoryId) {
            if (categoryId) $scope.selectedCategoryId = categoryId;
            $scope.showSubcategories = $scope.showSubcategories === true ? false : true;
        };
        $scope.EmphPoi = (geometry, category) => {
            console.log('emph')
            orsLocationsService.emphPoi(geometry, category);
        };
        $scope.DeEmphPoi = () => {
            orsLocationsService.DeEmphPoi();
        };
        $scope.panTo = (geometry) => {
            orsLocationsService.panTo(geometry);

        };
        $scope.onInit = () => {
            $scope.loading = true;
            const payload = orsUtilsService.locationsCategoryPayload();
            const request = orsLocationsService.fetchLocations(payload);
            request.promise.then(function(response) {
                // intermediate state is needed as we are using a tri-state checkbox
                $scope.loading = $scope.showSubcategories = $scope.isIntermediate = false;
                $scope.show = $scope.disabled = true;
                $scope.categories = {};
                $scope.subcategoriesLookup = {};
                angular.forEach(response.categories, (categoryObj, categoryName) => {
                    let subCategories = {};
                    angular.forEach(categoryObj.values, (subCategoryId, subCategoryName) => {
                        $scope.subcategoriesLookup[subCategoryId] = categoryObj.id;
                        subCategories[subCategoryId] = {
                            name: subCategoryName,
                            selected: false,
                        };
                    });
                    $scope.categories[categoryObj.id] = {
                        name: categoryName,
                        selected: false,
                        subCategories: subCategories
                    };
                });
                orsLocationsService.setSubcategoriesLookup($scope.subcategoriesLookup);
            }, function(response) {
                console.error(response);
                $scope.loading = false;
            });
        };
        $scope.onInit();
    }
});