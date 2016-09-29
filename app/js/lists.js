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
lists.distanceUnits = ['m', 'km', 'yd', 'mi'];
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
    BicycleTouring: {
        name: 'BicycleTouring',
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
    HeavyVehicle: {
        name: 'HeavyVehicle',
        elevation: false,
        subgroup: 'HeavyVehicle'
    },
    Goods: {
        name: 'Goods',
        elevation: false,
        subgroup: 'HeavyVehicle'
    },
    Bus: {
        name: 'Bus',
        elevation: false,
        subgroup: 'HeavyVehicle'
    },
    Agricultural: {
        name: 'Agricultural',
        elevation: false,
        subgroup: 'HeavyVehicle'
    },
    Foresty: {
        name: 'Foresty',
        elevation: false,
        subgroup: 'HeavyVehicle'
    },
    Delivery: {
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
            Unset: {
                name: 'Unset',
                value: -1
            },
            Novice: {
                name: 'Novice',
                value: 0
            },
            Moderate: {
                name: 'Moderate',
                value: 1
            },
            Amateur: {
                name: 'Amateur',
                value: 2
            },
            Pro: {
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
            name: 'Ferry'
        },
        unpaved: {
            name: 'Unpavedroads'
        },
        paved: {
            name: 'Pavedroads'
        },
        fords: {
            name: 'Fords'
        },
        steps: {
            name: 'Steps'
        },
        highways: {
            name: 'Highways'
        },
        tollroads: {
            name: 'Tollroads'
        },
        tunnels: {
            name: 'Tunnels'
        },
        tracks: {
            name: 'Tracks'
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
            step: 5
        },
        Bicycle: {
            min: 5,
            max: 50,
            step: 1
        },
        BicycleMTB: {
            min: 5,
            max: 50,
            step: 1
        },
        BicycleRacer: {
            min: 5,
            max: 50,
            step: 1
        },
        BicycleTouring: {
            min: 5,
            max: 50,
            step: 1
        },
        BicycleSafety: {
            min: 5,
            max: 50,
            step: 1
        },
        Pedestrian: {
            min: 3,
            max: 15,
            step: 1
        },
        Wheelchair: {
            min: 5,
            max: 50,
            step: 1
        },
        HeavyVehicle: {
            min: 30,
            max: 200,
            step: 5
        },
        Goods: {
            min: 30,
            max: 200,
            step: 5
        },
        Bus: {
            min: 30,
            max: 200,
            step: 5
        },
        Agricultural: {
            min: 30,
            max: 200,
            step: 5
        },
        Foresty: {
            min: 30,
            max: 200,
            step: 5
        },
        Delivery: {
            min: 30,
            max: 200,
            step: 5
        },
    }
};