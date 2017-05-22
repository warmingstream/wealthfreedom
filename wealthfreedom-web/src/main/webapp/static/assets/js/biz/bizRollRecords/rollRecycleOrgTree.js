var BizRollRecords={};

BizRollRecords.loadOrgTree=function(){
    var setting = {
        async:{
            enable:true,//异步处理
            url:'/biz/bizRollRecords/getOrgTree',//异步获取json格式数据的路径
            otherParam:[],
            type:"post",
            dataFilter: BizRollRecords.dataFilter
        },
        check:{
            enable: true,//设置 zTree 的节点上是否显示 checkbox / radio ,默认为false
            //chkStyle: 'checkbox', //指定勾选框类型为checkbox(setting.check.enable=true时生效)
            //chkDisabledInherit: true,
            //autoCheckTrigger: true
            chkboxType: { "Y": "s", "N": "s" }  //checkbox 勾选操作，影响包含子级节点；取消勾选操作，只影响子级节点
        },
        view : {
            showIcon: true,
            showTitle : true,
            selectedMulti: true
        },
        data:{
            key:{
                name:"orgName"
            },
            simpleData: {//如果设置为 true，请务必设置 setting.data.simpleData 内的其他参数: idKey / pIdKey / rootPId,并且让数据满足父子关系
                enable: true,//true / false 分别表示 使用 / 不使用 简单数据模式
                idKey:"id",
                pIdKey:"superId",
                rootPId:1
            }
        },
        callback: {
            onClick: loadRecycleList,
            onCheck: zTreeOnCheck
        }
    };
    $.fn.zTree.init($("#bizRollOrgTree"), setting, null);//实例化后直接返回树对象
}

/**
 * 请求回来的数据过滤转换
 * @param treeId
 * @param parentNode
 * @param childNodes
 * @return {*}
 */
BizRollRecords.dataFilter = function(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    var data = childNodes;
    //构造root节点
    var nodes;
    if (!data.success || data.data.length == 0){
        nodes = [];
    }else{
        nodes = data.data;
    }
    return nodes;
}

/**
 * 加载机构下全部坐席列表
 */
function loadRecycleList(e, treeId, treeNode){
    var orgId = treeNode.id;
    $("#recycleConfirm_btn").css('display', '');
    $("#recycleConfirmOrg_btn").css('display', 'none');
    var treeObj = $.fn.zTree.getZTreeObj("bizRollOrgTree");
    var nodes = treeObj.getCheckedNodes(true);
    for (var i=0, l=nodes.length; i < l; i++) {
        treeObj.checkNode(nodes[i], false, false);
    }
    $.get("/biz/bizRoll/loadRecycleList?orgId="+orgId+"&bizRollRecordsId="+$("#rollRecycleModel_bizRollRecordsId").val(), function(result){
        $("#recycleItemsTableDiv").empty().html(result);
    });
}


function zTreeOnCheck(event, treeId, treeNode) {
    $("#recycleItemsTableDiv").empty().html("");
    $("#recycleConfirm_btn").css('display', 'none');
    $("#recycleConfirmOrg_btn").css('display', '');
    var orgId = treeNode.id;

    var treeObj = $.fn.zTree.getZTreeObj("bizRollOrgTree");
    var nodes = treeObj.getCheckedNodes(true);

    var recycleOrgArray = [];
    for(var i=0; i<nodes.length; i++){
        var tmpNode = nodes[i];
        recycleOrgArray.push(tmpNode.id);
    }
    if(recycleOrgArray.length>0){
        $.get("/biz/bizRoll/showOrgList?recycleOrgArray="+recycleOrgArray.join(",")+"&bizRollRecordsId="+$("#rollRecycleModel_bizRollRecordsId").val(), function(result){
            $("#recycleItemsTableDiv").empty().html(result);
        });
    }
};

