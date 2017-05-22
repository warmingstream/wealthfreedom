$(function(){
    //navbar-top-links
    $('.navbar-top-links > li').hover(function(){
         $(this).addClass('open');       
    },function(){
         $(this).removeClass('open');  
    })
   
   //pageslide-left toggle
   
   $(".menu-toggle").click(function(){
	      	  
	  if($(this).hasClass("active")){
		  
		  $(this).removeClass("active");
		  $(this).find('i').removeClass('fa-indent').addClass('fa-outdent');
		  $(".main-container").animate({marginLeft:'200px'});
		  $(".pageslide-left").animate({left:'0'});
		  
	  }else{
		  $(this).addClass("active");
		  $(this).find('i').removeClass('fa-outdent').addClass('fa-indent');
		  $(".main-container").animate({marginLeft:'0'});
		  $(".pageslide-left").animate({left:'-200px'});

      }
	  
   });	

   //main-nav
   $(".main-nav>li>a").on("click",function(){
	   var navLi = $(this).parent('.main-nav>li');
	   if(navLi.hasClass('open')){
		   navLi.removeClass('open').find('ul.nav-sub').hide().find('li').removeClass('cur');
	   }else{
		   navLi.addClass('open').find('ul.nav-sub').show();
		   navLi.siblings().removeClass('open').find('ul.nav-sub').hide().find('li').removeClass('cur');
	   }
   });
   $(".nav-sub li").on('click',function(){
	   $(this).addClass('cur').siblings().removeClass('cur');
   })
   
   
   // main-nav perfectScrollbar
   $('#navbar-content').perfectScrollbar({
	   wheelSpeed: 50,
	   minScrollbarLength: 20,
	   suppressScrollX: true
   });

   // column: expand & callapse
   $(".collapse-link").on("click",function(e){
	   e.preventDefault();
	   var box = $(this).closest('div.column-box');
	   var button = $(this).find('i');
	   var content = box.find('div.column-content');
	   content.slideToggle();//box-content内容显示隐藏
	   button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
	   	   
   });
   // column: close
   $(".close-link").on("click",function(e){
	   e.preventDefault();
	   $(this).closest('div.column-box').remove();
   });
    
	//portlet sortable
    $( ".column" ).sortable({
      connectWith: ".column",
      handle: ".portlet-header",
      cancel: ".portlet-toggle",
	  opacity: 0.6,                       //拖动时，透明度为0.6
	  revert: true,                       //释放时，增加动画
      placeholder: "portlet-placeholder"
    });
	
    var portlet = $( ".portlet" );
	var portalH = portlet.height();
	
	portlet.on('mousedown',function(){
		$(this).mousemove(function(){
			var portletH = $(this).height();
			var placeholder = $(this).closest( ".column" ).find('div.portlet-placeholder');
			placeholder.height(portletH);
		})
	})

    //bootstrap datepicker
    $('.form_datetime').datetimepicker({
        format:'yyyy-mm-dd hh:ii:ss',
		language:  'cn',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1
    });
	$('.form_date').datetimepicker({
        format:'yyyy-mm-dd',
		language:  'cn',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
    });
	$('.form_time').datetimepicker({
        format:'yyyy-mm-dd hh:ii',
		language:  'cn',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 0,
		maxView: 1,
		forceParse: 0
    });  
	
	//setting skin
	$('.dropdown-skin li').click(function(){
		$("#"+this.id).addClass("selected").siblings().removeClass("selected");
		$('#skinCss').attr("href","static/assets/css/"+(this.id)+".css");
	});
	
    //select two-way
	
	/*右移*/
	$('#right').click(function(){
	    $obj = $('#leftSelect option:selected').clone(true);
		if($obj.length==0){
			alert('请至少选择一条！');
		}else{
		    $('#rightSelect').append($obj);	
			$('#leftSelect option:selected').remove();
		}
	});
	/*全右移*/
	$('#allRight').click(function(){
	    $('#rightSelect').append($('#leftSelect option'));
	});
	/*左移*/
	$('#left').click(function(){
	    $obj = $('#rightSelect option:selected').clone(true);
		if($obj.length==0){
			alert('请至少选择一条！');
		}else{
		    $('#leftSelect').append($obj);	
			$('#rightSelect option:selected').remove();
		}
	});
	/*全左移*/
    $('#allLeft').click(function(){
	    $('#leftSelect').append($('#rightSelect option'));
	});
	/*双击添加到相反的select框中*/
	$('.selectBox option').dblclick(function(){
	    var flag = $(this).parent().attr('id');
		if(flag == 'rightSelect'){
			var $obj = $(this).clone(true);
			$('#leftSelect').append($obj);
			$(this).remove();
		}else{
			var $obj = $(this).clone(true);
			$('#rightSelect').append($obj);
			$(this).remove();
			
		}	
	})

    $('body').on('click', 'a', function (e) {
        if ($(this).hasClass('ajax-link')) {
            e.preventDefault();
            var url = $(this).attr('href');
             window.location.hash = url;
            JUN.ui.load(url);
        }
        if ($(this).attr('href') == '#') {
            e.preventDefault();
        }
    });

})

