var userHandleTools = userHandleTools || {};

userHandleTools.queryUserList = userHandleTools.queryUserList || function () {
    jQuery.ajax({
        url: "/cfg/cfgUser/queryEmp",
        type: "POST",
        cache: false,
        dataType: "html",
        data: {
            userCode: $("#query_div #userCode").val(),
            userName: $("#query_div #userName").val(),
            userRoleId: $("#query_div #userRoleId").val(),
            userOrgId: $("#query_div #orgId").val(),
            // userOrgName:$("#query_div #userOrgId").val(),
            isOrgPic: $("#query_div #isOrgPic").val(),
            status: $("#query_div #status").val(),
            skillLevel: $("#query_div #skillLevel").val(),
            phone: $("#query_div #phone").val()
        },
        beforeSend: function () {
            popupTool.openLoading();
        },
        error: function (xhr) {
        },
        success: function (result) {
            popupTool.closeLoading();
            $("#employeeTable").empty().html(result);
        }
    });
}

/**
 * 根据语音平台获取CTI工号列表(新增)
 */
userHandleTools.getCTINumList = userHandleTools.getCTINumList || function (platFormId, $select) {
    if(platFormId==""){
        $("<option value=''>请选择CTI工号</option>").appendTo($select);
        return;
    }
    jQuery.ajax({
        url: "/cfg/cfgUser/getCTINumsByPlatFormId/" + platFormId,
        type: "GET",
        cache: false,
        dataType: "json",
        beforeSend: function () {
            //$("#loadingModal").modal("show");
        },
        error: function (xhr) {
            $("#dangerModal").modal("show");
        },
        success: function (result) {
            if (result.success) {
                //$("#loadingModal").modal("hide");
                var CITNumArray = result.data;
                $("<option value=''>请选择CTI工号</option>").appendTo($select);
                for (var i = 0; i < CITNumArray.length; i++) {
                    var option = $("<option value=" + CITNumArray[i].key + ">" + CITNumArray[i].value + "</option>").appendTo($select);
                }
            } else {
                popupTool.error("", result.msg);
            }
        }
    });

};


/**
 * 根据语音平台获取CIT工号列表（修改）
 */
userHandleTools.getEditCTINumList = userHandleTools.getEditCTINumList || function (platFormId, $select) {
    if(platFormId==""){
        $("<option value=''>请选择CTI工号</option>").appendTo($select);
        return;
    }
    jQuery.ajax({
        url: "/cfg/cfgUser/getCTINumsByPlatFormId/" + platFormId,
        type: "GET",
        cache: false,
        dataType: "json",
        beforeSend: function () {
            //$("#loadingModal").modal("show");
        },
        error: function (xhr) {
            $("#dangerModal").modal("show");
        },
        success: function (result) {
            if (result.success) {
                //$("#loadingModal").modal("hide");
                var CITNumArray = result.data;
                $("<option value=''>请选择CTI工号</option>").appendTo($select);
                for (var i = 0; i < CITNumArray.length; i++) {
                    var option = $("<option value=" + CITNumArray[i].key + ">" + CITNumArray[i].value + "</option>").appendTo($select);
                }
                var platRemoveTR = $("#modifyvicPlatForm-table tr[id!='']:hidden");
                platRemoveTR.each(function (i) {
                        var platRemoveTD = $(this).children();
                        var platId = platRemoveTD.eq(0).attr("id");
                        if(platFormId==platId) {
                            var ctiId = platRemoveTD.eq(1).attr("id");
                            var ctiNo = platRemoveTD.eq(1).text();
                            $("<option value=" + ctiId + ">" + ctiNo + "</option>").appendTo($select);
                            return false;
                        }
                });
            } else {
                popupTool.error("", result.msg);
            }
        }
    });

};



/**
 * 绑定语音平台
 */
