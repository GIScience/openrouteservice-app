var $__app_47_scripts_47_components_47_ors_45_panel_45_routing_47_ors_45_waypoints_47_ors_45_route_45_controls_47_ors_45_options_47_ors_45_options_46_js__ = (function() {
  "use strict";
  var __moduleName = "app/scripts/components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-options/ors-options.js";
  angular.module('orsApp.ors-options', []).component('orsOptions', {
    templateUrl: 'scripts/components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-options/ors-options.html',
    bindings: {
      activeSubgroup: '<',
      activeProfile: '<',
      showOptions: '<'
    },
    controller: ['orsSettingsFactory', 'orsObjectsFactory', 'orsUtilsService', 'orsRequestService', 'orsErrorhandlerService', 'orsParamsService', '$scope', '$timeout', function(orsSettingsFactory, orsObjectsFactory, orsUtilsService, orsRequestService, orsErrorhandlerService, orsParamsService, $scope, $timeout) {
      var ctrl = this;
      ctrl.optionList = lists.optionList;
      ctrl.$onInit = function() {
        ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
        console.info(ctrl.currentOptions);
        ctrl.currentOptions.weight = ctrl.currentOptions.weight !== undefined ? ctrl.currentOptions.weight : ctrl.optionList.weight.Fastest;
        ctrl.weightSlider = {
          value: ctrl.currentOptions.weight,
          options: {
            stepsArray: [{value: ctrl.optionList.weight.Fastest.value}, {value: ctrl.optionList.weight.Shortest.value}, {value: ctrl.optionList.weight.Recommended.value}],
            showTicks: true,
            showTicksValues: false,
            hidePointerLabels: true,
            hideLimitLabels: true,
            onEnd: function() {
              ctrl.currentOptions.weight = ctrl.weightSlider.value;
              ctrl.changeOptions();
            }
          }
        };
        ctrl.maxspeedOptions = ctrl.optionList.maxspeeds[ctrl.activeSubgroup];
        ctrl.currentOptions.maxspeed = ctrl.currentOptions.maxspeed !== undefined ? ctrl.currentOptions.maxspeed : ctrl.maxspeedOptions.default;
        ctrl.maxspeedSlider = {
          value: ctrl.currentOptions.maxspeed,
          options: {
            floor: ctrl.maxspeedOptions.min,
            ceil: ctrl.maxspeedOptions.max,
            step: ctrl.maxspeedOptions.step,
            translate: function(value) {
              return value + ' <b>km/h</b>';
            },
            onEnd: function() {
              ctrl.currentOptions.maxspeed = ctrl.maxspeedSlider.value;
              ctrl.changeOptions();
            }
          }
        };
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
              onEnd: function() {
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
              onEnd: function() {
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
              onEnd: function() {
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
              onEnd: function() {
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
              onEnd: function() {
                ctrl.currentOptions.hgvWeight = ctrl.hgvSliders.Weight.value;
                ctrl.changeOptions();
              }
            }
          }
        };
        ctrl.currentOptions.fitness = ctrl.currentOptions.fitness !== undefined ? ctrl.optionList.difficulty.fitness[ctrl.currentOptions.fitness].value : ctrl.optionList.difficulty.fitness['-1'].value;
        ctrl.fitnessValue = ctrl.optionList.difficulty.fitness[ctrl.currentOptions.fitness].name;
        ctrl.currentOptions.steepness = ctrl.currentOptions.steepness !== undefined ? ctrl.currentOptions.steepness : ctrl.optionList.difficulty.steepness.min;
        ctrl.avoidHillsCheckbox();
        ctrl.difficultySliders = {
          Fitness: {
            value: ctrl.currentOptions.fitness,
            options: {
              stepsArray: [{value: ctrl.optionList.difficulty.fitness['-1'].value}, {value: ctrl.optionList.difficulty.fitness['0'].value}, {value: ctrl.optionList.difficulty.fitness['1'].value}, {value: ctrl.optionList.difficulty.fitness['2'].value}, {value: ctrl.optionList.difficulty.fitness['3'].value}],
              showTicks: true,
              showTicksValues: false,
              hidePointerLabels: true,
              hideLimitLabels: true,
              onEnd: function() {
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
              translate: function(value) {
                return value + ' <b>%</b>';
              },
              onEnd: function() {
                ctrl.currentOptions.steepness = ctrl.difficultySliders.Steepness.value;
                ctrl.changeOptions();
              }
            }
          }
        };
        ctrl.currentOptions.surface = ctrl.currentOptions.surface !== undefined ? ctrl.optionList.wheelchair.Surface[ctrl.currentOptions.surface].value : ctrl.optionList.wheelchair.Surface['0'].value;
        ctrl.currentOptions.incline = ctrl.currentOptions.incline !== undefined ? ctrl.optionList.wheelchair.Incline[ctrl.currentOptions.incline].value : ctrl.optionList.wheelchair.Incline['0'].value;
        ctrl.currentOptions.curb = ctrl.currentOptions.curb !== undefined ? ctrl.optionList.wheelchair.Curb[ctrl.currentOptions.curb].value : ctrl.optionList.wheelchair.Curb['0'].value;
        ctrl.wheelchairSliders = {
          Surface: {
            value: ctrl.currentOptions.surface,
            options: {
              stepsArray: [{value: ctrl.optionList.wheelchair.Surface['0'].value}, {value: ctrl.optionList.wheelchair.Surface['1'].value}, {value: ctrl.optionList.wheelchair.Surface['2'].value}, {value: ctrl.optionList.wheelchair.Surface['3'].value}, {value: ctrl.optionList.wheelchair.Surface['4'].value}],
              showTicks: true,
              showTicksValues: false,
              hidePointerLabels: true,
              hideLimitLabels: true,
              onEnd: function() {
                ctrl.currentOptions.surface = ctrl.wheelchairSliders.Surface.value;
                ctrl.changeOptions();
              }
            }
          },
          Incline: {
            value: ctrl.currentOptions.incline,
            options: {
              stepsArray: [{value: ctrl.optionList.wheelchair.Incline['0'].value}, {value: ctrl.optionList.wheelchair.Incline['1'].value}, {value: ctrl.optionList.wheelchair.Incline['2'].value}, {value: ctrl.optionList.wheelchair.Incline['3'].value}, {value: ctrl.optionList.wheelchair.Incline['4'].value}],
              showTicks: true,
              showTicksValues: false,
              hidePointerLabels: true,
              hideLimitLabels: true,
              onEnd: function() {
                ctrl.currentOptions.incline = ctrl.wheelchairSliders.Incline.value;
                ctrl.changeOptions();
              }
            }
          },
          Curb: {
            value: ctrl.currentOptions.curb,
            options: {
              stepsArray: [{value: ctrl.optionList.wheelchair.Curb['0'].value}, {value: ctrl.optionList.wheelchair.Curb['1'].value}, {value: ctrl.optionList.wheelchair.Curb['2'].value}, {value: ctrl.optionList.wheelchair.Curb['3'].value}],
              showTicks: true,
              showTicksValues: false,
              hidePointerLabels: true,
              hideLimitLabels: true,
              onEnd: function() {
                ctrl.currentOptions.curb = ctrl.wheelchairSliders.Curb.value;
                ctrl.changeOptions();
              }
            }
          }
        };
      };
      ctrl.avoidHillsCheckbox = function() {
        var avoidhillsCheckbox = angular.element(document.querySelector('#cb-avoidhills'));
        var avoidhillsCheckboxInput = angular.element(document.querySelector('#cb-avoidhills-input'));
        if (ctrl.optionList.difficulty.fitness[ctrl.currentOptions.fitness].value >= 0) {
          avoidhillsCheckbox.addClass('disabled');
          avoidhillsCheckboxInput.attr('disabled', 'disabled');
        } else {
          avoidhillsCheckbox.removeClass('disabled');
          avoidhillsCheckboxInput.removeAttr('disabled');
        }
      };
      ctrl.$onChanges = function(changesObj) {
        if (changesObj.showOptions)
          ctrl.refreshSlider();
        if (changesObj.activeSubgroup || changesObj.activeProfile) {
          ctrl.maxspeedOptions = ctrl.optionList.maxspeeds[ctrl.activeProfile];
          if (ctrl.maxspeedSlider) {
            ctrl.maxspeedSlider.value = ctrl.maxspeedOptions.default;
            ctrl.currentOptions.maxspeed = ctrl.maxspeedSlider.value;
            ctrl.maxspeedSlider.options.floor = ctrl.maxspeedOptions.min;
            ctrl.maxspeedSlider.options.ceil = ctrl.maxspeedOptions.max;
            ctrl.maxspeedSlider.options.step = ctrl.maxspeedOptions.step;
          }
        }
      };
      ctrl.changeOptions = function() {
        if (ctrl.currentOptions.difficulty)
          ctrl.difficultySliders.Fitness.options.disabled = ctrl.currentOptions.difficulty.avoidhills === true ? true : false;
        orsSettingsFactory.setActiveOptions(ctrl.currentOptions);
      };
      ctrl.getClass = function(bool) {
        if (bool === true)
          return "fa fa-fw fa-chevron-down";
        else
          return "fa fa-fw fa-chevron-right";
      };
      ctrl.refreshSlider = function() {
        $timeout(function() {
          $scope.$broadcast('rzSliderForceRender');
        }, 1000);
      };
      ctrl.reCalcViewDimensions = function() {
        $timeout(function() {
          $scope.$broadcast('reCalcViewDimensions');
        }, 1000);
      };
      ctrl.refreshSlider();
    }]
  });
  return {};
})();
