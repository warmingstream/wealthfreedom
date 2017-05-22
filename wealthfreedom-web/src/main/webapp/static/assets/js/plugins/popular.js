// JavaScript Document
$(function() {
    //创建报告 “指定范围报告层”  （project-2）
    $(".report-box").hover(function() {
        $(".set-report").addClass("set-report1");
        $(".report").show();
    }, function() {
        $(".set-report").removeClass("set-report1");
        $(".report").hide();
    })
    //处理网站管理  （project-10）
    $(".b-box").hover(function() {
        $(this).find(".blog").addClass("blog-hov");
        $(this).find(".user-info").show();
        $(this).find(".blog").find(".hide").show();
        $(".user-info div").hover(function() {
            $(this).find(".hide").show();
        }, function() {
            $(this).find(".hide").hide();
        })
    }, function() {
        $(this).find(".blog").removeClass("blog-hov");
        $(this).find(".user-info").hide();
        $(this).find(".blog").find(".hide").hide();
    })
    //舆情列表页，分析图表页  “其他分类”层  （project-5,6）
    $(".other-wrap").hover(function() {
        $(this).find(".other").show();
        $(this).find(".other-cls").addClass("other-cls1");
    }, function() {
        $(this).find(".other").hide();
        $(this).find(".other-cls").removeClass("other-cls1");
    })
    //舆情列表页 鼠标点击和滑过效果  （project-6）
    $(".p-list").bind('click', function() {
        if ($(this).hasClass("p-list1"))
        {
            $(this).removeClass("p-list1")
        }
        else
        {
            $(this).addClass("p-list1")
        }
    })
    $(".p-list").hover(function() {
        $(this).addClass("hp-list");
    }, function() {
        $(this).removeClass("hp-list");
    })
    //网站管理 “修改”层  （project-7）
    $(".opt").live('mouseenter', function() {
        $(this).find(".modi").addClass("modi1");
        $(this).find(".opt-con").show();
    }).live('mouseleave', function() {
        $(this).find(".modi").removeClass("modi1");
        $(this).find(".opt-con").hide();
    })
    //业务组管理-2  “展开”  （project-9）

    function setKeywordControlListener() {

        var listGroup = $('.business-group-list');

        listGroup.each(function() {

            var itemCount = $(this).find('.retract').find('a').length;
            if (itemCount > 18) {
                $(this).find('.open').show();
            } else {
                $(this).find('.open').hide();
            }

        })
    }

    setKeywordControlListener();

    //	$(".open").live('click', function(){
    //		if($(this).find("b").hasClass("b5"))
    //		{
    //			$(this).html('展开<b class="b4"></b>');
    //			$(this).parents('div.line').find(".retract").css({"max-height":"78px"});
    //		}
    //		else
    //		{
    //			$(this).html('收起<b class="b4 b5"></b>');
    //			$(this).parents('div.line').find(".retract").css({"max-height":"none"});
    //		}
    //	})
})

/**
 * saitD
 * 舆情监控系统通用功能
 */
var saitD = {};

/**
 * saitD.globalEvent
 * 舆情监控系统 全局功能事件
 */
saitD.globalEvent = {};

//全局功能事件加载
$(function() {
    saitD.globalEvent.setNavHover();
    saitD.globalEvent.setGridRows();
    saitD.globalEvent.dateSet();
    saitD.globalEvent.setInputTips();
})

/**
 * saitD.globalEvent.setNavHover
 * 舆情监控系统 菜单事件绑定
 */
saitD.globalEvent.setNavHover = function() {

    var curSelected = $(".nav").find("li.curr");
    var curSelectedChild = $(".nav").find(".vice-nav.selected");

    $(".nav li").hover(function() {

        var idx = $(".nav").find("li").index($(this));

        if (idx >= 0) {

            var h = $(".vice-wrap").find(".vice-nav").eq(idx).addClass("selected").siblings().removeClass("selected");

        }

        $(this).addClass("curr").siblings().removeClass("curr");
    })

    $(".nav").bind('mouseleave', function() {

        curSelected.addClass("curr").siblings().removeClass("curr");
        curSelectedChild.addClass("selected").siblings().removeClass("selected");

    })
}
/**
 * saitD.globalEvent.setGridRows
 * 舆情监控系统 表格等隔行变色hover
 */
