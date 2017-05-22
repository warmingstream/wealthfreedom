/**
 * --------------------------------------------------------------------
 * crm2.0 菜单扩展函数
 * Author: bjqiujian
 * Date:2013/12/23
 * Version:1.0
 * dependency:目前依赖于/static/js/common/main.js下的 reloadArea函数
 * 参数说明：menuObj{
 *     menuId:"#menu", //被遍历菜单最外层的自定义div的ID
       defaultShowLi:1,//默认展示的菜单项
       mouseOverCss:"moveCss",//鼠标滑过时的自定义样式
       menuOpenCss:"open",//被选中时的菜单项自定义样式
       actionSpeed:150,//菜单展开时的速度
       pageToUrlAttrName:"pageToUrl"//没项可点击菜单时在主页要替换的Url自定义属性名称
       reloadAreaId:"right-side"//点击菜单时要替换的divId
 *    }
 *
 * --------------------------------------------------------------------
 */
$.extend({
    initMenuCss: function (menuObj) {
        $(menuObj.menuId + " a").hover(function () {
            if ($(this).attr("class").indexOf("selected") < 0) {
                $(this).addClass(menuObj.mouseOverCss);
            }
        }, function () {
            $(this).removeClass(menuObj.mouseOverCss);
        })
    },
    showMenu: function (menuObj,callbackFun) {
        if (menuObj.menuId != "") {
            $.initMenuCss(menuObj);
            /**
             *遍历所有的ul项
             */
            $(menuObj.menuId + " > ul").each(function (index) {
                //先将遍历到的所有ul收起
                $(this).find("ul").hide();
                //默认展开定义的ul
                $(this).find(">li>ul:eq(" + menuObj.defaultShowLi + ")").show();
                $(this).on("click", "li", function () {
                    if ($(this).find("ul").length == 0) {
                        var knowLedgeFlag = $(this).find(">a[id=knowledge_menu]");
                        var menuId = $(this).find(">a").attr("id");
                        var menuName = $(this).find(">a").attr("menuName");
                        var menuUrl = $(this).find(">a").attr(menuObj.pageToUrlAttrName);
                        if (menuUrl != "#") {
                            if (menuId=="knowledge_menu") {
                                window.open( menuUrl,"_blank");
                            } else {
                                addTab(menuName, menuUrl, "menu-" + menuId);
                            }
                        }
                        $(this).find(">a").addClass(menuObj.menuOpenCss);
                    }
                    $(this).find(">ul").toggle(menuObj.actionSpeed);
                    $(this).siblings().find("ul").hide();
                    $(this).siblings().find("a").removeClass(menuObj.menuOpenCss);
                    callbackFun();//click菜单延时触发
                    return false;
                })
            })
        }
    },
    /**
     * 展示菜单项未处理函数
     */
    showNoProcessNum: function () {
        var processMenu = $("#menu a:visible[id^=process_]");
        if (processMenu.length > 0) {//处理数菜单显示时取数
            var menuIdArr = new Array();
            processMenu.each(function(i){
                menuIdArr[i] = $(this).attr("id");
            });
            var param = {
                menuIds:menuIdArr
            };
            if (window.console && window.console.log) window.console.log(menuIdArr);
            jQuery.ajax({
                url: "/showNoProcessNum",
                type: "post",
                data: param ,
                dataType: "json",
                error: function (xhr) {
                },
                success: function (result) {
                    if (result.state) {
                        var resultMap = result.object;
                        $("a[id^=process_]").each(function () {
                            //此处先将每个菜单旁边的小数字清空，然后在循环数据库中查询的小数字，并放置在对应的em标签中
                            //若不清空会有，从有到无时数字不变的bug
                            $(this).find("em").html("");
                            for (var o in resultMap) {
                                if ($(this).attr("id") == o) {
                                    $(this).find("em").html(resultMap[o]);
                                }
                            }
                        })
                    }
                }
            });
        }
    },
    /**
     * 初始化知识库菜单
     */
    initKnowledgeMenu: function () {
        if ($("#knowledge_menu")) {
            var knowMenuUl = "<ul class='menu_lev2' id='knowledge-ul'></ul>";
            $("#knowledge_menu").after(knowMenuUl);
            $("#knowledge_menu").click(function () {
                //只有当知识库菜单为收起状态时，打开才会重新加载知识库菜单
                if(!$("#knowledge-ul").is(":visible")){
                    $.getKnowledgeMenu();
                }
            })
        }
    },
    /**
     * 获取知识库菜单
     */
    getKnowledgeMenu: function () {
        $.ajax({
            type: 'POST',
            url: '/knowledge/knowledgeMenuList',
            dataType: "json",
            contentType: 'application/json',
            success: function (json) {
                var result = json.data;
                var html = "";
                for (var i = 0; i < result.length; i++) {
                    var rc = result[i];
                    html += "<li>" +
                        "<a href='javascript:void(0);' knowledgeFlag='1'  pageToUrl='" + rc.url + "'  " +
                        "class='tit_lev2' title='"+rc.ktitle+"'>" +
                        "<span class='isb isw-dot'></span><span class='title'>" + rc.ktitle + "</span>" +
                        "</a>" +
                        "</li>";
                }
                $("#knowledge-ul").empty().append(html);
                var knowMenuObj = {
                    menuId: "#knowledge-ul",
                    mouseOverCss: "hover"
                }
                $.initMenuCss(knowMenuObj);
            }
        });
    }
})
