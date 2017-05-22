/**
 * 对外公开的公共机构选择树
 */

var userOrgTree = {}
var modalId;
userOrgTree.onBodyDown = function onBodyDown(event) {
    if (!(event.target.id == "userOrgTree" ||
        jQuery(event.target).parents("#"+modalId+" #userOrgTree").length > 0)) {
        userOrgTree.hideOrgTree(modalId);
    }
}

userOrgTree.hideOrgTree = function () {
    jQuery("#"+modalId+" #userOrgTree").fadeOut("fast");
    jQuery("body").unbind("mousedown", userOrgTree.onBodyDown);
}

userOrgTree.orgTreeNodeClick = function (e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("orgTree"),
        nodes = zTree.getSelectedNodes(),
        orgName = nodes[0].orgName,
        orgId = treeNode.id;
    $("#"+modalId+" #userOrgName").val(orgName);
    $("#"+modalId+" #userOrgId").val(orgId);
    userOrgTree.hideOrgTree();
}


userOrgTree.loadOrgTree = function (orgId) {
    if (orgId == null || orgId == undefined) {
        return;
    }
    var setting = {
        async: {
            enable: true,//异步处理
            url: '/cfg/cfgOrg/getOrgTree?id=' + orgId,//异步获取json格式数据的路径
            autoParam: ["id"],
            type: "get",
            dataFilter: publicOrgTree.dataFilter
        },
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
            onClick: userOrgTree.orgTreeNodeClick
        }
    };
    $.fn.zTree.init($("#"+modalId+" #orgTree"), setting, null);//实例化后直接返回树对象
}

/**
 * 初始化机构树
 * 参数：orgId  父节点
 * 如果需要展示全部树结构，orgId设置为-1
 */
userOrgTree.initOrgTree = function (orgId,newModalId) {
    if (orgId == null || orgId == undefined) {
        return;
    }
    modalId = newModalId;  //设置当前弹出窗Id
    userOrgTree.loadOrgTree(orgId);
}


userOrgTree.showOrgTree = function () {
    jQuery("#"+modalId+" #userOrgTree").slideDown("fast");
    jQuery("body").bind("mousedown", userOrgTree.onBodyDown);
}