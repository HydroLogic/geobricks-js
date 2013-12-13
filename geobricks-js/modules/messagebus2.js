/**
 * Message Bus v.2
 * ---------------
 *
 * Changes from v.1:
 * 
 *  - Uses jQuery's .on() method, instead of .bind()
 *  - Public methods are renamed to: publish, subscribe and unsubcribe
 *  - Message "name" is now "channel"; "parameters" renamed to "message"
 *  - Optional subscription parameter to set callback's context
 *  - The "event" parameter disappears from callback signature,
 *    callback receives a single param: function callback(message)
 *  - New unsubscribe method, to stop listening to messages
 */
define(["jquery"], function($) {
    var o = {}; // Single object where all events are attached.
    
    // Publish a message in a channel
    function publish(channel, message) {
        $(o).trigger(channel, message);
    }
    
    // Subscribe to a channel.
    // Provide a callback to be run after a message is published.
    // Callback function receives a single param: the "message".
    // Optionally, provide a context for the callback execution (*this*).
    function subscribe(channel, callback, context) {
        $(o).on(channel, function(event, message) {
            callback.apply(context, [message]);
        });
    }
    
    // Remove an existing subscription.
    // Provide a channel and the callback function to be unregistered.
    function unsubscribe(channel, callback) {
        $(o).off(channel, callback);
    }
    
    return {
        publish: publish,
        subscribe: subscribe,
        unsubscribe: unsubscribe
    };
});
