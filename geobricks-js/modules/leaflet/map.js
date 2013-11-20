define([ "jquery", "leaflet", "message-bus", "leaflet-google", "layout", "module" ], function($, L, bus, Google, Layout, module) {
	var positionIconProperties = module.config().positionIconProperties;

	var LayerTypes = {
		JSON : "json",
		WMS : "wms",
		OSM : "osm",
		GOOGLE : "google"
	};

	var map = L.map(Layout.map);
	var layers = {};
	var baseLayer = null;
	var positionMarkerIcon = L.icon(positionIconProperties);
	var position = null;

	function getBounds(obj) {
		var southWest = new L.LatLng(obj.bottom, obj.left);
		var northEast = new L.LatLng(obj.top, obj.right);
		return new L.LatLngBounds(southWest, northEast);
	}

	function createLayer(layerInfo) {
		if (layerInfo.type == LayerTypes.JSON) {
			return L.geoJson(layerInfo.features, layerInfo.geoJsonOptions);
		} else if (layerInfo.type == LayerTypes.WMS) {
			return new L.TileLayer.WMS(layerInfo.url, {
				layers : layerInfo.wmsName,
				format : 'image/png',
				transparent : false,
				crs : L.CRS.EPSG4326
			});
		} else if (layerInfo.type == LayerTypes.OSM) {
			return new L.TileLayer(layerInfo.url);
		} else if (layerInfo.type == LayerTypes.GOOGLE) {
			return new L.Google(layerInfo.layer, {
				detectRetina : true
			});
		}
	}

	bus.listen("zoom-to-extent", function(event, bounds) {
		map.fitBounds(getBounds(bounds));
	});

	bus.listen("add-layer", function(event, layerInfo) {
		var layer = createLayer(layerInfo);
		if (layer) {
			layers[layerInfo.id] = layer;
			if (layerInfo.visible) {
				layer.addTo(map);
			}
		}
	});

	bus.listen("center-map", function(event, info) {
		map.fitBounds(getBounds(info));
		if (position) {
			map.removeLayer(position);
		}
		position = L.marker([ info.lat, info.lon ], {
			icon : positionMarkerIcon
		}).addTo(map);

		position.bindPopup(info.address, {
			offset : new L.Point(0, -35)
		}).openPopup();
	});

	bus.listen("layer-visibility", function(event, layerId, visibility) {
		var layer = layers[layerId];
		if (visibility) {
			map.addLayer(layer);
		} else {
			map.removeLayer(layer);
		}
	});

	bus.listen("base-layer", function(event, layerInfo) {
		var newBaseLayer = createLayer(layerInfo);

		if (newBaseLayer && newBaseLayer != baseLayer) {
			if (baseLayer) {
				map.removeLayer(baseLayer);
			}
			map.addLayer(newBaseLayer, true);
			baseLayer = newBaseLayer;
		}
	});

	return {
		LayerTypes : LayerTypes,
		map : map
	};
});