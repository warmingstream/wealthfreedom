(function($){
    	$.fn.floatDiv = function(options) {
    		var op = {
            		id:'floatDiv',
            		onClose:null
            };
            op = $.extend(op,options);
    		
    		var h = $(this).height() + 2;
            var top = $(this).offset().top + h;
            var left = $(this).offset().left;
            var ev = options.event? options.event:'click';
        		
    		if(ev == 'click') {
    			$(this).click(function(){
    				$("#" + op.id).css({'top':top,'left':left,'display':''});       
                }); 
    		}
    		if(ev == 'focus') {
    			$(this).focus(function(){
    				$("#" + op.id).css({'top':top,'left':left,'display':''});       
                }); 
    		}
            clearTimeout(timeout);
            var timeout = null;
            var closeDiv = function() {
            	timeout = setTimeout(function(){
                		$("#" + op.id).css({'display':'none'});
                		if(op.onClose) {
                    		op.onClose();
                    	} 
                }, 300);
            };
            
            $("#" + op.id).mouseleave(function(){
            	closeDiv();	
            });
            
            $("#" + op.id).mouseover(function(){
            	clearTimeout(timeout); 
            });
            
            $(this).mouseover(function(){
            	clearTimeout(timeout); 
            });
            
            $(this).mouseleave(function(){
            	closeDiv();
            });
            
            $("#" + "floatDivClose_" + op.id).click(function(){
            	clearTimeout(timeout); 
            	$("#" + op.id).css({'display':'none'});        	
            });
	     
    	};
    	
    })(jQuery);