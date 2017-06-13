/**
 * various keyword lists used in the client
 */
angular.module('orsApp')
    .constant('lists', {
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
            hgv: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload', 'hazmat'],
            goods: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload', 'hazmat'],
            bus: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload', 'hazmat'],
            agricultural: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload', 'hazmat'],
            forestry: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload', 'hazmat'],
            delivery: ['type', 'weight', 'maxspeed', 'height', 'width', 'length', 'hgvWeight', 'axleload', 'hazmat'],
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
            hazmat: 'f6',
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
            6: 'layerRouteNumberedMarkers',
            7: 'layerRouteExtras'
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
            },
            getStyle: function(c,w,o) {
                return {
                    color: c,
                    weight: w,
                    opacity: o
                };
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
        },
        locations: {
            "categories": {
                "accomodation": {
                    "id": 100,
                    "values": {
                        "alpine_hut": 101,
                        "apparmtent": 102,
                        "camp_site": 103,
                        "caravan_site": 104,
                        "chalet": 105,
                        "guest_house": 106,
                        "hostel": 107,
                        "hotel": 108,
                        "motel": 109,
                        "wilderness_hut": 110
                    }
                },
                "animals": {
                    "id": 120,
                    "values": {
                        "animal_boarding": 121,
                        "animal_shelter": 122,
                        "veterinary": 123,
                        "pet": 124
                    }
                },
                "arts_and_culture": {
                    "id": 130,
                    "values": {
                        "arts_centre": 131,
                        "gallery": 132,
                        "library": 133,
                        "museum": 134,
                        "place_of_worship": 135,
                        "studio": 136
                    }
                },
                "education": {
                    "id": 150,
                    "values": {
                        "college": 151,
                        "driving_school": 152,
                        "kindergarten": 153,
                        "lanuage_school": 154,
                        "music_school": 155,
                        "school": 156,
                        "university": 157
                    }
                },
                "facilities": {
                    "id": 160,
                    "values": {
                        "compressed_air": 161,
                        "bench": 162,
                        "emergency_phone": 163,
                        "clock": 164,
                        "defibrillator": 165,
                        "drinking_water": 166,
                        "fire_hydrant": 167,
                        "hunting_stand": 168,
                        "internet_cafe": 169,
                        "kneipp_water_cure": 170,
                        "post_box": 171,
                        "recycling": 172,
                        "recycling_station": 173,
                        "sanitary_dump_station": 174,
                        "shelter": 175,
                        "shower": 176,
                        "table": 177,
                        "telephone": 178,
                        "toilets": 179,
                        "waste_basket": 180,
                        "waste_disposal": 181,
                        "water_point": 182
                    }
                },
                "financial": {
                    "id": 190,
                    "values": {
                        "atm": 191,
                        "bank": 192,
                        "bureau_de_change": 193
                    }
                },
                "healthcare": {
                    "id": 200,
                    "values": {
                        "baby_hatch": 201,
                        "clinic": 202,
                        "dentist": 203,
                        "doctors": 204,
                        "emergency_access_point": 205,
                        "hospital": 206,
                        "nursing_home": 207,
                        "pharmacy": 208,
                        "retirement_home": 209,
                        "social_facility": 210,
                        "blood_donation": 211
                    }
                },
                "historic": {
                    "id": 220,
                    "values": {
                        "aircraft": 221,
                        "aqueduct": 222,
                        "archaeological_site": 223,
                        "castle": 224,
                        "cannon": 225,
                        "city_gate": 226,
                        "citywalls": 227,
                        "battlefield": 228,
                        "boundary_stone": 229,
                        "building": 230,
                        "farm": 231,
                        "fort": 232,
                        "gallows": 233,
                        "highwater_mark": 234,
                        "locomotive": 235,
                        "manor": 236,
                        "memorial": 237,
                        "milestone": 238,
                        "monastery": 239,
                        "monument": 240,
                        "optical_telegraph": 241,
                        "pillory": 242,
                        "ruins": 243,
                        "rune_stone": 244,
                        "ship": 245,
                        "tomb": 246,
                        "wayside_cross": 247,
                        "wayside_shrine": 248,
                        "wreck": 249
                    }
                },
                "leisure_and_ntertainment": {
                    "id": 260,
                    "values": {
                        "adult_gaming_centre": 261,
                        "amusement_arcade": 262,
                        "beach_resort": 263,
                        "bandstand": 264,
                        "bird_hide": 265,
                        "common": 266,
                        "dance": 267,
                        "dog_park": 268,
                        "firepit": 269,
                        "fishing": 270,
                        "fitness_centre": 271,
                        "garden": 272,
                        "golf_course": 273,
                        "hackerspace": 274,
                        "horse_riding": 275,
                        "ice_ring": 276,
                        "marina": 277,
                        "miniature_golf": 278,
                        "nature_reserve": 279,
                        "park": 280,
                        "picnic_table": 281,
                        "pitch": 282,
                        "playground": 283,
                        "raceway": 284,
                        "public_bath": 285,
                        "sauna": 286,
                        "slipway": 287,
                        "sports_centre": 288,
                        "stadium": 289,
                        "summer_camp": 290,
                        "swimming_area": 291,
                        "swimming_pool": 292,
                        "track": 293,
                        "turkish_bath": 294,
                        "water_park": 295,
                        "wildlife_hide": 296,
                        "brothel": 297,
                        "casino": 298,
                        "cinema": 299,
                        "dive_centre": 300,
                        "dojo": 301,
                        "gambling": 302,
                        "nightclub": 303,
                        "planetarium": 304,
                        "social_centre": 305,
                        "spa": 306,
                        "stripclub": 307,
                        "aquarium": 308,
                        "theme_park": 309,
                        "zoo": 310
                    }
                },
                "natural": {
                    "id": 330,
                    "values": {
                        "cave_entrance": 331,
                        "beach": 332,
                        "geyser": 333,
                        "hill": 334,
                        "peak": 335,
                        "rock": 336,
                        "saddle": 337,
                        "spring": 338,
                        "volcano": 339,
                        "water": 340
                    }
                },
                "public_places": {
                    "id": 360,
                    "values": {
                        "embassy": 361,
                        "crematorium": 362,
                        "community_centre": 363,
                        "courthouse": 364,
                        "coworking_space": 365,
                        "crypt": 366,
                        "fire_station": 367,
                        "grave_yard": 368,
                        "police": 369,
                        "post_office": 370,
                        "prison": 371,
                        "ranger_station": 372,
                        "rescue_station": 373,
                        "townhall": 374
                    }
                },
                "service": {
                    "id": 390,
                    "values": {
                        "beauty": 391,
                        "estate_agent": 392,
                        "dry_cleaning": 393,
                        "glaziery": 394,
                        "hairdresser": 395,
                        "laundry": 396,
                        "massage": 397,
                        "photo_booth": 398,
                        "tailor": 399,
                        "tattoo": 400
                    }
                },
                "shops": {
                    "id": 420,
                    "values": {
                        "agrarian": 421,
                        "alkohol": 422,
                        "antiques": 423,
                        "art": 424,
                        "bag": 425,
                        "bakery": 426,
                        "bed": 427,
                        "beverages": 428,
                        "bicycle": 429,
                        "books": 430,
                        "boutique": 431,
                        "brewing_supplies": 432,
                        "business_machines": 433,
                        "butcher": 434,
                        "caf?": 435,
                        "camera": 436,
                        "candles": 437,
                        "car": 438,
                        "car_parts": 439,
                        "carpet": 440,
                        "curtain": 441,
                        "cheese": 442,
                        "chemist": 443,
                        "chocolate": 444,
                        "clock": 445,
                        "clocks": 446,
                        "clothes": 447,
                        "coffee": 448,
                        "computer": 449,
                        "confectionery": 450,
                        "convenience": 451,
                        "copyshop": 452,
                        "cosmetics": 453,
                        "dairy": 454,
                        "deli": 455,
                        "department_store": 456,
                        "doityourself": 457,
                        "electrical": 458,
                        "electronics": 459,
                        "erotic": 460,
                        "e-cigarette": 461,
                        "farm": 462,
                        "fashion": 463,
                        "fishing": 464,
                        "florist": 465,
                        "funeral_directors": 466,
                        "furniture": 467,
                        "games": 468,
                        "garden_centre": 469,
                        "garden_furniture": 470,
                        "gas": 471,
                        "general": 472,
                        "gift": 473,
                        "greengrocer": 474,
                        "grocery": 475,
                        "interior_decoration": 476,
                        "hairdresser_supply": 477,
                        "hardware": 478,
                        "hearing_aids": 479,
                        "herbalist": 480,
                        "hifi": 481,
                        "houseware": 482,
                        "hunting": 483,
                        "jewelry": 485,
                        "leather": 486,
                        "locksmith": 487,
                        "kiosk": 488,
                        "kitchen": 489,
                        "lamps": 490,
                        "lottery": 491,
                        "mall": 492,
                        "marketplace": 493,
                        "medical_supply": 494,
                        "mobile_phone": 495,
                        "model": 496,
                        "motorcycle": 497,
                        "music": 498,
                        "musical_instrument": 499,
                        "nutrition_supplements": 500,
                        "newsagent": 501,
                        "optician": 502,
                        "organic": 503,
                        "outdoor": 504,
                        "paint": 505,
                        "pastry": 506,
                        "perfumery": 507,
                        "photo": 508,
                        "pyrotechnics": 509,
                        "radiotechnics": 510,
                        "seefood": 511,
                        "second_hand": 512,
                        "security": 513,
                        "shoes": 514,
                        "spices": 515,
                        "sports": 516,
                        "stationery": 517,
                        "supermarket": 518,
                        "swimming_pool": 519,
                        "tea": 520,
                        "ticket": 521,
                        "tiles": 522,
                        "tobacco": 523,
                        "toys": 524,
                        "trophy": 525,
                        "tyres": 526,
                        "variety_store": 527,
                        "vending_machine": 528,
                        "video": 529,
                        "video_games": 530,
                        "watches": 531,
                        "weapons": 532,
                        "wine": 533
                    }
                },
                "sustenance": {
                    "id": 560,
                    "values": {
                        "bar": 561,
                        "bbq": 562,
                        "biergarten": 563,
                        "caf?": 564,
                        "drinking_water": 565,
                        "fast_food": 566,
                        "food_court": 567,
                        "ice_cream": 568,
                        "pub": 569,
                        "restaurant": 570
                    }
                },
                "transport": {
                    "id": 580,
                    "values": {
                        "aerodrome": 581,
                        "aeroport": 582,
                        "bicycle_parking": 583,
                        "bicycle_rental": 584,
                        "bicycle_repair_station": 585,
                        "boat_sharing": 586,
                        "bus_station": 587,
                        "bus_stop": 588,
                        "car_rental": 589,
                        "car_repair": 590,
                        "car_sharing": 591,
                        "car_wash": 592,
                        "charging_station": 593,
                        "ev_charging": 594,
                        "ferry_terminal": 595,
                        "fuel": 596,
                        "halt": 597,
                        "helipad": 598,
                        "heliport": 599,
                        "motorcycle_parking": 600,
                        "parking": 601,
                        "parking_entrance": 602,
                        "parking_space": 603,
                        "station": 604,
                        "tram_stop": 605,
                        "taxi": 606
                    }
                },
                "tourism": {
                    "id": 620,
                    "values": {
                        "artwork": 621,
                        "attraction": 622,
                        "fountain": 623,
                        "information": 624,
                        "picnic_site": 625,
                        "travel_agency": 626,
                        "viewpoint": 627
                    }
                }
            },
            "info": {
                "service": "locations",
                "version": "4.0.0",
                "attribution": "openrouteservice.org, OpenStreetMap contributors",
                "timestamp": 1496839009147
            }
        }
    });