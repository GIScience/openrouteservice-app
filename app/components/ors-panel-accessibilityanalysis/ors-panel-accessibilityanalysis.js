angular.module('orsApp.ors-panel-accessibilityanalysis', ['orsApp.ors-aa-controls', 'orsApp.ors-aa-waypoints']).component('orsAnalysis', {
    templateUrl: 'app/components/ors-panel-accessibilityanalysis/ors-panel-accessibilityanalysis.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService) {
        var ctrl = this;
        ctrl.optionList = lists.isochroneOptionList;
        console.warn(ctrl.optionList)
        ctrl.$onInit = function() {};
        ctrl.$routerOnActivate = function(next) {
            /** notify the settings that we're now in the aa panel */
            orsSettingsFactory.updateNgRoute(next.urlPath);
            /** 
             * check if anything is saved in the settings object
             * if there isn't initialize settings object from permalink or provide empty
             */
            ctrl.routeParams = next.params;
            if (orsSettingsFactory.getWaypoints().length == 0) {
            	console.log('importing aa settings..')
            	console.log(JSON.stringify(orsSettingsFactory.getWaypoints()));
                const settings = orsParamsService.importSettings(ctrl.routeParams);
                console.log(JSON.stringify(settings));
                orsSettingsFactory.setSettings(settings);
            }
            orsSettingsFactory.updateWaypoints();
            ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
            ctrl.currentOptions.analysis_options.method = ctrl.currentOptions.analysis_options.method !== undefined ? ctrl.currentOptions.analysis_options.method : ctrl.optionList.methodOptions.RG.id;
            ctrl.isochroneOptionsSlider = {
                value: ctrl.currentOptions.analysis_options.method,
                options: {
                    floor: ctrl.optionList.methodOptions.RG.id,
                    ceil: ctrl.optionList.methodOptions.TIN.id,
                    step: 1,
                    translate: function(value) {
                        return value == 0 ? ctrl.optionList.methodOptions.RG.name : ctrl.optionList.methodOptions.TIN.name;
                    },
                    onEnd: function() {
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
                        ctrl.isochroneIntervalSlider.options.ceil = ctrl.isochroneMinutesSlider.value - 1;
                        if (ctrl.isochroneIntervalSlider.value > ctrl.isochroneIntervalSlider.options.ceil) ctrl.isochroneIntervalSlider.value = ctrl.isochroneIntervalSlider.options.ceil;
                    },
                    hidePointerLabels: true
                }
            };
            ctrl.currentOptions.analysis_options.interval = ctrl.currentOptions.analysis_options.interval !== undefined ? ctrl.currentOptions.analysis_options.interval : ctrl.optionList.intervalOptions.default;
            ctrl.isochroneIntervalSlider = {
                value: ctrl.currentOptions.analysis_options.interval,
                options: {
                    floor: ctrl.optionList.intervalOptions.min,
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
        };
        ctrl.changeOptions = function() {
            // call setoptions
            console.log(ctrl.currentOptions);
        };
    },
    require: {
        parent: '^orsSidebar'
    }
});