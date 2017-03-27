/**
 * various keyword lists used in the client
 */
var lists = {};

lists.waypointIcons = {
    0: {
        className: "ors-marker-start",
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        html: '<i class="fa fa-map-marker"></i>'
    },
    1: {
        className: "ors-marker-via",
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        html: '<i class="fa fa-map-marker"></i>'
    },
    2: {
        className: "ors-marker-end",
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        html: '<i class="fa fa-map-marker"></i>'
    },
    3: {
        className: "ors-marker-location",
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        html: '<i class="fa fa-map-marker"></i>'
    },
    4: {
        className: "ors-marker-start-highlight",
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        html: '<i class="fa fa-map-marker"></i>'
    },
    5: {
        className: "ors-marker-via-highlight",
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        html: '<i class="fa fa-map-marker"></i>'
    },
    6: {
        className: "ors-marker-end-highlight",
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        html: '<i class="fa fa-map-marker"></i>'
    },
};
lists.profiles = {
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
        shortValue: '2'
    },
    Wheelchair: {
        name: 'Wheelchair',
        elevation: true,
        subgroup: 'Wheelchair',
        request: 'foot-walking',
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
};
lists.optionList = {
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
            '0': {
                name: 'Concrete, asphalt',
                value: 0
            },
            '1': {
                name: 'Flattened Cobblestone and better',
                value: 1
            },
            '2': {
                name: 'Cobblestone and better',
                value: 2
            },
            '3': {
                name: 'Compacted',
                value: 3
            },
            '4': {
                name: 'All traversable surfaces',
                value: 4
            }
        },
        Incline: {
            '0': {
                name: 'Up to 3%',
                value: 0
            },
            '1': {
                name: 'Up to 6%',
                value: 1
            },
            '2': {
                name: 'Up to 10%',
                value: 2
            },
            '3': {
                name: 'Up to 15%',
                value: 4
            },
            '4': {
                name: 'Flexible',
                value: 5
            }
        },
        Curb: {
            '0': {
                name: 'Up to 3cm',
                value: 0
            },
            '1': {
                name: 'Up to 6cm',
                value: 1
            },
            '2': {
                name: 'Up to 10cm',
                value: 2
            },
            '3': {
                name: 'Flexible',
                value: 3
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
    }
};
lists.isochroneOptionList = {
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
};
lists.userOptions = {
    languages: {
        default: 'en-US',
        all: ['de-DE', 'en-US', 'zh-CN', 'pt-PT', 'es-ES']
    },
    routinglanguages: {
        default: 'en',
        all: ['de', 'en', 'es', 'pt', 'ru']
    },
    units: {
        default: 'km',
        km: 'km',
        mi: 'mi'
    }
};
//Whitelist for settings to be stored in permalink
lists.permalinkFilters = {
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
    Pedestrian: ['type', 'weight', 'maxspeed', 'fitness', 'steepness'],
    Wheelchair: ['type', 'weight', 'maxspeed', 'incline', 'curb', 'surface']
};
lists.permalinkKeys = {
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
    tracks: 'l8'
};
lists.permalinkKeysReversed = swap(lists.permalinkKeys);

function swap(obj) {
    var rev = {};
    for (var key in obj) {
        rev[obj[key]] = key;
    }
    return rev;
}
lists.layers = {
    0: 'layerRoutePoints',
    1: 'layerRouteLines',
    2: 'layerEmph',
    3: 'layerAccessibilityAnalysis',
    4: 'layerTracks',
    5: 'layerAccessibilityAnalysisNumberedMarkers',
    6: 'layerRouteNumberedMarkers'
};
lists.layerStyles = {
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
            color: 'yellow',
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
            color: '#FFF',
            weight: 5,
            opacity: 1
        };
    },
    trackPadding: function() {
        return {
            color: lists.layerStyles.get_random_color(),
            weight: 9,
            opacity: 1
        };
    },
    rand: function(min, max) {
        return parseInt(Math.random() * (max - min + 1), 10) + min;
    },
    get_random_color: function() {
        var h = lists.layerStyles.rand(180, 250);
        var s = lists.layerStyles.rand(30, 100);
        var l = lists.layerStyles.rand(20, 70);
        return 'hsl(' + h + ',' + s + '%,' + l + '%)';
    }
};
// -1 red, 0 orange, 1 blue, 2 green
lists.errors = {
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
};
lists.avoidFlags = {
    Highways: 1, // 1 << 0;
    Tollways: 2, // 1 << 1;
    Steps: 2, // 1 << 1;
    Ferries: 4, // 1 << 2;
    UnpavedRoads: 8, // 1 << 3;
    Tracks: 16, // 1 << 4;
    Tunnels: 32, // 1 << 5;
    PavedRoads: 64, // 1 << 6;
    Fords: 128, // 1 << 7;
};