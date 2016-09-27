angular.module('orsApp.ors-options', []).component('orsOptions', {
    templateUrl: 'app/components/ors-panel-routing/ors-options/ors-options.html',
    bindings: {
        activeMenu: '<',
        showOptions: '<'
    },
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService, $scope, $timeout) {
        var ctrl = this;
        console.log('showoptions', ctrl.showOptions)
        ctrl.optionList = lists.optionList;
        ctrl.$onInit = function() {
            ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
            // set weight slider from params
            if (ctrl.currentOptions.weight) {
                ctrl.weightValue = ctrl.currentOptions.weight;
            } else {
                ctrl.weightValue = ctrl.optionList.weight.Fastest;
            }
            ctrl.weightSlider = {
                value: ctrl.weightValue,
                options: {
                    stepsArray: [{
                        value: ctrl.optionList.weight.Fastest.value,
                        legend: ctrl.optionList.weight.Fastest.value
                    }, {
                        value: ctrl.optionList.weight.Shortest.value,
                        legend: ctrl.optionList.weight.Shortest.value
                    }, {
                        value: ctrl.optionList.weight.Recommended.value,
                        legend: ctrl.optionList.weight.Recommended.value
                    }],
                    showTicks: true,
                    showTicksValues: false,
                    hidePointerLabels: true,
                    hideLimitLabels: true,
                    onChange: function() {
                        console.log('change')
                        ctrl.currentOptions.weight = ctrl.weightSlider.value;
                        ctrl.changeOptions();
                    }
                }
            };
            // set maxspeed slider from params
            ctrl.maxspeedOptions = ctrl.optionList.maxspeeds[ctrl.activeMenu];
            if (ctrl.currentOptions.maxspeed) {
                ctrl.maxspeedValue = ctrl.currentOptions.maxspeed;
            } else {
                ctrl.maxspeedValue = ctrl.maxspeedOptions.min;
            }
            ctrl.maxspeedSlider = {
                value: ctrl.maxspeedValue,
                options: {
                    floor: ctrl.maxspeedOptions.min,
                    ceil: ctrl.maxspeedOptions.max,
                    step: ctrl.maxspeedOptions.step,
                    translate: function(value) {
                        return value + ' <b>km/h</b>';
                    },
                    onChange: function() {
                        ctrl.currentOptions.maxspeed = ctrl.maxspeedSlider.value;
                        ctrl.changeOptions();
                    }
                }
            };
            ctrl.heightValue = ctrl.currentOptions.height ? ctrl.currentOptions.height : ctrl.optionList.hgvParams.Height.min;
            ctrl.widthValue = ctrl.currentOptions.width ? ctrl.currentOptions.width : ctrl.optionList.hgvParams.Width.min;
            ctrl.lengthValue = ctrl.currentOptions.length ? ctrl.currentOptions.length : ctrl.optionList.hgvParams.Length.min;
            ctrl.hgvWeightValue = ctrl.currentOptions.hgvWeight ? ctrl.currentOptions.hgvWeight : ctrl.optionList.hgvParams.Weight.min;
            ctrl.axleloadValue = ctrl.currentOptions.axleload ? ctrl.currentOptions.axleload : ctrl.optionList.hgvParams.AxleLoad.min;
            
            console.log(ctrl.heightValue,ctrl.widthValue,ctrl.lengthValue,ctrl.hgvWeightValue,ctrl.axleloadValue)

            ctrl.hgvSliders = {
                Height: {
                    value: ctrl.heightValue,
                    options: {
                        floor: ctrl.optionList.hgvParams.Height.min,
                        ceil: ctrl.optionList.hgvParams.Height.max,
                        translate: function(value) {
                            return value + ' <b>m</b>';
                        },
                        onChange: function() {
                            ctrl.currentOptions.heightValue = ctrl.hgvSliders.Height.value;
                            ctrl.changeOptions();
                        }
                    }
                },
                Length: {
                    value: ctrl.lengthValue,
                    options: {
                        floor: ctrl.optionList.hgvParams.Length.min,
                        ceil: ctrl.optionList.hgvParams.Length.max,
                        translate: function(value) {
                            return value + ' <b>m</b>';
                        },
                        onChange: function() {
                            ctrl.currentOptions.lengthValue = ctrl.hgvSliders.Length.value;
                            ctrl.changeOptions();
                        }
                    }
                },
                Width: {
                    value: ctrl.widthValue,
                    options: {
                        floor: ctrl.optionList.hgvParams.Width.min,
                        ceil: ctrl.optionList.hgvParams.Width.max,
                        translate: function(value) {
                            return value + ' <b>m</b>';
                        },
                        onChange: function() {
                            ctrl.currentOptions.widthValue = ctrl.hgvSliders.Width.value;
                            ctrl.changeOptions();
                        }
                    }
                },
                AxleLoad: {
                    value: ctrl.axleloadValue,
                    options: {
                        floor: ctrl.optionList.hgvParams.AxleLoad.min,
                        ceil: ctrl.optionList.hgvParams.AxleLoad.max,
                        translate: function(value) {
                            return value + ' <b>t</b>';
                        },
                        onChange: function() {
                            ctrl.currentOptions.axleloadValue = ctrl.hgvSliders.AxleLoad.value;
                            ctrl.changeOptions();
                        }
                    }
                },
                Weight: {
                    value: ctrl.hgvWeightValue,
                    options: {
                        floor: ctrl.optionList.hgvParams.Weight.min,
                        ceil: ctrl.optionList.hgvParams.Weight.max,
                        translate: function(value) {
                            return value + ' <b>t</b>';
                        },
                        onChange: function() {
                            ctrl.currentOptions.hgvWeightValue = ctrl.hgvSliders.Weight.value;
                            ctrl.changeOptions();
                        }
                    }
                }
            };
            console.log('done')
        };
        ctrl.$onChanges = function(changesObj) {
            if (changesObj.showOptions) ctrl.refreshSlider();
            if (changesObj.activeMenu) {
                ctrl.maxspeedOptions = ctrl.optionList.maxspeeds[ctrl.activeMenu];
                // check if already initiated
                if (ctrl.maxspeedSlider) {
                    ctrl.maxspeedSlider.value = ctrl.maxspeedOptions.min;
                    ctrl.maxspeedSlider.options.floor = ctrl.maxspeedOptions.min;
                    ctrl.maxspeedSlider.options.ceil = ctrl.maxspeedOptions.max;
                    ctrl.maxspeedSlider.options.step = ctrl.maxspeedOptions.step;
                }
            }
            console.log(ctrl.maxspeedOptions)
        };
        ctrl.changeOptions = function() {
            // call setoptions
            console.log(ctrl.currentOptions);
        };
        ctrl.getClass = (bool) => {
            if (bool === true) return "fa fa-lg fa-fw fa-caret-up";
            else return "fa fa-lg fa-fw fa-caret-down";
        };
        ctrl.refreshSlider = function() {
            $timeout(function() {
                console.log('force rendering')
                $scope.$broadcast('rzSliderForceRender');
            });
        };
    }
});