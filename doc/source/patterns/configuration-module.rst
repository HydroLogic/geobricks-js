Configuration module
---------------------

**Problem:**

Your module requires information depending on the application. For example a "news" module that requires a title and the URL of an RSS source. Obviously, the generic repository where the reusable module is cannot contain application specific translations.

**Solution:**

Specify the configuration of the module the way RequireJS allows:

- Load a js file *before* RequireJS::

	<script src="config.js"></script>
	<script src="js/require.js" data-main="modules/main"></script>

- Specify in the config.js the properties that your module requires::

	var require : {
		config : {
			"news" : {
				title : "Barrapunto",
				url : "http://barrapunto.com/index.rss"
			} 
		}
	}

- Import the special module called "module" and read them::

	define([ "module" ], function(module) {
		var title = module.config().title;
		var url = module.config().url;
		...
	});