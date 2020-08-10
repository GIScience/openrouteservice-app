/**
 * various keyword lists used in the client
 */
angular.module("orsApp").constant("lists", {
  locationsIcon: {
    className: "ors-icon-locations",
    iconSize: [20, 20]
  },
  locationsIconHighlight: {
    className: "ors-icon-locations-highlight",
    iconSize: [20, 20]
  },
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
    },
    5: {
      className: "ors-marker-hover"
    },
    6: {
      className: "ors-marker-hover-drag"
    }
  },
  customMarkerIcon: {
    className: "ors-marker-custom",
    iconSize: [45, 45],
    iconAnchor: [22, 45]
  },
  landmarkIcon: {
    className: "ors-marker-landmark",
    iconSize: [45, 45],
    iconAnchor: [22, 45]
  },
  landmarkIconEmph: {
    className: "ors-marker-landmark-highlight",
    iconSize: [45, 45],
    iconAnchor: [22, 45]
  },
  profiles: {
    Car: {
      name: "Car",
      elevation: true,
      subgroup: "Car",
      request: "driving-car",
      shortValue: "0"
    },
    Bicycle: {
      name: "Bicycle",
      elevation: true,
      subgroup: "Bicycle",
      request: "cycling-regular",
      shortValue: "1a"
    },
    BicycleMTB: {
      name: "BicycleMTB",
      elevation: true,
      subgroup: "Bicycle",
      request: "cycling-mountain",
      shortValue: "1b"
    },
    BicycleRacer: {
      name: "BicycleRacer",
      elevation: true,
      subgroup: "Bicycle",
      request: "cycling-road",
      shortValue: "1c"
    },
    BicycleTour: {
      name: "BicycleTour",
      elevation: true,
      subgroup: "Bicycle",
      request: "cycling-tour",
      shortValue: "1d"
    },
    BicycleSafety: {
      name: "BicycleSafety",
      elevation: true,
      subgroup: "Bicycle",
      request: "cycling-safe",
      shortValue: "1e"
    },
    BicycleElectro: {
      name: "BicycleElectro",
      elevation: true,
      subgroup: "Bicycle",
      request: "cycling-electric",
      shortValue: "1f"
    },
    Pedestrian: {
      name: "Pedestrian",
      elevation: true,
      subgroup: "Pedestrian",
      request: "foot-walking",
      shortValue: "2"
    },
    PedestrianHiking: {
      name: "PedestrianHiking",
      elevation: true,
      subgroup: "Pedestrian",
      request: "foot-hiking",
      shortValue: "2b"
    },
    Wheelchair: {
      name: "Wheelchair",
      elevation: true,
      subgroup: "Wheelchair",
      request: "wheelchair",
      shortValue: "3"
    },
    hgv: {
      name: "hgv",
      elevation: true,
      subgroup: "HeavyVehicle",
      request: "driving-hgv",
      shortValue: "4a"
    },
    goods: {
      name: "goods",
      elevation: true,
      subgroup: "HeavyVehicle",
      request: "driving-hgv",
      shortValue: "4b"
    },
    bus: {
      name: "bus",
      elevation: true,
      subgroup: "HeavyVehicle",
      request: "driving-hgv",
      shortValue: "4c"
    },
    agricultural: {
      name: "agricultural",
      elevation: true,
      subgroup: "HeavyVehicle",
      request: "driving-hgv",
      shortValue: "4d"
    },
    forestry: {
      name: "forestry",
      elevation: true,
      subgroup: "HeavyVehicle",
      request: "driving-hgv",
      shortValue: "4e"
    },
    delivery: {
      name: "delivery",
      elevation: true,
      subgroup: "HeavyVehicle",
      request: "driving-hgv",
      shortValue: "4f"
    }
  },
  extra_info: {
    surface: ["Wheelchair", "HeavyVehicle", "Pedestrian", "Bicycle", "Car"],
    waytype: ["Wheelchair", "HeavyVehicle", "Pedestrian", "Bicycle", "Car"],
    suitability: ["Wheelchair", "HeavyVehicle", "Pedestrian", "Bicycle", "Car"],
    tollways: ["HeavyVehicle", "Car"],
    steepness: ["Wheelchair", "HeavyVehicle", "Pedestrian", "Bicycle", "Car"],
    green: ["Pedestrian", "Bicycle"],
    noise: ["Pedestrian", "Bicycle"],
    traildifficulty: ["Pedestrian", "Bicycle"],
    HeavyVehicle: [
      "surface",
      "waytype",
      "suitability",
      "tollways",
      "steepness"
    ],
    Car: ["surface", "waytype", "suitability", "tollways", "steepness"],
    Bicycle: [
      "surface",
      "waytype",
      "suitability",
      "steepness",
      "green",
      "noise",
      "traildifficulty"
    ],
    Pedestrian: [
      "surface",
      "waytype",
      "suitability",
      "steepness",
      "green",
      "noise",
      "traildifficulty"
    ],
    Wheelchair: [
      "surface",
      "waytype",
      "suitability",
      "steepness",
      "green",
      "noise",
      "traildifficulty"
    ]
  },
  optionList: {
    weight: {
      Recommended: {
        value: "Recommended",
        shortValue: "0"
      },
      Shortest: {
        value: "Shortest",
        shortValue: "1"
      }
    },
    roundTrip: {
      length: {
        min: 1000,
        max: 100000,
        preset: 10000
      },
      points: {
        min: 3,
        max: 30,
        preset: 10
      },
      seed: {
        preset: 0
      }
    },
    borders: {
      all: {
        subgroups: ["Car", "HeavyVehicle"]
      },
      controlled: {
        subgroups: ["Car", "HeavyVehicle"]
      },
      country: {
        subgroups: ["Car", "HeavyVehicle"]
      }
    },
    avoidables: {
      ferry: {
        name: "ferries",
        subgroups: [
          "Car",
          "Bicycle",
          "HeavyVehicle",
          "Wheelchair",
          "Pedestrian"
        ]
      },
      fords: {
        name: "fords",
        subgroups: ["Bicycle", "Wheelchair", "Pedestrian"]
      },
      steps: {
        name: "steps",
        subgroups: ["Wheelchair", "Pedestrian", "Bicycle"]
      },
      highways: {
        name: "highways",
        subgroups: ["Car", "HeavyVehicle"]
      },
      tollroads: {
        name: "tollways",
        subgroups: ["Car", "HeavyVehicle"]
      }
    },
    wheelchair: {
      Surface: {
        concrete: {
          name: "Concrete, asphalt",
          value: "concrete"
        },
        "cobblestone:flattened": {
          name: "Flattened Cobblestone and better",
          value: "cobblestone:flattened"
        },
        cobblestone: {
          name: "Cobblestone and better",
          value: "cobblestone"
        },
        compacted: {
          name: "Compacted",
          value: "compacted"
        },
        any: {
          name: "All traversable surfaces",
          value: "any"
        }
      },
      Incline: {
        "3": {
          name: "Up to 3%",
          value: 3
        },
        "6": {
          name: "Up to 6%",
          value: 6
        },
        "10": {
          name: "Up to 10%",
          value: 10
        },
        "15": {
          name: "Up to 15%",
          value: 15
        },
        "31": {
          name: "Flexible",
          value: 31
        }
      },
      Curb: {
        "0.001": {
          name: "0.0 cm",
          value: 0.001
        },
        "0.03": {
          name: "Up to 3cm",
          value: 0.03
        },
        "0.06": {
          name: "Up to 6cm",
          value: 0.06
        },
        "0.1": {
          name: "Up to 10cm",
          value: 0.1
        },
        "0.31": {
          name: "Flexible",
          value: 0.31
        }
      },
      Width: {
        "2": {
          name: "2m",
          value: 2.0
        },
        "1.5": {
          name: "1.5m",
          value: 1.5
        },
        "1": {
          name: "1m",
          value: 1.0
        },
        "-1": {
          name: "Any width (no value set)",
          value: -1
        }
      }
    },
    hgvParams: {
      length: {
        min: 2,
        max: 15,
        value: "length"
      },
      height: {
        min: 2,
        max: 5,
        value: "height"
      },
      width: {
        min: 2,
        max: 5,
        value: "width"
      },
      hgvWeight: {
        min: 1,
        max: 100,
        value: "weight"
      },
      axleload: {
        min: 1,
        max: 100,
        value: "axleload"
      }
    },
    maximum_speed: {
      min: 80,
      max: 120,
      preset: 100,
      step: 1
    },
    green: {
      min: 0.1,
      max: 1
    },
    quiet: {
      min: 0.1,
      max: 1
    }
  },
  isochroneOptionList: {
    methodOptions: {
      TIME: {
        id: 0,
        name: "Time"
      },
      DISTANCE: {
        id: 1,
        name: "Distance"
      }
    },
    reverseFlow: {
      start: "start",
      destination: "destination"
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
      HeavyVehicle: 80
    }
  },
  userOptions: {
    languages: {
      default: "en-US",
      all: [
        "de-DE",
        "en-US",
        "en-GB",
        "zh-CN",
        "pt-PT",
        "es-ES",
        "ru-RU",
        "fr-FR",
        "pl-PL",
        "it-IT",
        "id-ID",
        "hu-HU"
      ]
    },
    routinglanguages: {
      default: "en-US",
      all: [
        "de",
        "en-US",
        "pt",
        "gr",
        "ru",
        "hu",
        "fr",
        "it",
        "nl",
        "zh-CN",
        "es",
        "id"
      ]
    },
    units: {
      default: "km",
      km: "km",
      mi: "mi"
    },
    randomIsoColor: {
      default: false
    },
    distanceMarkers: {
      default: false
    },
    alternativeRoutes: {
      default: false
    }
  },
  permalinkFilters: {
    avoidables: ["ferry", "fords", "steps", "highways", "tollroads"],
    analysis: ["method", "isovalue", "isointerval", "reverseflow"],
    Car: ["type", "weight", "maximum_speed"],
    hgv: [
      "type",
      "weight",
      "maximum_speed",
      "height",
      "width",
      "length",
      "hgvWeight",
      "axleload",
      "hazmat"
    ],
    goods: [
      "type",
      "weight",
      "maximum_speed",
      "height",
      "width",
      "length",
      "hgvWeight",
      "axleload",
      "hazmat"
    ],
    bus: [
      "type",
      "weight",
      "maximum_speed",
      "height",
      "width",
      "length",
      "hgvWeight",
      "axleload",
      "hazmat"
    ],
    agricultural: [
      "type",
      "weight",
      "maximum_speed",
      "height",
      "width",
      "length",
      "hgvWeight",
      "axleload",
      "hazmat"
    ],
    forestry: [
      "type",
      "weight",
      "maximum_speed",
      "height",
      "width",
      "length",
      "hgvWeight",
      "axleload",
      "hazmat"
    ],
    delivery: [
      "type",
      "weight",
      "maximum_speed",
      "height",
      "width",
      "length",
      "hgvWeight",
      "axleload",
      "hazmat"
    ],
    Bicycle: ["type", "weight"],
    BicycleSafety: ["type", "weight"],
    BicycleMTB: ["type", "weight"],
    BicycleRacer: ["type", "weight"],
    BicycleElectro: ["type", "weight"],
    BicycleTour: ["type", "weight"],
    Pedestrian: ["type", "weight", "green"],
    PedestrianHiking: ["type", "weight", "green"],
    Wheelchair: [
      "type",
      "weight",
      "incline",
      "curb",
      "surface",
      "wheelchairWidth"
    ]
  },
  //Whitelist for settings to be stored in permalink
  permalinkKeys: {
    wps: "a",
    type: "b",
    weight: "c",
    maximum_speed: "d",
    hgvWeight: "f1",
    width: "f2",
    height: "f3",
    axleload: "f4",
    length: "f5",
    hazmat: "f6",
    surface: "h1",
    incline: "h2",
    curb: "h3",
    wheelchairWidth: "h4",
    method: "i",
    isovalue: "j1",
    isointerval: "j2",
    reverseflow: "j3",
    routinglang: "k1",
    units: "k2",
    ferry: "l1",
    fords: "l4",
    highways: "l5",
    tollroads: "l6",
    green: "m1",
    lat: "n1",
    lng: "n2",
    zoom: "n3",
    round_length: "r1",
    round_points: "r2",
    round_seed: "r3",
    all: "o1",
    controlled: "o2",
    country: "o3",
    skip_segments: "s"
  },
  reversePermalinkKeys: function(obj) {
    let rev = {};
    for (let key in obj) {
      rev[obj[key]] = key;
    }
    return rev;
  },
  layers: {
    0: "layerRoutePoints",
    1: "layerRouteLines",
    2: "layerEmph",
    3: "layerAccessibilityAnalysis",
    4: "layerTracks",
    5: "layerAccessibilityAnalysisNumberedMarkers",
    6: "layerRouteNumberedMarkers",
    7: "layerRouteExtras",
    8: "layerLocations",
    9: "layerRouteDrag",
    10: "layerLandmarks",
    11: "layerLandmarksEmph"
  },
  layerStyles: {
    route: function() {
      return {
        color: "#b5152b",
        weight: 5,
        opacity: 1
      };
    },
    routeAlternative: () => {
      return {
        color: "#6D6D6D",
        weight: 5,
        opacity: 1
      };
    },
    routePadding: function() {
      return {
        color: "#fff",
        weight: 9,
        opacity: 1
      };
    },
    routeHovering: function() {
      return {
        color: "#FFF",
        weight: 50,
        opacity: 0
      };
    },
    routeEmph: function() {
      return {
        color: "#FFF",
        weight: 3,
        opacity: 1
      };
    },
    isochroneEmph: function() {
      return {
        color: "#FFF",
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
        color: "#FFF",
        weight: 6,
        opacity: 1
      };
    },
    hoverPoint: function() {
      return {
        radius: 5,
        weight: 2,
        color: "#000",
        fillColor: "#FFF",
        fillOpacity: 1,
        // interactive: true,
        draggable: "true"
        // autoPan: true,
        // autoPanPadding: [50, 50],
        // autoPanSpeed: 10
      };
    },
    rand: function(min, max) {
      return parseInt(Math.random() * (max - min + 1), 10) + min;
    },
    get_random_color: function() {
      let h = this.rand(150, 250);
      let s = this.rand(30, 100);
      let l = this.rand(20, 70);
      return "hsl(" + h + "," + s + "%," + l + "%)";
    },
    getStyle: function(c, w, o) {
      return {
        color: c,
        weight: w,
        opacity: o
      };
    },
    boundary: function() {
      return {
        color: "#cf5f5f",
        weight: 10,
        opacity: 1,
        fillOpacity: 0
      };
    }
  },
  isochronesColorsRanges: [360, 300, 240, 180, 120, 60],
  errors: {
    CONNECTION: {
      translate: "CONNECTION",
      color: -1
    },
    GEOCODE: {
      translate: "GEOCODE",
      color: 0
    },
    ROUTE: {
      translate: "ROUTE",
      color: 0
    },
    GENERALERROR: {
      translate: "GENERALERROR",
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
    Fords: 128 // 1 << 7;
  },
  locations_icons: {
    100: '<i class="fa fa-hotel"></i>',
    120: '<i class="fa fa-paw"></i>',
    130: '<i class="fa fa-lg fa-paint-brush"></i>',
    150: '<i class="fa fa-lg fa-university"></i>',
    160: '<i class="fa fa-lg fa-building"></i>',
    190: '<i class="fa fa-lg fa-dollar"></i>',
    200: '<i class="fa fa-lg fa-hospital-o"></i>',
    220: '<i class="fa fa-lg fa-fort-awesome"></i>',
    260: '<i class="fa fa-lg fa-film"></i>',
    330: '<i class="fa fa-lg fa-tree"></i>',
    360: '<i class="fa fa-lg fa-map-signs"></i>',
    390: '<i class="fa fa-lg fa-camera"></i>',
    420: '<i class="fa fa-lg fa-shopping-cart"></i>',
    560: '<i class="fa fa-lg fa-cutlery"></i>',
    580: '<i class="fa fa-lg fa-bus"></i>',
    620: '<i class="fa fa-lg fa-suitcase"></i>',
    phone: '<i class="fa fa-phone"></i>',
    address: '<i class="fa fa-address-card"></i>',
    website: '<i class="fa fa-globe"></i>',
    wheelchair: '<i class="fa fa-wheelchair-alt"></i>'
  },
  landmark_icons: {
    arts_centre: '<i class="fa fa-stack-1x fa-paint-brush"></i>',
    artwork: '<i class="fa fa-stack-1x fa-paint-brush"></i>',
    attraction: '<i class="fa fa-stack-1x fa-camera"></i>',
    bank: '<i class="fa fa-stack-1x fa-dollar"></i>',
    bar: '<i class="fa fa-stack-1x fa-glass"</i>>',
    cafe: '<i class="fa fa-stack-1x fa-coffee icon"></i>',
    clock: '<i class="fa fa-stack-1x fa-clock-o"></i>',
    courthouse: '<i class="fa fa-stack-1x fa-legal"></i>',
    embassy: '<i class="fa fa-stack-1x fa-flag"></i>',
    fast_food: '<i class="fa fa-stack-1x fa-cutlery"></i>',
    fuel: '<i class="fa fa-stack-1x fa-car"></i>',
    gallery: '<i class="fa fa-stack-1x fa-photo"></i>',
    hotel: '<i class="fa fa-stack-1x fa-stack-1x fa-hotel"></i>',
    information: '<i class="fa fa-stack-1x fa-info"></i>',
    memorial: '<i class="fa fa-stack-1x fa-institution"></i>',
    monument: '<i class="fa fa-stack-1x fa-institution"></i>',
    museum: '<i class="fa fa-stack-1x fa-institution"></i>',
    park: '<i class="fa fa-stack-1x fa-tree"></i>',
    pharmacy: '<i class="fa fa-stack-1x fa-medkit"></i>',
    pitch: '<i class="fa fa-stack-1x fa-futbol-o"></i>',
    place_of_worship: '<i class="fa fa-stack-1x fa-building"></i>',
    playground: '<i class="fa fa-stack-1x fa-futbol-o"></i>',
    pub: '<i class="fa fa-stack-1x fa-beer"></i>',
    restaurant: '<i class="fa fa-stack-1x fa-cutlery"></i>',
    shop: '<i class="fa fa-stack-1x fa-shopping-bag"></i>',
    sports_centre: '<i class="fa fa-stack-1x fa-futbol-o"></i>',
    station: '<i class="fa fa-stack-1x fa-train"></i>',
    statue: '<i class="fa fa-stack-1x fa-institution"></i>',
    subway_entrance: '<i class="fa fa-stack-1x fa-subway"></i>',
    swimming_pool: '<i class="fa fa-stack-1x fa-dollar-o"></i>',
    theatre: '<i class="fa fa-stack-1x fa-ticket"></i>',
    town_hall: '<i class="fa fa-stack-1x fa-institution"></i>',
    traffic_signals: '<i class="fa fa-stack-1x fa-car"></i>',
    tram_stop: '<i class="fa fa-stack-1x fa-bus"></i>'
  },
  boundary: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "DEU",
        properties: {
          name: "Germany"
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [9.921906, 54.983104],
              [9.93958, 54.596642],
              [10.950112, 54.363607],
              [10.939467, 54.008693],
              [11.956252, 54.196486],
              [12.51844, 54.470371],
              [13.647467, 54.075511],
              [14.119686, 53.757029],
              [14.353315, 53.248171],
              [14.074521, 52.981263],
              [14.4376, 52.62485],
              [14.685026, 52.089947],
              [14.607098, 51.745188],
              [15.016996, 51.106674],
              [14.570718, 51.002339],
              [14.307013, 51.117268],
              [14.056228, 50.926918],
              [13.338132, 50.733234],
              [12.966837, 50.484076],
              [12.240111, 50.266338],
              [12.415191, 49.969121],
              [12.521024, 49.547415],
              [13.031329, 49.307068],
              [13.595946, 48.877172],
              [13.243357, 48.416115],
              [12.884103, 48.289146],
              [13.025851, 47.637584],
              [12.932627, 47.467646],
              [12.62076, 47.672388],
              [12.141357, 47.703083],
              [11.426414, 47.523766],
              [10.544504, 47.566399],
              [10.402084, 47.302488],
              [9.896068, 47.580197],
              [9.594226, 47.525058],
              [8.522612, 47.830828],
              [8.317301, 47.61358],
              [7.466759, 47.620582],
              [7.593676, 48.333019],
              [8.099279, 49.017784],
              [6.65823, 49.201958],
              [6.18632, 49.463803],
              [6.242751, 49.902226],
              [6.043073, 50.128052],
              [6.156658, 50.803721],
              [5.988658, 51.851616],
              [6.589397, 51.852029],
              [6.84287, 52.22844],
              [7.092053, 53.144043],
              [6.90514, 53.482162],
              [7.100425, 53.693932],
              [7.936239, 53.748296],
              [8.121706, 53.527792],
              [8.800734, 54.020786],
              [8.572118, 54.395646],
              [8.526229, 54.962744],
              [9.282049, 54.830865],
              [9.921906, 54.983104]
            ]
          ]
        }
      }
    ]
  },
  measure_locale: {
    "de-DE": "de",
    "en-US": "en",
    "en-GB": "en_UK",
    "zh-CN": "cn",
    "pt-PT": "pt_PT",
    "es-ES": "es",
    "ru-RU": "ru",
    "fr-FR": "fr",
    "pl-PL": "pl"
  }
});
