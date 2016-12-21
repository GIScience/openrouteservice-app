/**
 * all URLs used in the openrouteservice
 */
/**
 * namespaces and schemata e.g. for XML requests to services
 */
namespaces = {
    xls: 'http://www.opengis.net/xls',
    sch: 'http://www.ascc.net/xml/schematron',
    gml: 'http://www.opengis.net/gml',
    wps: 'http://www.opengis.net/wps/1.0.0',
    ows: 'http://www.opengis.net/ows/1.1',
    xlink: 'http://www.w3.org/1999/xlink',
    xsi: 'http://www.w3.org/2001/XMLSchema-instance',
    ascc: 'http://www.ascc.net/xml/schematron',
    aas: 'http://www.geoinform.fh-mainz.de/aas',
    gpx: 'http://www.topografix.com/GPX/1/1',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xsd: 'http://www.w3.org/2001/XMLSchema',
    tcx: 'http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2',
    gml32: 'http://www.opengis.net/gml/3.2',
    xs: 'http://www.w3.org/2001/XMLSchema',
    kml: 'http://www.opengis.net/kml/2.2',
    atom: 'http://www.w3.org/2005/Atom',
    xal: 'urn:oasis:names:tc:ciq:xsdschema:xAL:2.0'
};
namespaces.schemata = {
    directoryService: 'http://www.opengis.net/xls http://schemas.opengis.net/ols/1.1.0/DirectoryService.xsd',
    analyseService: 'http://www.geoinform.fh-mainz.de/aas',
    gatewayService: 'http://www.opengis.net/xls http://schemas.opengis.net/ols/1.1.0/GatewayService.xsd',
    locationUtilityService: 'http://www.opengis.net/xls http://schemas.opengis.net/ols/1.1.0/LocationUtilityService.xsd',
    presentationService: 'http://www.opengis.net/xls http://schemas.opengis.net/ols/1.1.0/PresentationService.xsd',
    routeService: 'http://www.opengis.net/xls http://schemas.opengis.net/ols/1.1.0/RouteService.xsd',
    wpsService: 'http://www.opengis.net/xls http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd',
    lineStringService: 'http://www.opengis.net/gml http://schemas.opengis.net/gml/3.1.1/base/geometryBasic0d1d.xsd',
    gpxService: 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd',
    tcxService: 'http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd',
    kmlService: 'http://www.opengis.net/kml/2.2 http://schemas.opengis.net/kml/2.2.0/ogckml22.xsd'
};
/**
 * services that are called by openrouteservice, e.g. to determine the route between two waypoints
 * important note: all these URLs must be listed in the cgi-bin/proxy.cgi script of the server running ORS!
 * important note: all URLs have been blanked out for security reasons
 * if you want to become an active ORS code contributor please contact us: openrouteserviceATgeog.uni-heidelberg.de
 */
namespaces.services = {
    geocoding: 'http://129.206.7.158/geocoding', //for address search requests
    routing: 'http://129.206.7.158/routing', //for routing requests
    tmc: 'http://129.206.228.124/routing?tmc',
    analyse: 'http://129.206.7.158/analysis', //for accessibility analysis requests
};
/**
 * metadata used when generating (export) files on the openrouteservice
 */
namespaces.metadata = {
    name: 'OpenRouteService Route',
    description: 'Route exported using GIScience Universität Heidelberg OpenRouteService',
    authorName: 'GIScience Universität Heidelberg',
    authorEmailId: 'some_person',
    authorEmailDomain: 'geog.uni-heidelberg.de',
    copyright: 'OpenRouteService - GIScience Universität Heidelberg',
    license: 'MIT',
    link: 'http://www.geog.uni-heidelberg.de/gis/index_en.html',
    keywords: 'OpenRouteService. Routing. GIS. Universität Heidelberg',
    src: 'Route point logged using OpenRouteService'
};
/**
 * map layers used on the openlayers map
 */
//url to ORS-WMS map layer
namespaces.layerWms = 'http://129.206.228.72/cached/osm?';
//url to Open Map Surfer layer
namespaces.layerMapSurfer = {};
namespaces.layerMapSurfer.url = 'http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}';
namespaces.layerMapSurfer.attribution = 'Map data &copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors, powered by <a href="http://mapsurfernet.com/">MapSurfer.NET</a>';
//url to hillshade overlay
namespaces.layerHs = 'http://korona.geog.uni-heidelberg.de/tiles/asterh/x={x}&y={y}&z={z}';
//url to OSM layer
namespaces.layerOSM = {};
namespaces.layerOSM.url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
namespaces.layerOSM.attribution = 'Map data &copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors';
//url to OpenCycleMap
namespaces.layerOSMCycle = {};
namespaces.layerOSMCycle.url = 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png';
namespaces.layerOSMCycle.attribution = 'Map data &copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors';
//url to stamen maps
namespaces.layerStamen = {};
namespaces.layerStamen.url = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
namespaces.layerStamen.attribution = 'Map data &copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors';
//urls to TMC overlay
namespaces.overlayTmc = {};
namespaces.overlayHillshade = {};
namespaces.overlayHillshade.url = 'http://korona.geog.uni-heidelberg.de/tiles/asterh/x={x}&y={y}&z={z}';