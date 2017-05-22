/**
 * 对外公开的公共机构选择树
 */

var publicOrgTree = {}

publicOrgTree.onBodyDown = function onBodyDown(event) {
    if (!(event.target.id == "publicOrgTree" ||
        jQuery(event.target).parents("#publicOrgTree").length > 0)) {
        publicOrgTree.hideOrgTree();
    }
}

publicOrgTree.hideOrgTree = function () {
    jQuery("#publicOrgTree").fadeOut("fast");
    jQuery("body").unbind("mousedown", publicOrgTree.onBodyDown);
}

publicOrgTree.dataFilter = function (treeId, parentNode, childNodes) {
    var orgChildNodesData = childNodes;
    var orgTreeNodes;
    if (!orgChildNodesData || !orgChildNodesData.success || orgChildNodesData.data.length == 0) {
        orgTreeNodes = [];
    } else {
        orgTreeNodes = orgChildNodesData.data;
    }
    // var rootNode = {id: -1, orgName: "机构", open: true, isParent: true};
    // orgTreeNodes.push(rootNode);
    return orgTreeNodes;
}

publicOrgTree.orgTreeNodeClick = function (e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("orgTree"),
        nodes = zTree.getSelectedNodes(),
        orgName = "",
        orgIdPath = "",
        orgId = "";
    for (var i = 0, l = nodes.length; i < l; i++) {
        orgName = nodes[i].orgName;
        orgIdPath = nodes[i].orgIdPath;
        orgId = nodes[i].id;
    }
    $("#fetchOrg").val(orgName);
    $("#orgIdPath").val(orgIdPath);
    $("#orgId").val(orgId);
    publicOrgTree.hideOrgTree();
}
publicOrgTree.loadOrgTree = function (orgId) {
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
            onClick: publicOrgTree.orgTreeNodeClick
        }
    };
    $.fn.zTree.init($("#publicOrgTree #orgTree"), setting, null);//实例化后直接返回树对象
}

/**
 * 初始化机构树
 * 参数：orgId  父节点
 * 如果需要展示全部树结构，orgId设置为-1
 */
publicOrgTree.initOrgTree = function (orgId) {
    if (orgId == null || orgId == undefined) {
        return;
    }
    publicOrgTree.loadOrgTree(orgId);
}

publicOrgTree.showOrgTree = function () {
    jQuery("#publicOrgTree").slideDown("fast");
    jQuery("body").bind("mousedown", publicOrgTree.onBodyDown);
}