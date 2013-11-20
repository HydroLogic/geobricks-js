define([ "jquery", "layout", "dropdown" ], function($, Layout, Dropdown) {
	var container = $("#" + Layout.toolbar);

	return {
		addDropdown : function(options, label, id, click) {
			var dropdown = new Dropdown(label, id);
			$.each(options, function(id, index) {
				dropdown.add(id, options[id]);
			});

			if (click) {
				dropdown.click(click);
			}

			container.append(dropdown.div);
			return dropdown;
		}
	};
});