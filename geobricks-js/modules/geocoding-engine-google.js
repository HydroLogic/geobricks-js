define([], function() {
	return {
		search : function(text, success, error) {
			$.getJSON("http://maps.googleapis.com/maps/api/geocode/json", {
				address : text,
				sensor : false
			}, function(data) {
				if (data.error_message) {
					console.error("Geocoding error. Status:" + data.status);
					error(data.error_message);
				} else {
					var results = [];
					for (var i = 0; i < data.results.length; i++) {
						var geom = data.results[i].geometry;
						results.push({
							address : data.results[i].formatted_address,
							lon : geom.location.lng,
							lat : geom.location.lat,
							left : geom.viewport.southwest.lng,
							bottom : geom.viewport.southwest.lat,
							right : geom.viewport.northeast.lng,
							top : geom.viewport.northeast.lat
						});
					}
					success(results);
				}
			}).fail(function() {
				console.error("Unknown geocoding error.");
				error("Unknown error");
			});
		}
	};
});
