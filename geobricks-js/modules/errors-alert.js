/**
 * Listens:
 *   - error
 * 			Shows an alert window with the given message and severity.
 * 		@param message - string
 *      @param severity - string, one of 'success', 'info', 'warning' or 'danger'
 * 		
 * 		Send example: bus.send("alert", [ "Unexpected error!", "danger" ]); 
 */
define([ "message-bus" ], function(bus) {
	bus.listen("alert", function(event, msg, severity) {
		window.alert(severity + "! " + msg);
	});
});
