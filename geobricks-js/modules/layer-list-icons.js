define([ "jquery", "message-bus", "module", "jquery-ui", "bootstrap" ], function($, bus, module) {
	var config = module.config();

	function Group(groupName, groupId, nColumns, container) {
		if (config.useGroupTitle) {
			var title = $("<p>" + groupName + "</p>");
			title.addClass("layerlist-group-title");

			if (config.collapseGroup) {
				title.click(function() {
					$(this).next().toggle();
					return false;
				}).next().hide();
			}
			container.append(title);
		}

		var div = $("<div/>");
		div.addClass("layerlist-group-content");
		div.attr("id", "layerlist-group-" + groupId);
		if (config.sortable) {
			div.sortable();
		}
		container.append(div);

		if (!nColumns) {
			nColumns = 1;
		}

		this.currentDiv = 0;
		this.divs = [];
		for (var i = 0; i < nColumns; i++) {
			this.divs[i] = $("<div/>");
			this.divs[i].addClass("layerlist-group-column");
			this.divs[i].css("width", 100 / nColumns + "%");
			if (config.sortable) {
				this.divs[i].sortable();
			}
			div.append(this.divs[i]);
		}
	}

	Group.prototype.addLayer = function(layerDiv) {
		var div = this.divs[this.currentDiv];
		div.append(layerDiv);
		this.currentDiv++;
		if (this.currentDiv >= this.divs.length) {
			this.currentDiv = 0;
		}
	};

	function Layer(layerId, layerIcon, layerName, visible) {
		this.id = layerId;

		this.div = $("<div/>").attr("id", "layerlist-layer-" + layerId);
		this.div.addClass("layerlist-layer");

		if (config.useCheckbox) {
			var checkbox = $("<div/>").addClass("layerlist-layer-checkbox");
			this.div.append(checkbox);
			enableVisibilityToggle(checkbox, this.id);
			if (visible) {
				checkbox.addClass("checked");
			}
		}

		if (config.useIcon) {
			var icon = $("<div/>");
			icon.css("background", "url(" + layerIcon + ") no-repeat center");
			icon.css("background-size", "contain");
			icon.addClass("layerlist-layer-icon");
			icon.attr("data-trigger", "hover");
			icon.popover({
				trigger : "hover",
				content: layerName,
				placement : "left",
				container : "#right"
			});
			this.div.append(icon);

			if (config.useIconForVisibility) {
				enableVisibilityToggle(icon, this.id);
				if (visible) {
					icon.addClass("checked");
				}
			}
		}

		if (config.useText) {
			var text = $("<div/>").text(layerName);
			text.addClass("layerlist-layer-name");
			this.div.append(text);
		}
	}

	function enableVisibilityToggle(div, id) {
		div.mousedown(function() {
			div.addClass("mousedown");
		}).mouseup(function() {
			div.removeClass("mousedown");
		}).mouseleave(function() {
			div.removeClass("in");
		}).mouseenter(function() {
			div.addClass("in");
		}).click(function(event) {
			event.stopPropagation();
			div.toggleClass("checked");
			var checked = div.hasClass("checked");
			bus.send("layer-visibility", [ id, checked ]);
		});
	}

	return {
		create : function(id, divId) {
			var container = $("#" + divId);
			container.addClass("layerlist-container");

			var groups = {};

			bus.listen("add-layer-group", function(event, groupInfo) {
				if (groupInfo.mapId == id) {
					var group = new Group(groupInfo.id, groupInfo.name, groupInfo.nColumns, container);
					groups[groupInfo.id] = group;
				}
			});

			bus.listen("add-layer", function(event, layerInfo) {
				var group = groups[layerInfo.groupId];
				if (!group) {
					return;
				}

				var layer = new Layer(layerInfo.id, layerInfo.icon, layerInfo.name, layerInfo.visible);
				group.addLayer(layer.div);
			});
		}
	};
});
