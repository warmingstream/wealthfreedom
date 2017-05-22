/**
 * Created by changjiang3 on 2016/4/15.
 */

var baseUrl;
var module;

//打开新增页面
function showAddModal(){
    _ajaxGet("showAddModal", "addModal");
}

//打开详细信息页面
function showDetailModal(id){
    _ajaxGet("showDetail?id="+id, "detailModal");
}

//获取数据，加载页面
function _ajaxGet(urlPart, modalId){
    $.get(baseUrl + urlPart, function(result){
        $("#" + modalId).empty().html(result);
    });
}

///////////////////////////////////

//新增数据，更新数据列表
function add(){
    _ajaxPost("add", "param-" + module + "-add");
    $('#addModal').modal('hide');
    $('#addModal').empty();
    query();
}

//校验新增数据
function safeAdd(){
    if(isValid(module + "AddForm")){
        add();
    }
}

//勾选单条数据，待批量删除
function sel(id){
    if($("#check_" + id).attr("checked")){
        $("#check_" + id).attr("checked", false);
    }else{
        $("#check_" + id).attr("checked", true);
    }
    var idSel = [];
    $("input[id^=check_]").each(function(){
        if($(this).attr("checked")){
            idSel.push($(this).val());
        }
    });
    $(".param-" + module + "-selBatch").val(idSel);
}

//勾选当前页全部数据，待批量删除
function selectAll(){
    var idSel = [];
    if($("#checkAll").attr("checked")){
        $("#checkAll").attr("checked", false);
        $("input[id^=check_]").each(function(){
            $(this).prop("checked", false);
        });
    }else{
        $("#checkAll").attr("checked", true);
        $("input[id^=check_]").each(function(){
            $(this).prop("checked", true);
            idSel.push($(this).val());
        });
    }
    $(".param-" + module + "-selBatch").val(idSel);
}

//批量删除，更新数据列表
function deleteItems(){
    _ajaxPost("deleteBatch", "param-" + module + "-selBatch");
    query();
}

//查询数据
function query(){
    _ajaxPost("list", "param-" + module + "-query", true);
}

//重置查询条件
function resetQuery(){
    $(".param-" + module + "-query").each(function(){
        $(this).val('');
    });
}

//校验查询条件
function safeQuery(){
    if(isValid(module + "IndexForm")){
        query();
    }
}

//提交数据
function _ajaxPost(urlPart, classId, isQuery, callback){
    var isQuery = isQuery || false;
    jQuery.ajax({
        url: baseUrl + urlPart,
        type: "post",
        cache: false,
        async: false,
        dataType: isQuery ? "html" : "json",
        data: $("."+classId).serialize(),
        success: function (result) {
            if(isQuery){
                $("#mySimpleTable").empty().html(result);
            }else{
                if(result.success){
                    if(result.msg){
                        alert(result.msg);
                        //popupTool.success("",result.msg);
                    }
                    if(callback && callback instanceof Function){
                        callback(result.data);
                    }
                }else{
                    alert(result.msg);
                    //popupTool.error("",result.msg);
                }
            }
        }
    });
}

//////////////////////////////

//设置数据列表页面翻页
function setSimpleTable(pageNumber, pageSize){
    window.simpleTable =new SimpleTable({
        container : 'mySimpleTable',
        pageNumber : pageNumber,
        pageSize : pageSize,
        url: baseUrl + "list",
        httpMethod : 'POST',
        parameters: $(".param-" + module + "-query").serialize()
    });
}




