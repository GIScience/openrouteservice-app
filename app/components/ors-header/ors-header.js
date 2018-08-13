angular.module('orsApp.ors-header', [])
    .component('orsHeader', {
        templateUrl: 'components/ors-header/ors-header.html',
        controller: ['$rootScope', '$timeout', '$translate', 'orsUtilsService', 'orsSettingsFactory', 'orsCookiesFactory', 'lists', 'ENV', function ($rootScope, $timeout, $translate, orsUtilsService, orsSettingsFactory, orsCookiesFactory, lists, ENV) {
            let ctrl = this

            ctrl.$onInit = () => {
                // uncomment for settings development
                // ctrl.showSettings = ctrl.showDev = ctrl.editEndpoints =  true;

                /* initialize endpoint urls from cookies */
                ctrl.env = orsCookiesFactory.getCookies().env
                ctrl.changeEndpoints()
                ctrl.envBase = ctrl.env.directions.split("/").slice(0, 3).join("/")
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
                ctrl.envBase = ctrl.env.directions.split("/").slice(0, 3).join("/")
                ctrl.currentOptions.env = ctrl.env
                orsCookiesFactory.setCookieUserOptions(ctrl.currentOptions)
            }

            /**
             * Presets for setting Requests to a Local ORS server or directly to the ORS API
             * @param {String} fill - name of the preset to apply
             */
            ctrl.setEndpoints = (fill) => {
                console.log(fill)
                if (fill === "local") {
                    console.log(ctrl.env)
                    angular.forEach(Object.keys(ctrl.env), (key) => {
                        ctrl.envBase = "http://localhost:8082/openrouteservice-4.5.1"
                        ctrl.env[key] = ctrl.envBase + "/" + key
                    })
                } else if (fill === "api") {
                    angular.forEach(Object.keys(ctrl.env), (key) => {
                        ctrl.envBase = "https://api.openrouteservice.org"
                        ctrl.env[key] = ctrl.envBase + "/" + key
                    })
                }
            }
            /**
             * Set baseURL for every endpoint with value from input field
             * @param {String} value - the baseURL
             */
            ctrl.setDefaultValues = (value) => {
                angular.forEach(Object.keys(ctrl.env), (key) => {
                    ctrl.env[key] = [value, ctrl.env[key].split("/").slice(3).join("/")].join("/")
                })
            }
            /**
             * Change endpoints in the app/js/config.js file to take immediate effect
             */
            ctrl.changeEndpoints = () => {
                ENV.directions = ctrl.env.directions
                ENV.analyse = ctrl.env.isochrones
                ENV.geocode = ctrl.env.geocode
                ENV.matrix = ctrl.env.matrix
                ENV.pois = ctrl.env.pois
                ctrl.currentOptions.env = ctrl.env
                orsCookiesFactory.setCookieUserOptions(ctrl.currentOptions)
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