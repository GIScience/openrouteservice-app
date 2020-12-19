# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!--## [Unreleased]

### Added
### Fixed
### Changed
### Deprecated
### Removed-->

## [Unreleased]

### Changed
- generation of slider styles

## [v0.6.0] - 2020-08-10

### Added
- maximum_speed for `driving-*` profiles.
    The option works for speeds down to `80` km/h (See [ors backend issue #480](https://github.com/GIScience/openrouteservice/issues/480))

### Changed
- leaflet.heightgraph version & style
- default weighting option to `recommended` ([#315](https://github.com/GIScience/openrouteservice-app/issues/315))

### Removed
- `fastest` weighting option ([#315](https://github.com/GIScience/openrouteservice-app/issues/315))

## [v0.5.4] - 2020-07-23

### Fixed
- gpx export exception ([#335](https://github.com/GIScience/openrouteservice-app/issues/335))
- distance markers not only on active route ([PR #337](https://github.com/GIScience/openrouteservice-app/pull/337))
- turn instruction with tcx export ([PR #323](https://github.com/GIScience/openrouteservice-app/pull/323))

### Removed
- unused code
- unused dependency

### Security
- updated some dependencies

## [v0.5.3] - 2020-05-18

### Added
- CycleOSM baselayer

## [v0.5.2] - 2020-05-12

### Fixed
- avoid features & polygons not working for isochrones
### Changed
- isochrones endpoint to V2 API
### Removed
- Mapsurfer baselayer

## [v0.5.1] - 2020-05-07

### Added
- World Imagery (Esri) satellite base layer
- 0mm kerb option for wheelchair profile

## [v0.5.0] - 2020-03-26

### Removed
- support for node 6 & 7. Please use version 8 or above

## [v0.4.3] - 2020-03-26

### Added
- deviation tolerance during route import ([#325](https://github.com/GIScience/openrouteservice-app/issues/325))
    - set lower value for more waypoints/accuracy
- alternative route feature ([#319](https://github.com/GIScience/openrouteservice-app/issues/319))
    - activate in settings, click route or sidebar entry to switch route
    - only for routes with 2 points (start & end) below 100km
    - default values for `weight-factor` and `share-factor` used
- possibility to mock the ors response for development purpose
    - uncomment all instances of "mock" to enable

### Fixed
- no extra info settings for subgroups ([#328](https://github.com/GIScience/openrouteservice-app/issues/328))

### Changed
- maxZoom of all base maps to 18 ([#311](https://github.com/GIScience/openrouteservice-app/issues/311))
- route processing logic to increase performance ([#320](https://github.com/GIScience/openrouteservice-app/issues/320))

## [v0.4.2] - 2020-01-30

### Added
- tcx export format (Garmin) incl. adjustable pace in km/h ([#313](https://github.com/GIScience/openrouteservice-app/pull/313))
- http-proxy for using this client with a local ors backend:
  - Running `grunt ors_local` will
    now initially map the ENV endpoints to the same host the frontend is running (localhost:3005)
    and will proxy it to localhost:8082 if the URL contains `/ors/`.

### Fixed
- TypeError when using isochrones with avoid areas ([#321](https://github.com/GIScience/openrouteservice-app/issues/321))
- deleting last waypoint input field for round trip routing ([#312](https://github.com/GIScience/openrouteservice-app/issues/312))
- a console error appearing for swapping empty waypoints

## [v0.4.1] - 2020-01-24

### Added
- experimental round trip functionality
  - round trips can be made from one starting point by choosing the
    approximate length (`options.round_trip.length`) of the trip (may vary greatly!)
  - the roundness sets the `options.round_trip.points` api parameter
    and defines the number of helper points generated
  - the randomization sets the `options.round_trip.seed` api parameter
    which randomly defines the direction in which the helper points
    are generated

### Fixed
- gpx export with ors API ([#308](https://github.com/GIScience/openrouteservice-app/issues/308))
- green & quiet routing ([#310](https://github.com/GIScience/openrouteservice-app/issues/310))

### Changed
- endpoints for local development to `http://localhost:8082/ors(/v2)`

## [v0.4.0] - 2020-01-08

### Added
- direct Waypoints: choose from "right-click" menu ([#305](https://github.com/GIScience/openrouteservice-app/issues/305))
- hungarian translation for interface ([#306](https://github.com/GIScience/openrouteservice-app/issues/306))
- indonesian translation for instructions

### Changed
- ORS api version for routing to V2

## [v0.3.12] - 2019-11-15

### Added
- some german translations
- inspect route above x meter elevation (heightgraph update)

### Changed
- version of leaflet.heightgraph, leaflet-distance-markers and grunt-contrib-cssmin to latest
- geocoding endpoint from `search` to `autocomplete`
- address search debounce from 1s to 200ms

### Fixed
- some translations

## [v0.3.11] - 2019-09-27

### Added
- warning flag for wheelchair profile

### Fixed
- remaining security issues ([#294](https://github.com/GIScience/openrouteservice-app/issues/294))
- some translations

## [v0.3.10] - 2019-09-06

### Added
- indonesian as interface language

### Fixed
- most security issues ([#294](https://github.com/GIScience/openrouteservice-app/issues/294))
- some translations

## [v0.3.9] - 2019-03-02

### Changed
- fuel options initialization
    - hide fuel options if it is not possible to retrieve car brands
    - retry fuel option initialization on option change (after changing endpoint)

### Fixed
- missing fuel endpoint in Gruntfile.default.js ([#279](https://github.com/GIScience/openrouteservice-app/issues/279))

## [v0.3.8] - 2019-02-28

### Added
- OpenFuelService integration ([#248](https://github.com/GIScience/openrouteservice-app/issues/248))

### Removed
- cycling-tour profile ([#272](https://github.com/GIScience/openrouteservice-app/issues/272))
- some options see ORS issue [#396](https://github.com/GIScience/openrouteservice/issues/396) ([#274](https://github.com/GIScience/openrouteservice-app/issues/274))

## [v0.3.7] - 2018-12-17

### Added
- Population attribution to info modal ([#266](https://github.com/GIScience/openrouteservice-app/issues/266))
- Road access restrictions to panel and map ([#267](https://github.com/GIScience/openrouteservice-app/issues/267))
- Minimum wheelchair width setting ([#268](https://github.com/GIScience/openrouteservice-app/issues/268))

## [v0.3.6] - 2018-11-13

### Changed
- Forum link to ask.openrouteservice.org (([#262](https://github.com/GIScience/openrouteservice-app/issues/262)))
- GPX export file generation supports both old and new method (([#256](https://github.com/GIScience/openrouteservice-app/issues/256)))

### Fixed
- Incorrect Wheelchair parameters ([#264](https://github.com/GIScience/openrouteservice-app/issues/264))
- Unchecking hgv settings leaves setting=false remnant in request' ([#263](https://github.com/GIScience/openrouteservice-app/issues/263))
- Broken Isochrone toggle ([#260](https://github.com/GIScience/openrouteservice-app/issues/260))

## [v0.3.5] - 2018-09-11

### Changed
- GPX export file generation

### Fixed
- GPX export strips out XML tag ([#256](https://github.com/GIScience/openrouteservice-app/issues/256))

## [v0.3.4] - 2018-08-24

### Added
- OpenMapSurfer tiles served via API
- GruntFile updates

### Fixed
- Isochrones random colors

## [v0.3.3] - 2018-08-16

### Added
- default endpoint setting for current domain
- popup to inform user of changed endpoints
- checkbox to decide if endpoints will be saved to cookies

### Fixed
- system error not fading ([#161](https://github.com/GIScience/openrouteservice-app/issues/161))
- showing false internet connection error ([#235](https://github.com/GIScience/openrouteservice-app/issues/235))

## [v0.3.2] - 2018-08-14

### Fixed
- map settings not loading from cookies
- TopPlus maplayers not showing

### Removed
- korona map layers due to instability

## [v0.3.1] - 2018-08-13

### Added
- Support for additional Turn instructions keep left/keep right (provided by graphhopper 0.10)
- Custom endpoint settings (gear icon in bottom left corner of the settings) ([#243](https://github.com/GIScience/openrouteservice-app/issues/243))
- Personalized isochrone-color, distance marker and elevation profile settings ([#234](https://github.com/GIScience/openrouteservice-app/issues/234))
- Tooltip for geocode results that show the datasource ([#245](https://github.com/GIScience/openrouteservice-app/issues/245))

### Changed
- Heightgraph (aka. elevation profile) visibility on mobile devices (see 5194fac1f1f5e58667b7fac64e1a6964330b1968)

## [v0.3.0] - 2018-05-28

### Added
- foldable sidebar ([#183](https://github.com/GIScience/openrouteservice-app/issues/183))
- temporary marker to map on "What's Here?" request ([#216](https://github.com/GIScience/openrouteservice-app/issues/216))
- custom markers for isochrones view ([#221](https://github.com/GIScience/openrouteservice-app/issues/221))
- option to export GeoJSON routes without elevation ([#218](https://github.com/GIScience/openrouteservice-app/issues/218))

### Changed
- geocoding endpoint from deprecated 'geocoding' to 'geocode/search' and 'geocode/reverse' ([#196](https://github.com/GIScience/openrouteservice-app/issues/196))
- pois logic to support multiple categories for one entry ([#207](https://github.com/GIScience/openrouteservice-app/issues/207))

### Fixed
- left-click event triggered upon closing map popups ([#215](https://github.com/GIScience/openrouteservice-app/issues/215))
- font-family of geocoding input fields
- vulnerability issue with kml converter (tokml.js)
- width of isochrone result table ([#214](https://github.com/GIScience/openrouteservice-app/issues/214))

## [0.2.9] - 2018-05-07

### Added
- slider to adjust isochrone transparency ([#179](https://github.com/GIScience/openrouteservice-app/issues/179))

### Changed
- color of angularjs-sliders to basic ors color

### Fixed
- 'sochrones' typo to 'isochrones' in welcome message
- empty borders options for requests with pedestrian or bike profile

## [0.2.8] - 2018-04-24

### Fixed
- Landmark styles not applied ([#211](https://github.com/GIScience/openrouteservice-app/issues/211))

## [0.2.7] - 2018-04-19

### Added
- Landmarks stylesheet

### Fixed
- /pois endpoint implementation

## [0.2.6] - 2018-04-17

### Removed
- Links to deprecated labs.openrouteservice.org. (Menu & Wheelchair profile)

## [0.2.5] - 2018-04-12

### Added
- Functionality to left-click map for a "What's Here" request ([#203](https://github.com/GIScience/openrouteservice-app/issues/203))
- Landmarks option to routing instructions ([#205](https://github.com/GIScience/openrouteservice-app/issues/205))

### Changed
- Locations to Pois as it is now the external [Openpoiservice](https://github.com/GIScience/openpoiservice) ([#200](https://github.com/GIScience/openrouteservice-app/issues/200))

### Fixed
- Distance markers placed at 500m instead of 1km ([#201](https://github.com/GIScience/openrouteservice-app/issues/201))

## [0.2.4] - 2018-03-17

### Added
- Functionality to copy Coordinates from What's Here Popup ([#198](https://github.com/GIScience/openrouteservice-app/issues/198))

## [0.2.3] - 2018-03-16

### Added
- Elevation for car and hgv as they were resumed in the backend vehicle graphs
- Version number to bottom left
- Population information to Isochrones ([#191](https://github.com/GIScience/openrouteservice-app/issues/191))
- Task to automatically bump the version number with Grunt ([#166](https://github.com/GIScience/openrouteservice-app/issues/166))

## [0.2.2] - 2018-02-27

### Fixed
- Permalink for HGV Profiles

## [0.2.1] - 2018-02-27

### Removed
- Elevation for car and hgv requests as they are removed from the backend vehicle graphs
(effects heightgraph display)

## [0.2.0] - 2018-02-27

### Added
- Italian as interface language
- Functionality to restrict routes so that they do not cross all borders, controlled borders, or the borders of
    specific countries ([#157](https://github.com/GIScience/openrouteservice-app/issues/157))

### Changed
- Heigit and Uni logo size reduced, link removed and transparency added ([#182](https://github.com/GIScience/openrouteservice-app/issues/182))
- Signup-Box shows after 5 minutes now (instead of instantly showing)

## [0.1.2] - 2018-02-13

### Fixed
- Pass empty options object to route request ([#180](https://github.com/GIScience/openrouteservice-app/issues/180))

## [0.1.1] - 2018-02-07

### Added
- Build instructions
- Hide some controls on small screens ([#169](https://github.com/GIScience/openrouteservice-app/issues/169))
- Reduce HeiGIT on small screens ([#170](https://github.com/GIScience/openrouteservice-app/issues/170))
- Update angularjs-slider layout automatically with grunt ([#172](https://github.com/GIScience/openrouteservice-app/issues/172))
- Directly focus geocoding input field ([#163](https://github.com/GIScience/openrouteservice-app/issues/163))
- Gruntfile.js: using load-grunt-tasks ([#173](https://github.com/GIScience/openrouteservice-app/issues/173))


### Fixed
- What's Here Popup only shows coordinates ([#176](https://github.com/GIScience/openrouteservice-app/issues/176))
- Isochrones always using 'distance' method ([#168](https://github.com/GIScience/openrouteservice-app/issues/168))
- Share link not reproducing same Isochrones ([#164](https://github.com/GIScience/openrouteservice-app/issues/164))
- Sending geocoding requests for empty geocoding query ([#167](https://github.com/GIScience/openrouteservice-app/issues/167))

## [0.1.0] - 2017-12-06

### Added
- Semantic Versioning ([#165](https://github.com/GIScience/openrouteservice-app/issues/165))
- loading Mapstyle from Cookies ([#150](https://github.com/GIScience/openrouteservice-app/issues/150))

### Fixed
- hiding wrong Isochrones ([#160](https://github.com/GIScience/openrouteservice-app/issues/160))

<!--

### Added
 new features.

### Changed
 something in existing functionality.

### Deprecated
 a soon-to-be removed feature.

### Removed
 a now removed feature.

### Fixed
 a bug.

### Security
 in case of vulnerabilities.


-->