//var datas = new Array();  //语音平台数据全局变量
userHandleTools.bindPlatForm = userHandleTools.bindPlatForm || function (tabDiv,$tableId) {

    var platFormSelect = $("#"+tabDiv+" #platForm");
    var ctiNumSelect = $("#"+tabDiv+" #ctiNum");

    var platFormId = platFormSelect.val();
    if (platFormId === "") {
        popupTool.tip(" ", "请选择语言平台！");
        return;
    }
    var platFormName = platFormSelect.find("option:selected").text();
    if (ctiNumSelect.val() === "") {
        popupTool.tip(" ", "请选择需要绑定的CTI工号！");
        return;
    }
    var ctiID = ctiNumSelect.val();
    var ctiNum = ctiNumSelect.find("option:selected").text();
    var trVisible = $("#"+tabDiv+" tr:visible");
    if (trVisible.size() < 6) {
        //插入一条语音平台记录
        var innerHtml = "<tr id=''>" +
            "<td class='center'  id='" + platFormId + "' name='platFormName'>" + platFormName +
            "</td><td class='center' id='"+ctiID+"' name='ctiNum' >" + ctiNum + "</td>" +
            "<td class='center'><input type='hidden' name='relId' id='relId' value=''><input type='radio' name='isDefault' id='isDefault' value='1'></td>" +
            "<td class='center'><button class='btn btn-red btn-xs' id='removeBind_btn' type='button' onclick=removeBind('" + platFormId + "','" + platFormName + "',this)>" +
            "<i class='fa fa-trash-o'></i>解除绑定</button></td></tr>";

        $tableId.append(innerHtml);
        if(trVisible.size()===1) {
            $("#"+tabDiv+" tr:visible").eq(1).find("input:radio[name='isDefault']").attr("checked", true);//首次设置默认选中
        }
        platFormSelect.find("option:selected").remove(); //移除已绑定过的语音平台
        ctiNumSelect.find("option[value!='']").remove();  //清空CTI列表

    } else {
        popupTool.tip(" ", "每位员工最多允许绑定五个CTI工号！");
        return;
    }
}



/**
 * 解除绑定语音平台
 */
userHandleTools.removeBind = userHandleTools.removeBind || function (platFormId, platFormName,tabDiv,removeBtn) {
    var trId = $(removeBtn).parents("tr").attr("id");
    var platFormSelect = $("#"+tabDiv+" #platForm");
    var ctiNumSelect = $("#"+tabDiv+" #ctiNum");

    var option = $("<option>").val(platFormId).text(platFormName);
    platFormSelect.append(option);
    platFormSelect.find("option[val='']").attr("selected", true);
    ctiNumSelect.find("option[value!='']").remove();  //清空CTI列表
    if(trId==""){
        $(removeBtn).parents("tr").remove();//删除被选中行
    }else {
        $(removeBtn).parents("tr").css("display", "none"); //隐藏行
    }
}


/**
 * 新增用户确认提交
 * @type {Function|*}
 */
userHandleTools.addOk_btn = userHandleTools.addOk_btn || function () {
    var cfgUserVO = {};
    cfgUserVO.userCode = $("#addUserInfo_div #userCode").val();
    cfgUserVO.userName = $("#addUserInfo_div #userName").val();
    cfgUserVO.phone = $("#addUserInfo_div #phone").val();
    cfgUserVO.email = $("#addUserInfo_div #email").val();
    cfgUserVO.skillLevel = $("#addUserInfo_div #skillLevel").val();
    cfgUserVO.userOrgId = $("#addUserInfo_div #userOrgId").val();
    cfgUserVO.isOrgPic = $("#addUserInfo_div input[name=isOrgPic]:radio:checked").val();
    cfgUserVO.status = $("#addUserInfo_div input[name=status]:radio:checked").val();

//角色
    var relroleIdList = [];

    var u_roleIdChecked = $("#addUserInfo_div input[name=userRoleId]:checkbox:checked");
    u_roleIdChecked.each(function () {
        var relRole = {};
        relRole.roleId = $(this).val();
        relroleIdList.push(relRole);
    });
    cfgUserVO.relUserRoleList = relroleIdList;

//绑定的语音平台
    var relUserVicpformList = [];

    var platFormTR = $("#vicPlatForm-table tr:visible");
    platFormTR.each(function (i) {
        if (i > 0) {//表头剔除
            var platFormTD = $(this).children();
            var relUserPlatFormVo = {};
            relUserPlatFormVo.platformId = platFormTD.eq(0).attr("id");
            relUserPlatFormVo.platformName = platFormTD.eq(0).text();
            relUserPlatFormVo.ctiId = platFormTD.eq(1).attr("id");
            relUserPlatFormVo.ctiNo = platFormTD.eq(1).text();
            if (platFormTD.eq(2).find("input:radio[name='isDefault']:checked").val() == 1) {
                relUserPlatFormVo.isDefault = 1;
            } else {
                relUserPlatFormVo.isDefault = 0;
            }
            relUserVicpformList.push(relUserPlatFormVo);
        }
    });


    cfgUserVO.relUserVicpformVOList = relUserVicpformList;
    jQuery.ajax({
        url: "/cfg/cfgUser/createEmp",
        type: "POST",
        cache: false,
        async: false,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(cfgUserVO),
        beforeSend: function () {
            popupTool.openLoading("提交中，请稍后！！！");
        },
        error: function (xhr) {
        },
        success: function (result) {
            if (result.success) {
                popupTool.closeLoading();
                popupTool.success("提示",result.msg);
                reloadPage();
                $("#addUserModal").modal("hide");
            } else {
                popupTool.error("异常", result.msg);
            }
        }
    });

}

