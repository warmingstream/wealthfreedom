/**
 * --------------------------------------------------------------------
 * crm2.0 事件概要插件
 * Author: bjqiujian
 * Date:2013/12/23
 * Version:1.0
 *  --------------------------------------------------------------------
 */
$(function(){
    var defaultOutLineObj = {
        ifExtendAttrFlag:false,//是否使用扩展属性(默认false)
        ifSelectAllOutLine:false,//是否选择了全部概要(默认false)
        ifSelectAllOutLineFlag:true,//是否要判断是否选择了全部概要的标志（默认true）
        outLineShowDivId:"",//要展示概要的divId （必传参数）
        targetOutLineId:"",//概要选择完毕要填入的divId
        caseType:"",//事件类型（必传参数）
        outLineIdArray:"",//当前已选择概要id的集合
        hidden_outLineName:"",//当前已选择概要名称
        hidden_outLineIdArray:"",//放置概要Id的隐藏变量
        hidden_outLineExtendAttrId:"",//放置扩展属性的id
        extendAttrClueValue:"", //扩展属性线索值如订单号等
        ifHaveExtendAttr:false,//是否有扩展属性用于关闭概要时获取扩展属性标志位
        cusNo:"",//客户账号
        orderType:"",//订单类型
        reSetOutLineFlag:"false"//是否使用重置事件概要功能标志（默认false）
    }
    $.extend({
        //打开事件概要
        showCrmOutLine:function(outLineObj){
            $("#caseTrace").hide();
            $("#specialProblemDiv").hide();
            defaultOutLineObj.ifSelectAllOutLine = false;
            //接收新的属性
            jQuery.extend(defaultOutLineObj, outLineObj);
            jQuery.ajax({
                url: "/caseOutLine/getCaseOutLine",
                type: "post",
                cache: false,
                dataType: "html",
                data:{
                    caseType:outLineObj.caseType,
                    outLinePid:outLineObj.outLinePid,
                    outLineIdArray:outLineObj.outLineIdArray,
                    selectOutLineName:outLineObj.outLineNameArray,
                    selectOutLineExtendAttr:outLineObj.outLineExtendAttr,
                    orderType:outLineObj.orderType
                },
                error: function (xhr) {
                },
                success: function (result) {
                    $("#"+outLineObj.outLineShowDivId).empty().append(result).show();
                    //如果未配置事件概要，增加鼠标离开关闭概要框事件
                    if($("#ifHaveOutLine").length>0){
                        defaultOutLineObj.ifSelectAllOutLine = true;
                        $("#"+outLineObj.outLineShowDivId).bind("mouseleave",function(){
                            $("#"+outLineObj.outLineShowDivId).hide();
                        })
                    }
                }
            });
        },
        //关闭事件概要
        closeCrmOutLine:function(){
            if(defaultOutLineObj.ifSelectAllOutLineFlag){
                //关闭之前判断是否选择了全部概要
                if(defaultOutLineObj.ifSelectAllOutLine){
                    $.setOutLine();
                }else{
                  //  $.jqmAlert("请选择完整概要！");
                    $("#"+defaultOutLineObj.outLineShowDivId).hide();
                }
            }else{
                $.setOutLine();
            }
        },
        //将选择的事件概要赋值
        setOutLine:function(){
            $("#"+defaultOutLineObj.outLineShowDivId).hide();
            //拼装事件概要内容
            var selectOutLinContent ="";
            var selectOutLineName = "";
            //li[thisOutLineSelectFlag=true]
            $("#outLineTab li[id^=outLineTab_][thisOutLineSelectFlag=true]").each(function(){
                selectOutLinContent+= $.trim($(this).find("a").find("span").html())+">";
            });
            selectOutLineName =selectOutLinContent.substr(0,selectOutLinContent.length-1);
            $("#"+defaultOutLineObj.hidden_outLineName).val(selectOutLineName)
            //拼装扩展属性内容
            var extendAttrContent = "";
            var extendAttrHiddenContent = "";
            if($("#outLineExtendTab span").length>0){
                extendAttrHiddenContent =$("#outLineExtendTab span").html()+">";
                extendAttrContent =  extendAttrHiddenContent;
                //如果扩展属性为选择的
                if(defaultOutLineObj.ifHaveExtendAttr){
                    //如果未勾选特殊属性
                    if($("input[id^=extendAttrValue_]:checkbox:checked").length==0){
                        extendAttrContent = "";
                        extendAttrHiddenContent = "";
                    }else{
                        $("input[id^=extendAttrValue_]:checkbox:checked").each(function(){
                            extendAttrContent+=$(this).val()+">";
                            extendAttrHiddenContent+= $(this).val()+">";
                        });
                    }
                //如果扩展属性为手动输入
                }else{
                    //如果未输入特殊属性则清空特殊属性
                    if($("input[id^=extendAttrValue_]").length==0){
                        extendAttrContent = "";
                        extendAttrHiddenContent = "";
                    }else{
                        $("input[id^=extendAttrValue_]").each(function(){
                            extendAttrContent+=$(this).val()+">";
                            extendAttrHiddenContent+= $(this).val()+">";
                        });
                    }
                }

            }
            //将扩展属性拼装放置隐藏变量id中
            extendAttrHiddenContent = extendAttrHiddenContent.substr(0,extendAttrHiddenContent.length-1);
            $("#"+defaultOutLineObj.hidden_outLineExtendAttrId).val(extendAttrHiddenContent);
            //将已选择的概要内容放置到概要输入框中
            selectOutLinContent =selectOutLinContent+extendAttrContent ;
            selectOutLinContent =selectOutLinContent.substr(0,selectOutLinContent.length-1);
            $("#"+defaultOutLineObj.targetOutLineId).val(selectOutLinContent).attr("title",selectOutLinContent);

            //将所选概要对应的Id放到隐藏变量内
            var selectOutLineId = "";
            $("input[id^=outLineIdHidden_]").each(function(){
                if($(this).val()!=""){
                    selectOutLineId+=$(this).val()+"@";
                }
            })
            selectOutLineId = selectOutLineId.substr(0,selectOutLineId.length-1);
            $("#"+defaultOutLineObj.hidden_outLineIdArray).val(selectOutLineId);
        },
        //通过Pid获取下一级概要
        getNexLevOutLineByPid:function(thisOutLine){
            //先将是否已全部选择置为false
            defaultOutLineObj.ifSelectAllOutLine = false;
            jQuery.ajax({
                url: "/caseOutLine/getNextLevOutLine",
                type: "post",
                cache: false,
                dataType: "json",
                async:false,
                data:{
                    caseType:defaultOutLineObj.caseType,
                    outLinePid:thisOutLine.thisOutLineId,
                    orderType:defaultOutLineObj.orderType
                },
                error: function (xhr) {
                },
                success: function (result) {
                   if(!result.success){
                       alert(result.msg);
                       return false;
                   }
                   var outLineContentList = result.data["outLineContentList"];
                   //若存在下一级概要
                   if(outLineContentList.length>0){
                       var outLineTab =  result.data["outLineTab"];
                       var outLineContent = "";
                       $.each(outLineContentList,function(index){
                           outLineContent+=
                               "<a href='javascript:void(0)' class='pt5 ml20 fl pointer' extendAttrType='"+this.expandAttribute+"' extendAttrName='"+this.expandAttributeName+"' " +
                                   "onclick='getNextLevOutLine(this)' " +
                                   "onmouseenter='previewNextLevOutLine(this)' " +
                                   "onmouseout='hiddenPreViesNextLevOutLine(this)' " +
                                   "id='"+this.id+"'>"
                                   +this.outlineName +
                               "</a>" +
                               "<div class='mc' style='margin-top: 22px'><ul id='previewOutLineDiv_"+this.id+"' class='tips-flow-panel' style='display: none;'></ul></div>";
                       })
                       //追加获取到的下一级概要tab
                       $("#outLineTab").append(
                           "<li id='outLineTab_"+outLineTab.outLineLevel+"' thisOutLineSelectFlag='false'>" +
                               "<a href='#outLine_"+outLineTab.outLineLevel+"' class='' >" +
                                    "<span>"+outLineTab.outLineTabName+"</span>" +
                               "</a>" +
                               "<input type='hidden' id='outLineIdHidden_"+outLineTab.outLineLevel+"' value=''>"+
                           "</li>");
                       //追加下一级概要内容
                       $("#outLineContent").append("" +
                           "<div class='tab-con' id='outLine_"+outLineTab.outLineLevel+"' outLineLevel='"+outLineTab.outLineLevel+"'>" +
                                "<span>" + outLineContent +"</span>" +
                           "</div>");
                       //显示下一级概要
                       $("#caseOutLine ul").idTabs("outLine_"+outLineTab.outLineLevel);
                   }else{
                       //如果展示扩展属性并且该级事件概要已经配置了扩展属性
                       if(defaultOutLineObj.ifExtendAttrFlag && thisOutLine.extendAttrName!='null' && thisOutLine.extendAttrName!=""){
                           //获取扩展属性展示扩展属性
                           $.getOutLineExtendAttr({
                              extendAttrName: thisOutLine.extendAttrName,
                              extendAttrType:thisOutLine.extendAttrType
                           });
                       }else{
                           //只展示当前概要
                           $("#caseOutLine ul").idTabs("outLine_"+thisOutLine.thisOutLineLevel);
                           defaultOutLineObj.ifSelectAllOutLine = true;
                           //自动关闭事件概要
                           $.closeCrmOutLine();
                       }
                   }
                }
            });
        },
        //预览下一级概要
        previewNextLevOutLine:function(thisOutLine){
            jQuery.ajax({
                url: "/caseOutLine/getNextLevOutLine",
                type: "post",
                cache: false,
                dataType: "json",
                async:false,
                data:{
                    caseType:defaultOutLineObj.caseType,
                    outLinePid:thisOutLine.thisOutLineId,
                    orderType:defaultOutLineObj.orderType
                },
                error: function (xhr) {
                },
                success: function (result) {
                    if(result.success){
                        var outLineContentList = result.data["outLineContentList"];
                        if(outLineContentList.length>0){
                            var outLineContent = "";
                            $.each(outLineContentList,function(index){
                                outLineContent+=
                                    "<li style='width:75px;'>"+this.outlineName +"</li>";
                            })
                            $("#previewOutLineDiv_"+thisOutLine.thisOutLineId).html(outLineContent).show();
                        }
                    }
                }
            })
        },
        //获取概要扩展属性
        getOutLineExtendAttr:function(thisOutLineExtendAttr){
            //追加扩展属性tab
            $("#outLineTab").append(
                "<li id='outLineExtendTab'>" +
                    "<a href='#extendDiv' class='' >" +
                        "<span>"+thisOutLineExtendAttr.extendAttrName+"</span>" +
                    "</a>" +
                "</li>"
            );
            //展示扩展属页签和内容
            $("#outLineContent").append("<div class='tab-con' id='extendDiv'>数据加载中......</div>");
            $("#caseOutLine ul").idTabs("extendDiv");

            //获取特殊属性值
            jQuery.ajax({
                url: "/caseOutLine/getOutLineExtendAttr",
                type: "post",
                cache: false,
                dataType: "json",
                async:false,
                data:{
                    orderId:defaultOutLineObj.extendAttrClueValue,
                    cusNo:defaultOutLineObj.cusNo,
                    extendAttrName:thisOutLineExtendAttr.extendAttrName,
                    extendAttrType:thisOutLineExtendAttr.extendAttrType
                },
                error: function (xhr) {
                },
                success: function (resultData) {
                    defaultOutLineObj.ifSelectAllOutLine = true;
                    if(resultData.data.length>0){
                        defaultOutLineObj.ifHaveExtendAttr = true;
                        var extendAttrObj = ""
                        //追加查询扩展属性内容
                        $.each(resultData.data,function(){
                            extendAttrObj =
                                "<div id='extendAttrValueSpan_"+this.extendAttrValue+"' class='mr30'>" +
                                    "<input type='checkbox' class='mt5 ml10 fl itxt-10' id='extendAttrValue_"+this.extendAttrValue+"' value='"+this.extendAttrValue+"'>" +
                                    "<span class='mt10 ml10 fl'>"+this.extendAttrValue+"</span>" +
                                    "<span class='mt10 ml10 fl'><img title='"+this.extendAttrImgName+"' src='"+this.extendAttrImgPath+"'></img></span>" +
                                "</div>";
                        });
                        $("#extendDiv").empty().append(extendAttrObj);
                    }else{
                        //追加手动扩展属性内容
                        $("#extendDiv").empty().append(
                                "<span>" +
                                    "<input type='text' id='extendAttrValue' class='mt5 ml20 fl itxt1-12' maxlength='20'>" +
                                    "<a href='javascript:void(0)' onclick='$.addExtendAttrValue("+thisOutLineExtendAttr.extendAttrType+")' id='' class='mt20 ml10 fl'>添加</a>" +
                                    "<div class='ml20 fl'id='extendAttrValueDiv'></div>" +
                                "</span>"
                        );
                    }
                }
            })
        },
        //添加扩展属性方法
        addExtendAttrValue:function(extendAttrType){
            var extendAttrValue =  $("#extendAttrValue").val();
            //校验扩展属性值
            if($.checkAddExtendAttrValue(extendAttrType,extendAttrValue)){
                var attrValueObj =
                    "<div id='extendAttrValueSpan_"+extendAttrValue+"' class='mr30'>"+
                        "<a class='pointer' onclick='$.delExtendAttr("+extendAttrValue+")' extendAttrValue='"+extendAttrValue+"'>删除</a>"+
                        "<input type='text' class='itxt-10' readonly='readonly' id='extendAttrValue_"+extendAttrValue+"' value='"+extendAttrValue+"'>" +
                    "<div>"
                $("#extendAttrValueDiv").append(attrValueObj);
                $("#extendAttrValue").val("").focus();
                defaultOutLineObj.ifSelectAllOutLine=true;
            }
        },
        //校验扩展属性值
        checkAddExtendAttrValue:function(attrType,attrValue){
            if(attrValue==""){
                $.jqmAlert("请输入属性编号！");
                $("#extendAttrValue").focus();
                return false;
            }
            if(attrValue<1){
                $.jqmAlert("请输入合理的属性编号！")
                $("#extendAttrValue").focus();
                return false;
            }
            if(isNaN(attrValue)){
                $.jqmAlert("扩展属性应为数字")
                $("#extendAttrValue").focus();
                return false;
            }
            if($("input[id^=extendAttrValue_]").length<=4){
                var returnFlag = true;
                $("input[id^=extendAttrValue_]").each(function(){
                     if(attrValue==$(this).val()){
                         $.jqmAlert("扩展属性相同，请添加不同扩展属性！")
                         $("#extendAttrValue").focus();
                         returnFlag =  false;
                         return false;
                     }
                })
                if(attrType==30){
                    if(returnFlag){
                        returnFlag =  $.checkOutLineExtendAttr(attrType,attrValue);
                    }
                }
                return returnFlag;
            }else{
                $.jqmAlert("扩展属性最多添加5个");
                return false;
            }

            return  true;
        },
        //删除扩展属性
        delExtendAttr:function(extendAttrValue){
             $("#extendAttrValueSpan_"+extendAttrValue).remove();
            defaultOutLineObj.ifSelectAllOutLine=true;
        },
        //重置事件概要
        reSetOutLine:function(){
          //如果提供了重置事件概要属性则可以重置
          if(defaultOutLineObj.reSetOutLineFlag){
             $("#"+defaultOutLineObj.hidden_outLineExtendAttrId).val("");
             $("#"+defaultOutLineObj.targetOutLineId).val("").attr("title","");
             $("#"+defaultOutLineObj.hidden_outLineIdArray).val("");
             $("#"+defaultOutLineObj.hidden_outLineName).val("");
             $("#"+defaultOutLineObj.outLineShowDivId).hide();
          }
        },
        //封装警告信息弹出框
        jqmAlert:function(alertContent){
            jqm.alert({
                w:260,
                title:'警告',
                type:'warning',//有warning 和  attention 两种
                content:"<div>"+alertContent+"</div>",
                self:self
            });
        },
        checkOutLineExtendAttr:function(extAttrType,extAttrValue){
            var returnFlag = true;
            jQuery.ajax({
                url: "/caseOutLine/checkOutLineExtendAttr",
                type: "post",
                cache: false,
                dataType: "json",
                async:false,
                data:{
                    extendAttrType:extAttrType,
                    extendAttrValue:extAttrValue
                },
                beforeSend:function(){
                    jqm.loading({content: '正在校验扩展属性，请稍后....'});
                },
                error: function (xhr) {
                },
                success: function (resultData) {
                    $('#jqmLoading').jqmHide();
                    returnFlag = resultData.success;
                    if(!returnFlag){
                        $.jqmAlert(resultData.msg);
                    }
                }
            })
            return returnFlag;
        }
    })
})
