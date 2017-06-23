angular.module('orsApp.ors-options', [])
    .component('orsOptions', {
        templateUrl: 'components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-options/ors-options.html',
        bindings: {
            activeSubgroup: '<',
            activeProfile: '<',
            showOptions: '<'
        },
        controller: ['orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsParamsService', '$scope', '$timeout', 'lists', function(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsParamsService, $scope, $timeout, lists) {
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
                            ctrl.currentOptions.maxspeed = ctrl.maxspeedSlider.value;
                            ctrl.changeOptions();
                        }
                    }
                };
                ctrl.toggleMaxspeedSlider(false);
                // set hgv options from params
                ctrl.toggleHgvOptSlider = (name, fireRequest = true) => {
                    console.log(name)
                    switch (name) {
                        case 'height':
                            if (ctrl.hgvHeightCb === true) {
                                ctrl.hgvSliders.Height.options.disabled = false;
                                ctrl.currentOptions.height = ctrl.hgvSliders.Height.value;
                            } else if (ctrl.hgvHeightCb === false) {
                                ctrl.hgvSliders.Height.options.disabled = true;
                                delete ctrl.currentOptions.height;
                            }
                            break;
                        case 'width':
                            if (ctrl.hgvWidthCb === true) {
                                ctrl.hgvSliders.Width.options.disabled = false;
                                ctrl.currentOptions.width = ctrl.hgvSliders.Width.value;
                            } else if (ctrl.hgvWidthCb === false) {
                                ctrl.hgvSliders.Width.options.disabled = true;
                                delete ctrl.currentOptions.width;
                            }
                            break;
                        case 'length':
                            if (ctrl.hgvLengthCb === true) {
                                ctrl.hgvSliders.Length.options.disabled = false;
                                ctrl.currentOptions.length = ctrl.hgvSliders.Length.value;
                            } else if (ctrl.hgvLengthCb === false) {
                                ctrl.hgvSliders.Length.options.disabled = true;
                                delete ctrl.currentOptions.length;
                            }
                            break;
                        case 'hgvWeight':
                            if (ctrl.hgvWeightCb === true) {
                                ctrl.hgvSliders.Weight.options.disabled = false;
                                ctrl.currentOptions.hgvWeight = ctrl.hgvSliders.Weight.value;
                            } else if (ctrl.hgvWeightCb === false) {
                                ctrl.hgvSliders.Weight.options.disabled = true;
                                delete ctrl.currentOptions.hgvWeight;
                            }
                            break;
                        case 'axleload':
                            console.log('****')
                            if (ctrl.hgvAxleloadCb === true) {
                                ctrl.hgvSliders.AxleLoad.options.disabled = false;
                                ctrl.currentOptions.axleload = ctrl.hgvSliders.AxleLoad.value;
                            } else if (ctrl.hgvAxleloadCb === false) {
                                ctrl.hgvSliders.AxleLoad.options.disabled = true;
                                delete ctrl.currentOptions.axleload;
                            }
                            break;
                        default:
                    }
                    if (fireRequest) ctrl.changeOptions();
                };
                if (ctrl.currentOptions.hazmat !== undefined) ctrl.currentOptions.hazmat = true;
                const hgvParamsInit = {
                    height: {
                        val: ctrl.optionList.hgvParams.height.min,
                        checkbox: 'hgvHeightCb'
                    },
                    width: {
                        val: ctrl.optionList.hgvParams.width.min,
                        checkbox: 'hgvWidthCb'
                    },
                    hgvWeight: {
                        val: ctrl.optionList.hgvParams.hgvWeight.min,
                        checkbox: 'hgvWeightCb'
                    },
                    axleload: {
                        val: ctrl.optionList.hgvParams.axleload.min,
                        checkbox: 'hgvAxleloadCb'
                    },
                    length: {
                        val: ctrl.optionList.hgvParams.length.min,
                        checkbox: 'hgvLengthCb'
                    }
                };
                // check if params contain hgv settings within range
                angular.forEach(hgvParamsInit, (val, key) => {

                    if (ctrl.currentOptions[key] >= ctrl.optionList.hgvParams[key].min && ctrl.currentOptions[key] <= ctrl.optionList.hgvParams[key].max) {
                        console.log(ctrl.currentOptions[key])
                        hgvParamsInit[key].val = ctrl.currentOptions[key];
                        ctrl[hgvParamsInit[key].checkbox] = true;
                    }
                });
                ctrl.hgvSliders = {
                    Height: {
                        value: hgvParamsInit.height.val,
                        options: {
                            disabled: !ctrl.hgvHeightCb,
                            floor: ctrl.optionList.hgvParams.height.min,
                            ceil: ctrl.optionList.hgvParams.height.max,
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
                        value: hgvParamsInit.length.val,
                        options: {
                            disabled: !ctrl.hgvLengthCb,
                            floor: ctrl.optionList.hgvParams.length.min,
                            ceil: ctrl.optionList.hgvParams.length.max,
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
                        value: hgvParamsInit.width.val,
                        options: {
                            disabled: !ctrl.hgvWidthCb,
                            floor: ctrl.optionList.hgvParams.width.min,
                            ceil: ctrl.optionList.hgvParams.width.max,
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
                        value: hgvParamsInit.axleload.val,
                        options: {
                            disabled: !ctrl.hgvAxleloadCb,
                            floor: ctrl.optionList.hgvParams.axleload.min,
                            ceil: ctrl.optionList.hgvParams.axleload.max,
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
                        value: hgvParamsInit.hgvWeight.val,
                        options: {
                            disabled: !ctrl.hgvWeightCb,
                            floor: ctrl.optionList.hgvParams.hgvWeight.min,
                            ceil: ctrl.optionList.hgvParams.hgvWeight.max,
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
                ctrl.toggleHgvOptSlider('', false);
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
                ctrl.currentOptions.surface = ctrl.currentOptions.surface !== undefined ? ctrl.optionList.wheelchair.Surface[ctrl.currentOptions.surface].value : ctrl.optionList.wheelchair.Surface['concrete'].value;
                ctrl.currentOptions.incline = ctrl.currentOptions.incline !== undefined ? ctrl.optionList.wheelchair.Incline[ctrl.currentOptions.incline].value : ctrl.optionList.wheelchair.Incline['3'].value;
                ctrl.currentOptions.curb = ctrl.currentOptions.curb !== undefined ? ctrl.optionList.wheelchair.Curb[ctrl.currentOptions.curb].value : ctrl.optionList.wheelchair.Curb['0.03'].value;
                ctrl.wheelchairSliders = {
                    Surface: {
                        value: ctrl.currentOptions.surface,
                        options: {
                            stepsArray: [{
                                value: ctrl.optionList.wheelchair.Surface['concrete'].value
                            }, {
                                value: ctrl.optionList.wheelchair.Surface['cobblestone:flattened'].value
                            }, {
                                value: ctrl.optionList.wheelchair.Surface['cobblestone'].value
                            }, {
                                value: ctrl.optionList.wheelchair.Surface['compacted'].value
                            }, {
                                value: ctrl.optionList.wheelchair.Surface['any'].value
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
                                value: ctrl.optionList.wheelchair.Incline['3'].value
                            }, {
                                value: ctrl.optionList.wheelchair.Incline['6'].value
                            }, {
                                value: ctrl.optionList.wheelchair.Incline['10'].value
                            }, {
                                value: ctrl.optionList.wheelchair.Incline['15'].value
                            }, {
                                value: ctrl.optionList.wheelchair.Incline['31'].value
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
                                value: ctrl.optionList.wheelchair.Curb['0.03'].value
                            }, {
                                value: ctrl.optionList.wheelchair.Curb['0.06'].value
                            }, {
                                value: ctrl.optionList.wheelchair.Curb['0.1'].value
                            }, {
                                value: ctrl.optionList.wheelchair.Curb['0.31'].value
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
                    console.log('hallo', changesObj.activeProfile)
                    ctrl.maxspeedOptions = ctrl.optionList.maxspeeds[ctrl.activeSubgroup];
                    // check if already initiated
                    /** update slider settings */
                    if (ctrl.maxspeedSlider) {
                        console.log(true)
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