require.config({
	baseUrl : "../geobricks-js/modules",
	paths : {
		"jquery" : "http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min",
		"jquery-ui" : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min",
	}
});

require([ "jquery", "message-bus", "jquery-ui", "login" ], function($, bus) {
	function checkLength(o, n, min, max) {
		if (o.length > max || o.length < min) {
			return "Length of " + n + " must be between " + min + " and " + max + ".";
		} else {
			return null;
		}
	}

	function checkRegexp(o, regexp, n) {
		return !regexp.test(o);
	}

	var body = $("body");
	var div = $("<div/>");
	body.append(div);

	var button = $("<button>Login</button>");
	body.append(button);
	button.click(function() {
		bus.send("login", {
			url : "<your url goes here>",
			validateName : function(name) {
				var error = checkLength(name, "username", 3, 16);
				if (error) {
					console.log(error);
					return error;
				}
				error = checkRegexp(name, /^[a-z]([0-9a-z_])+$/i);
				if (error) {
					return "Username may consist of a-z, 0-9, underscores, begin with a letter.";
				}
				return null;
			},
			validatePassword : function(password) {
				var error = checkLength(password, "password", 5, 16);
				if (error) {
					console.log(typeof error);
					return error;
				}
				error = checkRegexp(password, /^([0-9a-zA-Z])+$/);
				if (error) {
					return "Password field only allow : a-z 0-9";
				}
				return null;
			},
			error : function(data, status) {
				console.log(data);
				window.alert("Error!! " + data.status + " " + data.statusText + "; Status: " + status);
			},
			success : function(data, status) {
				window.alert("Success!! " + data + "; Status: " + status);
			},
			div : div
		});
	});
});
