angular.module('orsApp.ors-aa-sliders', []).component('orsAaSliders', {
    templateUrl: 'components/ors-panel-accessibilityanalysis/ors-aa-sliders/ors-aa-sliders.html',
    controller: ['$filter', '$scope', '$timeout', 'orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsParamsService', 'lists', function($filter, $scope, $timeout, orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsParamsService, lists) {
        let ctrl = this;
        ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
        ctrl.optionList = lists.isochroneOptionList;
        ctrl.currentOptions.analysis_options.method = ctrl.currentOptions.analysis_options.method !== undefined ? ctrl.currentOptions.analysis_options.method : ctrl.optionList.methodOptions.TIME.id;
        ctrl.currentOptions.analysis_options.isovalue = ctrl.currentOptions.analysis_options.isovalue !== undefined ? ctrl.currentOptions.analysis_options.isovalue : ctrl.optionList.valueOptions.default;
        ctrl.currentOptions.analysis_options.isointerval = ctrl.currentOptions.analysis_options.isointerval !== undefined ? ctrl.currentOptions.analysis_options.isointerval : ctrl.optionList.intervalOptions.default;
        ctrl.currentOptions.analysis_options.reverseflow = ctrl.currentOptions.analysis_options.reverseflow !== undefined ? ctrl.currentOptions.analysis_options.reverseflow : false;
        ctrl.$onInit = () => {
            ctrl.initSliders();
            ctrl.updateSliderDimensions();
        };
        ctrl.$onChanges = (changes) => {
            if (changes.activeSubgroup) {
                if (changes.activeSubgroup.currentValue !== changes.activeSubgroup.previousValue) {
                    ctrl.changeOptions(true);
                }
            }
        };
        ctrl.getClass = (bool) => {
            if (bool === true) return "fa fa-fw fa-chevron-down";
            else return "fa fa-fw fa-chevron-right";
        };
        ctrl.updateSliderDimensions = (changedProfile = false) => {
            if (ctrl.isochroneMinutesSlider && ctrl.isochroneIntervalSlider) {
                // if time is selected multiply distance by factor
                if (ctrl.currentOptions.analysis_options.method == 0) {
                    ctrl.isochroneMinutesSlider.options.ceil = ctrl.optionList.valueOptions.max / ctrl.optionList.velocities[ctrl.activeSubgroup] * 60;
                } else if (ctrl.currentOptions.analysis_options.method == 1) {
                    ctrl.isochroneMinutesSlider.options.ceil = ctrl.optionList.valueOptions.max;
                }
                // set min and max for both sliders
                ctrl.isochroneMinutesSlider.options.floor = ctrl.optionList.valueOptions.min;
                if (ctrl.isochroneMinutesSlider.value > ctrl.isochroneMinutesSlider.options.ceil) {
                    ctrl.isochroneMinutesSlider.value = ctrl.isochroneMinutesSlider.options.ceil;
                }
                ctrl.isochroneIntervalSlider.options.floor = Math.ceil(ctrl.isochroneMinutesSlider.value / 10);
                ctrl.isochroneIntervalSlider.options.ceil = ctrl.isochroneMinutesSlider.value;
                if (ctrl.isochroneIntervalSlider.value < ctrl.isochroneIntervalSlider.options.floor) {
                    ctrl.isochroneIntervalSlider.value = ctrl.isochroneIntervalSlider.options.floor;
                } else if (ctrl.isochroneIntervalSlider.value > ctrl.isochroneIntervalSlider.options.ceil) {
                    ctrl.isochroneIntervalSlider.value = ctrl.isochroneIntervalSlider.options.ceil;
                }
                ctrl.currentOptions.analysis_options.isointerval = ctrl.isochroneIntervalSlider.value;
                ctrl.currentOptions.analysis_options.isovalue = ctrl.isochroneMinutesSlider.value;
            }
            ctrl.refreshSliders();
            ctrl.reCalcViewDimensions();
        };
        ctrl.initSliders = () => {
            ctrl.isochroneMinutesSlider = {
                value: ctrl.currentOptions.analysis_options.isovalue,
                options: {
                    floor: null,
                    ceil: null,
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
                        ctrl.currentOptions.analysis_options.isointerval = ctrl.isochroneIntervalSlider.value;
                        ctrl.changeOptions(false);
                    },
                    onChange: () => {
                        if (ctrl.isochroneMinutesSlider.value >= 1) {
                            ctrl.isochroneIntervalSlider.options.ceil = ctrl.isochroneMinutesSlider.value;
                            ctrl.isochroneIntervalSlider.options.floor = Math.ceil(ctrl.isochroneMinutesSlider.value / 10); //* Math.ceil(ctrl.isochroneMinutesSlider.value / 10);
                        }
                        if (ctrl.isochroneIntervalSlider.value > ctrl.isochroneIntervalSlider.options.ceil) {
                            ctrl.isochroneIntervalSlider.value = ctrl.isochroneIntervalSlider.options.ceil;
                        } else if (ctrl.isochroneIntervalSlider.value < ctrl.isochroneIntervalSlider.options.ceil) {
                            ctrl.isochroneIntervalSlider.value = ctrl.isochroneIntervalSlider.options.floor;
                        }
                    },
                    hidePointerLabels: true
                }
            };
            ctrl.currentOptions.analysis_options.isointerval = ctrl.currentOptions.analysis_options.isointerval !== undefined ? ctrl.currentOptions.analysis_options.isointerval : ctrl.optionList.intervalOptions.default;
            ctrl.isochroneIntervalSlider = {
                value: ctrl.currentOptions.analysis_options.isointerval,
                options: {
                    floor: null,
                    ceil: null,
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
                        ctrl.changeOptions(false);
                    },
                    hidePointerLabels: true
                }
            };
        };
        ctrl.changeOptions = (changeDimensions) => {
            if (changeDimensions) ctrl.updateSliderDimensions();
            orsUtilsService.parseSettingsToPermalink(orsSettingsFactory.getSettings(), orsSettingsFactory.getUserOptions());
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