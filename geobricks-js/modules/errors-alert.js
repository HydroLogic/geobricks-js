/**
 * Listens:
 *   - error
 * 			Shows an alert window with the given message.
 * 		@param message string
 * 		
 * 		Send example: bus.send("error", "Unexpected error!"); 
 */
define([ "message-bus" ], function(bus) {
	bus.listen("error", function(event, msg) {
		window.alert(msg);
	});
});
