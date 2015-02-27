;(function($) {
	var proportionalBlock = function(wrapper, options) {
		this.options = $.extend({
			factor: false,// Factor determining the difference between the width and height,
			yShift: 0, // Vertical shift for background image in percents
			xShift: 0 // Horizontal shift for background image in percents

		}, options || {});

		this.wrappers = {
			main: wrapper
		};

		this.info = {
			bg: false,
			bgWidth: 0,
			bgHeight: 0
		};

		this.init = function() {
			var plugin = this;
			// Get background image
			var bg_url = $(this.wrappers.main).css('background-image');
		    // ^ Either "none" or url("...urlhere..")
		    bg_url = /^url\((['"]?)(.*)\1\)$/.exec(bg_url);
		    bg_url = bg_url ? bg_url[2] : ""; // If matched, retrieve url, otherwise ""
		    console.log('url', bg_url);
		    if (bg_url.length>0) {
		    	// Upload image
		    	var testImg = new Image();
		    	testImg.onload = function() { 
		    		plugin.initBackground(testImg.width, testImg.height);
		    	};
		    	testImg.src = bg_url;
		    }
		    // Make right styles
		    $(this.wrappers.main).css("width", "100%");
			// Binds
			$(window).resize(function() {
				plugin.recalc();
			});
			plugin.recalc();
		};

		this.initBackground = function(width, height) {
			this.info.bg = true;
			this.info.bgWidth = width;
			this.info.bgHeight = height;
			this.recalc();
		}

		this.recalc = function() {
			var wrapW = $(this.wrappers.main).width();
			var nH = wrapW*this.options.factor;
			$(this.wrappers.main).css({
				"height": nH+'px'
			});
			if (this.info.bg) {
				var iRation = wrapW/this.info.bgWidth;
				var tImgH = this.info.bgHeight*iRation;

				if (tImgH<nH) {
					var ihRation = nH/this.info.bgHeight;
					var tImgW = this.info.bgWidth*iRation;
					var thImageShift = -(tImgW-wrapW)/2;
					var tvImageShift = 0;
					// Add shift is exists
					if (this.options.xShift) {
						thImageShift+=(tImgW/100)*this.options.xShift;
					}
					if (this.options.yShift) {
						tvImageShift+=(nH/100)*this.options.yShift;
					}
					$(this.wrappers.main).css({
						"background-position": ''+thImageShift+'px '+tvImageShift+'px',
						"background-size": "auto 100%"
					});
				} else {
					var tvImageShift = -(tImgH-nH)/2;
					var thImageShift = 0;
					if (this.options.xShift) {
						thImageShift+=(wrapW/100)*this.options.xShift;
					}
					if (this.options.yShift) {
						tvImageShift+=(nH/100)*this.options.yShift;
					}
					
					$(this.wrappers.main).css({
						"background-position": ''+thImageShift+'px '+tvImageShift+'px',
						"background-size": "100% auto"
					});
				};				 
			};
		}
		this.init();
	}
	$.fn.proportionalBlock = $.fn.ratio = function(options) { 
		var options = options;
		
		return $(this).each(function() {

			new proportionalBlock(this, options); 
		});
	};

})(jQuery);