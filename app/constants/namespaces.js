/**
 * all URLs used in the openrouteservice
 */
/**
 * orsNamespaces and schemata e.g. for XML requests to services
 */
angular.module("orsApp").constant("orsNamespaces", {
  schemata: {
    xls: "http://www.opengis.net/xls",
    sch: "http://www.ascc.net/xml/schematron",
    gml: "http://www.opengis.net/gml",
    wps: "http://www.opengis.net/wps/1.0.0",
    ows: "http://www.opengis.net/ows/1.1",
    xlink: "http://www.w3.org/1999/xlink",
    xsi: "http://www.w3.org/2001/XMLSchema-instance",
    ascc: "http://www.ascc.net/xml/schematron",
    aas: "http://www.geoinform.fh-mainz.de/aas",
    gpx: "http://www.topografix.com/GPX/1/1",
    xml: "http://www.w3.org/XML/1998/namespace",
    xsd: "http://www.w3.org/2001/XMLSchema",
    tcx: "http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2",
    gml32: "http://www.opengis.net/gml/3.2",
    xs: "http://www.w3.org/2001/XMLSchema",
    kml: "http://www.opengis.net/kml/2.2",
    atom: "http://www.w3.org/2005/Atom",
    xal: "urn:oasis:names:tc:ciq:xsdschema:xAL:2.0",
    gpxService:
      "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd",
    tcxService:
      "http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd",
    kmlService:
      "http://www.opengis.net/kml/2.2 http://schemas.opengis.net/kml/2.2.0/ogckml22.xsd"
  },
  /**
   * metadata used when generating (export) files on the openrouteservice
   */ metadata: {
    name: "Openrouteservice Route",
    description:
      "Route exported using GIScience Universität Heidelberg Openrouteservice",
    authorName: "GIScience Universität Heidelberg",
    authorEmailId: "some_person",
    authorEmailDomain: "geog.uni-heidelberg.de",
    copyright: "Openrouteservice - GIScience Universität Heidelberg",
    license: "MIT",
    link: "http://www.geog.uni-heidelberg.de/gis/index_en.html",
    keywords: "Openrouteservice. Routing. GIS. Universität Heidelberg",
    src: "Route point logged using Openrouteservice"
  }, //url to hillshade overlay
  layerHs:
    "https://korona.geog.uni-heidelberg.de/tiles/asterh/x={x}&y={y}&z={z}", //url to OSM layer
  layerBkgTopPlus: {
    GetCapabilities:
      "https://sgx.geodatenzentrum.de/wms_topplus_web_open?request=GetCapabilities&service=wms",
    url: "https://sgx.geodatenzentrum.de/wms_topplus_web_open?",
    options: {
      normal: {
        layers: "web",
        format: "image/png",
        attribution:
          '© <a href="http://www.bkg.bund.de">Bundesamt für Kartographie und Geodäsie</a> 2020, <a href="https://sgx.geodatenzentrum.de/web_public/Datenquellen_TopPlus_Open.pdf">Datenquellen</a>',
        id: 1
      },
      grey: {
        layers: "web_grau",
        format: "image/png",
        attribution:
          '© <a href="http://www.bkg.bund.de">Bundesamt für Kartographie und Geodäsie</a> 2020, <a href="https://sgx.geodatenzentrum.de/web_public/Datenquellen_TopPlus_Open.pdf">Datenquellen</a>',
        id: 2
      }
    }
  },
  layerOSM: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      id: 3
    }
  }, //url to OpenCycleMap
  layerOSMCycle: {
    url:
      "https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=13efc496ac0b486ea05691c820824f5f",
    options: {
      attribution:
        'Maps &copy; <a href="http://thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      id: 4
    }
  }, //url to Transport Dark map
  layerOSMDark: {
    url:
      "https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=13efc496ac0b486ea05691c820824f5f",
    options: {
      attribution:
        'Maps &copy; <a href="http://thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      id: 5
    }
  }, //url to Outdoors map
  layerOutdoors: {
    url:
      "https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=13efc496ac0b486ea05691c820824f5f",
    options: {
      attribution:
        'Maps &copy; <a href="http://thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      id: 6
    }
  }, //url to stamen maps
  layerStamen: {
    url: "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png",
    options: {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  overlayHillshade: {
    url: "https://korona.geog.uni-heidelberg.de/tiles/asterh/x={x}&y={y}&z={z}",
    options: {}
  },
  layerWorldImagery: {
    url:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    options: {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      id: 7
    }
  },
  layerCycleOsm: {
    url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    options: {
      attribution:
        'Tiles <a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases">CycleOSM</a> latest',
      id: 8
    }
  }
});
