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
                        <div class="result-list">3</div>
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
                orsLocationsService.addLocationsToMap(response);
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
        // create categories object
        $scope.onInit = () => {};
        $scope.categories = {};
        angular.forEach(lists.locations.categories, (categoryObj, categoryName) => {
            let subCategories = {};
            angular.forEach(categoryObj.values, (subCategoryId, subCategoryName) => {
                subCategories[subCategoryId] = {
                    name: subCategoryName,
                    selected: false
                };
            });
            $scope.categories[categoryObj.id] = {
                name: categoryName,
                selected: false,
                subCategories: subCategories
            };
        });
        var that = this;
        // intermediate state is needed as we are using a tri-state checkbox
        $scope.isIntermediate = false;
        $scope.show = true;
        $scope.showSubcategories = false;
        $scope.disabled = true;
        this.latlng = null;
        this.zoom = function() {
            $map.zoomIn();
        };
        $map.on('click', function(e) {
            that.latlng = e.latlng;
            $scope.$apply();
        });
    }
});