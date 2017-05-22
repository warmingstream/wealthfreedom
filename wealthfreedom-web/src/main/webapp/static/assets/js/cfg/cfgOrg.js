var CfgOrg = {};

CfgOrg.loadOrgTree = function () {
    var setting = {
        async: {
            enable: true,//异步处理
            url: '/cfg/cfgOrg/getOrgTree',//异步获取json格式数据的路径
            autoParam: ["id"],
            otherParam: { "onlyChildNode" : true},
            type: "get",
            dataFilter: CfgOrg.dataFilter
        },
        /*check:{
         enable: true,//设置 zTree 的节点上是否显示 checkbox / radio ,默认为false
         //chkStyle: 'checkbox', //指定勾选框类型为checkbox(setting.check.enable=true时生效)
         chkDisabledInherit: true,
         autoCheckTrigger: true
         },*/
        view: {
            showIcon: true,
            showTitle: true,
            selectedMulti: false
        },
        data: {
            key: {
                name: "orgName"
            },
            simpleData: {//如果设置为 true，请务必设置 setting.data.simpleData 内的其他参数: idKey / pIdKey / rootPId,并且让数据满足父子关系
                enable: true,//true / false 分别表示 使用 / 不使用 简单数据模式
                idKey: "id",
                pIdKey: "superId",
                rootPId: -1
            }
        },
        callback: {
            onClick: CfgOrg.orgTreeNodeClick
        }
    };
    $.fn.zTree.init($("#tenant_org_div #orgTree"), setting, null);//实例化后直接返回树对象
}

/**
 * 请求回来的数据过滤转换
 * @param treeId
 * @param parentNode
 * @param childNodes
 * @return {*}
 */
CfgOrg.dataFilter = function (treeId, parentNode, childNodes) {
    var orgChildNodesData = childNodes;
    var orgTreeNodes;
    if (!orgChildNodesData || !orgChildNodesData.success || orgChildNodesData.data.length == 0) {
        orgTreeNodes = [];
    } else {
        orgTreeNodes = orgChildNodesData.data;
    }
    /* 改成后台处理
    var rootNode = {id: -1, orgName: "机构", open: true, isParent: true};
    orgTreeNodes.push(rootNode);
    */
    return orgTreeNodes;
}
/**
 * 机构树节点点击时，加载机构基本信息
 * @param e
 * @param treeId
 * @param treeNode
 */
CfgOrg.orgTreeNodeClick = function(e, treeId, treeNode){
    if(treeNode == null || treeNode.id == undefined){
        return;
    }
    // 展示机构基本信息
    CfgOrg.showOrgBaseInfoById(treeNode.id);

    // 如果为顶级虚拟节点，则直接清空机构用户显示区域内的信息，不再请求机构用户列表
    if(treeNode.id == -1){
        jQuery("#orgUserListDiv").empty();
        return;
    }
    // 加载机构用户列表
    CfgOrg.showOrgUserList(treeNode.id);
}

/**
 * 删除指定机构节点
 * @param orgId
 * @param orgName
 */
CfgOrg.deleteOrgById = function(orgId,orgName){
    if(orgId == null || orgId == undefined){
        return;
    }
    jQuery("#deleteOrgByIdBtn").attr("disabled",true);

    var confirmResult = confirm("确定要删除机构【" + orgName + "】？");

    if(confirmResult == false){
        jQuery("#deleteOrgByIdBtn").attr("disabled",false);
        return;
    }

    jQuery.ajax({
        url:"/cfg/cfgOrg/deleteOrgById/" + orgId,
        type:"POST",
        cache:false,
        success:function(responseJson){
            if(responseJson.success){
                popupTool.success("机构维护",responseJson.msg);
                // 机构删除成功后，需要执行以下操作
                // 1.清空机构用户列表展示区域内容
                jQuery("#orgUserListDiv").empty();
                // 2.禁用机构用户添加按钮
                jQuery("#showAddOrgUserBtn").attr("disabled",true);
                // 3.禁用下级机构添加按钮
                jQuery("#showAddSubOrgBtn").attr("disabled",true);
                // 4.禁用机构信息修改按钮
                jQuery("#showModifyOrgBaseInfoBtn").attr("disabled",true);
            }else{
                popupTool.error("机构维护",responseJson.msg);
                jQuery("#deleteOrgByIdBtn").attr("disabled",false);
            }
        },
        error:function(){
            jQuery("#deleteOrgByIdBtn").attr("disabled",false);
        }
    });
}

