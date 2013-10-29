define([ "module" ], function(module) {
	var i18n = module.config().get;
	if (i18n) {
		return i18n;
	} else {
		return function(string) {
			return string;
		};
	}
});