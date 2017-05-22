/**
 * Created by songyang10 on 2016/4/8.
 */


//过滤节点的机制 直接return node表示不做任何过滤
function filter(node) {
    return node;
}


//设置zTree的所有节点的checkbox都是只读的
function disabledTree() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    //根据过滤机制获得zTree的所有节点
    var nodes = zTree.getNodesByFilter(filter);

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        node.chkDisabled = true; //表示checkbox只读
        zTree.updateNode(node);
    }
}

//设置zTree的所有节点的checkbox都是可勾选的
function abledTree() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    //根据过滤机制获得zTree的所有节点
    var nodes = zTree.getNodesByFilter(filter);

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        node.chkDisabled = false; //表示checkbox可勾选
        zTree.updateNode(node);
    }
}
/**
 * 添加角色页面初始化
 */
function initAdd(){
    jQuery.ajax({
        url: "/cfg/cfgMenu/menuZTree",
        type: "post",
        cache: false,
        dataType: "json",
        data: { },
        beforeSend: function () {},
        error: function (xhr) {
            popupTool.error("系统异常！");
            cancel();
        },
        success: function (result) {
            if (result.success){
                var setting = {
                    view: {
                        selectedMulti: false
                    },
                    check: {
                        enable: true
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    }
                };
                var zNodes = result.data;
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                $("#cancelBtn").bind("click", cancel);
                $("#okBtn").bind("click", save);
            }else{
                popupTool.error("系统异常！");
                cancel();
            }
        }
    });
}

/**
 * 编辑角色页面初始化
 */
function initEdit(id){
    jQuery.ajax({
        url: "/cfg/cfgMenu/menuZTreeByRoleId",
        type: "post",
        cache: false,
        dataType: "json",
        data: {
            roleId : id
        },
        beforeSend: function () {},
        error: function (xhr) {
            popupTool.error("系统异常！");
            cancel();
        },
        success: function (result) {
            if (result.success){
                var setting = {
                    view: {
                        selectedMulti: false
                    },
                    check: {
                        enable: true
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    }
                };
                var zNodes = result.data;
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                //初始化原始菜单id，用于修改是做判断，是否修改了菜单权限
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                var nodes = zTree.getCheckedNodes();
                for(var i=0; i<nodes.length; i++){
                    var tmpNode = nodes[i];
                    if(i!=nodes.length-1){
                        oldIds += tmpNode.id+",";
                    }else{
                        oldIds += tmpNode.id;
                    }
                }


                disabledTree();
                $("#disabledAllTrue").bind("click", disabledTree);
                $("#disabledAllFalse").bind("click", abledTree);


                $('#disabledAllFalse').click(function(){
                    $('.btnBar').show();
                });

                $("#disabledAllTrue").click(function(){
                    $('.btnBar').hide();
                })

                //点击'编辑'按钮，显示编辑角色信息
                $('#editBtn').click(function(){
                    $('#viewBox').hide();
                    $('#editBox').show();
                });
                $('#okBtn1').click(function(){
                    $('#viewBox').show();
                    $('#editBox').hide();
                    save();
                });
                $("#cancelBtn").bind("click", cancel);
                $("#okBtn").bind("click", save);
            }else{
                popupTool.error("系统异常！");
                cancel();
            }
        }
    });
}

/**
 * 取消方法，返回列表页
 */
function cancel(){
    $.get("/cfg/cfgRole/index", function(result){
        $(".container-box").empty().html(result);
    });
}
/**
 * 保存角色信息
 * @returns {boolean}
 */
function save(){
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    var reg = /[^a-zA-Z\u4E00-\u9FA50-9\-\_\(\)]/g;
    var name = $("#name").val();
    if(name == "" || name.match(reg) != null){
        popupTool.warning("角色名称不能为空,且只能是中文、大小写英文字母、数字以及“-“，”_“,”(”,”)”。！");
        return false;
    }
    var nodes = zTree.getCheckedNodes();
    var ids = "";
    for(var i=0; i<nodes.length; i++){
        var tmpNode = nodes[i];
        if(i!=nodes.length-1){
            ids += tmpNode.id+",";
        }else{
            ids += tmpNode.id;
        }
    }

    var id = $("#id").val();
    //如果名称和菜单id都没有变化则不进行更新
    if(name == oldName && ids == oldIds){
        popupTool.success("保存成功！");
        cancel();
        return;
    }else{
        //没有变化则置为空，后台不做更新处理
        if(name == oldName){
            name = "";
        }
        if(ids == oldIds){
            ids = "";
        }
        jQuery.ajax({
            url: "/cfg/cfgRole/saveCfgRole",
            type: "post",
            cache: false,
            dataType: "json",
            data: {
                id : id,
                name : name,
                menuIds : ids
            },
            beforeSend: function () {

            },
            error: function (xhr) {
                popupTool.error("系统异常！");
                cancel();
            },
            success: function (result) {
                if (result.success){
                    popupTool.success("保存成功！");
                    cancel();
                }else{
                    popupTool.error(result.msg);
                }
            }
        });
    }
}
/**
 * 搜索
 */
function query(){
    jQuery.ajax({
        url: "/cfg/cfgRole/cfgRoleTable",
        type: "post",
        cache: false,
        dataType: "html",
        data: {
            name:$("#name").val(),
            createUser:$("#createUser").val(),
            createTimeBeginString:$("#createTimeBegin").val(),
            createTimeEndString:$("#createTimeEnd").val()
        },
        beforeSend: function () {

        },
        error: function (xhr) {

        },
        success: function (result) {
            $("#cfgRoleTable").empty().html(result);
        }
    });
}
/**
 * 重置搜索条件
 */
function resetForm(){
    $("#name").val("");
    $("#createUser").val("");
    $("#createTimeBegin").val("");
    $("#createTimeEnd").val("");
}
/**
 * 删除角色
 * @param id
 */
function del(id){
    jQuery.ajax({
        url: "/cfg/cfgRole/delCfgRole",
        type: "post",
        cache: false,
        dataType: "json",
        data: {
            id:id
        },
        beforeSend: function () {
            popupTool.openLoading();
        },
        error: function (xhr) {
            popupTool.closeLoading();
            popupTool.error("操作失败","删除异常！");
        },
        success: function (result) {
            popupTool.closeLoading();
            if(result.success){
                popupTool.success("操作成功！");
            }else{
                popupTool.error("操作失败", result.msg);
            }
            cancel();
        }
    });
}

/**
 * 打开新增角色页面
 */
function showAddCfgRole(){
    $.get("/cfg/cfgRole/addCfgRole", function(result){
        $(".container-box").empty().html(result);
    });
}
/**
 * 打开编辑角色页面
 */
function showEditCfgRole(id){
    $.get("/cfg/cfgRole/editCfgRole?id="+id, function(result){
        $(".container-box").empty().html(result);
    });
}