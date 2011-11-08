(function($){})(window.jQuery);

/*
 * I found the following jQuery plugin on a help forum, but I can no longer find it.
 * This jQuery plugin fixes a visual anomaly in IE8 in which PNGs with transparencies
 * can appear with a black outline.
 */

;(function fixPNGsPlugin($){
   /* Fixes PNGs in IE < 9 for use in fading and other opacity changes.
    * Adapted from:
    * http://stackoverflow.com/questions/1204457/how-to-solve-hack-fading-semi-transparent-png-bug-in-ie8/4126528#4126528
    * http://stackoverflow.com/questions/1156985/jquery-cycle-ie7-transparent-png-problem/1157006#1157006
    */
   var $blankImg = 'images/transparent_1x1.gif'
     , $sizingMethod = 'crop';
   
   $.fn.fixPNGs = function()
   {
      if (!$.browser.msie || $.browser.version >= 9) return this;
      
      this.each(function forEachElement(){
         /* if (DD_belatedPNG && $.browser.version < 8) {
            DD_belatedPNG.fixPng(this);
            return;
         } */
         
         var isImg = $.nodeName(this, 'img')
           , path  = (isImg) ? this.src : this.currentStyle.backgroundImage;
         
         // If the path is surrounded by `url(` and `)`...
         if (path.search(/^url\(/i) !== -1) {
            // ...extract the path
            path = path.match(/^url\(['"]?([^'"]+)['"]?\)\s*$/i)[1];
         }
         
         // Make sure this is a PNG image
         if (path.search(/\.png$/i) === -1) return;
         
         // Apply the filter
         this.style.filter = 
           "progid:DXImageTransform.Microsoft.AlphaImageLoader" +
           "(src='" + path + "', sizingMethod='" + $sizingMethod + "')";
         // Replace the background image with a transparent 1x1 image.
         if (isImg) this.src = $blankImg;
         else {
            this.style.backgroundImage = 'url(' + $blankImg + ')';
            this.style.backgroundRepeat = 'repeat';
         }
      });
      
      return this;
   }; // $.fn.donutSlider()
})(jQuery); // (fixPNGsPlugin)()


$(document).ready(function () {

	// Set the map's glowing dots and information panels initially invisible, and
	// hide the information panels so they don't interfere with each other later.
	// They're all absolutely positioned and one on top of the other, so not hiding
	// them causes links within lower ones to be unclickable.
	$(".dot").fixPNGs().css({opacity: 0});
	$(".island-text").css({opacity: 0}).hide();

	$(".dot").hover(function () {
		// When a dot is hovered over, fade it in, then take its id, strip off the "dot-" prefix
		// and add a "text-" prefix to match the corresponding information panel's id.
		$(this).stop().animate({opacity: 1}, 100);
		var selectedElement = "#text-" + $(this).attr("id").replace("dot-", "");

		// Fade out the currently displayed information panel, which we know because it has
		// the current-island class on it, and fade in the information for the currently hovered
		// dot. But only do this if the currently hovered dot is different from the currently
		// displayed information panel.
		if (selectedElement !== ("#" + $(".current-island").attr('id'))) {
			// After the current panel fades out, hide it to keep it from covering the links of
			// the newly revealed panel. Add the current-island class to the newly revealed panel
			// so we can keep track of it.
			$(".current-island").animate({opacity: 0}, 500, function () { $(this).hide() }).removeClass("current-island");
			$(selectedElement).show().animate({opacity: 1}, 500).addClass("current-island");
		}
	}, function () {
		// Once the mouse moves off a dot, fade it out. The information panel stays though
		$(this).stop().animate({opacity: 0}, 500);
	});

});

