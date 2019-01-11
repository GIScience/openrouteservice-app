angular.module("orsApp.ors-options", []).component("orsOptions", {
  templateUrl:
    "components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-options/ors-options.html",
  bindings: {
    activeSubgroup: "<",
    activeProfile: "<",
    showOptions: "<"
  },
  controller: [
    "orsSettingsFactory",
    "orsCookiesFactory",
    "orsObjectsFactory",
    "orsUtilsService",
    "orsRequestService",
    "orsParamsService",
    "orsFuelService",
    "$scope",
    "$timeout",
    "lists",
    "countries",
    "carCategories",
    "carBrands",
    function(
      orsSettingsFactory,
      orsCookiesFactory,
      orsObjectsFactory,
      orsUtilsService,
      orsRequestService,
      orsParamsService,
      orsFuelService,
      $scope,
      $timeout,
      lists,
      countries,
      carCategories,
      carBrands
    ) {
      let ctrl = this;
      ctrl.fuelSettings = true;
      ctrl.optionList = lists.optionList;
      ctrl.$onInit = () => {
        /** This is a reference of the settings object, if we change here, it is updated in settings */
        ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
        // preference/weight is only considered for routing panel
        if (ctrl.routing)
          ctrl.currentOptions.weight =
            ctrl.currentOptions.weight !== undefined
              ? ctrl.currentOptions.weight
              : ctrl.optionList.weight.Fastest.value;
        ctrl.weightSlider = {
          value: ctrl.currentOptions.weight,
          options: {
            stepsArray: [
              {
                value: ctrl.optionList.weight.Fastest.value
              },
              {
                value: ctrl.optionList.weight.Shortest.value
              },
              {
                value: ctrl.optionList.weight.Recommended.value
              }
            ],
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
            translate: value => {
              return value + " <b>km/h</b>";
            },
            onEnd: () => {
              ctrl.currentOptions.maxspeed = ctrl.maxspeedSlider.value;
              ctrl.changeOptions();
            }
          }
        };
        ctrl.toggleMaxspeedSlider(false);
        ctrl.greenActive = false;
        ctrl.toggleGreenSlider = (fireRequest = true) => {
          if (ctrl.greenActive === true) {
            ctrl.greenSlider.options.disabled = false;
            ctrl.currentOptions.green = ctrl.greenSlider.value;
          } else if (ctrl.greenActive === false) {
            ctrl.greenSlider.options.disabled = true;
            delete ctrl.currentOptions.green;
          }
          ctrl.refreshSlider();
          if (fireRequest) ctrl.changeOptions();
        };
        ctrl.greenSlider = {
          value: ctrl.optionList.green.min,
          options: {
            floor: ctrl.optionList.green.min,
            ceil: ctrl.optionList.green.max,
            step: 0.1,
            precision: 1,
            translate: value => {
              return value * 10 + "/10 <b>score</b>";
            },
            onEnd: () => {
              ctrl.currentOptions.green = ctrl.greenSlider.value;
              ctrl.changeOptions();
            }
          }
        };
        ctrl.toggleGreenSlider(false);
        ctrl.quietActive = false;
        ctrl.toggleQuietSlider = (fireRequest = true) => {
          if (ctrl.quietActive === true) {
            ctrl.quietSlider.options.disabled = false;
            ctrl.currentOptions.quiet = ctrl.quietSlider.value;
          } else if (ctrl.quietActive === false) {
            ctrl.quietSlider.options.disabled = true;
            delete ctrl.currentOptions.quiet;
          }
          ctrl.refreshSlider();
          if (fireRequest) ctrl.changeOptions();
        };
        ctrl.quietSlider = {
          value: ctrl.optionList.quiet.min,
          options: {
            floor: ctrl.optionList.quiet.min,
            ceil: ctrl.optionList.quiet.max,
            step: 0.1,
            precision: 1,
            translate: value => {
              return value * 10 + "/10 <b>score</b>";
            },
            onEnd: () => {
              ctrl.currentOptions.quiet = ctrl.quietSlider.value;
              ctrl.changeOptions();
            }
          }
        };
        ctrl.toggleQuietSlider(false);
        // set hgv options from params
        ctrl.toggleHgvOptSlider = (name, fireRequest = true) => {
          switch (name) {
            case "height":
              if (ctrl.hgvHeightCb === true) {
                ctrl.hgvSliders.Height.options.disabled = false;
                ctrl.currentOptions.height = ctrl.hgvSliders.Height.value;
              } else if (ctrl.hgvHeightCb === false) {
                ctrl.hgvSliders.Height.options.disabled = true;
                delete ctrl.currentOptions.height;
              }
              break;
            case "width":
              if (ctrl.hgvWidthCb === true) {
                ctrl.hgvSliders.Width.options.disabled = false;
                ctrl.currentOptions.width = ctrl.hgvSliders.Width.value;
              } else if (ctrl.hgvWidthCb === false) {
                ctrl.hgvSliders.Width.options.disabled = true;
                delete ctrl.currentOptions.width;
              }
              break;
            case "length":
              if (ctrl.hgvLengthCb === true) {
                ctrl.hgvSliders.Length.options.disabled = false;
                ctrl.currentOptions.length = ctrl.hgvSliders.Length.value;
              } else if (ctrl.hgvLengthCb === false) {
                ctrl.hgvSliders.Length.options.disabled = true;
                delete ctrl.currentOptions.length;
              }
              break;
            case "hgvWeight":
              if (ctrl.hgvWeightCb === true) {
                ctrl.hgvSliders.Weight.options.disabled = false;
                ctrl.currentOptions.hgvWeight = ctrl.hgvSliders.Weight.value;
              } else if (ctrl.hgvWeightCb === false) {
                ctrl.hgvSliders.Weight.options.disabled = true;
                delete ctrl.currentOptions.hgvWeight;
              }
              break;
            case "axleload":
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
        if (ctrl.currentOptions.hazmat !== undefined)
          ctrl.currentOptions.hazmat = true;
        const hgvParamsInit = {
          height: {
            val: ctrl.optionList.hgvParams.height.min,
            checkbox: "hgvHeightCb"
          },
          width: {
            val: ctrl.optionList.hgvParams.width.min,
            checkbox: "hgvWidthCb"
          },
          hgvWeight: {
            val: ctrl.optionList.hgvParams.hgvWeight.min,
            checkbox: "hgvWeightCb"
          },
          axleload: {
            val: ctrl.optionList.hgvParams.axleload.min,
            checkbox: "hgvAxleloadCb"
          },
          length: {
            val: ctrl.optionList.hgvParams.length.min,
            checkbox: "hgvLengthCb"
          }
        };
        // check if params contain hgv settings within range
        angular.forEach(hgvParamsInit, (val, key) => {
          if (
            ctrl.currentOptions[key] >= ctrl.optionList.hgvParams[key].min &&
            ctrl.currentOptions[key] <= ctrl.optionList.hgvParams[key].max
          ) {
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
              translate: value => {
                return value + " <b>m</b>";
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
              translate: value => {
                return value + " <b>m</b>";
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
              translate: value => {
                return value + " <b>m</b>";
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
              translate: value => {
                return value + " <b>t</b>";
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
              translate: value => {
                return value + " <b>t</b>";
              },
              onEnd: () => {
                ctrl.currentOptions.hgvWeight = ctrl.hgvSliders.Weight.value;
                ctrl.changeOptions();
              }
            }
          }
        };
        ctrl.toggleHgvOptSlider("", false);
        // Difficulty settings
        ctrl.currentOptions.fitness =
          ctrl.currentOptions.fitness !== undefined
            ? ctrl.optionList.difficulty.fitness[ctrl.currentOptions.fitness]
                .value
            : ctrl.optionList.difficulty.fitness["-1"].value;
        ctrl.fitnessValue =
          ctrl.optionList.difficulty.fitness[ctrl.currentOptions.fitness].name;
        ctrl.currentOptions.steepness =
          ctrl.currentOptions.steepness !== undefined
            ? ctrl.currentOptions.steepness
            : ctrl.optionList.difficulty.steepness.min;
        ctrl.avoidHillsCheckbox();
        ctrl.difficultySliders = {
          Fitness: {
            value: ctrl.currentOptions.fitness,
            options: {
              stepsArray: [
                {
                  value: ctrl.optionList.difficulty.fitness["-1"].value
                },
                {
                  value: ctrl.optionList.difficulty.fitness["0"].value
                },
                {
                  value: ctrl.optionList.difficulty.fitness["1"].value
                },
                {
                  value: ctrl.optionList.difficulty.fitness["2"].value
                },
                {
                  value: ctrl.optionList.difficulty.fitness["3"].value
                }
              ],
              showTicks: true,
              showTicksValues: false,
              hidePointerLabels: true,
              hideLimitLabels: true,
              onEnd: () => {
                ctrl.currentOptions.fitness =
                  ctrl.difficultySliders.Fitness.value;
                ctrl.changeOptions();
                ctrl.avoidHillsCheckbox();
                ctrl.fitnessValue =
                  ctrl.optionList.difficulty.fitness[
                    ctrl.currentOptions.fitness
                  ].name;
              }
            }
          },
          Steepness: {
            value: ctrl.currentOptions.steepness,
            options: {
              floor: ctrl.optionList.difficulty.steepness.min,
              ceil: ctrl.optionList.difficulty.steepness.max,
              translate: value => {
                return value + " <b>%</b>";
              },
              onEnd: () => {
                ctrl.currentOptions.steepness =
                  ctrl.difficultySliders.Steepness.value;
                ctrl.changeOptions();
              }
            }
          }
        };
        // wheelchair sliders
        ctrl.currentOptions.surface =
          ctrl.currentOptions.surface !== undefined
            ? ctrl.optionList.wheelchair.Surface[ctrl.currentOptions.surface]
                .value
            : ctrl.optionList.wheelchair.Surface["any"].value;
        ctrl.currentOptions.incline =
          ctrl.currentOptions.incline !== undefined
            ? ctrl.optionList.wheelchair.Incline[ctrl.currentOptions.incline]
                .value
            : ctrl.optionList.wheelchair.Incline["31"].value;
        ctrl.currentOptions.curb =
          ctrl.currentOptions.curb !== undefined
            ? ctrl.optionList.wheelchair.Curb[ctrl.currentOptions.curb].value
            : ctrl.optionList.wheelchair.Curb["0.31"].value;
        ctrl.currentOptions.wheelchairWidth =
          ctrl.currentOptions.wheelchairWidth !== undefined
            ? ctrl.optionList.wheelchair.Width[
                ctrl.currentOptions.wheelchairWidth
              ].value
            : ctrl.optionList.wheelchair.Width["-1"].value;
        ctrl.wheelchairSliders = {
          Surface: {
            value: ctrl.currentOptions.surface,
            options: {
              stepsArray: [
                {
                  value: ctrl.optionList.wheelchair.Surface["concrete"].value
                },
                {
                  value:
                    ctrl.optionList.wheelchair.Surface["cobblestone:flattened"]
                      .value
                },
                {
                  value: ctrl.optionList.wheelchair.Surface["cobblestone"].value
                },
                {
                  value: ctrl.optionList.wheelchair.Surface["compacted"].value
                },
                {
                  value: ctrl.optionList.wheelchair.Surface["any"].value
                }
              ],
              showTicks: true,
              showTicksValues: false,
              hidePointerLabels: true,
              hideLimitLabels: true,
              onEnd: () => {
                ctrl.currentOptions.surface =
                  ctrl.wheelchairSliders.Surface.value;
                ctrl.changeOptions();
              }
            }
          },
          Incline: {
            value: ctrl.currentOptions.incline,
            options: {
              stepsArray: [
                {
                  value: ctrl.optionList.wheelchair.Incline["3"].value
                },
                {
                  value: ctrl.optionList.wheelchair.Incline["6"].value
                },
                {
                  value: ctrl.optionList.wheelchair.Incline["10"].value
                },
                {
                  value: ctrl.optionList.wheelchair.Incline["15"].value
                },
                {
                  value: ctrl.optionList.wheelchair.Incline["31"].value
                }
              ],
              showTicks: true,
              showTicksValues: false,
              hidePointerLabels: true,
              hideLimitLabels: true,
              onEnd: () => {
                ctrl.currentOptions.incline =
                  ctrl.wheelchairSliders.Incline.value;
                ctrl.changeOptions();
              }
            }
          },
          Curb: {
            value: ctrl.currentOptions.curb,
            options: {
              stepsArray: [
                {
                  value: ctrl.optionList.wheelchair.Curb["0.03"].value
                },
                {
                  value: ctrl.optionList.wheelchair.Curb["0.06"].value
                },
                {
                  value: ctrl.optionList.wheelchair.Curb["0.1"].value
                },
                {
                  value: ctrl.optionList.wheelchair.Curb["0.31"].value
                }
              ],
              showTicks: true,
              showTicksValues: false,
              hidePointerLabels: true,
              hideLimitLabels: true,
              onEnd: () => {
                ctrl.currentOptions.curb = ctrl.wheelchairSliders.Curb.value;
                ctrl.changeOptions();
              }
            }
          },
          Width: {
            value: ctrl.currentOptions.wheelchairWidth,
            options: {
              stepsArray: [
                {
                  value: ctrl.optionList.wheelchair.Width["1"].value
                },
                {
                  value: ctrl.optionList.wheelchair.Width["1.5"].value
                },
                {
                  value: ctrl.optionList.wheelchair.Width["2"].value
                },
                {
                  value: ctrl.optionList.wheelchair.Width["-1"].value
                }
              ],
              showTicks: true,
              showTicksValues: false,
              hidePointerLabels: true,
              hideLimitLabels: true,
              onEnd: () => {
                ctrl.currentOptions.wheelchairWidth =
                  ctrl.wheelchairSliders.Width.value;
                ctrl.changeOptions();
              }
            }
          }
        };
        if (ctrl.currentOptions.borders.country !== undefined) {
          let numbers = ctrl.currentOptions.borders.country.split("|");
          // parse cid to real ID and pass it to checktCountries + checkbox model
          for (var i = 0; i < ctrl.countries.length; i++) {
            if (numbers.indexOf(ctrl.countries[i].cid) != -1) {
              ctrl.checkedCountries.push(ctrl.countries[i].id);
              ctrl.countries[i].check = true;
              ctrl.avoidCountries = true;
            }
          }
        }
      };
      ctrl.avoidHillsCheckbox = () => {
        let avoidhillsCheckbox = angular.element(
          document.querySelector("#cb-avoidhills")
        );
        let avoidhillsCheckboxInput = angular.element(
          document.querySelector("#cb-avoidhills-input")
        );
        if (
          ctrl.optionList.difficulty.fitness[ctrl.currentOptions.fitness]
            .value >= 0
        ) {
          avoidhillsCheckbox.addClass("disabled");
          avoidhillsCheckboxInput.attr("disabled", "disabled");
        } else {
          avoidhillsCheckbox.removeClass("disabled");
          avoidhillsCheckboxInput.removeAttr("disabled");
        }
      };
      ctrl.$onChanges = changesObj => {
        console.log(changesObj);
        if (changesObj.showOptions) ctrl.refreshSlider();
        if (changesObj.activeSubgroup || changesObj.activeProfile) {
          console.log("hallo", changesObj.activeProfile);
          ctrl.maxspeedOptions = ctrl.optionList.maxspeeds[ctrl.activeSubgroup];
          // check if already initiated
          /** update slider settings */
          if (ctrl.maxspeedSlider) {
            console.log(true);
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
        ctrl.routing = route == "directions" ? true : false;
      });
      ctrl.changeOptions = () => {
        // call setoptions
        if (ctrl.currentOptions.difficulty)
          ctrl.difficultySliders.Fitness.options.disabled =
            ctrl.currentOptions.difficulty.avoidhills === true;
        orsSettingsFactory.setActiveOptions(ctrl.currentOptions, ctrl.routing);
      };
      ctrl.getClass = bool => {
        if (bool === true) return "fa fa-fw fa-chevron-down";
        else return "fa fa-fw fa-chevron-right";
      };
      ctrl.refreshSlider = () => {
        $timeout(() => {
          $scope.$broadcast("rzSliderForceRender");
        }, 1000);
      };
      ctrl.reCalcViewDimensions = () => {
        $timeout(() => {
          $scope.$broadcast("reCalcViewDimensions");
        }, 1000);
      };
      //ctrl.reCalcViewDimensions();
      ctrl.refreshSlider();
      // get locale -> TODO works only on site reload after on-session-switch
      ctrl.getSettingsLanguage = () => {
        ctrl.language = orsCookiesFactory.getCookies().language.toString();
      };
      ctrl.getSettingsLanguage();
      ctrl.checkedCountries = [];
      ctrl.countries = countries.list;
      ctrl.queryCountries = "";
      /**
       * Unchecks all countries and removes them from ctrl.checkedCountries
       */
      ctrl.removeCountries = () => {
        for (var i = 0; i < ctrl.checkedCountries.length; i++) {
          ctrl.countries[ctrl.checkedCountries[i]].check = false;
        }
        ctrl.checkedCountries = [];
        ctrl.queryCountries = "";
        ctrl.passBordersToOptions();
        ctrl.avoidCountries = false;
      };
      /**
       * Adds or Removes a country from ctrl.checkedCountries
       * @param {int} idx: position of the country in ctrl.countries array
       */
      ctrl.toggleCountries = idx => {
        if (ctrl.countries[idx].check) {
          ctrl.checkedCountries.push(idx);
          ctrl.avoidCountries = true;
        } else {
          var position = ctrl.checkedCountries.indexOf(idx);
          ctrl.checkedCountries.splice(position, 1);
        }
        ctrl.passBordersToOptions();
      };
      /**
       * Generates the avoid_countries value and passes it to options
       */
      ctrl.passBordersToOptions = () => {
        let cstring = "";
        if (ctrl.avoidCountries) {
          for (var i = 0; i < ctrl.checkedCountries.length; i++) {
            let country = ctrl.countries[ctrl.checkedCountries[i]].cid;
            if (cstring === "") cstring += country;
            else cstring += "|" + country;
          }
        }
        if (ctrl.currentOptions.borders !== undefined)
          ctrl.currentOptions.borders.country = cstring;
        else
          ctrl.currentOptions.borders = {
            country: cstring
          };

        ctrl.changeOptions();
      };
      $scope.checked = row => {
        return !!(row.hasOwnProperty("check") && row.check === true);
      };
      $scope.search = row => {
        return !!(
          (row.official_en_name
            .toLowerCase()
            .indexOf(ctrl.queryCountries.toLowerCase() || "") !== -1 ||
            row.cid.indexOf(ctrl.queryCountries || "") !== -1 ||
            row.country_code
              .toLowerCase()
              .indexOf(ctrl.queryCountries.toLowerCase() || "") !== -1 ||
            row.native_names
              .toLowerCase()
              .indexOf(ctrl.queryCountries.toLowerCase() || "") !== -1 ||
            row[ctrl.language]
              .toLowerCase()
              .indexOf(ctrl.queryCountries.toLowerCase() || "") !== -1) &&
          (!row.hasOwnProperty("check") || row.check === false)
        );
      };
      ctrl.queryBrand = "";
      ctrl.carCategories = carCategories;
      ctrl.brands = carBrands;
      ctrl.drivingSpeed = false;
      ctrl.drivingStyle = true;
      ctrl.chooseCategory = () => {
        // rename Object key of the filters.fuel_consumptions and keep value
        const renameKey = (o, newKey) => {
          if (Object.keys(o)[0] !== newKey) {
            Object.defineProperty(
              o,
              newKey,
              Object.getOwnPropertyDescriptor(o, Object.keys(o)[0])
            );
            delete o[Object.keys(o)[0]];
          }
        };
        if (ctrl.tankSize)
          renameKey(
            ctrl.ofs.filters.tank_sizes,
            ctrl.ofs.filters.vehicle_categories[0]
          );
        if (ctrl.fuelConsumption)
          renameKey(
            ctrl.ofs.filters.fuel_consumptions,
            ctrl.ofs.filters.vehicle_categories[0]
          );
      };
      ctrl.check = what => {
        switch (what) {
          case "speed":
            if (ctrl.drivingSpeed) ctrl.drivingSpeed = false;
            delete ctrl.drivingSpeed;
            break;
          case "style":
            if (ctrl.drivingStyle) ctrl.drivingStyle = false;
            delete ctrl.drivingStyle;
            break;
        }
      };
      ctrl.requestConsumption = () => {
        ctrl.currentOptions.ofs = ctrl.ofs;
        if (ctrl.currentOptions.ofs && !ctrl.drivingSpeed) {
          delete ctrl.currentOptions.ofs.filters.driving_speed;
        }
        if (ctrl.currentOptions.ofs && !ctrl.drivingStyle) {
          delete ctrl.currentOptions.ofs.filters.driving_style;
        }
        orsSettingsFactory.setActiveOptions(ctrl.currentOptions);
        orsFuelService.getConsumption(ctrl.currentOptions.ofs);
      };
      //
      //
      ctrl.ofs = {
        filters: {
          data_source: "cfd",
          fuel_type: "gasoline",
          vehicle_type: "car",
          driving_style: "moderate",
          driving_speed: 60,
          vehicle_categories: [],
          fuel_consumptions: {},
          tank_sizes: {}
        }
      };
      $scope.searchBrand = row => {
        return !!(
          row.toLowerCase().indexOf(ctrl.queryBrand.toLowerCase() || "") !== -1
        );
      };
    }
  ]
});
