/**
 * Created by changjiang3 on 2016/4/20.
 */

function closeAddModal(){
    $('#addModal').modal('hide');
    $('#addModal').empty();
    query();
}
function importDetailModal(sku){
    _ajaxGet("showDetail?sku="+sku, "detailModal");
}
function closeDetailModal(){
    $('#detailModal').modal('hide');
    $('#detailModal').empty();
    query();
}

function updateItems(){
    _ajaxPost("updateBatch", "param-" + module + "-selBatch");
    query();
}
function updateOne(id){
    operateOne(id, "updateBatch");
}
function deleteOne(id){
    operateOne(id, "deleteBatch");
}
function operateOne(id, urlPart){
    jQuery.ajax({
        url: baseUrl + urlPart,
        type: "post",
        cache: false,
        async: false,
        dataType: "json",
        data: {ids : id},
        success: function (result) {
            if (result.success) {
                alert(result.msg);
                query();
//                    popupTool.success("",result.msg);
            } else {
                alert(result.msg);
//                    popupTool.error("",result.msg);
            }
        }
    });
}

////////////////////////////////////

function queryImports(){
    if(isValid("bizGoodsAddForm")){
        $.get(baseUrl + "queryImports?skus=" + $("#skus").val(), function(result){
            $("#importSimpleTable").empty().html(result);
        });
    }
    //if("" == $("#skus").val()){
    //    alert('请输入查询sku');
    //    return;
    //}
    //$.get(baseUrl + "queryImports?skus=" + $("#skus").val(), function(result){
    //    $("#importSimpleTable").empty().html(result);
    //});
}

function importGoodsBatch(){
    var postData = [];
    $("input[id^=importOne_]").each(function(){
        if($(this).attr("checked")){
            postData.push($(this).val());
        }
    });
    if(0 == postData.length){
        alert("请选择导入的数据");
        return;
    }
    importGoods(postData);
}

function importGoodsOne(sku, goodsType, goodsName, goodsBrand, shopType, shopName){
    var goods = {
        sku : sku,
        goodsType : goodsType,
        goodsName : goodsName,
        goodsBrand : goodsBrand,
        shopType : shopType,
        shopName : shopName
    }
    var postData = [];
    postData.push(goods);
    importGoods(postData);
}

function importGoods(postData){
    jQuery.ajax({
        url: baseUrl + "add",
        type: "post",
        cache: false,
        async: false,
        dataType: "json",
        data: {"goodsList" : JSON.stringify(postData)},
        success: function (result) {
            if(result.success){
                alert(result.msg);
                query();
//                    popupTool.success("",result.msg);
            }else{
                alert(result.msg);
//                    popupTool.error("",result.msg);
            }
        }
    });
}

function selImportAll(){
    if($("#importAll").attr("checked")){
        $("#importAll").attr("checked", false);
        $("input[id^=importOne_]").each(function(){
            if($(this).attr("checked")){
                $(this).click();
            }else{

            }
        });
    }else{
        $("#importAll").attr("checked", true);
        $("input[id^=importOne_]").each(function(){
            if($(this).attr("checked")){

            }else{
                $(this).click();
            }
        });
    }
}

function selImport(sku, goodsType, goodsName, goodsBrand, shopType, shopName){
    if($("#importOne_" + sku).attr("checked")){
        $("#importOne_" + sku).attr("checked", false);
        $("#importOne_" + sku).val('');
    }else {
        $("#importOne_" + sku).attr("checked", true);
        var goods = {
            sku : sku,
            goodsType : goodsType,
            goodsName : goodsName,
            goodsBrand : goodsBrand,
            shopType : shopType,
            shopName : shopName
        }
        $("#importOne_" + sku).val(JSON.stringify(goods));
    }
}

