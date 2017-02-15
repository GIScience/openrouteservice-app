angular.module('orsApp.ors-options', []).component('orsOptions', {
    templateUrl: 'components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-options/ors-options.html',
    bindings: {
        activeSubgroup: '<',
        activeProfile: '<',
        showOptions: '<'
    },
    controller: ['orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsParamsService', '$scope', '$timeout', function(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsParamsService, $scope, $timeout) {
        let ctrl = this;
        ctrl.optionList = lists.optionList;
        ctrl.$onInit = () => {
            /** This is a reference of the settings object, if we change here, it is updated in settings */
            ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
            console.log(ctrl.currentOptions)
            // preference/weight is only considered for routing panel
            if (ctrl.routing) ctrl.currentOptions.weight = ctrl.currentOptions.weight !== undefined ? ctrl.currentOptions.weight : ctrl.optionList.weight.Fastest.value;
            ctrl.weightSlider = {
                value: ctrl.currentOptions.weight,
                options: {
                    stepsArray: [{
                        value: ctrl.optionList.weight.Fastest.value
                    }, {
                        value: ctrl.optionList.weight.Shortest.value
                    }, {
                        value: ctrl.optionList.weight.Recommended.value
                    }],
                    showTicks: true,
                    showTicksValues: false,
                    hidePointerLabels: true,
                    hideLimitLabels: true,
                    onEnd: () => {
                        ctrl.currentOptions.weight = ctrl.weightSlider.value;
                        ctrl.changeOptions();
                    }
                }
            };
            // set maxspeed slider from params
            ctrl.maxspeedOptions = ctrl.optionList.maxspeeds[ctrl.activeSubgroup];
            // enable or disable checkbox depending on whether maxspeed is set
            let maxspeedVal;
            if (ctrl.currentOptions.maxspeed >= 0) {
                maxspeedVal = ctrl.currentOptions.maxspeed;
                ctrl.maxspeedCheckbox = true;
            } else {
                maxspeedVal = ctrl.maxspeedOptions.default;
                ctrl.maxspeedCheckbox = false;
            }
            ctrl.toggleMaxspeedSlider = (fireRequest = true) => {
                console.log('TOGGLED')
                if (ctrl.maxspeedCheckbox === true) {
                    ctrl.maxspeedSlider.options.disabled = false;
                    ctrl.currentOptions.maxspeed = ctrl.maxspeedSlider.value;
                } else if (ctrl.maxspeedCheckbox === false) {
                    ctrl.maxspeedSlider.options.disabled = true;
                    delete ctrl.currentOptions.maxspeed;
                }
                if (fireRequest) ctrl.changeOptions();
            };
            ctrl.maxspeedSlider = {
                value: maxspeedVal,
                options: {
                    floor: ctrl.maxspeedOptions.min,
                    ceil: ctrl.maxspeedOptions.max,
                    step: ctrl.maxspeedOptions.step,
                    translate: (value) => {
                        return value + ' <b>km/h</b>';
                    },
                    onEnd: () => {
                        console.log('ON END')
                        ctrl.currentOptions.maxspeed = ctrl.maxspeedSlider.value;
                        ctrl.changeOptions();
                    }
                }
            };
            ctrl.toggleMaxspeedSlider(false);
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
                        translate: (value) => {
                            return value + ' <b>m</b>';
                        },
                        onEnd: () => {
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
                        translate: (value) => {
                            return value + ' <b>m</b>';
                        },
                        onEnd: () => {
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
                        translate: (value) => {
                            return value + ' <b>m</b>';
                        },
                        onEnd: () => {
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
                        translate: (value) => {
                            return value + ' <b>t</b>';
                        },
                        onEnd: () => {
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
                        translate: (value) => {
                            return value + ' <b>t</b>';
                        },
                        onEnd: () => {
                            ctrl.currentOptions.hgvWeight = ctrl.hgvSliders.Weight.value;
                            ctrl.changeOptions();
                        }
                    }
                }
            };
            // Difficulty settings
            ctrl.currentOptions.fitness = ctrl.currentOptions.fitness !== undefined ? ctrl.optionList.difficulty.fitness[ctrl.currentOptions.fitness].value : ctrl.optionList.difficulty.fitness['-1'].value;
            ctrl.fitnessValue = ctrl.optionList.difficulty.fitness[ctrl.currentOptions.fitness].name;
            ctrl.currentOptions.steepness = ctrl.currentOptions.steepness !== undefined ? ctrl.currentOptions.steepness : ctrl.optionList.difficulty.steepness.min;
            ctrl.avoidHillsCheckbox();
            ctrl.difficultySliders = {
                Fitness: {
                    value: ctrl.currentOptions.fitness,
                    options: {
                        stepsArray: [{
                            value: ctrl.optionList.difficulty.fitness['-1'].value
                        }, {
                            value: ctrl.optionList.difficulty.fitness['0'].value
                        }, {
                            value: ctrl.optionList.difficulty.fitness['1'].value
                        }, {
                            value: ctrl.optionList.difficulty.fitness['2'].value
                        }, {
                            value: ctrl.optionList.difficulty.fitness['3'].value
                        }],
                        showTicks: true,
                        showTicksValues: false,
                        hidePointerLabels: true,
                        hideLimitLabels: true,
                        onEnd: () => {
                            ctrl.currentOptions.fitness = ctrl.difficultySliders.Fitness.value;
                            ctrl.changeOptions();
                            ctrl.avoidHillsCheckbox();
                            ctrl.fitnessValue = ctrl.optionList.difficulty.fitness[ctrl.currentOptions.fitness].name;
                        }
                    }
                },
                Steepness: {
                    value: ctrl.currentOptions.steepness,
                    options: {
                        floor: ctrl.optionList.difficulty.steepness.min,
                        ceil: ctrl.optionList.difficulty.steepness.max,
                        translate: (value) => {
                            return value + ' <b>%</b>';
                        },
                        onEnd: () => {
                            ctrl.currentOptions.steepness = ctrl.difficultySliders.Steepness.value;
                            ctrl.changeOptions();
                        }
                    }
                }
            };
            // wheelchair sliders
            ctrl.currentOptions.surface = ctrl.currentOptions.surface !== undefined ? ctrl.optionList.wheelchair.Surface[ctrl.currentOptions.surface].value : ctrl.optionList.wheelchair.Surface['0'].value;
            ctrl.currentOptions.incline = ctrl.currentOptions.incline !== undefined ? ctrl.optionList.wheelchair.Incline[ctrl.currentOptions.incline].value : ctrl.optionList.wheelchair.Incline['0'].value;
            ctrl.currentOptions.curb = ctrl.currentOptions.curb !== undefined ? ctrl.optionList.wheelchair.Curb[ctrl.currentOptions.curb].value : ctrl.optionList.wheelchair.Curb['0'].value;
            ctrl.wheelchairSliders = {
                Surface: {
                    value: ctrl.currentOptions.surface,
                    options: {
                        stepsArray: [{
                            value: ctrl.optionList.wheelchair.Surface['0'].value
                        }, {
                            value: ctrl.optionList.wheelchair.Surface['1'].value
                        }, {
                            value: ctrl.optionList.wheelchair.Surface['2'].value
                        }, {
                            value: ctrl.optionList.wheelchair.Surface['3'].value
                        }, {
                            value: ctrl.optionList.wheelchair.Surface['4'].value
                        }],
                        showTicks: true,
                        showTicksValues: false,
                        hidePointerLabels: true,
                        hideLimitLabels: true,
                        onEnd: () => {
                            ctrl.currentOptions.surface = ctrl.wheelchairSliders.Surface.value;
                            ctrl.changeOptions();
                        }
                    }
                },
                Incline: {
                    value: ctrl.currentOptions.incline,
                    options: {
                        stepsArray: [{
                            value: ctrl.optionList.wheelchair.Incline['0'].value
                        }, {
                            value: ctrl.optionList.wheelchair.Incline['1'].value
                        }, {
                            value: ctrl.optionList.wheelchair.Incline['2'].value
                        }, {
                            value: ctrl.optionList.wheelchair.Incline['3'].value
                        }, {
                            value: ctrl.optionList.wheelchair.Incline['4'].value
                        }],
                        showTicks: true,
                        showTicksValues: false,
                        hidePointerLabels: true,
                        hideLimitLabels: true,
                        onEnd: () => {
                            ctrl.currentOptions.incline = ctrl.wheelchairSliders.Incline.value;
                            ctrl.changeOptions();
                        }
                    }
                },
                Curb: {
                    value: ctrl.currentOptions.curb,
                    options: {
                        stepsArray: [{
                            value: ctrl.optionList.wheelchair.Curb['0'].value
                        }, {
                            value: ctrl.optionList.wheelchair.Curb['1'].value
                        }, {
                            value: ctrl.optionList.wheelchair.Curb['2'].value
                        }, {
                            value: ctrl.optionList.wheelchair.Curb['3'].value
                        }],
                        showTicks: true,
                        showTicksValues: false,
                        hidePointerLabels: true,
                        hideLimitLabels: true,
                        onEnd: () => {
                            ctrl.currentOptions.curb = ctrl.wheelchairSliders.Curb.value;
                            ctrl.changeOptions();
                        }
                    }
                }
            };
        };
        ctrl.avoidHillsCheckbox = () => {
            let avoidhillsCheckbox = angular.element(document.querySelector('#cb-avoidhills'));
            let avoidhillsCheckboxInput = angular.element(document.querySelector('#cb-avoidhills-input'));
            if (ctrl.optionList.difficulty.fitness[ctrl.currentOptions.fitness].value >= 0) {
                avoidhillsCheckbox.addClass('disabled');
                avoidhillsCheckboxInput.attr('disabled', 'disabled');
            } else {
                avoidhillsCheckbox.removeClass('disabled');
                avoidhillsCheckboxInput.removeAttr('disabled');
            }
        };
        ctrl.$onChanges = (changesObj) => {
            if (changesObj.showOptions) ctrl.refreshSlider();
            if (changesObj.activeSubgroup || changesObj.activeProfile) {
                ctrl.maxspeedOptions = ctrl.optionList.maxspeeds[ctrl.activeProfile];
                // check if already initiated
                /** update slider settings */
                if (ctrl.maxspeedSlider) {
                    ctrl.maxspeedSlider.value = ctrl.maxspeedOptions.default;
                    ctrl.maxspeedSlider.options.floor = ctrl.maxspeedOptions.min;
                    ctrl.maxspeedSlider.options.ceil = ctrl.maxspeedOptions.max;
                    ctrl.maxspeedSlider.options.step = ctrl.maxspeedOptions.step;
                    if (ctrl.currentOptions.maxspeed) {
                        ctrl.currentOptions.maxspeed = ctrl.maxspeedSlider.value;
                    }
                }
            }
        };
        // Get the app route, we need this to know whether to fire a request when the options change
        orsSettingsFactory.subscribeToNgRoute(function onNext(route) {
            ctrl.routing = route == 'directions' ? true : false;
        });
        ctrl.changeOptions = () => {
            // call setoptions
            console.log(ctrl.currentOptions)
            if (ctrl.currentOptions.difficulty) ctrl.difficultySliders.Fitness.options.disabled = ctrl.currentOptions.difficulty.avoidhills === true ? true : false;
            orsSettingsFactory.setActiveOptions(ctrl.currentOptions, ctrl.routing);
        };
        ctrl.getClass = (bool) => {
            if (bool === true) return "fa fa-fw fa-chevron-down";
            else return "fa fa-fw fa-chevron-right";
        };
        ctrl.refreshSlider = () => {
            $timeout(() => {
                $scope.$broadcast('rzSliderForceRender');
            }, 1000);
        };
        ctrl.reCalcViewDimensions = () => {
            $timeout(() => {
                $scope.$broadcast('reCalcViewDimensions');
            }, 1000);
        };
        //ctrl.reCalcViewDimensions();
        ctrl.refreshSlider();
    }]
});