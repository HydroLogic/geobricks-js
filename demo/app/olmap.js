define([ "openlayers", "jquery", "message-bus" ], function(ol, $, bus) {
	var map = null;
	var drawingLayer = null;

	bus.listen("init-map", function(event, div) {
		var divMap = $("<div/>").attr("id", "map");
		div.append(divMap);

		map = new OpenLayers.Map("map", {
			"allOverlays" : true
		});
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

	bus.listen("layer-visibility", function(event, layerId, visibility) {
		var layer = map.getLayer(layerId);
		layer.setVisibility(visibility);
	});

	bus.listen("add-point", function(event) {
		if (drawingLayer == null) {
			drawingLayer = new OpenLayers.Layer.Vector("Vector Layer", {
				style : {
					externalGraphic : 'http://geomati.co/geoposter/map-icons/pins/48/pin3.png',
					graphicWidth : 48,
					graphicHeight : 48,
					graphicYOffset : -47
				}
			});
			var drag = new OpenLayers.Control.DragFeature(drawingLayer);

			map.addLayer(drawingLayer);
			map.addControl(drag);
			drag.activate();
		}
		var center = map.getCenter();
		var point = new OpenLayers.Geometry.Point(center.lon, center.lat);
		drawingLayer.addFeatures([ new OpenLayers.Feature.Vector(point) ]);
	});

	bus.listen("time-slider.selection.unique-slider", function(event, date) {
		if (drawingLayer != null) {
			var d = new Date();
			d.setISO8601("2002-2-23");
			drawingLayer.setVisibility(date > d);
		}
	});
});