/**
 * 修改用户确认提交
 * @type {Function|*}
 */
userHandleTools.modifyOk_btn = userHandleTools.modifyOk_btn || function (id) {
    var cfgUserVO = {};
    cfgUserVO.id = id;
    var u_code = $("#modifyUserModal #userCode").val();
    cfgUserVO.userCode = u_code;
    cfgUserVO.userName = $("#modifyUserModal #userName").val();
    cfgUserVO.phone = $("#modifyUserModal #phone").val();
    cfgUserVO.email = $("#modifyUserModal #email").val();
    cfgUserVO.skillLevel = $("#modifyUserModal #skill_level").val();
    cfgUserVO.userOrgId = $("#modifyUserModal #userOrgId").val();
    cfgUserVO.isOrgPic = $("#modifyUserModal input[name=is_org_pic]:checked").val();
    cfgUserVO.status = $("#modifyUserModal input[name=status]:checked").val();

//角色
    var relroleIdList = [];

    var u_roleIdChecked = $("#modifyUserModal input[name=userRoleId]:checkbox:checked");
    u_roleIdChecked.each(function () {
        var relRole = {};
        relRole.id = $(this).attr("data-fld");
        relRole.roleId = $(this).val();
        relroleIdList.push(relRole);
    });
    cfgUserVO.relUserRoleList = relroleIdList;

//绑定的语音平台
    var relUserVicpformList = [];
    var platFormTR = $("#modifyvicPlatForm-table tr:visible");  //修改时新增 绑定的语音平台
    platFormTR.each(function (i) {
        if(i>0) {
            var platFormTD = $(this).children();
            var id = $(this).attr("id");
            var relUserPlatFormVo = {};
            relUserPlatFormVo.id = id;
            relUserPlatFormVo.platformId = platFormTD.eq(0).attr("id");
            relUserPlatFormVo.platformName = platFormTD.eq(0).text();
            relUserPlatFormVo.ctiId = platFormTD.eq(1).attr("id");
            relUserPlatFormVo.ctiNo = platFormTD.eq(1).text();
            if (platFormTD.eq(2).find("input:radio[name='isDefault']:checked").val() == 1) {
                relUserPlatFormVo.isDefault = 1;
            } else {
                relUserPlatFormVo.isDefault = 0;
            }
            relUserVicpformList.push(relUserPlatFormVo);
        }
    });
    var platRemoveTR = $("#modifyvicPlatForm-table tr[id!='']:hidden");  //需要移除的语音平台
    platRemoveTR.each(function (k) {
        //修改时移除是已绑定的
            var platRemoveTD = $(this).children();
            var relUserPlatFormVo = {};
            var id = $(this).attr("id");
            relUserPlatFormVo.id = id;
            relUserPlatFormVo.ctiId = platRemoveTD.eq(1).attr("id");
            relUserPlatFormVo.removeBindFlag = true; //移除
            relUserVicpformList.push(relUserPlatFormVo);
    });

    cfgUserVO.relUserVicpformVOList = relUserVicpformList;

    jQuery.ajax({
        url: "/cfg/cfgUser/modifyEmp",
        type: "POST",
        cache: false,
        async: false,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(cfgUserVO),
        beforeSend: function () {
            popupTool.openLoading("提交中，请稍后！！！");
        },
        error: function (xhr) {
        },
        success: function (result) {
            if (result.success) {
                popupTool.closeLoading();
                popupTool.success("提示",result.msg);
                reloadPage();
                $("#modifyUserModal").modal("hide");
            } else {
                popupTool.error("异常", result.msg);
                return;
            }
        }
    });
}



function reloadPage(){
    $.get("/cfg/cfgUser/queryEmp", function(result){
        $("#employeeTable").empty().html(result);
    });
}