saitD.globalEvent.setGridRows = function() {
    //系统首页 行交错背景
    if ($(".list").length > 0) {
        $(".list li:odd").css({"background":"#fafafa"})
    }
    //table hover&click
    if ($('.grid').length > 0) {
        $('.grid').find('tbody tr').live('mouseenter', function() {
            $(this).addClass('trHover').find('td:first').addClass('trHover').end().siblings().removeClass('trHover').find('td').removeClass('trHover')
        })
    }
    //查询全部关键词 表格
    if ($('.tabl').length > 0) {
        $(".tabl td").live('mouseenter', function() {
            $(this).addClass("hov-td");
        }).live('mouseleave', function() {
            $(this).removeClass("hov-td");
        })
    }
}
/**
 * saitD.globalEvent.dateSet
 * 舆情监控系统 时间空间
 */
saitD.globalEvent.dateSet = function() {

    var dateTime = new Date();
    var nowYear = dateTime.getFullYear();
    var nowMonth = dateTime.getMonth() + 1;
    var nowDay = dateTime.getDate();
    var now = nowYear + '-' + nowMonth + '-' + nowDay;

    //双月显示
    if ($(".dateSetDouble").length > 0) {
        $('.dateSetDouble').each(function() {
            var thisEle = $(this);
            $(this).DatePicker({
                format:'Y/m/d H:M:S',
                date: now,
                current: now,
                calendars: 2,
                mode: 'range',
                starts: 1,
                onBeforeShow: function() {
                },
                onChange: function(formated, dates) {
                    //thisEle.val(formated.join('-'));
                    $('.datepicker').each(function() {
                        if ($(this).find(".datepickerSelected").length > 1) {
                            thisEle.val(formated.join('-'));
                            $(this).hide();
                            if (thisEle.parent('div').find(".curr").length > 0) {
                                thisEle.parent('div').find(".curr").removeClass("curr");
                            }
                        }
                    });
                }
            });
        })
    }
    //单月显示
    if ($(".dateSet").length > 0) {
        $('.dateSet').each(function() {
            var thisEle = $(this);
            $(this).DatePicker({
                format:'Y.m.d',
                date: now,
                current: now,
                starts: 1,
                onBeforeShow: function() {
                },
                onChange: function(formated, dates) {
                    thisEle.val(formated);
                    $('.datepicker').each(function() {
                        $(this).hide();
                        if (thisEle.parent('div').find(".curr").length > 0) {
                            thisEle.parent('div').find(".curr").removeClass("curr");
                        }
                    });
                }
            });
        })
    }
}
/**
 * saitD.globalEvent.setInputTips
 * input 默认提示信息
 */
saitD.globalEvent.setInputTips = function() {

    if ($('.hasDefault').length > 0) {
        $('.hasDefault').each(function() {
            var dText = $(this).attr('tips');
            if ($(this).val().length == 0 || $(this).val() == dText) {
                $(this).addClass('dColor').val(dText);
            }
            $(this).bind('focus', function() {
                if ($(this).hasClass('dColor')) {
                    $(this).removeClass('dColor').val("");
                }
            })
            $(this).bind('blur', function() {
                if ($(this).val().length == 0) {
                    $(this).addClass('dColor').val($(this).attr('tips'));
                }
            })
        })
    }

}
/**
 * saitD.globalEvent.showAlert
 * 提示信息
 * @param {object} ele : 显示目标的DOM对象
 * @param {string} str : 提示信息内容
 */
saitD.globalEvent.showAlert = function (ele, str) {

    $('.alert-box').remove();

    var eleTop = $(ele).position().top + 15;
    var eleLeft = $(ele).position().left + 66;

    var temp = $('<span class="alert-box alert-float" style="left: ' + eleLeft + 'px; top:' + eleTop + 'px;"><a class="alert-ico"></a><em class="alert-content">' + str + '</em></span>');
    $(ele).after(temp);
    setTimeout(function() {
        temp.animate({"opacity": 0}, 200, function() {
            temp.remove();
        })
    }, 3000);
}

/**
 * saitD.globalEvent.scrollToTop
 * 返回顶部
 */
saitD.globalEvent.scrollToTop = function () {

    var $srollTop = $('<a id="scrollToTop" href="javascript:void(0)"></a>')
    $srollTop.bind('click', function() {
        $("html, body").animate({ 'scrollTop': '0' }, 200);
        return false;
    });
    $("body").append($srollTop);
    $(window).bind('scroll', function() {
        var st = $(document).scrollTop();
        (st > 20) ? $srollTop.show() : $srollTop.hide();
    });
}