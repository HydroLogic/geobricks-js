define([ "jquery", "bootstrap" ], function($) {
	function Dropdown(labelText, cssClass) {
		if (!cssClass) {
			cssClass = "";
		}

		// Selector label
		var label = $("<div/>");
		label.text(labelText);
		label.addClass("selector-label " + cssClass);

		// Dropdown text
		this._text = $("<button/>");
		this._text.addClass("btn dropdown-toggle " + cssClass);
		this._text.attr("data-toggle", "dropdown");

		// Dropdown list
		this._list = $("<ul/>");
		this._list.addClass("dropdown-menu " + cssClass);

		// Dropdown
		var dropdown = $("<div/>");
		dropdown.addClass("dropdown btn-group");
		dropdown.append(this._text);
		dropdown.append(this._list);

		// Dropdown container
		var dropdownContainer = $("<div/>");
		dropdownContainer.addClass("selector-dropdown-container " + cssClass);
		dropdownContainer.append(dropdown);

		// Main div
		this.div = $("<div/>");
		this.div.append(label);
		this.div.append(dropdownContainer);
		this.div.addClass("selector-container " + cssClass);

		this.options = {};
	}

	Dropdown.prototype.add = function(id, text) {
		if (this.options[id]) {
			throw "id already exists in dropdown: " + id;
		}

		this.options[id] = text;

		var $this = this;
		var a = $("<a/>").attr("href", "#").text(text);
		a.click(function() {
			if ($this._text.text() != text) {
				set($this._text, text);
				if ($this.callback) {
					$this.callback(id, text);
				}
			}
		});

		this._list.append($("<li/>").append(a));
	};

	Dropdown.prototype.click = function(callback) {
		this.callback = callback;
	};

	Dropdown.prototype.set = function(id) {
		var text = this.options[id];
		if (text) {
			set(this._text, text);
		}
	};

	function set(button, text) {
		button.text(text);
		button.val(text);
		button.append($("<span/>").addClass("caret"));
	}

	return Dropdown;
});