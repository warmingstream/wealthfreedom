/*
	*** jquery.drag 容器拖拽
*/
(function($){
	var _window = {
        windowWidth: function() {
            return ($.browser.msie) ? document.documentElement.clientWidth: window.innerWidth
        },
        windowHeight: function() {
            return ($.browser.msie) ? document.documentElement.clientHeight: window.innerHeight
        },
        scrollTop: function() {
            return ($.browser.msie) ? document.documentElement.scrollTop: window.pageYOffset
        },
        scrollLeft: function() {
            return ($.browser.msie) ? document.documentElement.scrollLeft: window.pageXOffset
        }
	};
	// 清除文本选择
	function clsSelect(e){
		e = e || window.event;
		if('getSelection' in window){
			window.getSelection().removeAllRanges();
		}else{
			try {
				document.selection.empty();
			} catch (e) {};
		};
		if(e.preventDefault){
			 e.preventDefault();
		}else{
			 e.returnValue = false;
		};	
	};
	$.fn.drag = function(op){
		var set = $.extend({
			handle : null,
			beforedrag : function(pos,self){},
			ondraging : function(pos,self){},
			enddrag : function(pos,self){},
			unselectClass : "unselect",
			xdrag : true,//容器left是否改变
			ydrag : true//容器top是否改变	
		},op);
		return this.each(function(){
			var t = $(this), _t = this, handle = set.handle === null ? t : t.find(set.handle), cachemousepos = {x : 0, y :0}, cachethispos = {x : 0, y: 0}, draggable = false, handled = false;
			//获取鼠标位置
			function getmousepos(e){
				e = e || window.event;
				return {
					x : (function(){
						return e.clientX + _window.scrollLeft();
					})(),
					y : (function(){
						return e.clientY + _window.scrollTop();
					})()
				};
			};
			//获取容器的 left 和 top
			function getdivpos(){
				return {
					x : (function(){
						return t.css("left") === "auto" ? 0 : parseInt(t.css("left"))	
					})(),
					y : (function(){
						return t.css("top") === "auto" ? 0 : parseInt(t.css("top"));
					})()
				};
			};
			//鼠标移动时 设置容器css positon left and top
			function __mousemove(e){
				e = e || window.event;
				clsSelect(e);	
				if(draggable){
					handled = true;	
					var eve = getmousepos(e);
					var css = {};
					if(set.xdrag === true){
						css.left = eve.x - cachemousepos.x + cachethispos.x + "px";
					};
					if(set.ydrag === true){
						css.top = eve.y - cachemousepos.y + cachethispos.y + "px"  
					};
					t.css(css);
					 
					set.ondraging(getdivpos(),t);
				};
			};
			//鼠标停止松开后重置
			function __mouseup(e){
				e = e || window.event;
				draggable  = false;	
				$(document).unbind("mousemove", __mousemove);
				$(document).unbind("selectstart", __mousemove);
				if(handled){
					set.enddrag(getdivpos(),t);
					handled = false;
				};
			};
			//初始化
			function init(){
				handle.mousedown(function(e){
					e = e || window.event;
					draggable = true;
					cachethispos = getdivpos();
					cachemousepos = getmousepos(e);
					set.beforedrag(cachethispos,t);
					$(document).bind("mousemove", __mousemove).bind("mouseup", __mouseup);
					$(document).bind("selectstart", __mousemove); 
				});
			};
			init();
		});
	};
})(jQuery);