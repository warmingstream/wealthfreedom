/**
 *事件详情页特殊问题插件
 * auth:QiuJian
 * date:2014-3-12
 */
$.extend({
    /**
     *展现特殊问题
     */
    showSpecialProblem : function(){
        $("#caseTrace").hide();
        $("#outLineDiv").hide();
        $("#specialProblemDiv").show();
        $("#specialProblemDetailDiv").html("数据加载中.....");
        var caseId = $("input[name=id]").val();
        var orderId = $("input[name=orderId]").val();
        var cusNo = $("input[name=cusNo]").val();
        var caseType = $("#caseType").val();
        jQuery.ajax({
            url: "/specialProblem/showCaseSpecialProblem",
            type: "post",
            cache: false,
            dataType: "html",
            data:{
               id:caseId,
               orderId:orderId,
               cusNo: cusNo,
               caseType:caseType
            },
            error: function (xhr) {
            },
            success: function (result) {
                $("#specialProblemDetailDiv").html(result);
                $('.ico-tips')
                    .bind('mouseover',function(){
                        var _tip = $('#tips-msg'),_offset = $(this).offset();
                        if(!_tip.length){
                            var _str = '<div id="tips-msg" class="tips-msg">'
                                +'<div class="tips-con">'
                                +'<div class="txt">'+$(this).attr('fmsg')+'</div>'
                                +'</div>'
                                +'<div class="arrow">&nbsp;</div>'
                                +'</div>';
                            _tip = $(_str).appendTo('body');
                        }else{
                            $('.txt',_tip).html($(this).attr('fmsg'));
                        }
                        _tip.css({
                            "top":_offset.top+0,
                            "left":_offset.left+20
                        }).show();

                    })
                    .bind('mouseout',function(){
                        $('#tips-msg').hide();
                    });
            }
        });
    },
    /**
     * 关闭特殊问题
     */
    closeSpecialProblem:function(){
        var selectProblemId = "";
        var selectProblemName = "";
        var selectProblemUrl = "";
        $("#specialProblemDiv input[type=checkbox]:checked").each(function(i){
            selectProblemId += $(this).val()+",";
            selectProblemName +=$(this).parent("span").next().html()+",";
            selectProblemUrl+="<input type='hidden' id='brandList_"+$(this).val()+"_spId' name='brandList["+i+"].spId' value='"+$(this).val()+"'>";
            selectProblemUrl+="<input type='hidden' id='brandList_"+$(this).val()+"_spName' name='brandList["+i+"].spName' value='"+$(this).parent("span").next().html()+"'>";
        });
        selectProblemName =  selectProblemName.substring(0,selectProblemName.length-1);
        $("#brand").attr("title",selectProblemName).val(selectProblemName);
        $("#brandUL").empty().append(selectProblemUrl);
        $("#specialProblemDiv").hide();
    },
    /**
     *默认展示特殊问题
     */
    defaultShowSpecialProblem:function(){
        var caseId = $("input[name=id]").val();
        var orderId = $("input[name=orderId]").val();
        var cusNo = $("input[name=cusNo]").val();
        var caseType = $("#caseType").val();
        jQuery.ajax({
            url: "/specialProblem/defaultShowSpecialProblem",
            type: "post",
            cache: false,
            dataType: "json",
            data:{
                id:caseId,
                orderId:orderId,
                cusNo: cusNo,
                caseType:caseType
            },
            error: function (xhr) {
            },
            success: function (jsonResult) {
                var title="";
                var selectProblemUrl = "";
                if(jsonResult!=null&&jsonResult.data!=null){
                    for(var i=0;i<jsonResult.data.length;i++){
                        var selected=jsonResult.data[i];
                        if(i!=0){
                            title=title+",";
                        }
                        title=title+selected.spName;
                        selectProblemUrl+="<input type='hidden' id='brandList_"+selected.spId+"_spId' name='brandList["+i+"].spId' value='"+selected.spId+"'>";
                        selectProblemUrl+="<input type='hidden' id='brandList_"+selected.spId+"_spName' name='brandList["+i+"].spName' value='"+selected.spName+"'>";
                    }
                }
                $("#brand").attr("title",title).val(title);
                $("#brandUL").append(selectProblemUrl);
                 if(jsonResult.success) {
                     $.showSpecialProblem();
                 }
            }
        });
    }
})
$(function(){
    $.defaultShowSpecialProblem()
})