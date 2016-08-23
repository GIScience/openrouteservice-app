angular.module('orsApp.ors-map', []).component('orsMap', {
    transclude: true,
    bindings: {
        orsMap: '<',
    },
    controller(orsSettingsFactory, orsObjectsFactory, orsMapFactory) {
        // // add map
        var ctrl = this;
        ctrl.$onInit = () => {
            ctrl.basemaps = {
                basemap: L.tileLayer(namespaces.layerMapSurfer.url, {
                    attribution: namespaces.layerMapSurfer.attribution
                })
            };
            ctrl.geofeatures = {
                layerLocationMarker: L.featureGroup(),
                layerRoutePoints: L.featureGroup(),
                layerRouteLines: L.featureGroup()
            };
            ctrl.mapModel = {
                map: ctrl.orsMap,
                basemaps: ctrl.basemaps,
                geofeatures: ctrl.geofeatures
            };
            ctrl.mapModel.map.on("load", function(evt) {
                ctrl.mapModel.basemaps.basemap.addTo(ctrl.orsMap);
                ctrl.mapModel.geofeatures.layerRoutePoints.addTo(ctrl.orsMap);
                ctrl.mapModel.geofeatures.layerRouteLines.addTo(ctrl.orsMap);
            });
            ctrl.orsMap.setView([0, 0], 1);
        };
        
        

        L.marker([0, 0]).addTo(ctrl.orsMap);
        //orsSettingsFactory.resetWaypoints();
        
    }
});