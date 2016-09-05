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