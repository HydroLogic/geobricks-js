/**
 * Listens:
 *   - init-alerts
 *          Initializes the alert div
 *      @param div - the div where the Bootstrap alerts will be contained
 *      
 *      var div = $("<div/>");
 *      $("body").append(div);
 *      Send example: bus.send("init-alerts", [ div ]); 
 * 
 *   - alert
 * 			Shows a Bootstrap alert with the given message.
 * 		@param message - string
 *      @param severity - string, one of 'success', 'info', 'warning' or 'danger'
 * 		
 * 		Send example: bus.send("error", "Unexpected error!", "danger"); 
 */
define([ "jquery", "message-bus", "module", "bootstrap" ], function($, bus, module) {
	var config = module.config();
	var divContainer = null;

	bus.listen("init-alerts", function(event, div) {
		divContainer = div;
	});

	bus.listen("alert", function(event, msg, severity) {
		var div = $("<div/>");
		div.addClass("alert alert-dismissable");

		var prefix = "";
		if (severity == "success") {
			div.addClass("alert-success");
			if (config.successPrefix) {
				prefix = config.successPrefix;
			}
		} else if (severity == "info") {
			div.addClass("alert-info");
			if (config.infoPrefix) {
				prefix = config.infoPrefix;
			}
		} else if (severity == "warning") {
			div.addClass("alert-warning");
			if (config.warningPrefix) {
				prefix = config.warningPrefix;
			}
		} else {
			div.addClass("alert-danger");
			if (config.dangerPrefix) {
				prefix = config.dangerPrefix;
			}
		}

		var button = $('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
		var text = $("<div><strong>" + prefix + "</strong> " + msg + "</div>");
		div.append(button);
		div.append(text);
		divContainer.append(div);
	});
});
