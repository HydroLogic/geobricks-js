define([ "leaflet" ], function(L) {
	L.Google = L.Class.extend({
	    includes: L.Mixin.Events,
	    options: {
	        minZoom: 0,
	        maxZoom: 22,
	        tileSize: 256,
	        subdomains: "abc",
	        errorTileUrl: "",
	        attribution: "",
	        opacity: 1,
	        continuousWorld: !1,
	        noWrap: !1,
	        mapOptions: {
	            backgroundColor: "#F6F6F6"
	        }
	    },
	    initialize: function (a, b) {
	        L.Util.setOptions(this, b);
	        this._ready = void 0 != google.maps.Map;
	        this._ready || L.Google.asyncWait.push(this);
	        this._type = a || "SATELLITE";
	    },
	    onAdd: function (a, b) {
	        this._map = a, this._insertAtTheBottom = b, this._initContainer(), this._initMapObject();
	        a.on("viewreset", this._resetCallback, this);
	        this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
	        a.on("move", this._update, this);
	        a.on("zoomanim", this._handleZoomAnim, this);
	        a._controlCorners.bottomright.style.marginBottom = "19px";
	        a._controlCorners.bottomleft.style.marginBottom = "21px";
	        this._reset();
	        this._update();
	    },
	    onRemove: function (a) {
	        this._map._container.removeChild(this._container);
	        this._map.off("viewreset", this._resetCallback, this);
	        this._map.off("move", this._update, this);
	        this._map.off("zoomanim", this._handleZoomAnim, this);
	        a._controlCorners.bottomright.style.marginBottom = "0em";
	    },
	    getAttribution: function () {
	        return this.options.attribution;
	    },
	    setOpacity: function (a) {
	        this.options.opacity = a;
	        1 > a && L.DomUtil.setOpacity(this._container, a);
	    },
	    setElementSize: function (a, b) {
	        a.style.width = b.x + "px", a.style.height = b.y + "px";
	    },
	    _initContainer: function () {
	        var a = this._map._container,
	            b = a.firstChild;
	        this._container || (
	        		this._container = L.DomUtil.create("div", "leaflet-google-layer leaflet-top leaflet-left"), 
	        		this._container.id = "_GMapContainer_" + L.Util.stamp(this), 
	        		this._container.style.zIndex = "auto");
	        a.insertBefore(this._container, b);
	        this.setOpacity(this.options.opacity);
	        this.setElementSize(this._container, this._map.getSize());
	    },
	    _initMapObject: function () {
	        if (this._ready) {
	            this._google_center = new google.maps.LatLng(0, 0);
	            var map = new google.maps.Map(this._container, {
	                center: this._google_center,
	                zoom: 0,
	                tilt: 0,
	                mapTypeId: google.maps.MapTypeId[this._type],
	                disableDefaultUI: !0,
	                keyboardShortcuts: !1,
	                draggable: !1,
	                disableDoubleClickZoom: !0,
	                scrollwheel: !1,
	                streetViewControl: !1,
	                backgroundColor: this.options.mapOptions.backgroundColor
	            });
	            if ("disabled" != false) {
	                var styles = eval(false);
	                map.setOptions({
	                    styles: styles
	                });
	            }
	            var _this = this;
	            this._reposition = google.maps.event.addListenerOnce(map, "center_changed", function () {
	                _this.onReposition();
	            }), this._google = map, google.maps.event.addListenerOnce(map, "idle", function () {
	                _this._checkZoomLevels();
	            });
	        }
	    },
	    _checkZoomLevels: function () {
	        this._google.getZoom() !== this._map.getZoom() && this._map.setZoom(this._google.getZoom());
	    },
	    _resetCallback: function (a) {
	        this._reset(a.hard);
	    },
	    _handleZoomAnim: function (a) {
	        var b = a.center, c = new google.maps.LatLng(b.lat, b.lng);
	        this._google.setCenter(c), this._google.setZoom(a.zoom);
	    },
	    _reset: function () {
	        this._initContainer();
	    },
	    _update: function (a) {
	        if (this._google) {
	            this._resize();
	            var b = a && a.latlng ? a.latlng : this._map.getCenter(),
	                c = new google.maps.LatLng(b.lat, b.lng);
	            this._google.setCenter(c), this._google.setZoom(this._map.getZoom()), this._checkZoomLevels(), this._google.getZoom() != this._map.getZoom() && this._map.setZoom(this._google.getZoom());
	        }
	    },
	    _resize: function () {
	        var a = this._map.getSize();
	        (this._container.style.width != a.x || this._container.style.height != a.y) && (this.setElementSize(this._container, a), this.onReposition());
	    },
	    onReposition: function () {
	        this._google && google.maps.event.trigger(this._google, "resize");
	    }
	});
});