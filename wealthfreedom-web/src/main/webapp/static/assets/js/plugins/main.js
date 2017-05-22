/*!
 * @fileoverview table select plugins
 * @Version 1.0  (August 13, 2012)
 * @author FengWeiping 360buy.com
 * @email me@itfe.org
 * @example
 * $('#tableId').tableCheck(),
 */
/*global jQuery:true */
;(function ($) {
	//global event
	$(function () {
		//globalEvent.simList();
		//globalEvent.gridRows();
		//globalEvent.menu();
	});

	var globalEvent = {
		/*nav of header*/
		simList:function(){
			if($('.sim-list').length > 0){
				$('.sim-list').live('mouseenter', function(){
					$(this).addClass('hover').find('.pss-nav-child').width($(this).width()-2);
				})
				.live('mouseleave', function(){
					$(this).removeClass('hover');
				});
			}
		},
		/*color of grid's tr*/
		gridRows:function(){
			$('.grid td[rowspan]').each(function(i){
				var  _n = $(this).attr('rowspan'),
					_fid = 'rows'+i,
					_trs = $(this).parent().nextAll(),
					_flag = $(this).prev().length,
					_fclass = (!_flag?'td-first':'td-hover');
				
				for(var i=0,l = _trs.length;i<_n-1;i++){
					$(_trs[i]).addClass('rs').attr('fid',_fid);
					if(!_flag) $(_trs[i]).find('td:first').addClass('no-first');
					$(_trs[i])
					.bind('mouseover',function(){
						$('td[fid='+$(this).attr('fid')+']').addClass(_fclass);
					})
					.bind('mouseout',function(){
						$('td[fid='+$(this).attr('fid')+']').removeClass(_fclass);
					});
				}
				$(this).attr('fid',_fid)
				.bind('mouseover',function(){
					$('tr[fid='+$(this).attr('fid')+']').addClass('tr-hover').find('td:first').addClass('td-first');	
				})
				.bind('mouseout',function(){
					$('tr[fid='+$(this).attr('fid')+']').removeClass('tr-hover').find('td:first').removeClass('td-first');	
				});
				
			});//表格复选
			$('.grid tbody tr')
			.bind('mouseover',function(){
				$(this).addClass('tr-hover').find('td:first').addClass('td-first');		
			})
			.bind('mouseout',function(){
				$(this).removeClass('tr-hover').find('td:first').removeClass('td-first');			
			});
		},
		/*main menu*/
		menu:function(){
			$('#menu li a').bind('click',function(){
				if($(this).next('ul').length){
					$(this).toggleClass('closed').toggleClass('open').next('ul').slideToggle();
					$(this).parent().siblings().children('a').not('.noNext').addClass('closed').removeClass('open').next('ul').slideUp();//同级展开缩放
				}				
				else{
					$(".selected","#menu").removeClass('selected');
					$(this).addClass('selected');
					if($(this).hasClass('tit_lev1')){
						$('.tit_lev1').not('.noNext').addClass('closed').removeClass('open').next('ul').slideUp();
					}				
					if($(this).hasClass('tit_lev2')){
						$('.tit_lev2').not('.noNext').addClass('closed').removeClass('open').next('ul').slideUp();
					}
					if($(this).hasClass('tit_lev3')){
                        $('.tit_lev3').not('.noNext').addClass('closed').removeClass('open').next('ul').slideUp();
					}
				} 
			}).live('mouseenter',function(){$(this).addClass('hover');}).live('mouseleave',function(){$(this).removeClass('hover')});
			
			$('#menu li a').each(function(){			
				if($(this).next('ul:visible').length){
					$(this).addClass('open');
				}else if($(this).next('ul:hidden').length){
					$(this).addClass('closed');
				}else{
					$(this).addClass('noNext');
				}
			});
			$('#menu a').bind('focus',function () {
				if (this.blur) {this.blur();}
			});
			$('#menu #menu-switch ')
			.bind('mouseenter mouseleave',function () {
				$(this).toggleClass('hover');
			})
			.find('.m-s-handle').bind('click',function(){
				$(this).parents('#menu').toggleClass('off');
				$('#container').toggleClass('m-off');
			});
		}
	}


	/*
	 * buttonSlider
	 */ 
	function buttonSlider(o){
		this.o = $(o);
	}
	buttonSlider.prototype={
		init:function(){
			var _this = this, _timerS, _timerH;
			//$('dt',this.o)
			this.o
			.bind('mouseenter',function(){
				clearTimeout(_timerH);
				_timerS = setTimeout(function(){
					_this.show();
				},80);
			})
			.bind('mouseleave',function(){
				clearTimeout(_timerS);
				_timerH = setTimeout(function(){
					_this.hide();
				},80);
			});
			/*this.o
			.bind('mouseenter',function(){
				$(document).unbind('click',_hide);
			})
			.bind('mouseleave',function(){
				$(document).bind('click',_hide);
			});*/
		},
		show:function(o){
			//var _this = o;
			//return function(){
				$('dl',this.o).addClass('on');
				$('dd',this.o).slideDown();
			//}
		},
		hide:function(o){
			//var _this = o;
			//return function(){
				$('dl',this.o).removeClass('on');
				$('dd',this.o).slideUp();
			//}
		}
	}

	/*
	 * imgSlider 焦点图
	 */ 
	function imgSlider(o,opts){
		this.o = $(o);
		this.ops = $.extend({
			"time" : 1500
		},opts);
	}
	imgSlider.prototype={
		init:function(){
			var _this = this,_timer,_i = 0,_i_timer;
			_this.li = $('ul li',this.o);
			_this.bars = $('.slide-ctrl span',this.o);
			_this.length = _this.li.length;
			_this.bars
			.bind('mouseover',function(){
				_i = _this.bars.index(this);
				clearTimeout(_timer);
				_timer = setTimeout(function(){
					_this.show(_i);
				},250);
			})
			.bind('mouseout',function(){
				clearTimeout(_timer);
			});
			_i_timer = setInterval(function(){
				_i=(_i+1)%_this.length;
				_this.show(_i)
			},_this.ops.time);
			this.o
			.bind('mouseenter',function(){
				clearInterval(_i_timer);
			})
			.bind('mouseleave',function(){
				clearInterval(_i_timer);
				_i_timer = setInterval(function(){
					_i=(_i+1)%_this.length;
					_this.show(_i)
				},_this.ops.time);
			});
		},
		show:function(i){
			$('.curr',this.o).removeClass('curr');
			$(this.bars[i]).addClass('curr');
			$(this.li[i]).fadeIn(function(){
				$(this).addClass('curr');
			}).siblings().fadeOut();
		}	
	}
	/*
	 * imgScroll 旋转木马
	 */ 
	function imgScroll(o,opts){
		this.o = $(o);
		this.opts = $.extend({},{
			"steps" : 1,
			"loop" : false,
			"time" : 500,
			"disabled" : "disabled"
		},opts);
	}
	imgScroll.prototype={
		init:function(){
			var _this = this,_timer,_opts = _this.opts, autoRun = _this.autoRun(_this);
			_this.L = $('.prev',_this.o);
			_this.R = $('.next',_this.o);
			_this.con = $('.imgs-box',_this.o);
			_this.ul = $('.imgs-box ul',_this.o);
			_this.liw = $('ul li:first',_this.o).outerWidth();
			_this.total = $('.imgs-box li',_this.o).length;
			_this.l = Math.floor(_this.con.outerWidth()/_this.liw);
			_this.ml = 0;
			_this.L.bind('click',function(){
				if(_this.ml <= 0) return;
				else{
					if(_this.ml-_opts.steps > 0 ){
						_this.ml-=_opts.steps;
					}
					else{
						_this.ml = 0;
						_this.L.addClass(_opts.disabled);
					}				
					_this.ul.animate({
						"margin-left" : -_this.liw*_this.ml
					},function(){
						_this.R.removeClass(_opts.disabled);
					});
				}
			});
			_this.R.bind('click',function(){
				if(_this.total-_this.ml- _this.l<=0) return;
				else{
					if(_this.total-_this.ml- _this.l > _opts.steps){
						_this.ml += _opts.steps
					}else{
						_this.ml = _this.total- _this.l;
						_this.R.addClass(_opts.disabled);
					}
					_this.ul.animate({
						"margin-left" : -_this.liw*_this.ml
					},function(){
						_this.L.removeClass(_opts.disabled);
					});
				}
			});
			
			_timer = setInterval(autoRun,_opts.time);
			
			_this.con
			.bind('mouseenter',function(){
				clearTimeout(_timer);
			})
			.bind('mouseleave',function(){
				_timer = setInterval(autoRun,_opts.time)
			});
			
		},
		toLeft:function(i){
			
		},
		toRight:function(i){
			
		},
		autoRun:function(o){
			var _this = o;
			return function(){
			}
		}
	}

	function dragDar(o,opts){
		this.o = $(o);
		this.ops = $.extend({
			"s" : 0,
			"e" : 10
		},opts);
	}
	dragDar.prototype = {
		init : function(){
			var _this = this, _move = _this.start(), _stop, _htmlStr,_s = this.ops.s,_e = this.ops.e;
			
			_htmlStr = '<div class="drag-pannel"><div class="point"></div></div><div class="drag-list">';
			for(var i = _s;i <= _e;i++){
				_htmlStr+=('<span>'+i+'</span>');
			}
			_htmlStr+='</div>';
			this.o.append(_htmlStr).css({
				'width':16*(_e-_s+1)
			});
			$.extend(this,{
				"point" :$('.point',this.o),
				"stop" : function(){
					$(document).unbind('mousemove',_move).unbind('mouseup',_stop);
				}
			})
			_stop = _this.stop;
			$(this.o).bind('click',function(e){
				_this.clickEve(e);
			});
			$(this.point)
			.bind('click',function(){
				return false;
			})
			.bind('mousedown',function(e){
				$(document).bind('mousemove',_move).bind('mouseup',_stop)
			});	
		},
		clickEve : function(e){
			var _l = Math.round((e.pageX-this.o.offset().left-8)/16);
			_l = (0<_l&&_l<(this.ops.e-this.ops.s))?(_l*16):(0>=_l?0:(this.ops.e-this.ops.s)*16);
			
			this.point.css({"left":_l});
		},
		start : function(){
			var _this = this;
			return function(eve){
				var _l = Math.round((eve.pageX-_this.o.offset().left-8)/16);
				_l = (0<_l&&_l<(_this.ops.e-_this.ops.s))?(_l*16):(0>=_l?0:(_this.ops.e-_this.ops.s)*16);
				_this.point.css({"left":_l});
			}	
		} 
	}
	/*
	 * fakeSelect
	 */ 
	function fakeSelect(o){
		this.o = $(o);
	}
	fakeSelect.prototype={
		init:function(){
			var _this = this,_hide = this.hide(this);
			$('i',this.o).bind('click',function(){
				$('ul',_this.o).slideToggle();
			});
			$('li .del',this.o).bind('click',function(){
				$(this).parent().parent().remove();
			});
			$(this.o)
			.bind('mouseenter',function(){
				$(document).unbind('click',_hide);
			})
			.bind('mouseleave',function(){
				$(document).bind('click',_hide);
			});
			$('li',this.o).bind('click',function(){
				$('input',_this.o).val($(this).text());
			});

		},
		hide:function(o){
			var _this = o;
			return function(){
				$('ul',_this.o).slideUp();
			}	
		}	
	}
	$.fn.extend({
		"buttonSlider":function(){
			this.each(function(){
				var _o = new buttonSlider(this);
				_o.init();
			});
		},
		"imgSlider":function(opts){
			$(this).each(function(){
				var _o = new imgSlider(this,opts);
				_o.init();
			});
			return this;
		},
		"imgScroll":function(opts){
			$(this).each(function(){
				var _o = new imgScroll(this,opts);
				_o.init();
			});
			return this;
		},
		fakeSelect:function(){
			$(this).each(function(){
				var _o = new fakeSelect(this);
				_o.init();
			});
			return this;
		},
		"tableCheck": function (options) {
			//default options
			options = $.extend({
				selected: "selected",
				checkControl:".checkControl"
			}, options);

			//select all

			$("thead tr :checkbox,tr.thead :checkbox", this).click(function () {
				$(this).parents("table").find('tbody tr :checkbox').not('::disabled').not('tr.thead :checkbox')
				.attr("checked", this.checked).parents("tr")[this.checked ? "addClass" : "removeClass"](options.selected); //2011-5-31 fengweiping edited
			});
			//select one
			$('tbody tr :checkbox', this).not('tr.thead :checkbox').click(function () {
				var hasSelected = $(this).parents("tr").hasClass(options.selected);
				$(this).parents("tr")[hasSelected ? "removeClass" : "addClass"](options.selected);
				var $tmp = $(this).parents("table").find('tbody tr :checkbox').not('::disabled').not('tr.thead :checkbox');
				$(this).parents("table").find('thead tr :checkbox,tr.thead :checkbox')
				.attr('checked', $tmp.length == $tmp.filter(':checked').length);

			});

			//if one checkbox is checked ,then color this tr
			$('tbody>tr:has(:checkbox:checked)', this).addClass(options.selected);

		},
		"dragDar" : function(opts){
			$(this).each(function(){
				var _o = new dragDar(this,opts);
				_o.init();
			});
			return this;
		}
	})

})(jQuery);