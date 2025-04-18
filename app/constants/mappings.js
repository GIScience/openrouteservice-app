angular.module("orsApp").constant("mappings", {
  default: {
    "-1": {
      text: "default",
      color: "grey"
    }
  },
  steepness: {
    false: {
      text: "no data",
      type: "false",
      color: "grey"
    },
    "-5": {
      text: "16%+",
      type: "-1",
      color: "#028306"
    },
    "-4": {
      text: "10-15%",
      type: "-1",
      color: "#2AA12E"
    },
    "-3": {
      text: "7-9%",
      type: "-1",
      color: "#53BF56"
    },
    "-2": {
      text: "4-6%",
      type: "-1",
      color: "#7BDD7E"
    },
    "-1": {
      text: "1-3%",
      type: "-1",
      color: "#A4FBA6"
    },
    "0": {
      text: "0%",
      type: "0",
      color: "#ffcc99"
    },
    "1": {
      text: "1-3%",
      type: "1",
      color: "#F29898"
    },
    "2": {
      text: "4-6%",
      type: "1",
      color: "#E07575"
    },
    "3": {
      text: "7-9%",
      type: "1",
      color: "#CF5352"
    },
    "4": {
      text: "10-15%",
      type: "1",
      color: "#BE312F"
    },
    "5": {
      text: "16%+",
      type: "1",
      color: "#AD0F0C"
    }
  },
  waytype: {
    false: {
      text: "no data",
      type: "false",
      color: "grey"
    },
    "0": {
      text: "Other",
      color: "#30959e"
    },
    "1": {
      text: "StateRoad",
      color: "#3f9da6"
    },
    "2": {
      text: "Road",
      color: "#4ea5ae"
    },
    "3": {
      text: "Street",
      color: "#5baeb5"
    },
    "4": {
      text: "Path",
      color: "#67b5bd"
    },
    "5": {
      text: "Track",
      color: "#73bdc4"
    },
    "6": {
      text: "Cycleway",
      color: "#7fc7cd"
    },
    "7": {
      text: "Footway",
      color: "#8acfd5"
    },
    "8": {
      text: "Steps",
      color: "#96d7dc"
    },
    "9": {
      text: "Ferry",
      color: "#a2dfe5"
    },
    "10": {
      text: "Construction",
      color: "#ade8ed"
    }
  },
  surface: {
    false: {
      text: "no data",
      type: "false",
      color: "grey"
    },
    "0": {
      text: "Other",
      color: "#ddcdeb"
    },
    "1": {
      text: "Paved",
      color: "#cdb8df"
    },
    "2": {
      text: "Unpaved",
      color: "#d2c0e3"
    },
    "3": {
      text: "Asphalt",
      color: "#bca4d3"
    },
    "4": {
      text: "Concrete",
      color: "#c1abd7"
    },
    "5": {
      text: "Cobblestone",
      color: "#c7b2db"
    },
    "6": {
      text: "Metal",
      color: "#e8dcf3"
    },
    "7": {
      text: "Wood",
      color: "#eee3f7"
    },
    "8": {
      text: "Compacted Gravel",
      color: "#d8c6e7"
    },
    "9": {
      text: "Fine Gravel",
      color: "#8f9de4"
    },
    "10": {
      text: "Gravel",
      color: "#e3d4ef"
    },
    "11": {
      text: "Dirt",
      color: "#99a6e7"
    },
    "12": {
      text: "Ground",
      color: "#a3aeeb"
    },
    "13": {
      text: "Ice",
      color: "#acb6ee"
    },
    "14": {
      text: "Paving Stones",
      color: "#b6c0f2"
    },
    "15": {
      text: "Sand",
      color: "#c9d1f8"
    },
    "16": {
      text: "Woodchips",
      color: "#c0c8f5"
    },
    "17": {
      text: "Grass",
      color: "#d2dafc"
    },
    "18": {
      text: "Grass Paver",
      color: "#dbe3ff"
    }
  },
  suitability: {
    false: {
      text: "no data",
      type: "false",
      color: "grey"
    },
    "3": {
      text: "3/10",
      color: "#3D3D3D"
    },
    "4": {
      text: "4/10",
      color: "#4D4D4D"
    },
    "5": {
      text: "5/10",
      color: "#5D5D5D"
    },
    "6": {
      text: "6/10",
      color: "#6D6D6D"
    },
    "7": {
      text: "7/10",
      color: "#7C7C7C"
    },
    "8": {
      text: "8/10",
      color: "#8D8D8D"
    },
    "9": {
      text: "9/10",
      color: "#9D9D9D"
    },
    "10": {
      text: "10/10",
      color: "#ADADAD"
    }
  },
  green: {
    false: {
      text: "no data",
      type: "false",
      color: "grey"
    },
    "3": {
      text: "10/10",
      color: "#8ec639"
    },
    "4": {
      text: "9/10",
      color: "#99c93c"
    },
    "5": {
      text: "8/10",
      color: "#a4cc40"
    },
    "6": {
      text: "7/10",
      color: "#afcf43"
    },
    "7": {
      text: "6/10",
      color: "#bbd246"
    },
    "8": {
      text: "5/10",
      color: "#c6d54a"
    },
    "9": {
      text: "4/10",
      color: "#d1d84e"
    },
    "10": {
      text: "3/10",
      color: "#dcdc51"
    }
  },
  noise: {
    false: {
      text: "no data",
      type: "false",
      color: "grey"
    },
    "7": {
      text: "7/10",
      color: "#F8A056"
    },
    "8": {
      text: "8/10",
      color: "#EA7F27"
    },
    "9": {
      text: "9/10",
      color: "#A04900"
    },
    "10": {
      text: "10/10",
      color: "#773600"
    }
  },
  tollways: {
    false: {
      text: "no data",
      type: "false",
      color: "grey"
    },
    "0": {
      text: "LOCALE_NO_TOLLWAY",
      color: "#6ca97b"
    },
    "1": {
      text: "LOCALE_TOLLWAY",
      color: "#ffb347"
    }
  },
  avgspeed: {
    false: {
      text: "no data",
      type: "false",
      color: "grey"
    },
    "3": {
      text: "3 km/h",
      color: "#f2fdff",
      rangeBot: "0",
      rangeTop: "4"
    },
    "4": {
      text: "4 km/h",
      color: "#D8FAFF",
      rangeBot: "4",
      rangeTop: "5"
    },
    "5": {
      text: "5 km/h",
      color: "bff7ff",
      rangeBot: "5",
      rangeTop: "6"
    },
    "6": {
      text: "6-8 km/h",
      color: "#f2f7ff",
      rangeBot: "5",
      rangeTop: "9"
    },
    "9": {
      text: "9-12 km/h",
      color: "#d8e9ff",
      rangeBot: "9",
      rangeTop: "13"
    },
    "13": {
      text: "13-16 km/h",
      color: "#bedaff",
      rangeBot: "13",
      rangeTop: "17"
    },
    "17": {
      text: "17-20 km/h",
      color: "#a5cbff",
      rangeBot: "17",
      rangeTop: "21"
    },
    "21": {
      text: "21-24 km/h",
      color: "#8cbcff",
      rangeBot: "21",
      rangeTop: "25"
    },
    "25": {
      text: "25-29 km/h",
      color: "#72aeff",
      rangeBot: "25",
      rangeTop: "30"
    },
    "30": {
      text: "30-34 km/h",
      color: "#599fff",
      rangeBot: "30",
      rangeTop: "35"
    },
    "35": {
      text: "35-39 km/h",
      color: "#3f91ff",
      rangeBot: "35",
      rangeTop: "40"
    },
    "40": {
      text: "40-44 km/h",
      color: "#2682ff",
      rangeBot: "40",
      rangeTop: "45"
    },
    "45": {
      text: "45-49 km/h",
      color: "#0d73ff",
      rangeBot: "45",
      rangeTop: "50"
    },
    "50": {
      text: "50-59 km/h",
      color: "#0067f2",
      rangeBot: "50",
      rangeTop: "60"
    },
    "60": {
      text: "60-69 km/h",
      color: "#005cd9",
      rangeBot: "60",
      rangeTop: "70"
    },
    "70": {
      text: "70-79 km/h",
      color: "#0051c0",
      rangeBot: "70",
      rangeTop: "80"
    },
    "80": {
      text: "80-99 km/h",
      color: "#0046a6",
      rangeBot: "80",
      rangeTop: "100"
    },
    "100": {
      text: "100-119 km/h",
      color: "#003c8d",
      rangeBot: "100",
      rangeTop: "120"
    },
    "120": {
      text: "+120 km/h",
      color: "#003174",
      rangeBot: "120",
      rangeTop: "300"
    }
  },
  traildifficulty: {
    false: {
      text: "no data",
      type: "false",
      color: "grey"
    },
    "0": {
      text: "Missing SAC tag",
      text_hiking: "Missing SAC tag",
      color: "#dfecec"
    },
    "1": {
      text: "S0",
      text_hiking: "T1",
      color: "#9fc6c6"
    },
    "2": {
      text: "S1",
      text_hiking: "T2",
      color: "#80b3b3"
    },
    "3": {
      text: "S2",
      text_hiking: "T3",
      color: "#609f9f"
    },
    "4": {
      text: "S3",
      text_hiking: "T4",
      color: "#4d8080"
    },
    "5": {
      text: "S4",
      text_hiking: "T5",
      color: "#396060"
    },
    "6": {
      text: "S5",
      text_hiking: "T6",
      color: "#264040"
    },
    "7": {
      text: ">S5",
      color: "#132020"
    }
  },
  roadaccessrestrictions: {
    false: {
      text: "no data",
      type: "false",
      color: "grey"
    },
    "0": {
      text: "None (there are no restrictions)",
      color: "#fe7f6c"
    },
    "1": {
      text: "No",
      color: "#FE7F9C"
    },
    "2": {
      text: "Customers",
      color: "#FDAB9F"
    },
    "4": {
      text: "Destination",
      color: "#FF66CC"
    },
    "8": {
      text: "Delivery",
      color: "#FDB9C8"
    },
    "16": {
      text: "Private",
      color: "#F64A8A"
    },
    "32": {
      text: "Permissive",
      color: "#E0115F"
    }
  }
});