/**
 * 展示机构详细信息
 * @param e
 * @param treeId
 * @param treeNode
 */
CfgOrg.showOrgBaseInfoById = function(orgId){
    jQuery.ajax({
        url:"/cfg/cfgOrg/getOrgBaseInfo/" + orgId,
        type:"get",
        success:function(responseText){
            jQuery("#orgBaseInfoDiv").empty().append(responseText);
        },
        error:function(){

        }
    });
}
/**
 * 验证机构基本信息
 * @param orgName
 * @param orgCode
 * @param serviceCode
 * @returns {boolean}
 */
CfgOrg.validateOrgBaseInfoData = function(orgName,orgCode,serviceCode){
    var orgNameReg = /[^a-zA-Z\u4E00-\u9FA50-9-_\(\)]/g;
    var orgCodeReg = /[^a-zA-Z0-9]/g;
    var serviceCodeReg = /[^a-zA-Z0-9-_\(\)]/g;
    // orgName 必填，并且填写字符有规则限制:最大长度14个中文汉字，仅允许输入汉字、大小写英文字母，数字以及“-“，”_“,”(”,”)”等符号
    if(orgName == "" || orgName.match(orgNameReg) != null){
        popupTool.warning("错误","机构名称不能为空,且只能是中文、大小写英文字母、数字以及“-“、”_“、”(”、”)”等符号！");
        jQuery("#saveNewSubOrgBtn").attr("disabled",false);
        return false;
    }
    if(orgName.length > 30){
        popupTool.warning("错误","机构名称最大长度30个字符");
        jQuery("#saveNewSubOrgBtn").attr("disabled",false);
        return false;
    }

    // orgCode 必填，并且填写字符有规则限制 : 最大长度18个字符，允许输入大小写英文字母以及数字
    if(orgCode == "" || orgCode.match(orgCodeReg) != null){
        popupTool.warning("错误","机构代码不能为空,且只能是大小写英文字母、数字！");
        jQuery("#saveNewSubOrgBtn").attr("disabled",false);
        return false;
    }
    if(orgCode.length > 40){
        popupTool.warning("错误","机构代码最大长度40个字符");
        jQuery("#saveNewSubOrgBtn").attr("disabled",false);
        return false;
    }
    // serviceCode 非必填，并且填写字符有规则限制 : 允许输入大小写英文字母，数字以及“-“，”_“,”(”,”)”等符号
    if(serviceCode != "" && serviceCode.match(serviceCodeReg) != null){
        popupTool.warning("错误","服务机构代码只能是大小写英文字母、数字以及“-“、”_“、”(”、”)”等符号！");
        jQuery("#saveNewSubOrgBtn").attr("disabled",false);
        return false;
    }
    if(serviceCode.length > 50){
        popupTool.warning("错误","服务机构代码最大长度50个字符");
        jQuery("#saveNewSubOrgBtn").attr("disabled",false);
        return false;
    }
    return true;
}

/**
 * 展示修改机构信息页面
 * @param e
 * @param treeId
 * @param treeNode
 */
CfgOrg.showModifyOrgBaseInfo = function(orgId){
    if(orgId == null || orgId == undefined){
        return;
    }
    jQuery.ajax({
        url:"/cfg/cfgOrg/showModifyOrgBaseInfo/" + orgId,
        type:"get",
        cache:false,
        success:function(responseText){
            jQuery("#modalDiv").empty().append(responseText);
        },
        error:function(){

        }
    });
}

/**
 * 提交保存修改机构信息
 * @returns {boolean}
 */
