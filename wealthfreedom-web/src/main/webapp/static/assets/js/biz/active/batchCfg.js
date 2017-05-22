/**
 * Created by changjiang3 on 2016/4/22.
 */

function showBatchCfgModal(id, name){
    _ajaxGet("batchCfg?id="+id+"&name="+name, "batchCfgModal");
}

function queryBatchToBind(){
    jQuery.ajax({
        url: baseUrl + "batchCfg/unBind/list",
        type: "post",
        cache: false,
        async: false,
        dataType: "html",
        data: $(".param-listBatch-query").serialize(),
        success: function (result) {
            $("#batchUnbindSimpleTable").empty().html(result);
        }
    });
}

function safeQueryBatchToBind(){
    if(isValid('unBindBatchIndexForm')){
        queryBatchToBind();
    }
}

function selectBatch(param){
    var params = param.split("_");
    $("#batchId").val(params[0]);
    $("#batchSysVersion").val(params[1]);
}

function bindBatch(){
    if("" == $("#batchId").val()){
        alert('请选择要绑定的批次');
        return;
    }
    jQuery.ajax({
        url: baseUrl + "batchCfg/unBind/bindBatch",
        type: "post",
        cache: false,
        async: false,
        dataType: "json",
        data: $(".param-listBatch-bind").serialize(),
        success: function (result) {
            if(result.msg){
                alert(result.msg);
            }
            $("#batchCfgModal").modal('hide');
            $("#batchCfgModal").empty();
        }
    });
}