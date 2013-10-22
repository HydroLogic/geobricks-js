/**
 * Listens:
 *   - init-layerlist
 * 			Adds a new layer list to the given div.
 * 		@param div - where the layer list should be added.
 * 		Send example: 
 * 			var body = $("body");
 * 			var divLayersContainer = $("<div/>").attr("id", "layers_container");
 * 			body.append(divLayersContainer);
 * 			bus.send("init-layerlist", [ divLayersContainer ]);
 * 
 *   - add-group
 * 			Adds a new group to the layer list.
 * 		@param info - an object containing:
 * 			- id: identifier.
 * 			- name: name to be shown in the layer list.
 * 		Send example: 
 * 			bus.send("add-group", { id : "basic", name : "Basic layers" });
 * 
 *   - add-layer
 * 			Adds a new layer to the layer list.
 * 		@param info - an object containing:
 * 			- groupId: identifier of the group where the layer must be added.
 * 			- id: identifier of the layer.
 * 			- name: name to be shown in the layer list.
 * 			- visible: boolean specifying whether the layer is visible or not.
 * 			- infoLink: (optional) link to a layer description that would 
 * 						be shown in a popup.
 * 		Send example:
 * 			bus.send("add-layer", {
 * 				"id" : "blumarble",
 * 				"groupId" : "basic",
 * 				"url" : "http://rdc-snsf.org/diss_geoserver/wms",
 * 				"wmsName" : "common:blue_marble",
 * 				"name" : "Blue marble",
 * 				"infoLink" : "http://rdc-snsf.org/static/loc/en/html/bluemarble_def.html",
 * 				"visible" : "true"
 * 			});
 * 
 * 
 * Sends:
 *   - error
 * 			On 'add-layer' if the group id is invalid.
 * 		@param id - layer identifier.
 * 		@param checked - boolean with the layer visibility.
 * 
 *   - layer-visibility
 *   			When the layer checkbox is selected/unselected.
 *   			, with the following parameters
 * 		@param date - the new value of the slider.
 */
define([ "jquery", "message-bus", "jquery-ui", "fancy-box" ], function($, bus) {

	var divLayers = null;

	bus.listen("init-layerlist", function(event, divLayersContainer) {
		divLayers = $("<div/>").attr("id", "all_layers");
		divLayers.addClass("ui-accordion-icons");
		divLayers.accordion({
			"animate" : false,
			"collapsible" : true
		});
		divLayersContainer.append(divLayers);
	});

	bus.listen("add-group", function(event, groupInfo) {
		var divTitle = $("<div/>");
		aTitle = $("<a/>").attr("href", "#").html(groupInfo.name).disableSelection();
		divTitle.append(aTitle);
		divLayers.append(divTitle);
		var tblLayerGroup = $("<table/>");
		tblLayerGroup.attr("id", "group-content-table-" + groupInfo.id);
		tblLayerGroup.addClass("group-content-table");
		divLayers.append(tblLayerGroup).accordion("refresh");
	});

	bus.listen("add-layer", function(event, layerInfo) {
		var tblLayerGroup = $("#group-content-table-" + layerInfo.groupId);
		if (tblLayerGroup.length == 0) {
			bus.send("error", "Layer " + layerInfo.name + " references nonexistent group: " + layerInfo.groupId);
		} else {
			var trLayer = $("<tr/>").addClass("layer_row");

			var tdLegend = $("<td/>").addClass("layer_legend");
			trLayer.append(tdLegend);

			var tdVisibility = $("<td/>").css("width", "16px");
			var divCheckbox = $("<div/>").addClass("layer_visibility");
			if (layerInfo.visible) {
				divCheckbox.addClass("checked");
			}
			divCheckbox.mousedown(function() {
				divCheckbox.addClass("mousedown");
			}).mouseup(function() {
				divCheckbox.removeClass("mousedown");
			}).mouseleave(function() {
				divCheckbox.removeClass("in");
			}).mouseenter(function() {
				divCheckbox.addClass("in");
			}).click(function() {
				divCheckbox.toggleClass("checked");
				var checked = divCheckbox.hasClass("checked");
				bus.send("layer-visibility", [ layerInfo.id, checked ]);
			});

			tdVisibility.append(divCheckbox);

			trLayer.append(tdVisibility);

			var tdName = $("<td/>").addClass("layer_name");
			tdName.html(layerInfo.name);
			trLayer.append(tdName);

			var tdInfo = $("<td/>").addClass("layer_info");
			if (layerInfo.hasOwnProperty("infoLink")) {
				var aLink = $("<a/>").attr("href", layerInfo.infoLink);
				aLink.addClass("layer_info_button");
				aLink.fancybox({
					"closeBtn" : "true",
					"openEffect" : "elastic",
					"closeEffect" : "elastic",
					"type" : "iframe",
					"overlayOpacity" : 0.5
				});
				tdInfo.append(aLink);
			}
			trLayer.append(tdInfo);

			tblLayerGroup.append(trLayer);
		}
	});
});