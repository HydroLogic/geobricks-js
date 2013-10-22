/**
 * This module returns an object (the event bus) with two functions for sending
 * (send) and listening (listen) to events.
 */
define([ "jquery" ], function($) {
	var messageBus = {};

	return {
		send : function(name, parameters) {
			$(messageBus).trigger(name, parameters);
		},
		listen : function(name, callBack) {
			$(messageBus).bind(name, callBack);
		}
	};
});