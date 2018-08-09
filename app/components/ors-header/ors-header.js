angular.module('orsApp.ors-header', [])
    .component('orsHeader', {
        templateUrl: 'components/ors-header/ors-header.html',
        controller: ['$rootScope', '$timeout', '$translate', 'orsUtilsService', 'orsSettingsFactory', 'orsCookiesFactory', 'lists', 'ENV', function ($rootScope, $timeout, $translate, orsUtilsService, orsSettingsFactory, orsCookiesFactory, lists, ENV) {
            let ctrl = this

            ctrl.$onInit = () => {
                /* initialize endpoint urls from app/js/config.js*/
                ctrl.envBase = ENV.directions.split("/").slice(0, 3).join("/")
                ctrl.env = {
                    geocode: {
                        base: ENV.geocode.split("/").slice(0, 3).join("/"),
                        end: ENV.geocode.split("/").slice(3).join("/")
                    },
                    directions: {
                        base: ENV.directions.split("/").slice(0, 3).join("/"),
                        end: ENV.directions.split("/").slice(3).join("/")
                    },
                    isochrones: {
                        base: ENV.isochrones.split("/").slice(0, 3).join("/"),
                        end: ENV.isochrones.split("/").slice(3).join("/")
                    },
                    matrix: {
                        base: ENV.matrix.split("/").slice(0, 3).join("/"),
                        end: ENV.matrix.split("/").slice(3).join("/")
                    },
                    pois: {
                        base: ENV.pois.split("/").slice(0, 3).join("/"),
                        end: ENV.pois.split("/").slice(3).join("/")
                    }
                }
                ctrl.backup = JSON.parse(JSON.stringify(ctrl.env))
                ctrl.extra_infos = {
                    steepness: true,
                    waytype: true,
                    surface: true
                }
                ctrl.lists_extra_info = lists.extra_info
                ctrl.getActiveProfile = orsSettingsFactory.getActiveProfile
                ctrl.optionList = lists.userOptions
                ctrl.changeExtras()
            }

            ctrl.changeExtras = () => {
                orsUtilsService.setExtraInformation(ctrl.extra_infos)
            }
            /**
             * Reset all endpoint URLs to their initial state
             */
            ctrl.resetEndpoints = () => {
                ctrl.env = JSON.parse(JSON.stringify(ctrl.backup))
                ctrl.envBase = ctrl.env.directions.base;
            }

            /**
             * Presets for setting Requests to a Local ORS server or directly to the ORS API
             * @param {String} fill - name of the preset to apply
             */
            ctrl.setEndpoints = (fill) => {
                console.log(fill)
                if (fill === "local") {
                    angular.forEach(ctrl.env, (endpoint, key) => {
                        endpoint.base = ctrl.envBase = "http://localhost:8082/openrouteservice-4.5.1"
                        endpoint.end = key
                    })
                } else if (fill === "api") {
                    angular.forEach(ctrl.env, (endpoint, key) => {
                        endpoint.base = ctrl.envBase = "https://api.openrouteservice.org"
                        endpoint.end = key
                    })
                }
            }
            /**
             * Set baseURL for every endpoint with value from input field
             * @param {String} value -
             */
            ctrl.setDefaultValues = (value) => {
                angular.forEach(ctrl.env, (endpoint) => {
                    console.log(endpoint)
                    endpoint.base = value
                })
            }
            /**
             * Change endpoints in the app/js/config.js file to take immediate effect
             */
            ctrl.changeEndpoints = () => {
                ENV.directions = [ctrl.env.directions.base, ctrl.env.directions.end].join("/")
                ENV.analyse = [ctrl.env.isochrones.base, ctrl.env.isochrones.end].join("/")
                ENV.geocode = [ctrl.env.geocode.base, ctrl.env.geocode.end].join("/")
                ENV.matrix = [ctrl.env.matrix.base, ctrl.env.matrix.end].join("/")
                ENV.pois = [ctrl.env.pois.base, ctrl.env.pois.end].join("/")
            }

            /** subscription to settings, when permalink is used with lang params
             we have to update language settings. This is called before panel settings
             object is defined, this is why we have two subscriptions */
            orsSettingsFactory.userOptionsSubject.subscribe(settings => {
                ctrl.currentOptions = settings
                $translate.use(ctrl.currentOptions.language)
            })
            ctrl.changeOptions = (setting) => {
                if (setting === 'language') $translate.use(ctrl.currentOptions.language)
                console.log(ctrl.currentOptions.showHeightgraph)
                orsSettingsFactory.setUserOptions(ctrl.currentOptions)
                orsCookiesFactory.setCookieUserOptions(ctrl.currentOptions)
                orsUtilsService.parseSettingsToPermalink(orsSettingsFactory.getSettings(), orsSettingsFactory.getUserOptions())
                let payload = {
                    options: ctrl.currentOptions,
                    setting: setting
                }
                $rootScope.$broadcast('changeOptions', payload)
                // TODO: Reload site if site language is changed, we need this due to translations
                // update slider units!
                $timeout(() => {
                    $rootScope.$broadcast('rzSliderForceRender')
                })
            }
        }],
        bindings: {}
    })