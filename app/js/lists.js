/**
 * various keyword lists used in the client
 */
lists = {};
lists.geolocationOptions = {
    maximumAge: 3000,
    timeout: 10000,
    enableHighAccuracy: true
};
lists.circleMarkerOptions = {
    radius: 8,
    fillColor: "#4285f4",
    color: "#4285f4",
    weight: 10,
    opacity: 0.3,
    fillOpacity: 0.9
};
lists.wpColors = {
    0: '#9e9e9e',
    1: '#707070'
};
lists.geocodingContainers = {
    reverse: {
        inner: 'ReverseGeocodedLocation',
        outer: 'ReverseGeocodeResponse'
    },
    geocoding: {
        inner: 'GeocodedAddress',
        outer: 'GeocodeResponseList'
    }
};
lists.waypointIcons = {
    0: {
        iconUrl: 'app/img/start.png',
        iconSize: [30, 70], // size of the icon
        iconAnchor: [15, 35] // point of the icon which will correspond to marker's location
    },
    2: {
        iconUrl: 'app/img/end.png',
        iconSize: [30, 70], // size of the icon
        iconAnchor: [15, 35] // point of the icon which will correspond to marker's location
    },
    // anything else
    1: {
        iconUrl: 'app/img/via.png',
        iconSize: [30, 70], // size of the icon
        iconAnchor: [15, 35] // point of the icon which will correspond to marker's location
    },
};
lists.profiles = {
    Car: {
        name: 'Car',
        elevation: false,
        subgroup: 'Car'
    },
    Bicycle: {
        name: 'Bicycle',
        elevation: true,
        subgroup: 'Bicycle'
    },
    BicycleMTB: {
        name: 'BicycleMTB',
        elevation: true,
        subgroup: 'Bicycle'
    },
    BicycleRacer: {
        name: 'BicycleRacer',
        elevation: true,
        subgroup: 'Bicycle'
    },
    BicycleTour: {
        name: 'BicycleTour',
        elevation: true,
        subgroup: 'Bicycle'
    },
    BicycleSafety: {
        name: 'BicycleSafety',
        elevation: true,
        subgroup: 'Bicycle'
    },
    Pedestrian: {
        name: 'Pedestrian',
        elevation: true,
        subgroup: 'Pedestrian'
    },
    Wheelchair: {
        name: 'Wheelchair',
        elevation: true,
        subgroup: 'Wheelchair'
    },
    hgv: {
        name: 'hgv',
        elevation: false,
        subgroup: 'HeavyVehicle'
    },
    goods: {
        name: 'goods',
        elevation: false,
        subgroup: 'HeavyVehicle'
    },
    bus: {
        name: 'bus',
        elevation: false,
        subgroup: 'HeavyVehicle'
    },
    agricultural: {
        name: 'agricultural',
        elevation: false,
        subgroup: 'HeavyVehicle'
    },
    foresty: {
        name: 'foresty',
        elevation: false,
        subgroup: 'HeavyVehicle'
    },
    delivery: {
        name: 'Delivery',
        elevation: false,
        subgroup: 'HeavyVehicle'
    }
};
lists.optionList = {
    weight: {
        Fastest: {
            value: 'Fastest'
        },
        Shortest: {
            value: 'Shortest'
        },
        Recommended: {
            value: 'Recommended'
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
            name: 'Ferry',
            subgroups: ['Car', 'Bicycle', 'HeavyVehicle', 'Wheelchair', 'Pedestrian']
        },
        unpaved: {
            name: 'Unpavedroads',
            subgroups: ['Car', 'Bicycle', 'HeavyVehicle']
        },
        paved: {
            name: 'Pavedroads',
            subgroups: ['Car', 'Bicycle', 'HeavyVehicle']
        },
        fords: {
            name: 'Fords',
            subgroups: ['Car', 'Bicycle', 'HeavyVehicle', 'Wheelchair', 'Pedestrian']
        },
        steps: {
            name: 'Steps',
            subgroups: ['Wheelchair', 'Pedestrian']
        },
        highways: {
            name: 'Highways',
            subgroups: ['Car', 'HeavyVehicle']
        },
        tollroads: {
            name: 'Tollroads',
            subgroups: ['Car', 'HeavyVehicle']
        },
        tunnels: {
            name: 'Tunnels',
            subgroups: ['Car', 'HeavyVehicle']
        },
        tracks: {
            name: 'Tracks',
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
        hgv: {
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
        foresty: {
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
        RG: {
            id: 0,
            name: 'Recursive Grid'
        },
        TIN: {
            id: 1,
            name: 'TIN'
        }
    },
    minutesOptions: {
        min: 1,
        max: 30,
        step: 1,
        default: 3
    },
    intervalOptions: {
        min: 1,
        max: 29,
        step: 1,
        default: 1
    }
};
lists.userOptions = {
    languages: {
        default: 'en',
        all: ['de', 'en', 'es', 'fr', 'it', 'nl', 'hu', 'ru', 'ua', 'cz', 'pl', 'cnsimple', 'cn']
    },
    routinglanguages: {
        default: 'en',
        all: ['de', 'en', 'es', 'fr', 'it', 'nl', 'hu', 'ru', 'ua', 'cz', 'pl', 'cnsimple', 'cn', 'bg', 'hr', 'nl_BE', 'eo', 'fi', 'fr', 'pl', 'pt_BR', 'ro', 'se', 'dk', 'tr', 'ca', 'ja', 'no', 'vi', 'nb', 'de-rheinl', 'de-opplat', 'de-berlin', 'de-swabia', 'de-ruhrpo', 'de-at-ooe', 'de-bay']
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
    analysis: ['method', 'minutes', 'interval'],
    Car: ['type', 'weight', 'maxspeed'],
    hgv: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload'],
    Bicycle: ['type', 'weight', 'maxspeed', 'fitness', 'incline', 'steepness'],
    Pedestrian: ['type', 'weight', 'maxspeed', 'fitness', 'steepness'],
    Wheelchair: ['type', 'weight', 'maxspeed', 'incline', 'curb', 'surface']
};
lists.layers = {
    0: 'layerRoutePoints',
    1: 'layerRouteLines',
    2: 'layerEmph',
    3: 'layerAccessibilityAnalysis',
    4: 'layerTracks'
};