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
            console.log(ctrl.currentOptions);
            // set weight slider from params
            ctrl.currentOptions.weight = ctrl.currentOptions.weight !== undefined ? ctrl.currentOptions.weight : ctrl.optionList.weight.Fastest;
            ctrl.weightSlider = {
                value: ctrl.currentOptions.weight,
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
            ctrl.currentOptions.maxspeed = ctrl.currentOptions.maxspeed !== undefined ? ctrl.currentOptions.maxspeed : ctrl.maxspeedOptions.min;
            ctrl.maxspeedSlider = {
                value: ctrl.currentOptions.maxspeed,
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
            // set hgv options from params
            ctrl.currentOptions.height = ctrl.currentOptions.height !== undefined ? ctrl.currentOptions.height : ctrl.optionList.hgvParams.Height.min;
            ctrl.currentOptions.width = ctrl.currentOptions.width !== undefined ? ctrl.currentOptions.width : ctrl.optionList.hgvParams.Width.min;
            ctrl.currentOptions.length = ctrl.currentOptions.length !== undefined ? ctrl.currentOptions.length : ctrl.optionList.hgvParams.Length.min;
            ctrl.currentOptions.hgvWeight = ctrl.currentOptions.hgvWeight !== undefined ? ctrl.currentOptions.hgvWeight : ctrl.optionList.hgvParams.Weight.min;
            ctrl.currentOptions.axleload = ctrl.currentOptions.axleload !== undefined ? ctrl.currentOptions.axleload : ctrl.optionList.hgvParams.AxleLoad.min;
            ctrl.hgvSliders = {
                Height: {
                    value: ctrl.currentOptions.height,
                    options: {
                        floor: ctrl.optionList.hgvParams.Height.min,
                        ceil: ctrl.optionList.hgvParams.Height.max,
                        translate: function(value) {
                            return value + ' <b>m</b>';
                        },
                        onChange: function() {
                            ctrl.currentOptions.height = ctrl.hgvSliders.Height.value;
                            ctrl.changeOptions();
                        }
                    }
                },
                Length: {
                    value: ctrl.currentOptions.length,
                    options: {
                        floor: ctrl.optionList.hgvParams.Length.min,
                        ceil: ctrl.optionList.hgvParams.Length.max,
                        translate: function(value) {
                            return value + ' <b>m</b>';
                        },
                        onChange: function() {
                            ctrl.currentOptions.length = ctrl.hgvSliders.Length.value;
                            ctrl.changeOptions();
                        }
                    }
                },
                Width: {
                    value: ctrl.currentOptions.width,
                    options: {
                        floor: ctrl.optionList.hgvParams.Width.min,
                        ceil: ctrl.optionList.hgvParams.Width.max,
                        translate: function(value) {
                            return value + ' <b>m</b>';
                        },
                        onChange: function() {
                            ctrl.currentOptions.width = ctrl.hgvSliders.Width.value;
                            ctrl.changeOptions();
                        }
                    }
                },
                AxleLoad: {
                    value: ctrl.currentOptions.axleload,
                    options: {
                        floor: ctrl.optionList.hgvParams.AxleLoad.min,
                        ceil: ctrl.optionList.hgvParams.AxleLoad.max,
                        translate: function(value) {
                            return value + ' <b>t</b>';
                        },
                        onChange: function() {
                            ctrl.currentOptions.axleload = ctrl.hgvSliders.AxleLoad.value;
                            ctrl.changeOptions();
                        }
                    }
                },
                Weight: {
                    value: ctrl.currentOptions.hgvWeight,
                    options: {
                        floor: ctrl.optionList.hgvParams.Weight.min,
                        ceil: ctrl.optionList.hgvParams.Weight.max,
                        translate: function(value) {
                            return value + ' <b>t</b>';
                        },
                        onChange: function() {
                            ctrl.currentOptions.hgvWeight = ctrl.hgvSliders.Weight.value;
                            ctrl.changeOptions();
                        }
                    }
                }
            };
            // Difficulty settings
            ctrl.currentOptions.fitness = ctrl.currentOptions.fitness !== undefined ? ctrl.optionList.difficulty.fitness[ctrl.currentOptions.fitness].value : ctrl.optionList.difficulty.fitness.Default.value;
            ctrl.currentOptions.steepness = ctrl.currentOptions.steepness !== undefined ? ctrl.currentOptions.steepness : ctrl.optionList.difficulty.steepness.min;
            ctrl.avoidHillsCheckbox();
            ctrl.difficultySliders = {
                Fitness: {
                    value: ctrl.currentOptions.fitness,
                    options: {
                        stepsArray: [{
                            value: ctrl.optionList.difficulty.fitness.Default.value,
                            legend: ctrl.optionList.difficulty.fitness.Default.name
                        }, {
                            value: ctrl.optionList.difficulty.fitness.Novice.value,
                            legend: ctrl.optionList.difficulty.fitness.Novice.name
                        }, {
                            value: ctrl.optionList.difficulty.fitness.Amateur.value,
                            legend: ctrl.optionList.difficulty.fitness.Amateur.name
                        }, {
                            value: ctrl.optionList.difficulty.fitness.Athlete.value,
                            legend: ctrl.optionList.difficulty.fitness.Athlete.name
                        }, {
                            value: ctrl.optionList.difficulty.fitness.Pro.value,
                            legend: ctrl.optionList.difficulty.fitness.Pro.name
                        }],
                        showTicks: true,
                        showTicksValues: false,
                        hidePointerLabels: true,
                        hideLimitLabels: true,
                        onChange: function() {
                            ctrl.currentOptions.fitness = ctrl.difficultySliders.Fitness.value;
                            ctrl.changeOptions();
                            ctrl.avoidHillsCheckbox();
                        }
                    }
                },
                Steepness: {
                    value: ctrl.currentOptions.steepness,
                    options: {
                        floor: ctrl.optionList.difficulty.steepness.min,
                        ceil: ctrl.optionList.difficulty.steepness.max,
                        translate: function(value) {
                            return value + ' <b>%</b>';
                        },
                        onChange: function() {
                            ctrl.currentOptions.steepness = ctrl.difficultySliders.Steepness.value;
                            ctrl.changeOptions();
                        }
                    }
                }
            };
        };
        ctrl.avoidHillsCheckbox = () => {
            let avoidhillsCheckbox = angular.element(document.querySelector('#cb-avoidhills'));
            let avoidhillsCheckboxInput = angular.element(document.querySelector('#cb-avoidhills-input'));
            if (ctrl.currentOptions.fitness >= 0) {
                avoidhillsCheckbox.addClass('disabled');
                avoidhillsCheckboxInput.attr('disabled', 'disabled');
            } else {
                avoidhillsCheckbox.removeClass('disabled');
                avoidhillsCheckboxInput.removeAttr('disabled');
            }
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
        };
        ctrl.changeOptions = function() {
            // call setoptions
            console.log(ctrl.currentOptions.difficulty)
            if (ctrl.currentOptions.difficulty) ctrl.difficultySliders.Fitness.options.disabled = ctrl.currentOptions.difficulty.avoidhills === true ? true : false;
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