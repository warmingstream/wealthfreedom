+function($) {
    window.taskCommonUtil = window.taskCommonUtil || {
        loadNextSu: function(obj, level) {
            var value = $(obj).val();
            //值为空的情况
            if (value == '') {
                switch (level) {
                    case 1:
                        //清空已选择概要信息
                        $("#outLineId").val("");
                        $("#outLineStr").val("");
                        //设置二级概要为请选择
                        $("#suSelTwo").html("<option value=''>请选择</option>");
                        //设置三级概要为请选择
                        $("#suSelThree").html("<option value=''>请选择</option>");
                        break;
                    case 2:
                        //设置三级概要为请选择
                        $("#suSelThree").html("<option value=''>请选择</option>");
                        break;
                }
            } else {
                //设置概要查询参数为当前的概要编号和名称
                $("#outLineId").val("");
                $("#outLineStr").val("");
                //不为空时
                switch (level) {
                    case 1:
                        //根据当前概要查询下级概要
                        $("#suSelTwo").html(suOptionHtmlByPid(value));
                        //设置三级架构为请选择
                        $("#suSelThree").html("<option value=''>请选择</option>");
                        break;
                    case 2:
                        //根据当前概要查询下级概要
                        $("#suSelThree").html(suOptionHtmlByPid(value));
                        break;
                    case 3:
                        //设置概要查询参数为当前的概要编号和名称
                        $("#outLineId").val($("option:selected", obj).attr("idPath"));
                        $("#outLineStr").val($("option:selected", obj).attr("suName"));
                        break;

                }
            }
        },

        loadSu: function(){
            var suIdPath = $("#outLineId").val();
            var suName = $("#outLineStr").val();

            if (suIdPath != null && suIdPath != "") {
                var suIdPaths = suIdPath.split("/");

                if(suIdPaths.length > 2){
                    $("#suSelOne").val(suIdPaths[0]);		//一级任务概要

                    displaySu(suIdPaths[0],1);
                    $("#suSelTwo").val(suIdPaths[1]);		//二级任务概要

                    displaySu(suIdPaths[1],2);
                    $("#suSelThree").val(suIdPaths[2]);		//三级任务概要

                } else {
                    $("#suSelThree").append("<option value='"+suIdPath+ " suName='" + suName + "'>"+suName+"</option>");
                }
            }
        },

        getQueryParam: function() {
            return {
                customerName: $("#customerName").val(),
                mobile: $("#mobile").val(),
                fetchUserName: $("#fetchUserName").val(),
                fetchOrg: $("#orgId").val(),
                createUser: $("#createUser").val(),
                taskState: $("#taskState").val(),
                isReserve: $("input[name='isReserve']:checked").val(),
                createTimeBeginString: $("input[name='createTimeBeginString']").val(),
                createTimeEndString: $("input[name='createTimeEndString']").val(),
                updateTimeBeginString: $("input[name='updateTimeBeginString']").val(),
                updateTimeEndString: $("input[name='updateTimeEndString']").val(),
                outLineId: (function() {
                    var su3 = $("[name='suSelThree']").val();
                    var su2 = $("[name='suSelTwo']").val();
                    var su1 = $("[name='suSelOne']").val();
                    return su3 ? su1 + "/" + su2 + "/" + su3 : su2 ? su1 + "/" + su2 + "/" : su1 ? su1 + "/" : "";
                })()
            };
        },

        resetFormBiz: function() {
            $("#customerName").val("");
            $("#mobile").val("");
            $("#fetchUserName").val("");
            $("#createUser").val("");
            $("#taskState").val("");
            $("#createTimeBegin").val("");
            $("#createTimeEnd").val("");
            $("#updateTimeBegin").val("");
            $("#updateTimeEnd").val("");
            $("#isReserve0").attr("checked",false);
            $("#isReserve1").attr("checked",false);
            $("[name^='suSel']").val("");
            $("#orgId").val("");
            $("#fetchOrg").val("");
    //        document.getElementById("bizTaskQueryForm").reset();
        }
    };

    /**
     * 加载子级架构并拼结成option
     * @param pid
     * @returns {string}
     */
    function suOptionHtmlByPid(pid) {
        var optionHtml = "<option value=''>请选择</option>"
        var resultData = findSuList({pid: pid},'获取下级概要失败');
        for (var i = 0; i < resultData.length; i++) {
            optionHtml += "<option value=" + resultData[i].id +" idPath='"+resultData[i].suIdPath + "'" + " suName='" + resultData[i].suName + "' >" + resultData[i].suName + "</option>";
        }
        return optionHtml;
    }

    /**
     * 根据ID加载子级节点
     * @param data
     * @returns errorText
     */
    function findSuList(param,errorText) {
        var data = [];
        $.ajax({
            url: '/cfg/cfgActiveSummary/findList',
            type: 'POST',
            data:param ,
            async:false,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    var resultData = response.data;
                    if (resultData) {
                        data = resultData;
                    }
                } else {
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
        return data;
    }

    /**
     * 回显三级任务概要信息时调用
     * @param obj
     * @param level
     */
    function displaySu(value, level) {
        //值为空的情况
        if (value == '') {
            switch (level) {
                case 1:
                    //设置二级概要为请选择
                    $("#suSelTwo").html("<option value=''>请选择</option>");
                    //设置三级概要为请选择
                    $("#suSelThree").html("<option value=''>请选择</option>");
                    break;
                case 2:
                    //设置三级概要为请选择
                    $("#suSelThree").html("<option value=''>请选择</option>");
                    break;
            }
        } else {
            //不为空时
            switch (level) {
                case 1:
                    //根据当前概要查询下级概要
                    $("#suSelTwo").html(suOptionHtmlByPid(value));
                    //设置三级架构为请选择
                    $("#suSelThree").html("<option value=''>请选择</option>");
                    break;
                case 2:
                    //根据当前概要查询下级概要
                    $("#suSelThree").html(suOptionHtmlByPid(value));
                    break;
            }
        }
    }
}(jQuery);