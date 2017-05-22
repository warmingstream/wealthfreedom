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
        /*check:{
            enable: true,//设置 zTree 的节点上是否显示 checkbox / radio ,默认为false
            //chkStyle: 'checkbox', //指定勾选框类型为checkbox(setting.check.enable=true时生效)
            chkDisabledInherit: true,
            autoCheckTrigger: true
        },*/
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
            onClick: loadAllotModelByType
        }
    };
    $.fn.zTree.init($("#bizRecordsOrgTree"), setting, null);//实例化后直接返回树对象
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
 * 根据不同的分配方式加载不同的分配页面
 * @param e
 * @param treeId
 * @param treeNode
 */
function loadAllotModelByType(e, treeId, treeNode) {
    console.log(treeNode);
    //获取分配维度
    var allotDimension = $("input[type=radio][name=allotDimension]").val();
    loadAllotDimensionUser(treeNode.id);
    // if(allotDimension==1){//按照机构维度分配
    //     loadAllotDimensionOrg()
    // }else if(allotDimension==2){//按照坐席维度分配
    //     if(treeNode.orgLevel==3){
    //         loadAllotDimensionUser(treeNode.id);
    //     }else{
    //         return false;
    //     }
    // }
}
/**
 * 加载机构维度分配(二期开发)
 */
function loadAllotDimensionOrg(){
   return false;
}

/**
 * 加载坐席维度分配
 */
function loadAllotDimensionUser(orgId){
    $.get("/biz/bizRollRecords/loadAllotDimensionUser?orgId="+orgId+"&bizRollRecordsId="+$("#bizRollRecordsAllotModel_bizRollRecordsId").val(), function(result){
        $("#allotItemsTableDiv").empty().html(result);
    });
}