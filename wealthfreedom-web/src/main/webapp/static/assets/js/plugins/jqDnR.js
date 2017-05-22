/*
 * jqDnR - Minimalistic Drag'n'Resize for jQuery.
 *
 * Copyright (c) 2007 Brice Burgess <bhb@iceburg.net>, http://www.iceburg.net
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * $Version: 2007.08.19 +r2
 */

(function ($) {
	$.fn.jqDrag=function(h){return i(this,h,'d');};
	$.fn.jqResize=function(h){return i(this,h,'r');};
	$.jqDnR={dnr:{},e:0,
        drag: function (v) {
            if(M.k == 'd'){
            	if((M.X+v.pageX-M.pX+M.ml)<=0)  E.css({left:-M.ml});
            	else if((M.X+v.pageX-M.pX+M.ml)>=($('body').width()-M.W)) E.css({left:($('body').width()-M.W-M.ml)});
            	else E.css({left:M.X+v.pageX-M.pX});
            	if((M.Y+v.pageY-M.pY)<=0)E.css({top:0});
            	else if((M.Y+v.pageY-M.pY+M.H)>=M.dH)E.css({top:M.dH-M.H});
            	else E.css({top:M.Y+v.pageY-M.pY});
            	}
            else E.css({width:Math.max(v.pageX-M.pX+M.W,0),height:Math.max(v.pageY-M.pY+M.H,0)});
            return true;},
        //stop:function(){E.css('opacity',M.o);$(document).unbind('mousemove', J.drag).unbind('mouseup', J.stop); }
		stop:function(){//E.css('opacity',M.o);//ie bug
		$(document).unbind('mousemove',J.drag).unbind('mouseup',J.stop);}
    };
	var J=$.jqDnR,M=J.dnr,E=J.e,
	i=function(e,h,k){
		return e.each(function(){h=(h)?$(h,e):e;
		 h.bind('mousedown',{e:e,k:k},function(v){
		 	var d=v.data,p={};E=d.e;
			 // attempt utilization of dimensions plugin to fix IE issues
			 if(E.css('position') != 'relative'){try{E.position(p);}catch(e){}}
			 M={
			 	X:p.left||f('left')||0,
			 	Y:p.top||f('top')||0,
			 	W:f('width')||E[0].scrollWidth||0,
			 	H:f('height')||E[0].scrollHeight||0,
			 	pX:v.pageX,
			 	pY:v.pageY,
			 	k:d.k,
			 	o:E.css('opacity'),
			 	ml:E.css('margin-left').replace('px','')*1,
			 	dH:$(window).height() || document.body.parentNode.scrollHeight
			 	};
			//E.css({opacity:0.8});//ie bug
			$(document).mousemove($.jqDnR.drag).mouseup($.jqDnR.stop);
			 return true;
		 });
		});
	},
	f=function(k){return parseInt(E.css(k))||false;};
})(jQuery);
