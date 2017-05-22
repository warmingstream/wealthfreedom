/*---LEFT BAR ACCORDION----*/
$(function() {
    $('#nav-accordion').dcAccordion({
        eventType: 'click',
        autoClose: true,
        saveState: true,
        disableLink: true,
        speed: 'slow',
        showCount: false,
        autoExpand: true,
//        cookie: 'dcjq-accordion-1',
        classExpand: 'dcjq-current-parent'
    });

    //    sidebar dropdown menu auto scrolling
    //$('#sidebar .sub-menu > a').click(function () {
    //    var o = ($(this).offset());
    //    var diff = 250 - o.top;
    //    if(diff>0)
    //        $("#sidebar").scrollTo("-="+Math.abs(diff),500);
    //    else
    //        $("#sidebar").scrollTo("+="+Math.abs(diff),500);
    //});



//    sidebar toggle
    function responsiveView() {
        var wSize = $(window).width();
        if (wSize <= 768) {
            $('#container').addClass('sidebar-close');
            $('#sidebar > ul').hide();
        }

        if (wSize > 768) {
            $('#container').removeClass('sidebar-close');
            $('#sidebar > ul').show();
        }
    }
    $(window).on('load', responsiveView);
    $(window).on('resize', responsiveView);

    $('.fa-bars').click(function () {
        if ($('#sidebar > ul').is(":visible") === true) {
            $('#main-content').css({
                'margin-left': '0px'
            });
            $('#sidebar').css({
                'margin-left': '-210px'
            });
            $('#sidebar > ul').hide();
            $("#container").addClass("sidebar-closed");
        } else {
            $('#main-content').css({
                'margin-left': '210px'
            });
            $('#sidebar > ul').show();
            $('#sidebar').css({
                'margin-left': '0'
            });
            $("#container").removeClass("sidebar-closed");
        }
    });



//    tool tips
    $('.tooltips').tooltip();

//    popovers
    $('.popovers').popover();

    var ajax_url = location.hash.replace(/^#/, '');
    if (ajax_url.length < 1) {
        ajax_url = CONTEXT_PATH + '/dashboard';
    }

    JUN.ui.load(ajax_url);

    $("#sidebar  .treeview").menu();

    $('body').ajaxLink();

    $('#main-content').on('click', '.expand-link', function (e) {
            var body = $('body');
            e.preventDefault();
            var box = $(this).closest('div.box');
            var button = $(this).find('i');
            button.toggleClass('fa-expand').toggleClass('fa-compress');
            box.toggleClass('expanded');
            body.toggleClass('body-expanded');
            var timeout = 0;
            if (body.hasClass('body-expanded')) {
                timeout = 100;
            }
            setTimeout(function () {
                box.toggleClass('expanded-padding');
            }, timeout);
            setTimeout(function () {
                box.resize();
                box.find('[id^=map-]').resize();
            }, timeout + 50);
        })
        .on('click', '.collapse-link', function (e) {
            e.preventDefault();
            var box = $(this).closest('div.box');
            var button = $(this).find('i');
            var content = box.find('div.box-content');
            content.slideToggle('fast');
            button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
            setTimeout(function () {
                box.resize();
                box.find('[id^=map-]').resize();
            }, 50);
        })
        .on('click', '.close-link', function (e) {
            e.preventDefault();
            var content = $(this).closest('div.box');
            content.remove();
        });
});

/*
 * SIDEBAR MENU
 * ------------
 * This is a custom plugin for the sidebar menu. It provides a tree view.
 *
 * Usage:
 * $(".sidebar).tree();
 *
 * Note: This plugin does not accept any options. Instead, it only requires a class
 *       added to the element that contains a sub-menu.
 *
 * When used with the sidebar, for example, it would look something like this:
 * <ul class='sidebar-menu'>
 *      <li class="treeview active">
 *          <a href="#>Menu</a>
 *          <ul class='treeview-menu'>
 *              <li class='active'><a href=#>Level 1</a></li>
 *          </ul>
 *      </li>
 * </ul>
 *
 * Add .active class to <li> elements if you want the menu to be open automatically
 * on page load. See above for an example.
 */
(function($) {
    "use strict";

    $.fn.tree = function() {

        return this.each(function() {
            var btn = $(this).children("a").first();
            var menu = $(this).children(".treeview-menu").first();
            var isActive = $(this).hasClass('active');

            //initialize already active menus
            if (isActive) {
                menu.show();
                btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");
            }
            //Slide open or close the menu on link click
            btn.click(function(e) {
                e.preventDefault();
                if (isActive) {
                    //Slide up to close menu
                    menu.slideUp();
                    isActive = false;
                    btn.children(".fa-angle-down").first().removeClass("fa-angle-down").addClass("fa-angle-left");
                    btn.parent("li").removeClass("active");
                } else {
                    //Slide down to open menu
                    menu.slideDown();
                    isActive = true;
                    btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");
                    btn.parent("li").addClass("active");
                }
            });

            /* Add margins to submenu elements to give it a tree look */
            menu.find("li > a").each(function() {
                var pad = parseInt($(this).css("margin-left")) + 10;

                $(this).css({"margin-left": pad + "px"});
            });

        });

    };


}(jQuery));

(function($) {
    "use strict";

    $.fn.menu = function() {

        return this.each(function() {
            // li
            var item = $(this);
            var isActive = item.hasClass('active');
            var btn = item.children("a").first();
            var menu = item.children(".treeview-menu");

            //initialize already active menus
            if (isActive) {
                menu.show();
                btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");
            }

            //Slide open or close the menu on link click
            btn.click(function(e) {
                e.preventDefault();
                if (isActive) {
                    //Slide up to close menu
                    menu.slideUp();
                    isActive = false;
                    btn.children(".fa-angle-down").first().removeClass("fa-angle-down").addClass("fa-angle-left");
                    btn.parent("li").removeClass("active");
                } else {
                    //Slide down to open menu
                    menu.slideDown();
                    isActive = true;
                    btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");

                    item.parent().find('.active').removeClass('active');
                    btn.parent("li").addClass("active");
                }
            });

            /* Add margins to submenu elements to give it a tree look */
            menu.find("li > a").each(function() {
                var pad = parseInt($(this).css("margin-left")) + 10;

                $(this).css({"margin-left": pad + "px"});
            });

            menu.find("li").each(function() {
                $(this).click(function(e) {
                    e.preventDefault();

                    var isActive = $(this).hasClass('active');
                    if(!isActive) {
                        //alert(item.parent().find(".treeview-menu > .active").first().html())
                        item.parent().find(".treeview-menu > .active").first().removeClass("active");
                        item.parent().find(".treeview-menu > .active").first().removeClass("active");
                        $(this).addClass("active");

                    }

                });

            });



        });
    };
}(jQuery));

/**
 * ajax link
 */
(function ($) {
    "use strict";

    $.fn.ajaxLink = function(){
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
    };

}(jQuery));

(function ($) {
    "use strict";

    $.fn.crud = function(){
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
    };

}(jQuery));