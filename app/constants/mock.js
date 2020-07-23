angular.module("orsApp").constant("mockResponse", {
  type: "FeatureCollection",
  features: [
    {
      bbox: [8.507108, 48.945529, 8.512566, 48.952674],
      type: "Feature",
      properties: {
        ascent: 20.7,
        descent: 62.4,
        segments: [
          {
            distance: 1599.9,
            duration: 279.0,
            steps: [
              {
                distance: 196.2,
                duration: 35.3,
                type: 11,
                instruction: "Head northeast",
                name: "-",
                way_points: [0, 2]
              },
              {
                distance: 172.1,
                duration: 17.7,
                type: 3,
                instruction: "Turn sharp right",
                name: "-",
                way_points: [2, 3]
              },
              {
                distance: 282.3,
                duration: 25.4,
                type: 0,
                instruction: "Turn left",
                name: "-",
                way_points: [3, 11]
              },
              {
                distance: 199.2,
                duration: 20.5,
                type: 0,
                instruction: "Turn left",
                name: "-",
                way_points: [11, 17]
              },
              {
                distance: 416.1,
                duration: 99.9,
                type: 1,
                instruction: "Turn right onto <b>Weiklesstraße</b>",
                name: "Weiklesstraße",
                way_points: [17, 24]
              },
              {
                distance: 175.3,
                duration: 42.1,
                type: 0,
                instruction: "Turn left onto <b>Neubergstraße</b>",
                name: "Neubergstraße",
                way_points: [24, 28]
              },
              {
                distance: 158.8,
                duration: 38.1,
                type: 5,
                instruction: "Turn slight right onto <b>Palmbacher Straße</b>",
                name: "Palmbacher Straße",
                way_points: [28, 32]
              },
              {
                distance: 0.0,
                duration: 0.0,
                type: 10,
                instruction: "Arrive at Palmbacher Straße, on the right",
                name: "-",
                way_points: [32, 32]
              }
            ],
            detourfactor: 2.33,
            percentage: 100.0,
            ascent: 20.69122807017544,
            descent: 62.36622807017545
          }
        ],
        extras: {
          surface: {
            values: [
              [0, 2, 0],
              [2, 3, 1],
              [3, 17, 0],
              [17, 24, 3],
              [24, 26, 1],
              [26, 32, 3]
            ],
            summary: [
              { value: 0.0, distance: 824.0, amount: 51.5 },
              { value: 3.0, distance: 675.8, amount: 42.24 },
              { value: 1.0, distance: 100.1, amount: 6.25 }
            ]
          },
          waytypes: {
            values: [
              [0, 17, 5],
              [17, 32, 3]
            ],
            summary: [
              { value: 5.0, distance: 892.2, amount: 55.77 },
              { value: 3.0, distance: 255.8, amount: 15.99 }
            ]
          },
          steepness: {
            values: [
              [0, 18, -1],
              [18, 22, -3],
              [22, 32, 1]
            ],
            summary: [
              { value: -1.0, distance: 952.5, amount: 59.53 },
              { value: 1.0, distance: 598.0, amount: 37.38 },
              { value: -3.0, distance: 49.4, amount: 3.09 }
            ]
          }
        },
        summary: { distance: 1599.9, duration: 279.0 },
        way_points: [0, 32]
      },
      geometry: {
        coordinates: [
          [8.507108, 48.946505, 268.0],
          [8.507145, 48.946519, 266.5],
          [8.509622, 48.94707, 256.0],
          [8.509404, 48.945529, 249.4],
          [8.509963, 48.945541, 250.2],
          [8.510177, 48.945557, 251.0],
          [8.510343, 48.945569, 251.7],
          [8.510557, 48.945619, 252.4],
          [8.510729, 48.945707, 253.0],
          [8.511271, 48.946069, 255.7],
          [8.511735, 48.946353, 258.3],
          [8.512566, 48.946796, 263.4],
          [8.512389, 48.947082, 263.4],
          [8.512037, 48.947629, 261.0],
          [8.511935, 48.947788, 260.4],
          [8.511575, 48.948294, 253.8],
          [8.511506, 48.94836, 252.4],
          [8.511414, 48.948409, 250.9],
          [8.511684, 48.948822, 245.5],
          [8.51184, 48.949276, 240.0],
          [8.51192, 48.94967, 236.4],
          [8.511974, 48.950361, 231.2],
          [8.511989, 48.95102, 226.0],
          [8.511947, 48.95188, 221.4],
          [8.511939, 48.952099, 220.7],
          [8.511682, 48.952093, 220.4],
          [8.510237, 48.952112, 219.7],
          [8.510106, 48.952113, 219.7],
          [8.509539, 48.952127, 220.4],
          [8.509052, 48.952302, 221.9],
          [8.508087, 48.952567, 225.1],
          [8.507771, 48.952638, 225.9],
          [8.507541, 48.952674, 226.3]
        ],
        type: "LineString"
      }
    },
    {
      bbox: [8.497653, 48.94338, 8.507541, 48.953301],
      type: "Feature",
      properties: {
        ascent: 10.6,
        descent: 49.4,
        segments: [
          {
            distance: 2286.2,
            duration: 294.2,
            steps: [
              {
                distance: 380.0,
                duration: 60.4,
                type: 11,
                instruction: "Head southwest",
                name: "-",
                way_points: [0, 3]
              },
              {
                distance: 191.2,
                duration: 22.9,
                type: 1,
                instruction: "Turn right",
                name: "-",
                way_points: [3, 7]
              },
              {
                distance: 226.0,
                duration: 31.0,
                type: 1,
                instruction: "Turn right onto <b>Palmbacher Weg</b>",
                name: "Palmbacher Weg",
                way_points: [7, 12]
              },
              {
                distance: 21.2,
                duration: 5.1,
                type: 12,
                instruction: "Keep left",
                name: "-",
                way_points: [12, 15]
              },
              {
                distance: 502.5,
                duration: 67.1,
                type: 3,
                instruction: "Turn sharp right",
                name: "-",
                way_points: [15, 42]
              },
              {
                distance: 341.3,
                duration: 22.3,
                type: 1,
                instruction: "Turn right onto <b>Karlsbader Straße, K 9653</b>",
                name: "Karlsbader Straße, K 9653",
                way_points: [42, 48]
              },
              {
                distance: 500.3,
                duration: 55.6,
                type: 7,
                instruction:
                  "Enter the roundabout and take the 2nd exit onto <b>Karlsbader Straße, K 9653</b>",
                name: "Karlsbader Straße, K 9653",
                exit_number: 2,
                way_points: [48, 69]
              },
              {
                distance: 72.7,
                duration: 17.4,
                type: 3,
                instruction: "Turn sharp right",
                name: "-",
                way_points: [69, 73]
              },
              {
                distance: 50.9,
                duration: 12.2,
                type: 0,
                instruction: "Turn left onto <b>Palmbacher Straße</b>",
                name: "Palmbacher Straße",
                way_points: [73, 77]
              },
              {
                distance: 0.0,
                duration: 0.0,
                type: 10,
                instruction: "Arrive at Palmbacher Straße, on the left",
                name: "-",
                way_points: [77, 77]
              }
            ],
            detourfactor: 3.33,
            percentage: 100.0,
            ascent: 10.582499999999982,
            descent: 49.38249999999999
          }
        ],
        extras: {
          surface: {
            values: [
              [0, 10, 0],
              [10, 12, 1],
              [12, 42, 0],
              [42, 77, 3]
            ],
            summary: [
              { value: 0.0, distance: 1177.5, amount: 51.5 },
              { value: 3.0, distance: 965.7, amount: 42.24 },
              { value: 1.0, distance: 143.0, amount: 6.25 }
            ]
          },
          waytypes: {
            values: [
              [0, 42, 5],
              [42, 69, 2],
              [69, 77, 3]
            ],
            summary: [
              { value: 5.0, distance: 1274.9, amount: 55.77 },
              { value: 2.0, distance: 645.8, amount: 28.25 },
              { value: 3.0, distance: 365.5, amount: 15.99 }
            ]
          },
          steepness: {
            values: [
              [0, 2, 1],
              [2, 63, -1],
              [63, 77, 1]
            ],
            summary: [
              { value: -1.0, distance: 1361.1, amount: 59.53 },
              { value: 1.0, distance: 854.5, amount: 37.38 }
            ]
          }
        },
        summary: { distance: 5286.2, duration: 1294.2 },
        way_points: [0, 77]
      },
      geometry: {
        coordinates: [
          [8.507108, 48.946505, 268.0],
          [8.50418, 48.945388, 269.8],
          [8.504073, 48.94511, 269.8],
          [8.50469, 48.944298, 272.9],
          [8.504533, 48.944206, 273.5],
          [8.503024, 48.943725, 278.1],
          [8.502678, 48.943508, 277.8],
          [8.50252, 48.94338, 277.5],
          [8.501805, 48.943602, 275.0],
          [8.500417, 48.94414, 273.1],
          [8.500211, 48.944233, 272.7],
          [8.500125, 48.944278, 272.2],
          [8.499846, 48.944396, 271.5],
          [8.499782, 48.944406, 271.2],
          [8.499618, 48.944416, 271.0],
          [8.499561, 48.944404, 270.7],
          [8.499579, 48.944426, 270.5],
          [8.499603, 48.944489, 270.3],
          [8.499591, 48.944551, 270.1],
          [8.499569, 48.944578, 269.9],
          [8.499474, 48.944619, 269.6],
          [8.49925, 48.944719, 269.3],
          [8.499172, 48.944786, 269.0],
          [8.499099, 48.944916, 268.7],
          [8.499068, 48.944991, 268.4],
          [8.498893, 48.945357, 266.8],
          [8.498712, 48.945562, 267.1],
          [8.498158, 48.945955, 266.4],
          [8.498037, 48.946091, 266.2],
          [8.497661, 48.946908, 262.5],
          [8.497653, 48.947026, 262.0],
          [8.497722, 48.947157, 261.5],
          [8.497789, 48.947288, 261.0],
          [8.498, 48.94745, 260.0],
          [8.49816, 48.947589, 259.5],
          [8.498328, 48.947715, 259.0],
          [8.498392, 48.947768, 258.5],
          [8.498496, 48.947815, 258.1],
          [8.498678, 48.947864, 257.8],
          [8.498836, 48.947943, 257.4],
          [8.49885, 48.948017, 257.1],
          [8.498751, 48.948082, 256.8],
          [8.498653, 48.94813, 256.5],
          [8.499202, 48.948566, 254.1],
          [8.500062, 48.949262, 249.0],
          [8.501069, 48.950048, 242.3],
          [8.501383, 48.95028, 241.1],
          [8.501514, 48.950402, 240.7],
          [8.501617, 48.950502, 240.4],
          [8.501654, 48.950488, 240.1],
          [8.501738, 48.950477, 239.9],
          [8.501853, 48.950514, 239.7],
          [8.501878, 48.950537, 239.6],
          [8.501893, 48.950564, 239.4],
          [8.501873, 48.950649, 239.3],
          [8.501845, 48.950672, 239.2],
          [8.501927, 48.950743, 239.2],
          [8.502137, 48.950927, 238.9],
          [8.502488, 48.951184, 238.5],
          [8.503093, 48.951717, 237.2],
          [8.503452, 48.952022, 235.7],
          [8.503753, 48.95225, 234.5],
          [8.503977, 48.95237, 233.8],
          [8.504137, 48.952441, 233.5],
          [8.504586, 48.95267, 232.0],
          [8.504888, 48.952777, 231.3],
          [8.50525, 48.952891, 230.8],
          [8.505811, 48.953085, 230.2],
          [8.506348, 48.953242, 229.7],
          [8.506569, 48.953301, 229.6],
          [8.506554, 48.953176, 229.5],
          [8.506709, 48.953061, 229.4],
          [8.506783, 48.952942, 229.2],
          [8.506851, 48.9527, 229.1],
          [8.507014, 48.952709, 229.1],
          [8.507181, 48.952717, 229.1],
          [8.507364, 48.952701, 229.2],
          [8.507541, 48.952674, 229.2]
        ],
        type: "LineString"
      }
    },
    {
      bbox: [8.497653, 48.94338, 8.507541, 48.953301],
      type: "Feature",
      properties: {
        ascent: 10.7,
        descent: 49.5,
        segments: [
          {
            distance: 2352.8,
            duration: 301.3,
            steps: [
              {
                distance: 380.0,
                duration: 60.4,
                type: 11,
                instruction: "Head southwest",
                name: "-",
                way_points: [0, 3]
              },
              {
                distance: 191.2,
                duration: 22.9,
                type: 1,
                instruction: "Turn right",
                name: "-",
                way_points: [3, 7]
              },
              {
                distance: 226.0,
                duration: 31.0,
                type: 1,
                instruction: "Turn right onto <b>Palmbacher Weg</b>",
                name: "Palmbacher Weg",
                way_points: [7, 12]
              },
              {
                distance: 511.3,
                duration: 71.1,
                type: 13,
                instruction: "Keep right onto <b>Palmbacher Weg</b>",
                name: "Palmbacher Weg",
                way_points: [12, 39]
              },
              {
                distance: 341.3,
                duration: 22.3,
                type: 1,
                instruction: "Turn right onto <b>Karlsbader Straße, K 9653</b>",
                name: "Karlsbader Straße, K 9653",
                way_points: [39, 45]
              },
              {
                distance: 579.3,
                duration: 63.7,
                type: 7,
                instruction:
                  "Enter the roundabout and take the 6th exit onto <b>Karlsbader Straße, K 9653</b>",
                name: "Karlsbader Straße, K 9653",
                exit_number: 6,
                way_points: [45, 82]
              },
              {
                distance: 72.7,
                duration: 17.4,
                type: 3,
                instruction: "Turn sharp right",
                name: "-",
                way_points: [82, 86]
              },
              {
                distance: 50.9,
                duration: 12.2,
                type: 0,
                instruction: "Turn left onto <b>Palmbacher Straße</b>",
                name: "Palmbacher Straße",
                way_points: [86, 90]
              },
              {
                distance: 0.0,
                duration: 0.0,
                type: 10,
                instruction: "Arrive at Palmbacher Straße, on the left",
                name: "-",
                way_points: [90, 90]
              }
            ],
            detourfactor: 3.43,
            percentage: 100.0,
            ascent: 10.682499999999976,
            descent: 49.48249999999999
          }
        ],
        extras: {
          surface: {
            values: [
              [0, 10, 0],
              [10, 16, 1],
              [16, 39, 0],
              [39, 90, 3]
            ],
            summary: [
              { value: 0.0, distance: 1211.8, amount: 51.5 },
              { value: 3.0, distance: 993.8, amount: 42.24 },
              { value: 1.0, distance: 147.2, amount: 6.25 }
            ]
          },
          waytypes: {
            values: [
              [0, 39, 5],
              [39, 82, 2],
              [82, 90, 3]
            ],
            summary: [
              { value: 5.0, distance: 1312.1, amount: 55.77 },
              { value: 2.0, distance: 664.6, amount: 28.25 },
              { value: 3.0, distance: 376.1, amount: 15.99 }
            ]
          },
          steepness: {
            values: [
              [0, 2, 1],
              [2, 90, -1]
            ],
            summary: [
              { value: -1.0, distance: 1400.7, amount: 59.53 },
              { value: 1.0, distance: 879.4, amount: 37.38 }
            ]
          }
        },
        summary: { distance: 2352.8, duration: 301.3 },
        way_points: [0, 90]
      },
      geometry: {
        coordinates: [
          [8.507108, 48.946505, 268.0],
          [8.50418, 48.945388, 269.8],
          [8.504073, 48.94511, 269.8],
          [8.50469, 48.944298, 272.9],
          [8.504533, 48.944206, 273.5],
          [8.503024, 48.943725, 278.1],
          [8.502678, 48.943508, 277.8],
          [8.50252, 48.94338, 277.5],
          [8.501805, 48.943602, 275.0],
          [8.500417, 48.94414, 273.1],
          [8.500211, 48.944233, 272.7],
          [8.500125, 48.944278, 272.2],
          [8.499846, 48.944396, 271.5],
          [8.499794, 48.944447, 271.2],
          [8.499694, 48.944529, 271.0],
          [8.499619, 48.944564, 270.7],
          [8.499569, 48.944578, 270.5],
          [8.499474, 48.944619, 270.3],
          [8.49925, 48.944719, 270.1],
          [8.499172, 48.944786, 269.9],
          [8.499099, 48.944916, 269.6],
          [8.499068, 48.944991, 269.4],
          [8.498893, 48.945357, 268.1],
          [8.498712, 48.945562, 267.3],
          [8.498158, 48.945955, 266.4],
          [8.498037, 48.946091, 266.2],
          [8.497661, 48.946908, 262.5],
          [8.497653, 48.947026, 262.0],
          [8.497722, 48.947157, 261.5],
          [8.497789, 48.947288, 261.0],
          [8.498, 48.94745, 260.0],
          [8.49816, 48.947589, 259.5],
          [8.498328, 48.947715, 259.0],
          [8.498392, 48.947768, 258.5],
          [8.498496, 48.947815, 258.1],
          [8.498678, 48.947864, 257.8],
          [8.498836, 48.947943, 257.4],
          [8.49885, 48.948017, 257.1],
          [8.498751, 48.948082, 256.8],
          [8.498653, 48.94813, 256.5],
          [8.499202, 48.948566, 254.1],
          [8.500062, 48.949262, 249.0],
          [8.501069, 48.950048, 242.3],
          [8.501383, 48.95028, 241.1],
          [8.501514, 48.950402, 240.7],
          [8.501617, 48.950502, 240.4],
          [8.501654, 48.950488, 240.1],
          [8.501738, 48.950477, 239.9],
          [8.501853, 48.950514, 239.7],
          [8.501878, 48.950537, 239.6],
          [8.501893, 48.950564, 239.4],
          [8.501873, 48.950649, 239.3],
          [8.501845, 48.950672, 239.2],
          [8.50181, 48.950689, 239.2],
          [8.501727, 48.950704, 239.1],
          [8.501684, 48.9507, 239.1],
          [8.501643, 48.95069, 239.0],
          [8.501577, 48.950648, 239.0],
          [8.501559, 48.950618, 238.9],
          [8.501553, 48.950586, 238.9],
          [8.501583, 48.950526, 238.9],
          [8.501617, 48.950502, 238.9],
          [8.501654, 48.950488, 238.9],
          [8.501738, 48.950477, 239.0],
          [8.501853, 48.950514, 239.1],
          [8.501878, 48.950537, 239.2],
          [8.501893, 48.950564, 239.3],
          [8.501873, 48.950649, 239.3],
          [8.501845, 48.950672, 239.3],
          [8.501927, 48.950743, 239.3],
          [8.502137, 48.950927, 239.1],
          [8.502488, 48.951184, 238.6],
          [8.503093, 48.951717, 237.2],
          [8.503452, 48.952022, 235.7],
          [8.503753, 48.95225, 234.5],
          [8.503977, 48.95237, 233.8],
          [8.504137, 48.952441, 233.5],
          [8.504586, 48.95267, 232.0],
          [8.504888, 48.952777, 231.3],
          [8.50525, 48.952891, 230.8],
          [8.505811, 48.953085, 230.2],
          [8.506348, 48.953242, 229.7],
          [8.506569, 48.953301, 229.6],
          [8.506554, 48.953176, 229.5],
          [8.506709, 48.953061, 229.4],
          [8.506783, 48.952942, 229.2],
          [8.506851, 48.9527, 229.1],
          [8.507014, 48.952709, 229.1],
          [8.507181, 48.952717, 229.1],
          [8.507364, 48.952701, 229.2],
          [8.507541, 48.952674, 229.2]
        ],
        type: "LineString"
      }
    }
  ],
  bbox: [8.497653, 48.94338, 8.512566, 48.953301],
  metadata: {
    attribution: "openrouteservice.org | OpenStreetMap contributors",
    service: "routing",
    timestamp: 1583508855164,
    query: {
      coordinates: [
        [8.507195, 48.946406],
        [8.50771, 48.953142]
      ],
      profile: "driving-car",
      preference: "fastest",
      format: "geojson",
      units: "m",
      geometry: true,
      instructions: true,
      instructions_format: "html",
      attributes: ["detourfactor", "percentage"],
      elevation: true,
      extra_info: ["steepness", "waytype", "surface"],
      alternative_routes: { target_count: 3 }
    },
    engine: {
      version: "6.0.0",
      build_date: "2020-01-16T14:21:32Z",
      graph_date: "0000-00-00T00:00:00Z"
    }
  }
});
