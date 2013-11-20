define([ "jquery", "message-bus", "module" ], function($, bus, module) {
	var config = module.config();

	function Group(groupId, groupName, nColumns, container) {
		this.id = groupId;

		this.title = $("<p>" + groupName + "</p>");
		this.title.addClass("layerlist-group-title");

		if (config.collapseGroup) {
			this.title.click(function() {
				$(this).next().toggle();
				return false;
			}).next().hide();
		}

		this.div = $("<div/>");
		this.div.addClass("layerlist-group-content");
		this.layers = new Array();
	}

	Group.prototype.addLayer = function(layer) {
		this.layers.push(layer);
		this.div.append(layer.div);
	};

	Group.prototype.visibility = function(visibility) {
		if (visibility) {
			this.div.show();
		} else {
			this.div.hide();
		}

		for (var i = 0; i < this.layers.length; i++) {
			this.layers[i].setEnabled(visibility);
		}
	};

	function Layer(layerId, layerIcon, layerIconDisabled, layerName, visible) {
		this.id = layerId;
		this.layerIcon = layerIcon;
		this.layerIconDisabled = layerIconDisabled;

		this.div = $("<div/>");
		this.div.addClass("layerlist-layer");

		var iconContainer = $("<div/>");
		iconContainer.addClass("layerlist-layer-icon-container");

		var icon = $("<div/>");
		this.icon = icon;
		icon.css("background", "url(" + layerIcon + ") no-repeat center");
		icon.css("background-size", "contain");
		icon.addClass("layerlist-layer-icon");
		icon.attr("data-trigger", "hover");
		iconContainer.append(icon);
		this.div.append(iconContainer);

		var $this = this;

		this.div.click(function() {
			var disabled = !$this.icon.data("disabled");
			$this.icon.data("disabled", disabled);
			$this.setEnabled(!disabled);
		});
		this.setEnabled(visible);

		if (!config.hideText) {
			var text = $("<div/>").text(layerName);
			text.addClass("layerlist-layer-name");
			this.div.append(text);
		}
	}

	Layer.prototype.setEnabled = function(enabled) {
		if (enabled) {
			this.div.removeClass("disabled");
			this.icon.css("background", "url(" + this.layerIcon + ") no-repeat center");
		} else {
			this.div.addClass("disabled");
			this.icon.css("background", "url(" + this.layerIconDisabled + ") no-repeat center");
		}
		this.icon.css("background-size", "contain");
		bus.send("layer-visibility", [ this.id, enabled ]);
	};

	return {
		init : function(id, divId) {
			var container = $("#" + divId);
			container.addClass("layerlist-container");

			var groups = {};

			bus.listen("add-layer-group", function(event, groupInfo) {
				if (groupInfo.mapId == id) {
					var group = new Group(groupInfo.id, groupInfo.name, groupInfo.nColumns);
					groups[groupInfo.id] = group;

					if (config.useGroupTitle) {
						container.append(group.title);
					}
					container.append(group.div);
				}
			});

			bus.listen("add-layer", function(event, layerInfo) {
				var group = groups[layerInfo.groupId];
				if (!group) {
					return;
				}

				var layer = new Layer(layerInfo.id, layerInfo.icon, layerInfo.iconDisabled, layerInfo.name, layerInfo.visible);
				group.addLayer(layer);
			});

			bus.listen("group-visibility", function(event, groupId, visibility) {
				// Ignore events for hiding groups
				if (visibility) {
					$.each(groups, function(id, index) {
						groups[id].visibility(id == groupId);
					});
				}
			});
		}
	};
});
