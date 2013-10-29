define([ "jquery", "message-bus", "i18n", "module", "css-loader" ], function($, bus, i18n, module) {
	// Configure style
	var css = module.config().css;
	if (css) {
		for (var i = 0; i < css.length; i++) {
			bus.send("css-load", css[i]);
		}
	} else {
		var base = module.uri.substring(0, module.uri.lastIndexOf("/"));
		base = base.substring(0, base.lastIndexOf("/"));
		bus.send("css-load", base + "/styles/jquery-ui-1.10.3.custom.min.css");
		bus.send("css-load", base + "/styles/login.css");
	}

	bus.listen("login", function(event, loginInfo) {
		var nameDiv = $('<input type="text" name="username" id="username" class="input-block-level" placeholder="Email address">');
		var passDiv = $('<input type="password" name="password" id="password" class="input-block-level" placeholder="Password">');
		var tipsDiv = $("<p/>").text(i18n("All form fields are required."));

		var form = $("<form/>");
		form.addClass("form-signin");
		form.append($("<h3/>").text(i18n("Please sign in")));
		form.append(nameDiv);
		form.append(passDiv);

		tipsDiv.addClass("validateTips");
		loginInfo.div.append(form);
		loginInfo.div.append(tipsDiv);
		loginInfo.div.append();

		var allFields = $([]).add(name).add(password);

		loginInfo.div.dialog({
			autoOpen : false,
			height : 300,
			width : 350,
			modal : true,
			closeOnEscape : false,
			close : function() {
				allFields.val("").removeClass("ui-state-error");
			}
		});

		var buttons = {};
		buttons[i18n("Sign in")] = function() {
			function updateTips(t) {
				tipsDiv.text(t).addClass("ui-state-highlight");
				setTimeout(function() {
					tipsDiv.removeClass("ui-state-highlight", 1500);
				}, 500);
			}

			allFields.removeClass("ui-state-error");

			var name = nameDiv.val();
			var pass = passDiv.val();

			var nameError = loginInfo.validateName(name);
			if (nameError) {
				nameDiv.addClass("ui-state-error");
				updateTips(nameError);
				return;
			}
			var passwordError = loginInfo.validatePassword(pass);
			if (passwordError) {
				passDiv.addClass("ui-state-error");
				updateTips(passwordError);
				return;
			}

			$.ajax({
				url : loginInfo.url,
				type : 'POST',
				beforeSend : function(xhr) {
					var auth = "Basic " + btoa(name + ':' + pass);
					xhr.setRequestHeader('Authorization', auth);
				},
				success : function(data, status) {
					loginInfo.div.dialog("close");
					loginInfo.success(data, status);
				},
				error : loginInfo.error,
			});
		};

		loginInfo.div.dialog({
			"buttons" : buttons
		});
		loginInfo.div.dialog("open");
	});
});
