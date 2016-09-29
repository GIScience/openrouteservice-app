angular.module('orsApp.ors-panel-accessibilityanalysis', []).component('orsAnalysis', {
    templateUrl: 'app/components/ors-panel-accessibilityanalysis/ors-panel-accessibilityanalysis.html',
    controller(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService) {
        var ctrl = this;
        ctrl.$onInit = function() {};
        ctrl.$routerOnActivate = function() {
			ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
            console.log(ctrl.currentOptions);
			ctrl.availableOptions = lists.isochroneList.methodOptions;
			console.log(ctrl.availableOptions);
			ctrl.isochroneOptionsSlider = {
					value: ctrl.availableOptions.RG.id,
					options: {
						floor: ctrl.availableOptions.RG.id,
						ceil: ctrl.availableOptions.TIN.id,
						step: 1,
						translate: function(value) {
							return value == 0 ? ctrl.availableOptions.RG.name : ctrl.availableOptions.TIN.name;
						},
						onEnd: function() {
							ctrl.changeOptions();
						}
					}
			};
			
			ctrl.isochroneMinutes = lists.isochroneList.minutesOptions;
			ctrl.isochroneMinutesSlider = {
					value: ctrl.isochroneMinutes.default,
					options: {
						floor: ctrl.isochroneMinutes.min,
						ceil: ctrl.isochroneMinutes.max,
						step: ctrl.isochroneMinutes.step,
						translate: function(value) {
							return value + ' <b>min</b>';
						},
						onEnd: function() {
							ctrl.currentOptions.isochroneMinutes = ctrl.isochroneMinutesSlider.value;
							ctrl.changeOptions();
						},
						onChange: function() {
							ctrl.isochroneIntervalSlider.options.ceil = ctrl.isochroneMinutesSlider.value - 1;
							if (ctrl.isochroneIntervalSlider.value > ctrl.isochroneIntervalSlider.options.ceil) ctrl.isochroneIntervalSlider.value = ctrl.isochroneIntervalSlider.options.ceil;
							console.log(ctrl.isochroneIntervalSlider);
						}
					}
			};
			
			ctrl.isochroneInterval = lists.isochroneList.intervalOptions;
			ctrl.isochroneIntervalSlider = {
					value: ctrl.isochroneInterval.default,
					options: {
						floor: ctrl.isochroneInterval.min,
						ceil: ctrl.isochroneInterval.max,
						step: ctrl.isochroneInterval.step,
						translate: function(value) {
							return value + ' <b>min</b>';
						},
						onEnd: function() {
							ctrl.currentOptions.isochroneInterval = ctrl.isochroneIntervalSlider.value;
							ctrl.changeOptions();
						}
					}
			};
        };
        ctrl.goInstructions = function() {
        };
		ctrl.getClass = (bool) => {
            if (bool === true) return "fa fa-lg fa-fw fa-caret-up";
            else return "fa fa-lg fa-fw fa-caret-down";
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