/*
 * @jQuery slideTab plugin
 * @Version 1.0  (August 13, 2012)
 * @author FengWeiping 360buy.com
 * @email me@itfe.org
 * @example $('.tab').slideTab();
 **/
(function (b) {
    b.fn.extend({
        resetIframeScope: function(iframeObj){
            if(jQuery(iframeObj).attr("hasInterval") == 'true'){//判断是否存在interval
                return;
            }
            var timer = setInterval(function(){
                if(!iframeObj || !jQuery(iframeObj).attr('src')){//这里不能用iframeObj.src获取iframe的src属性，实验证明取到的是上级地址栏的src
                    window.clearInterval(timer);
                    jQuery(iframeObj).attr("hasInterval",'false');
                    jQuery(iframeObj).attr("frameLastHight",0);  //tab页签iframe最后一次刷新时高度
                    return;
                }

                var innerHeight = 510;
                try {
                    innerHeight = iframeObj.contentDocument.body.scrollHeight;
                   /* if (iframeObj.contentDocument && iframeObj.contentDocument.body.offsetHeight) {//如果用户的浏览器是IE8及以上
                        innerHeight = iframeObj.contentDocument.body.offsetHeight;
                    }
                    else if (iframeObj.Document && iframeObj.Document.body.scrollHeight) {//如果用户的浏览器是IE7及以下
                        innerHeight = iframeObj.Document.body.scrollHeight;
                    }*/
                } catch (e) {
                }
                //判断是否已经默认添加了固定的高度--20px，否则，在.contentDocument.body.scrollHeight 上再添加20px高度
                var frameLastHight = jQuery(iframeObj).attr("frameLastHight");
                //如果tab页签iframe最后一次刷新时高度 不等于 最新页面高度，则默认再加10px
                if(innerHeight != frameLastHight){
                    innerHeight += 20;
                    if(innerHeight != frameLastHight){
                        jQuery(iframeObj).attr("frameLastHight",innerHeight);
                        iframeObj.style.height = innerHeight > 500 ? innerHeight + 'px' : '510px';
                    }
                }
            },1000);
            jQuery(iframeObj).attr("hasInterval",'true');
        },
        slideTab: function (c) {
            return b(this).each(function () {
                var d = new a(b(this));
                d.init(c);
            })
        },
        createTab: function (e, d, h) {
            var c = b(this), j = c.data("st_Opts");
            j.ops.current = b(this).attr(h);
            if (b("a[fid=" + h + "]", c).length) {
                b("a[fid=" + h + "]", c).click();
                b("#" + h + " iframe").attr("src", d);
                return
            }
            if (b("ul li", j.obj).length >= j.ops.maxNum) {
                jqm.alert({w: 300, type: "attention", title: "提示", content: "打开过多的tab,请关闭不必要的！"});
                return
            }
            var i = '<li class="' + h + '"><a class="sel" fid="' + h + '" href="javascript:void(0);" title="' + e + '"><span>' + e + '<em class="tab-close">&nbsp;</em></span><b></b></a></li>';
            b('<li class="' + h + '" fid="' + h + '"><a href="javascript:void(0);"><span class="tab-checked">&nbsp;</span><span class="tit">' + e + "</span></a></li>").appendTo(j.$foldLists).bind("click", function (k) {
                j.foldListsClick(b(this))
            });
            var g = b('<div class="tabCon" id="' + h + '"><iframe name="' + h + '" frameborder="0" scrolling="auto" hasInterval="false" height="510px" width="100%" src="'+d+'" onload="jQuery.fn.resetIframeScope(this)"></iframe>').appendTo(b("#" + j.ops.container));
            j.ops.current = h;
            var f = b(i).appendTo(b("ul", this));
            f.find(".tab-close").bind("click", function (k) {
                j.del(b(this));
                k.stopPropagation()
            });
            f.find("a").bind("click",function () {
                j.tabClick(b(this));
                j.toCurrent(f)
            }).click();
            //g.find("iframe").attr("src", d);
            return c
        },
        delTab: function (d) {
            var e = this.data("st_Opts"), c = b("ul li." + d + " .tab-close", e.obj);
            e.del(c);
            return this
        }
    });
    function a(c) {
        this.obj = c
    }

    a.prototype = {
        def: {current: null, attr: "fid", maxNum: 99999, container: "tabContainer", curClass: "selected"},
        init: function (c) {
            var d = this;
            d.$foldDown = b(".foldDown", d.obj);
            d.$foldLists = b(".foldLists", d.obj);
            d.$moveL = b(".moveL", d.obj);
            d.$moveR = b(".moveR", d.obj);
            d.$ul = b("ul", d.obj);
            d.liW = b("ul li:first", d.obj).width();
            d.hidden_num = 0;
            d.max_num = Math.floor(b(".tab-w", d.obj).width() / d.liW);
            if (!d.$foldDown.length) {
                d.$foldDown = b('<div class="foldDown">').appendTo(d.obj)
            }
            if (!d.$foldLists.length) {
                d.$foldLists = b('<ol class="foldLists hidden">').appendTo(d.obj)
            }
            if (!d.$moveL.length) {
                d.$moveL = b('<div class="moveL disabled">').appendTo(d.obj)
            }
            if (!d.$moveR.length) {
                d.$moveR = b('<div class="moveR disabled">').appendTo(d.obj)
            }
            d.ops = jQuery.extend({}, d.def, c);
            d.ops.current = d.ops.current ? d.ops.current : d.obj.find("ul li:first a").attr(d.ops.attr);
            d.obj.find("ul li").each(function () {
                d.activeW += b(this).width();
                var e = b("a", this).attr(d.ops.attr);
                b("#" + e).addClass("tabCon");
                b(this).addClass(e);
                d.$foldLists.append('<li class="' + e + '" fid="' + e + '"><a href="javascript:void(0);"><span class="tab-checked">&nbsp;</span><span class="tit">' + b(this).text() + "</span></a></li>")
            });
            b("ul a[" + d.ops.attr + "=" + d.ops.current + "]", d.obj).addClass(d.ops.curClass);
            b("#" + d.ops.current).show();
            d.$foldLists.find("." + d.ops.current).addClass(d.ops.curClass).siblings().removeClass(d.ops.curClass);
            d.obj.find("ul a").bind("click", function () {
                d.tabClick(b(this))
            });
            d.obj.find(".tab-close").bind("click", function (f) {
                d.del(b(this));
                f.stopPropagation()
            });
            d.$foldDown.bind("click", function (f) {
                if (d.$foldLists.hasClass("hidden")) {
                    d.foldListsShow();
                    setTimeout(function () {
                        b(document).bind("click.slideTab", function () {
                            d.foldListsHide()
                        })
                    }, 20)
                }
            });
            d.$foldLists.find("li").bind("click", function () {
                d.foldListsClick(b(this))
            });
            d.$moveL.bind("click", function () {
                if (d.$moveL.hasClass("disabled")) {
                    return
                }
                d.hidden_num--;
                d.tabSlide()
            });
            d.$moveR.bind("click", function () {
                if (d.$moveR.hasClass("disabled")) {
                    return
                }
                d.hidden_num++;
                d.tabSlide()
            });
            d.obj.data("st_Opts", d)
        },
        tabClick: function (c) {
            this.ops.current = c.attr(this.ops.attr);
            c.addClass(this.ops.curClass).parent().siblings().find("a").removeClass(this.ops.curClass);
            b(".tabCon").hide();
            b("#" + this.ops.current).show();
            this.$foldLists.find("." + this.ops.current).addClass(this.ops.curClass).siblings().removeClass(this.ops.curClass)
        },
        foldListsShow: function () {
            this.$foldLists.removeClass("hidden")
        },
        foldListsHide: function () {
            this.$foldLists.addClass("hidden");
            b(document).unbind("click.slideTab")
        },
        foldListsClick: function (c) {
            this.ops.current = c.attr(this.ops.attr);
            b("a[fid=" + this.ops.current + "]", this.obj).click();
            this.toCurrent(b("ul li." + this.ops.current, this.obj))
        },
        tabSlide: function () {
            this.$ul.animate({"margin-left": -this.hidden_num * this.liW}, 500);
            if ((this.hidden_num + this.max_num) >= b("ul li", this.obj).length) {
                this.$moveR.addClass("disabled")
            } else {
                this.$moveR.removeClass("disabled")
            }
            if (this.hidden_num <= 0) {
                this.$moveL.addClass("disabled")
            } else {
                this.$moveL.removeClass("disabled")
            }
        },
        toCurrent: function (d) {
            var c = b("ul li", this.obj).index(d) + 1;
            if (c <= this.hidden_num) {
                this.hidden_num = c - 1;
                this.tabSlide()
            } else {
                if (c > (this.hidden_num + this.max_num)) {
                    this.hidden_num = c - this.max_num;
                    this.tabSlide()
                }
            }
        },
        del: function (i) {
            var d = i.parent().parent();
            if (d.hasClass(this.ops.curClass)) {
                d.parent().prev().find("a").click()
            }
            b("." + d.attr(this.ops.attr)).remove();
            var c = document.getElementById(d.attr(this.ops.attr)), g = c.childNodes[0], f = g.contentWindow;
            if (g) {
                g.src = "about:blank";
                try {
                    f.document.write("");
                    f.document.clear()
                } catch (h) {
                }
                g.src = "";
                g.parentNode.removeChild(g)
            }
            b(c).remove();
            if (this.hidden_num > 0) {
                this.hidden_num--;
                this.$ul.animate({"margin-left": -this.hidden_num * this.liW}, 500)
            }
            if (this.hidden_num <= 0) {
                this.$moveL.addClass("disabled")
            }
            if ((this.hidden_num + this.max_num) >= b("ul li", this.obj).length) {
                this.$moveR.addClass("disabled")
            }
        }
    }
})(jQuery);