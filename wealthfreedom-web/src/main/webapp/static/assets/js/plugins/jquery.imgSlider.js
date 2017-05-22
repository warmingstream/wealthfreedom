// JavaScript Document
/**
 * @author feiweiping
 */
(function($){
	$.fn.imgSlider = function(settings){
        settings = jQuery.extend({
        	autoPlay:false,
        	speed : "normal",
			line : 1,
			timer : 800
    	}, settings);
		return this.each(function() {
			$.fn.imgSlider.scllor( $( this ), settings );
    	});
    }; 
	$.fn.imgSlider.scllor = function($this, settings){
		var content = $(".imgsCon ul", $this );
		var timerID;
		var img = content.children('li');
		var _btnLeft=$(".goPre:eq(0)", $this)
		var _btnRight=$(".goNext:eq(0)", $this)
		var liWidth=$(img[0]).width();
		var scrollWidth=0-(settings.line+1)*liWidth;//滚动的高度；
		var scrollLeft=function(){
			content.animate({marginLeft:-0},settings.speed,function(){
				for(i=0;i<settings.line;i++){
					 content.find("li:last").prependTo(content);
                }
               	content.css({marginLeft:-61});
			});	
		};
		var scrollRight=function(){
			content.animate({marginLeft:scrollWidth},settings.speed,function(){
				content.css({marginLeft:-61});
				for(i=0;i<settings.line;i++){
					 content.find("li:first").appendTo(content);
                }             	
			});	
		};
		var autoPlay=function(){
			timerID = window.setInterval(scrollRight,settings.timer);
		};
		var autoStop = function(){
            window.clearInterval(timerID);
        };
		//事件绑定
		if(settings.autoPlay){
			content.hover(autoStop,autoPlay).mouseout();
			_btnLeft.hover(autoStop,autoPlay);
			_btnRight.hover(autoStop,autoPlay);
		}
		_btnLeft.click( scrollLeft);
		_btnRight.click( scrollRight);
	};
})(jQuery);
