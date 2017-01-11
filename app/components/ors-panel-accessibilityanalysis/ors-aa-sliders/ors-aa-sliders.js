angular.module('orsApp.ors-aa-sliders', []).component('orsAaSliders', {
    templateUrl: 'components/ors-panel-accessibilityanalysis/ors-aa-sliders/ors-aa-sliders.html',
    controller: ['$filter', '$scope', '$timeout', 'orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsParamsService', function($filter, $scope, $timeout, orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsParamsService) {
        let ctrl = this;
        ctrl.$onInit = () => {
            ctrl.initSliders();
        };
        ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
        // if (ctrl.isochroneMinutesSlider.value > 1) ctrl.isochroneIntervalSlider.options.ceil = ctrl.isochroneMinutesSlider.value - 1;
        // else ctrl.isochroneIntervalSlider.options.ceil = 1;
        // if (ctrl.isochroneIntervalSlider.value > ctrl.isochroneIntervalSlider.options.ceil) ctrl.isochroneIntervalSlider.value = ctrl.isochroneIntervalSlider.options.ceil;
        ctrl.optionList = lists.isochroneOptionList;
        ctrl.currentOptions.analysis_options.method = ctrl.currentOptions.analysis_options.method !== undefined ? ctrl.currentOptions.analysis_options.method : ctrl.optionList.methodOptions.TIME.id;
        ctrl.currentOptions.analysis_options.isovalue = ctrl.currentOptions.analysis_options.isovalue !== undefined ? ctrl.currentOptions.analysis_options.isovalue : ctrl.optionList.valueOptions.default;
        ctrl.$onChanges = (changes) => {
            if (changes.activeSubgroup) {
                if (changes.activeSubgroup.currentValue !== changes.activeSubgroup.previosValue) {
                    // change slider options
                    ctrl.updateSliders();
                }
            }
        };
        ctrl.updateSliders = () => {
            // if time is selected multiply distance by factor
            if (ctrl.currentOptions.analysis_options.method == 0) {
                ctrl.isochroneMaxValue = ctrl.optionList.valueOptions.max / ctrl.optionList.velocities[ctrl.activeSubgroup] * 60;
            } else if (ctrl.currentOptions.analysis_options.method == 1) {
                ctrl.isochroneMaxValue = ctrl.optionList.valueOptions.max;
            }
            if (ctrl.isochroneMinutesSlider) {
                ctrl.isochroneMinutesSlider.options.ceil = ctrl.isochroneMaxValue;
            }
            ctrl.refreshSliders();
            ctrl.reCalcViewDimensions();
        };
        ctrl.initSliders = () => {
            ctrl.isochroneMinutesSlider = {
                value: ctrl.currentOptions.analysis_options.isovalue,
                options: {
                    floor: ctrl.optionList.valueOptions.min,
                    ceil: ctrl.isochroneMaxValue,
                    step: ctrl.optionList.valueOptions.step,
                    translate: (value) => {
                        if (ctrl.currentOptions.analysis_options.method == 0) {
                            return value + ' ' + $filter('translate')('MINUTES');
                        } else {
                            return $filter('distance')(value * 1000, true);
                        }
                    },
                    onEnd: () => {
                        ctrl.currentOptions.analysis_options.isovalue = ctrl.isochroneMinutesSlider.value;
                        ctrl.changeOptions();
                    },
                    onChange: () => {
                        if (ctrl.isochroneMinutesSlider.value > 1) {
                            ctrl.isochroneIntervalSlider.options.ceil = ctrl.isochroneMinutesSlider.value - 1;
                            ctrl.isochroneIntervalSlider.options.floor = Math.ceil(ctrl.isochroneMinutesSlider.value / 10);
                        } else {
                            ctrl.isochroneIntervalSlider.options.ceil = 1;
                        }
                        if (ctrl.isochroneIntervalSlider.value > ctrl.isochroneIntervalSlider.options.ceil) ctrl.isochroneIntervalSlider.value = ctrl.isochroneIntervalSlider.options.ceil;
                    },
                    hidePointerLabels: true
                }
            };
            ctrl.currentOptions.analysis_options.isointerval = ctrl.currentOptions.analysis_options.isointerval !== undefined ? ctrl.currentOptions.analysis_options.isointerval : ctrl.optionList.intervalOptions.default;
            ctrl.isochroneIntervalSlider = {
                value: ctrl.currentOptions.analysis_options.isointerval,
                options: {
                    floor: Math.ceil(ctrl.currentOptions.analysis_options.isovalue / 10),
                    ceil: ctrl.optionList.intervalOptions.max,
                    step: ctrl.optionList.intervalOptions.step,
                    translate: (value) => {
                        if (ctrl.currentOptions.analysis_options.method == 0) {
                            return value + ' ' + $filter('translate')('MINUTES');
                        } else {
                            return $filter('distance')(value * 1000, true);
                        }
                    },
                    onEnd: () => {
                        ctrl.currentOptions.analysis_options.isointerval = ctrl.isochroneIntervalSlider.value;
                        ctrl.changeOptions();
                    },
                    hidePointerLabels: true
                }
            };
        };
        ctrl.changeOptions = () => {
            orsUtilsService.parseSettingsToPermalink(orsSettingsFactory.getSettings(), orsSettingsFactory.getUserOptions());
            ctrl.updateSliders();
            ctrl.refreshSliders();
        };
        ctrl.refreshSliders = () => {
            $timeout(() => {
                $scope.$broadcast('rzSliderForceRender');
            });
        };
        ctrl.reCalcViewDimensions = () => {
            $timeout(() => {
                $scope.$broadcast('reCalcViewDimensions');
            });
        };
    }],
    require: {
        parent: '^orsSidebar'
    },
    bindings: {
        currentOptions: '=',
        activeSubgroup: '<'
    }
});