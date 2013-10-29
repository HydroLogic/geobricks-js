define([ "openlayers", "jquery", "message-bus" ], function(ol, $, bus) {
	var map = null;

	bus.listen("init-map", function(event, div) {
		var divMap = $("<div/>").attr("id", "map");
		div.append(divMap);
		map = new OpenLayers.Map("map", {
			"allOverlays" : true
		});
		map.addLayer(new OpenLayers.Layer.OSM());
		map.zoomToMaxExtent();
	});
	bus.listen("initial-zoom", function(event, layerInfo) {
		if (map != null) {
			map.zoomToMaxExtent();
		}
	});

	bus.listen("add-layer", function(event, layerInfo) {
		var layer = new OpenLayers.Layer.WMS("WMS layer", layerInfo.url, {
			layers : layerInfo.wmsName,
			transparent : true
		});
		layer.id = layerInfo.id;
		if (!layerInfo.visible) {
			layer.setVisibility(false);
		} else {
			layer.setVisibility(true);
		}
		if (map !== null) {
			map.addLayer(layer);
		}
	});

	bus.listen("map-extent", function(event, id, result) {
		var bounds = new OpenLayers.Bounds(result.left, result.bottom, result.right, result.top);
		map.zoomToExtent(bounds.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()));
	});
});