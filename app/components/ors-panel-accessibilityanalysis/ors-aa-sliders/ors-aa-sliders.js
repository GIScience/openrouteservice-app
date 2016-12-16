angular.module('orsApp.ors-aa-sliders', []).component('orsAaSliders', {
    templateUrl: 'app/components/ors-panel-accessibilityanalysis/ors-aa-sliders/ors-aa-sliders.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService) {
        var ctrl = this;
        ctrl.$onInit = function() {
            if (ctrl.isochroneMinutesSlider.value > 1) ctrl.isochroneIntervalSlider.options.ceil = ctrl.isochroneMinutesSlider.value - 1;
            else ctrl.isochroneIntervalSlider.options.ceil = 1;
            if (ctrl.isochroneIntervalSlider.value > ctrl.isochroneIntervalSlider.options.ceil) ctrl.isochroneIntervalSlider.value = ctrl.isochroneIntervalSlider.options.ceil;
        };
        ctrl.optionList = lists.isochroneOptionList;
        ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
        ctrl.currentOptions.analysis_options.method = ctrl.currentOptions.analysis_options.method !== undefined ? ctrl.currentOptions.analysis_options.method : ctrl.optionList.methodOptions.TIME.id;
        ctrl.isochroneOptionsSlider = {
            value: ctrl.currentOptions.analysis_options.method,
            options: {
                floor: ctrl.optionList.methodOptions.TIME.id,
                ceil: ctrl.optionList.methodOptions.DISTANCE.id,
                step: 1,
                translate: function(value) {
                    return value == 0 ? ctrl.optionList.methodOptions.TIME.name : ctrl.optionList.methodOptions.DISTANCE.name;
                },
                onEnd: function() {
                    console.log("TEST");
                    ctrl.currentOptions.analysis_options.method = ctrl.isochroneOptionsSlider.value;
                    console.log("TEST");
                    ctrl.changeOptions();
                }
            }
        };
        ctrl.currentOptions.analysis_options.minutes = ctrl.currentOptions.analysis_options.minutes !== undefined ? ctrl.currentOptions.analysis_options.minutes : ctrl.optionList.minutesOptions.default;
        ctrl.isochroneMinutesSlider = {
            value: ctrl.currentOptions.analysis_options.minutes,
            options: {
                floor: ctrl.optionList.minutesOptions.min,
                ceil: ctrl.optionList.minutesOptions.max,
                step: ctrl.optionList.minutesOptions.step,
                translate: function(value) {
                    return value + ' <b>min</b>';
                },
                onEnd: function() {
                    ctrl.currentOptions.analysis_options.minutes = ctrl.isochroneMinutesSlider.value;
                    ctrl.changeOptions();
                },
                onChange: function() {
                    if (ctrl.isochroneMinutesSlider.value > 1) {
                        ctrl.isochroneIntervalSlider.options.ceil = ctrl.isochroneMinutesSlider.value - 1;
                        ctrl.isochroneIntervalSlider.options.floor = ctrl.isochroneMinutesSlider.value/10;
                    }
                    else {
                        ctrl.isochroneIntervalSlider.options.ceil = 1;
                    }
                    if (ctrl.isochroneIntervalSlider.value > ctrl.isochroneIntervalSlider.options.ceil) ctrl.isochroneIntervalSlider.value = ctrl.isochroneIntervalSlider.options.ceil;
                },
                hidePointerLabels: true
            }
        };
        ctrl.currentOptions.analysis_options.interval = ctrl.currentOptions.analysis_options.interval !== undefined ? ctrl.currentOptions.analysis_options.interval : ctrl.optionList.intervalOptions.default;
        ctrl.isochroneIntervalSlider = {
            value: ctrl.currentOptions.analysis_options.interval,
            options: {
                floor: ctrl.currentOptions.analysis_options.minutes/10,
                ceil: ctrl.optionList.intervalOptions.max,
                step: ctrl.optionList.intervalOptions.step,
                translate: function(value) {
                    return value + ' <b>min</b>';
                },
                onEnd: function() {
                    ctrl.currentOptions.analysis_options.interval = ctrl.isochroneIntervalSlider.value;
                    ctrl.changeOptions();
                },
                hidePointerLabels: true
            }
        };
        ctrl.changeOptions = function() {
            console.log("changeOptions");
            orsUtilsService.parseSettingsToPermalink(orsSettingsFactory.getSettings(), orsSettingsFactory.getUserOptions());
        };
    },
    require: {
        parent: '^orsSidebar'
    },
    bindings: {
        currentOptions: '='
    }
});