CfgOrg.saveModifyOrgBaseInfo = function(){
    jQuery("#saveModifyOrgBaseInfo_btn").attr("disabled",true);

    var orgName = jQuery.trim(jQuery("#orgName").val());
    var orgCode = jQuery.trim(jQuery("#orgCode").val());
    var serviceCode = jQuery.trim(jQuery("#serviceCode").val());

    if(CfgOrg.validateOrgBaseInfoData(orgName,orgCode,serviceCode) == false){
        return false;
    }

    jQuery.ajax({
        url:"/cfg/cfgOrg/saveModifyOrgBaseInfo",
        type:"POST",
        cache:false,
        data:{id:jQuery("#orgId").val(),orgName:orgName,orgCode:orgCode,serviceCode:serviceCode,sysVersion:jQuery("#sysVersion").val()},
        dataType:"json",
        success:function(responseJson){
            if(responseJson.success){
                popupTool.success("修改机构","保存成功");
                CfgOrg.showOrgBaseInfoById(jQuery("#orgId").val());
                //刷新修改的节点
                var orgTreeObj = $.fn.zTree.getZTreeObj("orgTree");
                var currentOrgTreeNode = orgTreeObj.getNodeByParam("id",jQuery("#orgId").val());
                if(currentOrgTreeNode != null && currentOrgTreeNode != undefined){
                    currentOrgTreeNode.orgName = orgName;
                    orgTreeObj.updateNode(currentOrgTreeNode);
                }
            }else{
                popupTool.error("修改机构",responseJson.msg);
                jQuery("#saveModifyOrgBaseInfo_btn").attr("disabled",false);
            }
        },
        error:function(){
            popupTool.error("修改机构","保存失败");
            jQuery("#saveModifyOrgBaseInfo_btn").attr("disabled",false);
        }
    });
}


/**
 * 展示新增下级机构页面
 * @param e
 * @param treeId
 * @param treeNode
 */
CfgOrg.showAddSubOrg = function(superOrgId){
    if(superOrgId == null || superOrgId == undefined){
        return;
    }
    jQuery.ajax({
        url:"/cfg/cfgOrg/showAddSubOrg/" + superOrgId,
        type:"get",
        cache:false,
        success:function(responseText){
            jQuery("#modalDiv").empty().append(responseText);
        },
        error:function(){

        }
    });
}
/**
 * 提交保存新增下级机构
 * @returns {boolean}
 */
CfgOrg.saveNewSubOrg = function(){
    jQuery("#saveNewSubOrgBtn").attr("disabled",true);

    var orgName = jQuery.trim(jQuery("#orgName").val());
    var orgCode = jQuery.trim(jQuery("#orgCode").val());
    var serviceCode = jQuery.trim(jQuery("#serviceCode").val());

    if(CfgOrg.validateOrgBaseInfoData(orgName,orgCode,serviceCode) == false){
        return false;
    }

    jQuery.ajax({
        url:"/cfg/cfgOrg/saveNewSubOrg",
        type:"POST",
        cache:false,
        data:{orgName:orgName,orgCode:orgCode,serviceCode:serviceCode,superId:jQuery("#superId").val()},
        dataType:"json",
        success:function(responseJson){
            if(responseJson.success){
                popupTool.success("新增机构","保存成功");
                //异步局部刷新树
                var orgTreeObj = $.fn.zTree.getZTreeObj("orgTree");
                var superOrgId = jQuery("#superId").val();
                var superOrgTreeNode = orgTreeObj.getNodeByParam("id",superOrgId,null);
                if(superOrgTreeNode != null && superOrgTreeNode != undefined && superOrgId != -1){
                    orgTreeObj.reAsyncChildNodes(superOrgTreeNode, "refresh",false);
                }else{
                    orgTreeObj.reAsyncChildNodes(null, "refresh",false);
                }
            }else{
                popupTool.error("新增机构",responseJson.msg);
                jQuery("#saveNewSubOrgBtn").attr("disabled",false);
            }
        },
        error:function(){
            popupTool.error("新增机构","保存失败");
            jQuery("#saveNewSubOrgBtn").attr("disabled",false);
        }
    });
}

/////////////////////////////////////////  机构用户维护  ////////////////////////////////

