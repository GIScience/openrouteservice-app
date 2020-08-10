angular.module("orsApp.ors-options", []).component("orsOptions", {
  templateUrl:
    "components/ors-panel-routing/ors-waypoints/ors-route-controls/ors-options/ors-options.html",
  bindings: {
    activeSubgroup: "<",
    activeProfile: "<",
    showOptions: "<",
    roundTrip: "=?"
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
      carCategories
    ) {
      let ctrl = this;
      ctrl.optionList = lists.optionList;
      ctrl.$onInit = () => {
        /** This is a reference of the settings object, if we change here, it is updated in settings */
        ctrl.currentOptions = orsSettingsFactory.getActiveOptions();
        if (!ctrl.carBrands) {
          ctrl.initOFS();
        }

        // preference/weight is only considered for routing panel
        if (ctrl.routing)
          ctrl.currentOptions.weight =
            ctrl.currentOptions.weight !== undefined
              ? ctrl.currentOptions.weight
              : ctrl.optionList.weight.Recommended.value;
        ctrl.weightSlider = {
          value: ctrl.currentOptions.weight,
          options: {
            stepsArray: [
              {
                value: ctrl.optionList.weight.Recommended.value
              },
              {
                value: ctrl.optionList.weight.Shortest.value
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
        // Set round trip settings from permalink if available
        ctrl.roundTripOptions =
          Object.entries(ctrl.currentOptions.round_trip).length !== 0;
        ctrl.roundTrip = ctrl.roundTripOptions;
        ctrl.waypoints = orsSettingsFactory.getWaypoints();
        if (ctrl.roundTrip && ctrl.waypoints.length > 1) {
          ctrl.cachedWayPoints = ctrl.waypoints;
          ctrl.waypoints = [ctrl.cachedWayPoints.shift()];
          orsSettingsFactory.setWaypoints(ctrl.waypoints);
        }
        let {
          length: round_length,
          points: round_points,
          seed: round_seed
        } = ctrl.currentOptions.round_trip;
        ctrl.roundTripSeed = {
          min: round_seed || 0,
          max: round_seed || 0,
          value: round_seed || 0
        };
        /**
         * Called when checking the roundtrip checkbox.
         * Event is true when checked & false when unchecked.
         * Unnecessary waypoints are stored in ctrl.chachedWayPoints and used again when switching
         * back to normal routing.
         * @param event
         */
        ctrl.toggleRoundTrip = event => {
          if (event) {
            ctrl.currentOptions.round_trip = {
              length: ctrl.roundTripLengthSlider.value,
              points: ctrl.roundTripPointsSlider.value,
              seed: ctrl.roundTripSeed.value
            };
            ctrl.cachedWayPoints = orsSettingsFactory.getWaypoints();
            ctrl.waypoints = [ctrl.cachedWayPoints.shift()];
            ctrl.changeOptions();
            orsSettingsFactory.setWaypoints(ctrl.waypoints);
          } else {
            if (ctrl.cachedWayPoints) {
              ctrl.waypoints = ctrl.waypoints
                ? ctrl.waypoints.concat(ctrl.cachedWayPoints)
                : ctrl.cachedWayPoints;
            } else {
              ctrl.waypoints.push(
                orsObjectsFactory.createWaypoint("", false, 0)
              );
            }
            ctrl.currentOptions.round_trip = {};
            ctrl.changeOptions();
            orsSettingsFactory.setWaypoints(ctrl.waypoints);
          }
        };

        ctrl.roundTripLengthSlider = {
          value: round_length || ctrl.optionList.roundTrip.length.preset,
          options: {
            floor: ctrl.optionList.roundTrip.length.min,
            ceil: ctrl.optionList.roundTrip.length.max,
            step: 1000,
            precision: 1,
            translate: value => {
              return value / 1000 + " <b>km</b>";
            },
            onEnd: () => {
              if (ctrl.currentOptions.round_trip) {
                ctrl.currentOptions.round_trip.length =
                  ctrl.roundTripLengthSlider.value;
              } else {
                ctrl.currentOptions.round_trip = {
                  length: ctrl.roundTripLengthSlider.value
                };
              }
              ctrl.changeOptions();
            }
          }
        };
        ctrl.roundTripPointsSlider = {
          value: round_points || ctrl.optionList.roundTrip.points.preset,
          options: {
            floor: ctrl.optionList.roundTrip.points.min,
            ceil: ctrl.optionList.roundTrip.points.max,
            precision: 1,
            translate: value => {
              return value + "";
            },
            onEnd: () => {
              if (ctrl.currentOptions.round_trip) {
                ctrl.currentOptions.round_trip.points =
                  ctrl.roundTripPointsSlider.value;
              } else {
                ctrl.currentOptions.round_trip = {
                  points: ctrl.roundTripPointsSlider.value
                };
              }
              ctrl.changeOptions();
            }
          }
        };
        /**
         * Simple logic to handle the seed parameter.
         * Moving the seed over the maximum seed value increases it.
         * Max and Min values are for returning to previous randomization
         * @param i
         */
        ctrl.moveSeed = i => {
          ctrl.roundTripSeed.value += i;
          if (ctrl.roundTripSeed.value > ctrl.roundTripSeed.max) {
            ctrl.roundTripSeed.max += i;
          }
          ctrl.currentOptions.round_trip.seed = ctrl.roundTripSeed.value;
          ctrl.changeOptions();
        };
        // set maximum_speed slider from params
        const { min, max, preset, step } = lists.optionList.maximum_speed;
        // enable or disable checkbox depending on whether maximum_speed is set
        let maximumSpeedValue;
        if (ctrl.currentOptions.maximum_speed >= 0) {
          maximumSpeedValue = ctrl.currentOptions.maximum_speed;
          ctrl.maxspeedCheckbox = true;
        } else {
          maximumSpeedValue = preset;
          ctrl.maxspeedCheckbox = false;
        }
        ctrl.toggleMaximumSpeedSlider = (fireRequest = true) => {
          if (ctrl.maxspeedCheckbox === true) {
            ctrl.maximumSpeedSlider.options.disabled = false;
            ctrl.currentOptions.maximum_speed = ctrl.maximumSpeedSlider.value;
          } else if (ctrl.maxspeedCheckbox === false) {
            ctrl.maximumSpeedSlider.options.disabled = true;
            delete ctrl.currentOptions.maximum_speed;
          }
          if (fireRequest) ctrl.changeOptions();
        };
        ctrl.maximumSpeedSlider = {
          value: maximumSpeedValue,
          options: {
            floor: min,
            ceil: max,
            step: step,
            translate: value => {
              return value + " <b>km/h</b>";
            },
            onEnd: () => {
              ctrl.currentOptions.maximum_speed = ctrl.maximumSpeedSlider.value;
              ctrl.changeOptions();
            }
          }
        };
        ctrl.toggleMaximumSpeedSlider(false);
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
                  value: ctrl.optionList.wheelchair.Curb["0.001"].value
                },
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
          let numbers = ctrl.currentOptions.borders.country;
          // parse cid to real ID and pass it to checktCountries + checkbox model
          for (var i = 0; i < ctrl.countries.length; i++) {
            if (numbers.indexOf(ctrl.countries[i].cid) !== -1) {
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
        if (changesObj.showOptions) ctrl.refreshSlider();
      };
      // Get the app route, we need this to know whether to fire a request when the options change
      orsSettingsFactory.subscribeToNgRoute(function onNext(route) {
        ctrl.routing = route === "directions";
      });
      ctrl.changeOptions = () => {
        if (!ctrl.carBrands) {
          ctrl.initOFS();
        }
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
        let countryListToAvoid = [];
        if (ctrl.avoidCountries) {
          for (var i = 0; i < ctrl.checkedCountries.length; i++) {
            countryListToAvoid.push(
              ctrl.countries[ctrl.checkedCountries[i]].cid
            );
          }
        }
        if (ctrl.currentOptions.borders !== undefined)
          ctrl.currentOptions.borders.country = countryListToAvoid;
        else
          ctrl.currentOptions.borders = {
            country: countryListToAvoid
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

      // OFS options
      ctrl.initOFS = () => {
        try {
          let brandsRequest = orsFuelService.getBrands();
          brandsRequest.promise.then(
            brandsResponse => {
              ctrl.carBrands = brandsResponse.brands;
            },
            brandsError => {
              console.log(brandsError);
            }
          );
        } catch (e) {
          ctrl.carBrands = null;
        }
      };
      ctrl.carCategories = carCategories;
      ctrl.categoryCheck = true;
      ctrl.carModels = ctrl.carYears = ctrl.carTypes = [];
      ctrl.set = list => {
        ctrl[list] =
          list === "carYears"
            ? Object.keys(ctrl.carResponse[ctrl.queryModel])
            : list === "carTypes" && ctrl.queryYear
            ? Object.keys(ctrl.carResponse[ctrl.queryModel][ctrl.queryYear])
            : list;
      };
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
      ctrl.toggleSource = source => {
        if (source === "category") {
          ctrl.brandCheck = !ctrl.categoryCheck;
        } else if (source === "brand") {
          ctrl.categoryCheck = !ctrl.brandCheck;
        }
      };
      ctrl.requestConsumption = () => {
        if (ctrl.brandCheck) {
          if (ctrl.queryType) {
            ctrl.ofs.filters.cfd_ids =
              ctrl.carResponse[ctrl.queryModel][ctrl.queryYear][ctrl.queryType];
            ctrl.ofs.filters.request_id = `${ctrl.queryBrand} - ${ctrl.queryModel} (${ctrl.queryYear}) ${ctrl.queryType}`;
          } else if (ctrl.queryYear) {
            ctrl.ofs.filters.cfd_ids =
              ctrl.carResponse[ctrl.queryModel][ctrl.queryYear].all;
            ctrl.ofs.filters.request_id = `${ctrl.queryBrand} - ${ctrl.queryModel} (${ctrl.queryYear})`;
          } else if (ctrl.queryModel) {
            ctrl.ofs.filters.cfd_ids = ctrl.carResponse[ctrl.queryModel].all;
            ctrl.ofs.filters.request_id = `${ctrl.queryBrand} - ${ctrl.queryModel}`;
          }
        } else {
          ctrl.ofs.filters.request_id =
            ctrl.carCategories[ctrl.ofs.filters.vehicle_categories[0]].en;
        }
        ctrl.currentOptions.ofs = ctrl.ofs;
        if (ctrl.categoryCheck) {
          delete ctrl.currentOptions.ofs.filters.cfd_ids;
        } else {
          delete ctrl.currentOptions.ofs.filters.vehicle_categories[0];
        }
        orsSettingsFactory.setActiveOptions(ctrl.currentOptions);
        ctrl.requesting = true;
        orsFuelService.getConsumption(ctrl.currentOptions.ofs);
        ctrl.requesting = false;
        if (!ctrl.autoCall) {
          ctrl.removeOfsSettings();
        }
      };
      ctrl.filterOutAll = list => {
        return list.filter(e => {
          return e !== "all";
        });
      };
      ctrl.removeOfsSettings = () => {
        delete ctrl.currentOptions.ofs;
        orsSettingsFactory.setActiveOptions(ctrl.currentOptions);
      };
      ctrl.requestCars = () => {
        let carRequest = orsFuelService.getCars(ctrl.queryBrand);
        carRequest.promise.then(
          carResponse => {
            ctrl.carResponse = carResponse;
            ctrl.carModels = Object.keys(carResponse);
          },
          carError => {
            console.log(carError);
          }
        );
      };
      ctrl.toggleAutoCall = () => {
        if (!ctrl.autoCall) {
          ctrl.removeOfsSettings();
        } else {
          ctrl.currentOptions.ofs = ctrl.ofs;
          orsSettingsFactory.setActiveOptions(ctrl.currentOptions);
        }
      };
      //
      ctrl.ofs = {
        filters: {
          data_source: "cfd",
          fuel_type: "gasoline",
          vehicle_type: "car",
          driving_speed: 60,
          vehicle_categories: ["c"],
          fuel_consumptions: {},
          tank_sizes: {},
          request_id: "medium cars"
        }
      };
      $scope.searchBrand = row => {
        return ctrl.queryBrand
          ? !!(
              row.toLowerCase().indexOf(ctrl.queryBrand.toLowerCase() || "") !==
              -1
            )
          : row;
      };
    }
  ]
});
