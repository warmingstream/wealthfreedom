/**
 * Created by changjiang3 on 2016/4/21.
 */

function showGoodsCfgModal(id){
    $.get(baseUrl + "goodsCfg?id="+id, function(result){
        if(result.data > 0){
            _ajaxGet("goodsCfg/hasBind/index?id="+id, "goodsHasBindModal");
            $("#goodsHasBindModal").modal('show');
        }else{
            _ajaxGet("goodsCfg/unBind/index?id="+id, "goodsUnBindModal");
            $("#goodsUnBindModal").modal('show');
        }
    });
}

function closeGoodsUnbindModal(){
    var boundChange = $("#boundChanged").val();
    $("#goodsUnBindModal").modal('hide');
    $("#goodsUnBindModal").empty();
    if('false' == $("#goodsHasBindModal").attr('aria-hidden') && '1' == boundChange){
        queryBoundGoods();
    }
}
function closeGoodsBoundModal(){
    $("#goodsHasBindModal").modal('hide');
    $("#goodsHasBindModal").empty();
}
function toBindGoods(id){
    _ajaxGet("goodsCfg/unBind/index?id="+id, "goodsUnBindModal");
}
function viewGoodsDetail_hasBind(sku){
    _ajaxGet("goodsCfg/viewGoodsDetail?sku="+sku, "goodsDetailModal");
}
function viewGoodsDetail_unBind(sku){
    _ajaxGet("goodsCfg/viewGoodsDetail?sku="+sku, "goodsDetailModal");
}

function bindGoodsAll(){
    var idSel = [];
    if($("#goodsBindAll").attr("checked")){
        $("#goodsBindAll").attr("checked", false);
        $("input[id^=goodsBind_]").each(function(){
            $(this).prop("checked", false);
        });
    }else{
        $("#goodsBindAll").attr("checked", true);
        $("input[id^=goodsBind_]").each(function(){
            $(this).prop("checked", true);
            idSel.push($(this).val());
        });
    }
    $("#goodsIds").val(idSel);
}

function bindGoodsOne(id){
    var idSel = [];
    $("input[id^=goodsBind_]").each(function(){
        if($(this).prop("checked")) {
            idSel.push($(this).val());
        }
    });
    $("#goodsIds").val(idSel);
}

function queryGoodsToBind(){
    jQuery.ajax({
        url: baseUrl + "goodsCfg/unBind/list",
        type: "post",
        cache: false,
        async: false,
        dataType: "html",
        data: $(".param-listGoods-query").serialize(),
        success: function (result) {
            $("#goodsUnbindSimpleTable").empty().html(result);
        }
    });
}

function safeQueryGoodsToBind(){
    if(isValid('unBindGoodsIndexForm')){
        queryGoodsToBind();
    }
}

function resetQueryGoodsToBind(){
    $(".param-listGoods-query").each(function(){
        if('hidden' == $(this).attr('type')){

        }else{
            $(this).val('');
        }
    });
}

function bindGoods(){
    if('' == $("#goodsIds").val()){
        alert('请选择需要绑定的商品');
        return;
    }
    jQuery.ajax({
        url: baseUrl + "goodsCfg/unBind/bindGoods",
        type: "post",
        cache: false,
        async: false,
        dataType: "json",
        data: $(".param-goods-selBatch").serialize(),
        success: function (result) {
            $("#goodsIds").val('');
            if (result.success) {
                alert(result.msg);
                queryGoodsToBind();
                $("#boundChanged").val('1');
//                    popupTool.success("",result.msg);
            } else {
                alert(result.msg);
//                    popupTool.error("",result.msg);
            }
        }
    });
}

function queryBoundGoods(){
    jQuery.ajax({
        url: baseUrl + "goodsCfg/hasBind/list?size=20",
        type: "post",
        cache: false,
        async: false,
        dataType: "html",
        data: $(".param-listBound-query").serialize(),
        success: function (result) {
            $("#goodsBoundSimpleTable").empty().html(result);
        }
    });
}

function unBindGoodsAll(){
    var idSel = [];
    if($("#goodsUnbindAll").attr("checked")){
        $("#goodsUnbindAll").attr("checked", false);
        $("input[id^=goodsUnbind_]").each(function(){
            $(this).prop("checked", false);
        });
    }else{
        $("#goodsUnbindAll").attr("checked", true);
        $("input[id^=goodsUnbind_]").each(function(){
            $(this).prop("checked", true);
            idSel.push($(this).val());
        });
    }
    $("#goodsIds_unbind").val(idSel);
}

function unBindGoodsOne(id){
    var idSel = [];
    $("input[id^=goodsUnbind_]").each(function(){
        if($(this).prop("checked")) {
            idSel.push($(this).val());
        }
    });
    $("#goodsIds_unbind").val(idSel);
}

function unBindGoods(){
    if('' == $("#goodsIds_unbind").val()){
        alert('请选择需要解绑的商品');
        return;
    }
    jQuery.ajax({
        url: baseUrl + "goodsCfg/hasBind/unBindGoods",
        type: "post",
        cache: false,
        async: false,
        dataType: "json",
        data: $(".param-goods-delBatch").serialize(),
        success: function (result) {
            $("#goodsIds_unbind").val('');
            if (result.success) {
                alert(result.msg);
                queryBoundGoods();
                $("#toBindGoods").attr('disabled',false);
            } else {
                alert(result.msg);
            }
        }
    });
}

function unBindGoodsSingle(idSingle){
    $("#goodsIds_unbind").val(idSingle);
    unBindGoods();
}