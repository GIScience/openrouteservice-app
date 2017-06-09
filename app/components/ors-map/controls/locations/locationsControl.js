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
                                      <div class="four wide column category" ng-repeat="(category, obj) in categories">
                                        <div ng-click="toggleSubcategories(category)">
                                            <span tooltip-side="top" tooltip-template="{{(obj.name | translate)}}" tooltips="" ng-bind-html="categoryIcons[category]">
                                            </span>
                                        </div>
                                        <div class="category-checkbox">
                                            <input type="checkbox" ng-model="obj.selected" ng-click="setSubcategories(category)" indeterminate/>
                                            <!--{{obj.selected}}-->    
                                        </div>
                                      </div>
                                    </div>
                                </div>
                            </div>
                            <div class="sub-categories" ng-show="showSubcategories">
                                <div class="sc-nav">
                                    <div ng-click="toggleSubcategories()">
                                        <i class="fa fa-arrow-left"></i>
                                    </div>
                                    <div>info</div>
                                </div>
                                <div class="sc-list">
                                    <ul>
                                        <li ng-repeat="(scId, scObj) in categories[selectedCategoryId].subCategories">
                                            <div class="ui checkbox">
                                                <input id="{{scId}}" name="subcategory" ng-change="verifySubcategory(selectedCategoryId)" ng-model="scObj.selected" type="checkbox">
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
                           <div class="ui right labeled fluid input ors-input">
                                <input ng-model="$ctrl.waypoint._address" placeholder="{{$ctrl.getPlaceholder()}}" select-on-click="" type="text">
                                    <div class="ui basic label">
                                        <button class="tiny ui basic button ors-control-button" ng-click="$ctrl.delete()">
                                            <i class="fa fa-search">
                                            </i>
                                        </button>
                                    </div>
                                </input>
                            </div>
                        </div>
                        <div class="result-list">3</div>
                     </div>
                     `,
    controllerAs: 'leaflet',
    controller: function($scope, $element, $map, lists) {
        const lControl = angular.element(document.querySelector('.angular-control-leaflet'))
            .addClass('leaflet-bar')[0];
        if (!L.Browser.touch) {
            L.DomEvent.disableClickPropagation(lControl)
                .disableScrollPropagation(lControl);
        } else {
            L.DomEvent.disableClickPropagation(lControl)
                .disableScrollPropagation(lControl);
        }
        $scope.categoryIcons = {
            100: '<i class="fa fa-lg fa-hotel"></i>',
            120: '<i class="fa fa-lg fa-paw"></i>',
            130: '<i class="fa fa-lg fa-paint-brush"></i>',
            150: '<i class="fa fa-lg fa-university"></i>',
            160: '<i class="fa fa-lg fa-building"></i>',
            190: '<i class="fa fa-lg fa-bank"></i>',
            200: '<i class="fa fa-lg fa-hospital-o"></i>',
            220: '<i class="fa fa-lg fa-history"></i>',
            260: '<i class="fa fa-lg fa-video-camera"></i>',
            330: '<i class="fa fa-lg fa-tree"></i>',
            360: '<i class="fa fa-lg fa-map-signs"></i>',
            390: '<i class="fa fa-lg fa-shield"></i>',
            420: '<i class="fa fa-lg fa-shopping-cart"></i>',
            560: '<i class="fa fa-lg fa-map-marker"></i>',
            580: '<i class="fa fa-lg fa-bus"></i>',
            620: '<i class="fa fa-lg fa-suitcase"></i>',
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
            } else if (cnt > 0 && cnt < scLength - 1) {
                $scope.categories[selectedCategoryId].selected = '';
                $scope.isIntermediate = true;
            } else {
                $scope.categories[selectedCategoryId].selected = false;
                $scope.isIntermediate = false;
            }
            console.log($scope.categories[selectedCategoryId])
        };
        $scope.setSubcategories = function(categoryId) {
            console.log($scope.categories[categoryId], $scope.categories[categoryId].subCategories, $scope.isIntermediate)
            angular.forEach($scope.categories[categoryId].subCategories, (subCategoryObj, subCategoryId) => {
                if ($scope.isIntermediate) {
                    subCategoryObj.selected = false;
                } else {
                    subCategoryObj.selected = $scope.categories[categoryId].selected;
                }
            });
            $scope.isIntermediate = false;
        };
        $scope.toggleSubcategories = function(categoryId) {
            if (categoryId) $scope.selectedCategoryId = categoryId;
            $scope.showSubcategories = $scope.showSubcategories === true ? false : true;
        };
        // create categories object
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
        // intermediate state is need as tri-state checkbox
        $scope.isIntermediate = false;
        $scope.show = true;
        $scope.showSubcategories = false;
        this.message = "dude";
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