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
