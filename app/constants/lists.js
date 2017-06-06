/**
 * various keyword lists used in the client
 */
angular.module('orsApp').constant('lists', {
    waypointIcons: {
        0: {
            className: "ors-marker-start",
            iconSize: [45, 45],
            iconAnchor: [22, 45]
        },
        1: {
            className: "ors-marker-via",
            iconSize: [45, 45],
            iconAnchor: [22, 45]
        },
        2: {
            className: "ors-marker-end",
            iconSize: [45, 45],
            iconAnchor: [22, 45]
        },
        3: {
            className: "ors-marker-location",
            iconSize: [45, 45],
            iconAnchor: [22, 45]
        },
        4: {
            className: "ors-marker-highlight",
            iconSize: [45, 45],
            iconAnchor: [22, 45]
        }
    },
    profiles: {
        Car: {
            name: 'Car',
            elevation: false,
            subgroup: 'Car',
            request: 'driving-car',
            shortValue: '0'
        },
        Bicycle: {
            name: 'Bicycle',
            elevation: true,
            subgroup: 'Bicycle',
            request: 'cycling-regular',
            shortValue: '1a'
        },
        BicycleMTB: {
            name: 'BicycleMTB',
            elevation: true,
            subgroup: 'Bicycle',
            request: 'cycling-mountain',
            shortValue: '1b'
        },
        BicycleRacer: {
            name: 'BicycleRacer',
            elevation: true,
            subgroup: 'Bicycle',
            request: 'cycling-road',
            shortValue: '1c'
        },
        BicycleTour: {
            name: 'BicycleTour',
            elevation: true,
            subgroup: 'Bicycle',
            request: 'cycling-tour',
            shortValue: '1d'
        },
        BicycleSafety: {
            name: 'BicycleSafety',
            elevation: true,
            subgroup: 'Bicycle',
            request: 'cycling-safe',
            shortValue: '1e'
        },
        BicycleElectro: {
            name: 'BicycleElectro',
            elevation: true,
            subgroup: 'Bicycle',
            request: 'cycling-electric',
            shortValue: '1f'
        },
        Pedestrian: {
            name: 'Pedestrian',
            elevation: true,
            subgroup: 'Pedestrian',
            request: 'foot-walking',
            shortValue: '2',
            green: true
        },
        PedestrianHiking: {
            name: 'PedestrianHiking',
            elevation: true,
            subgroup: 'Pedestrian',
            request: 'foot-hiking',
            shortValue: '2b',
            green: true
        },
        Wheelchair: {
            name: 'Wheelchair',
            elevation: true,
            subgroup: 'Wheelchair',
            request: 'wheelchair',
            shortValue: '3'
        },
        hgv: {
            name: 'hgv',
            elevation: false,
            subgroup: 'HeavyVehicle',
            request: 'driving-hgv',
            shortValue: '4a'
        },
        goods: {
            name: 'goods',
            elevation: false,
            subgroup: 'HeavyVehicle',
            request: 'driving-hgv',
            shortValue: '4b'
        },
        bus: {
            name: 'bus',
            elevation: false,
            subgroup: 'HeavyVehicle',
            request: 'driving-hgv',
            shortValue: '4c'
        },
        agricultural: {
            name: 'agricultural',
            elevation: false,
            subgroup: 'HeavyVehicle',
            request: 'driving-hgv',
            shortValue: '4d'
        },
        forestry: {
            name: 'forestry',
            elevation: false,
            subgroup: 'HeavyVehicle',
            request: 'driving-hgv',
            shortValue: '4e'
        },
        delivery: {
            name: 'delivery',
            elevation: false,
            subgroup: 'HeavyVehicle',
            request: 'driving-hgv',
            shortValue: '4f'
        }
    },
    optionList: {
        weight: {
            Fastest: {
                value: 'Fastest',
                shortValue: '0'
            },
            Shortest: {
                value: 'Shortest',
                shortValue: '1'
            },
            Recommended: {
                value: 'Recommended',
                shortValue: '2'
            }
        },
        difficulty: {
            fitness: {
                '-1': {
                    name: 'Unset',
                    value: -1
                },
                '0': {
                    name: 'Novice',
                    value: 0
                },
                '1': {
                    name: 'Moderate',
                    value: 1
                },
                '2': {
                    name: 'Amateur',
                    value: 2
                },
                '3': {
                    name: 'Pro',
                    value: 3
                }
            },
            steepness: {
                min: 0,
                max: 15
            }
        },
        avoidables: {
            ferry: {
                name: 'ferries',
                subgroups: ['Car', 'Bicycle', 'HeavyVehicle', 'Wheelchair', 'Pedestrian']
            },
            unpaved: {
                name: 'unpavedroads',
                subgroups: ['Car', 'Bicycle', 'HeavyVehicle']
            },
            paved: {
                name: 'pavedroads',
                subgroups: ['Car', 'Bicycle', 'HeavyVehicle']
            },
            fords: {
                name: 'fords',
                subgroups: ['Car', 'Bicycle', 'HeavyVehicle', 'Wheelchair', 'Pedestrian']
            },
            steps: {
                name: 'steps',
                subgroups: ['Wheelchair', 'Pedestrian', 'Bicycle']
            },
            highways: {
                name: 'highways',
                subgroups: ['Car', 'HeavyVehicle']
            },
            tollroads: {
                name: 'tollways',
                subgroups: ['Car', 'HeavyVehicle']
            },
            tunnels: {
                name: 'tunnels',
                subgroups: ['Car', 'HeavyVehicle']
            },
            tracks: {
                name: 'tracks',
                subgroups: ['Car', 'HeavyVehicle']
            }
        },
        wheelchair: {
            Surface: {
                'concrete': {
                    name: 'Concrete, asphalt',
                    value: 'concrete'
                },
                'cobblestone:flattened': {
                    name: 'Flattened Cobblestone and better',
                    value: 'cobblestone:flattened'
                },
                'cobblestone': {
                    name: 'Cobblestone and better',
                    value: 'cobblestone'
                },
                'compacted': {
                    name: 'Compacted',
                    value: 'compacted'
                },
                'any': {
                    name: 'All traversable surfaces',
                    value: 'any'
                }
            },
            Incline: {
                '3': {
                    name: 'Up to 3%',
                    value: 3
                },
                '6': {
                    name: 'Up to 6%',
                    value: 6
                },
                '10': {
                    name: 'Up to 10%',
                    value: 10
                },
                '15': {
                    name: 'Up to 15%',
                    value: 15
                },
                '31': {
                    name: 'Flexible',
                    value: 31
                }
            },
            Curb: {
                '0.03': {
                    name: 'Up to 3cm',
                    value: 0.03
                },
                '0.06': {
                    name: 'Up to 6cm',
                    value: 0.06
                },
                '0.1': {
                    name: 'Up to 10cm',
                    value: 0.1
                },
                '0.31': {
                    name: 'Flexible',
                    value: 0.31
                }
            },
        },
        hgvParams: {
            Length: {
                min: 2,
                max: 15
            },
            Height: {
                min: 2,
                max: 5
            },
            Width: {
                min: 2,
                max: 5
            },
            Weight: {
                min: 1,
                max: 100
            },
            AxleLoad: {
                min: 1,
                max: 100
            }
        },
        maxspeeds: {
            Car: {
                min: 30,
                max: 300,
                default: 100,
                step: 5
            },
            Bicycle: {
                min: 5,
                max: 50,
                default: 25,
                step: 1
            },
            BicycleMTB: {
                min: 5,
                max: 50,
                default: 20,
                step: 1
            },
            BicycleRacer: {
                min: 5,
                max: 50,
                default: 30,
                step: 1
            },
            BicycleTour: {
                min: 5,
                max: 50,
                default: 25,
                step: 1
            },
            BicycleSafety: {
                min: 5,
                max: 50,
                default: 20,
                step: 1
            },
            BicycleElectro: {
                min: 5,
                max: 50,
                default: 20,
                step: 1
            },
            Pedestrian: {
                min: 3,
                max: 15,
                default: 6,
                step: 1
            },
            Wheelchair: {
                min: 5,
                max: 50,
                default: 8,
                step: 1
            },
            HeavyVehicle: {
                min: 30,
                max: 200,
                default: 100,
                step: 5
            },
            goods: {
                min: 30,
                max: 200,
                default: 100,
                step: 5
            },
            bus: {
                min: 30,
                max: 200,
                default: 100,
                step: 5
            },
            agricultural: {
                min: 30,
                max: 200,
                default: 100,
                step: 5
            },
            forestry: {
                min: 30,
                max: 200,
                default: 100,
                step: 5
            },
            delivery: {
                min: 30,
                max: 200,
                default: 100,
                step: 5
            },
        },
    },
    isochroneOptionList: {
        methodOptions: {
            TIME: {
                id: 0,
                name: 'Time'
            },
            DISTANCE: {
                id: 1,
                name: 'Distance'
            }
        },
        reverseFlow: {
            start: 'start',
            destination: 'destination'
        },
        valueOptions: {
            min: 1,
            max: 100,
            step: 1,
            default: 30
        },
        intervalOptions: {
            min: 1,
            step: 1,
            default: 15
        },
        velocities: {
            Pedestrian: 5,
            Car: 100,
            Bicycle: 20,
            Wheelchair: 5,
            HeavyVehicle: 80,
        }
    },
    userOptions: {
        languages: {
            default: 'en-US',
            all: ['de-DE', 'en-US', 'en-GB', 'zh-CN', 'pt-PT', 'es-ES', 'ru-RU', 'fr-FR', 'pl-PL']
        },
        routinglanguages: {
            default: 'en-US',
            all: ['de', 'en-US', 'pt', 'gr', 'ru', 'hu', 'fr', 'it', 'nl', 'zh-CN', 'es']
        },
        units: {
            default: 'km',
            km: 'km',
            mi: 'mi'
        }
    },
    permalinkFilters: {
        avoidables: ['ferry', 'unpaved', 'paved', 'fords', 'steps', 'highways', 'tollroads', 'tunnels', 'tracks'],
        analysis: ['method', 'isovalue', 'isointerval', 'reverseflow'],
        Car: ['type', 'weight', 'maxspeed'],
        hgv: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload'],
        goods: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload'],
        bus: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload'],
        agricultural: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload'],
        forestry: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload'],
        delivery: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload'],
        Bicycle: ['type', 'weight', 'maxspeed', 'fitness', 'incline', 'steepness'],
        BicycleSafety: ['type', 'weight', 'maxspeed', 'fitness', 'incline', 'steepness'],
        BicycleMTB: ['type', 'weight', 'maxspeed', 'fitness', 'incline', 'steepness'],
        BicycleRacer: ['type', 'weight', 'maxspeed', 'fitness', 'incline', 'steepness'],
        BicycleElectro: ['type', 'weight', 'maxspeed', 'fitness', 'incline', 'steepness'],
        BicycleTour: ['type', 'weight', 'maxspeed', 'fitness', 'incline', 'steepness'],
        Pedestrian: ['type', 'weight', 'maxspeed', 'fitness', 'steepness', 'green'],
        PedestrianHiking: ['type', 'weight', 'maxspeed', 'fitness', 'steepness', 'green'],
        Wheelchair: ['type', 'weight', 'maxspeed', 'incline', 'curb', 'surface']
    },
    //Whitelist for settings to be stored in permalink
    permalinkKeys: {
        wps: 'a',
        type: 'b',
        weight: 'c',
        maxspeed: 'd',
        hgvWeight: 'f1',
        width: 'f2',
        height: 'f3',
        axleload: 'f4',
        length: 'f5',
        fitness: 'g1',
        steepness: 'g2',
        surface: 'h1',
        incline: 'h2',
        curb: 'h3',
        method: 'i',
        isovalue: 'j1',
        isointerval: 'j2',
        reverseflow: 'j3',
        routinglang: 'k1',
        units: 'k2',
        ferry: 'l1',
        unpaved: 'l2',
        paved: 'l3',
        fords: 'l4',
        highways: 'l5',
        tollroads: 'l6',
        tunnels: 'l7',
        tracks: 'l8',
        green: 'm1'
    },
    reversePermalinkKeys: function(obj) {
        var rev = {};
        for (var key in obj) {
            rev[obj[key]] = key;
        }
        return rev;
    },
    layers: {
        0: 'layerRoutePoints',
        1: 'layerRouteLines',
        2: 'layerEmph',
        3: 'layerAccessibilityAnalysis',
        4: 'layerTracks',
        5: 'layerAccessibilityAnalysisNumberedMarkers',
        6: 'layerRouteNumberedMarkers'
    },
    layerStyles: {
        route: function() {
            return {
                color: '#b5152b',
                weight: 5,
                opacity: 1
            };
        },
        routePadding: function() {
            return {
                color: '#fff',
                weight: 9,
                opacity: 1
            };
        },
        routeEmph: function() {
            return {
                color: '#FFF',
                weight: 3,
                opacity: 1
            };
        },
        isochroneEmph: function() {
            return {
                color: '#FFF',
                weight: 3,
                opacity: 1
            };
        },
        track: function() {
            return {
                color: this.get_random_color(),
                weight: 3,
                opacity: 1
            };
        },
        trackPadding: function() {
            return {
                color: '#FFF',
                weight: 6,
                opacity: 1
            };
        },
        rand: function(min, max) {
            return parseInt(Math.random() * (max - min + 1), 10) + min;
        },
        get_random_color: function() {
            var h = this.rand(150, 250);
            var s = this.rand(30, 100);
            var l = this.rand(20, 70);
            return 'hsl(' + h + ',' + s + '%,' + l + '%)';
        }
    },
    errors: {
        CONNECTION: {
            translate: 'CONNECTION',
            color: -1
        },
        GEOCODE: {
            translate: 'GEOCODE',
            color: 0
        },
        ROUTE: {
            translate: 'ROUTE',
            color: 0
        },
        GENERALERROR: {
            translate: 'GENERALERROR',
            color: 1
        }
    },
    avoidFlags: {
        Highways: 1, // 1 << 0;
        Tollways: 2, // 1 << 1;
        Steps: 2, // 1 << 1;
        Ferries: 4, // 1 << 2;
        UnpavedRoads: 8, // 1 << 3;
        Tracks: 16, // 1 << 4;
        Tunnels: 32, // 1 << 5;
        PavedRoads: 64, // 1 << 6;
        Fords: 128, // 1 << 7;
    }
});