/**
 * 加载机构人员列表信息
 * @param e
 * @param treeId
 * @param treeNode
 */
CfgOrg.showOrgUserList = function(orgId){
    if(orgId == null || orgId == undefined){
        return;
    }

    jQuery.ajax({
        url:"/cfg/cfgOrg/showOrgUserList" ,
        type:"get",
        cache:false,
        data:{orgId:orgId,page:0,size:10},
        success:function(responseText){
            jQuery("#orgUserListDiv").empty().append(responseText);
        },
        error:function(){

        }
    });
}
/**
 * 删除指定机构用户
 * @param orgUserId
 */
CfgOrg.deleteOrgUser = function(orgUserId,orgId,userId,userName,relSysVersion){
    if(orgUserId == null || orgUserId == undefined){
        return;
    }

    var confirmResult = confirm("确定要移出" + userName + "?");

    if(confirmResult == false){
        return;
    }

    jQuery.ajax({
        url:"/cfg/cfgOrg/deleteOrgUser" ,
        type:"POST",
        cache:false,
        data:{relOrgUserId:orgUserId,orgId:orgId,userId:userId,relSysVersion:relSysVersion},
        success:function(responseJson){
            if(responseJson.success){
                popupTool.success("机构用户修改",responseJson.msg);
                // 重新加载机构用户列表
                CfgOrg.showOrgUserList(jQuery("#orgId").val());
            }else{
                popupTool.error("机构用户修改",responseJson.msg);
            }
        },
        error:function(){
            popupTool.error("机构用户修改","机构用户移出失败，请重试");
        }
    });


}

/**
 * 加载机构用户添加页眉
 * @param orgId
 */
CfgOrg.showAddOrgUser = function(orgId){
    if(orgId == null || orgId == undefined){
        return;
    }
    jQuery.ajax({
        url:"/cfg/cfgOrg/showAddOrgUser/" + orgId,
        type:"get",
        cache:false,
        success:function(responseText){
            jQuery("#modalDiv").empty().append(responseText);
        },
        error:function(){

        }
    });
}

/**
 * 查询不在本机构下人员列表
 * @param orgId
 */
CfgOrg.searchNotInOrgUserList = function(){
    var orgId = jQuery("#orgId").val();
    var userCode = jQuery.trim(jQuery("#userCode").val());
    var userName = jQuery.trim(jQuery("#userName").val());
    var userCreateTimeBegin = jQuery.trim(jQuery("#userCreateTimeBegin").val());
    if(orgId == null || orgId == undefined){
        return;
    }
    jQuery.ajax({
        url:"/cfg/cfgOrg/searchNotInOrgUserList",
        type:"get",
        cache:false,
        data:{orgId:orgId,userCode:userCode,userName:userName,userCreateTimeBeginString:userCreateTimeBegin},
        success:function(responseText){
            jQuery("#userSearchResult").empty().append(responseText);
        },
        error:function(){

        }
    });
}

/**
 * 批量选中用户，并且添加到机构中
 */
CfgOrg.batchAddOrgUser = function(){
    var userArray = [];
    jQuery("#notInOrgUserList input[name=user_checkbox]:checkbox:checked").each(function(){
        userArray.push(jQuery(this).val());
    });
    if (userArray.length <= 0) {
        popupTool.tip("提示", "请选择要添加的用户！");
        return;
    }

    jQuery.ajax({
        url: "/cfg/cfgOrg/batchAddOrgUser",
        type: "POST",
        cache: false,
        dataType: "json",
        async: false,
        data: {userArray:userArray.join(","),orgId:jQuery("#orgId").val()},
        beforeSend: function () { },
        error: function (xhr) { },
        success: function (responseJson) {
            if(responseJson.success){
                if(responseJson.msg){
                    popupTool.success("",responseJson.msg);
                    // 重新加载机构用户列表
                    CfgOrg.showOrgUserList(jQuery("#orgId").val());
                }
                userHandleTools.queryUserList();
            }else{
                popupTool.error("",responseJson.msg);
            }
        }
    });
}