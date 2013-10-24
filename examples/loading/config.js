var require = {
	config : {
		"page-loader" : {
			mode : "progressbar",
			foreground : "#FFF",
			background : "#222",
			opts : {
				lines : 10, // The number of lines to draw
				length : 25, // The length of each line
				width : 12, // The line thickness
				radius : 35, // The radius of the inner circle
				corners : 1, // Corner roundness (0..1)
				rotate : 0, // The rotation offset
				direction : 1, // 1: clockwise, -1: counterclockwise
				color : "#F00", // #rgb or #rrggbb or array of colors
				speed : 1, // Rounds per second
				trail : 30, // Afterglow percentage
				shadow : false, // Whether to render a shadow
				hwaccel : false, // Whether to use hardware acceleration
				zIndex : 2e9, // The z-index (defaults to 2000000000)
			},
			waitForModules : true,
			waitForDocument : false,
		}
	}
};