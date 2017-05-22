/**
 * Created by wangcan on 2015/5/27.
 */

function setDialBtnDisableIfEstablished(){
    if($("#dnState").text()=="通话"){
        $("#dialBtn").linkbutton('disable');
    }
}
function popScreenProcess(result){
   //console.log(JSON.stringify(result.attachedData));
    var attachedDataMap = {};
    try
    {
        var dataJson = extendDataList;
        //alert(result.attachedData.v_gvpType);
        if(result.attachedData.v_gvpType)
        {
            //alert("1234");
            for(var i=0; i<dataJson.length; i++) {
                attachedDataMap[dataJson[i]] = result.attachedData[dataJson[i]];
                //  alert(result.attachedData[dataJson[i]]);
            }
        }
    }
    catch (e)
    {
        //console.log(JSON.stringify(result.attachedData));
    }
    var attachedData =  encodeURI(JSON.stringify(attachedDataMap));
    if (result.callType == "Inbound") {
        if (result.attachedData.operation != null && result.attachedData.operation == "transfer") {
            var path = "/elasticScreen/showElasticScreen?screenType=2&callTel=" + result.otherDN + "&recordRunningNumber=" + result.connId + "&callTimes=" + "" + "&areaName=" + encodeURI(result.attachedData.callerprovince) + "&transferRecordNumber=" + result.connId + "&attachedDataMap=" + attachedData;
            var index = "转接热线呼入" + result.otherDN;
            var title = "转接热线呼入";
        }
        else if (result.attachedData.v_sid_reslut != null && result.attachedData.operation == "true") {
            var path = "/elasticScreen/showElasticScreen?screenType=1&callTel=" + result.ani + "recordRunningNumber=" + result.connId + "&callTimes=" + "" + "&sid=" + result.attachedData.v_sid_no + "&sidName=" + result.attachedData.v_sid_name + "&areaName=" + encodeURI(result.attachedData.callerprovince) + "&attachedDataMap=" + attachedData;
            var index = "BPO热线呼入" + result.ani;
            var title = "BPO热线呼入";
        }
        else {
            var path = "/elasticScreen/showElasticScreen?screenType=1&callTel=" + result.ani + "&recordRunningNumber=" + result.connId + "&callTimes=" + "" + "&areaName=" + encodeURI(result.attachedData.callerprovince) + "&attachedDataMap=" + attachedData;
            var index = "热线呼入" + result.ani;
            var title = "热线呼入";
        }
        self.parent.frame_main.addTab(index, path, title);
    }
    else if (result.callType == "Outbound") {
        var path = "/elasticScreen/showElasticScreen?screenType=3&callTel=" + result.ani + "&recordRunningNumber=" + result.connId + "&callTimes=" + "" + "&areaName=" + encodeURI(result.attachedData.callerprovince) + "&bookApplyId=" + result.attachedData.GSW_CHAIN_ID + "&attachedDataMap=" +attachedData;
        var index = "预约来电";
        var title = "预约来电";
        self.parent.frame_main.addTab(index, path, title);
    }
    else if (result.callType == "Consult") {

        if(result.attachedData.GSW_CHAIN_ID != null){
            var path = "/elasticScreen/showElasticScreen?screenType=4&callTel=" + result.otherDN+"&recordRunningNumber=" + result.connId + "&callTimes=" + "" + "&areaName=" + encodeURI(result.attachedData.callerprovince) + "&bookApplyId=" + result.attachedData.GSW_CHAIN_ID + "&transferRecordNumber=" + result.connId + "&attachedDataMap=" + attachedData;
            var index = "预约转接热线呼入" + result.otherDN;
            var title = "预约转接热线呼入";
        }
        else {
            var path = "/elasticScreen/showElasticScreen?screenType=2&callTel=" + result.otherDN + "&recordRunningNumber=" + result.connId + "&callTimes=" + "" + "&areaName=" + encodeURI(result.attachedData.callerprovince) + "&transferRecordNumber=" + result.connId + "&attachedDataMap=" + attachedData;
            var index = "2.0单步转咨询转接" + result.otherDN;
            var title = "2.0单步转咨询转接";
        }
        self.parent.frame_main.addTab(index, path, title);
    }
    else {
        var path = "/elasticScreen/showElasticScreen?screenType=1&callTel=" + result.ani + "&areaName=" + encodeURI(result.attachedData.callerprovince) + "&attachedDataMap=" + attachedData;
        var index = "genesys" + result.ani;
        var title = "热线呼入";
        self.parent.frame_main.addTab(index, path, title);
    }
}

function popScreenProcessCti(result) {
    var attachedDataMap = {};
    try {
        var dataJson = extendDataList;
        if (result.userData.v_gvpType) {
            for (var i = 0; i < dataJson.length; i++) {
                attachedDataMap[dataJson[i]] = result.userData[dataJson[i]];
            }
        }
    }
    catch (e) {
        //console.log(JSON.stringify(result.userData));
    }
    var attachedData = encodeURI(JSON.stringify(attachedDataMap));
    if (result.callType == CALLTYPE.INBOUND) {
        if (result.messageId == MessageID.EventPartyChanged && result.callState == CALLSTATE.Transferred) {
            var path = "/elasticScreen/showElasticScreen?screenType=2&callTel=" + result.otherDN + "&recordRunningNumber=" + result.connId + "&callTimes=" + "" + "&areaName=" + encodeURI("") + "&transferRecordNumber=" + result.connId + "&attachedDataMap=" + attachedData;
            var index = "转接热线呼入" + result.otherDN;
            var title = "转接热线呼入";
            self.parent.frame_main.addTab(index, path, title);
        }
        else {
            var path = "/elasticScreen/showElasticScreen?screenType=1&callTel=" + result.ani + "&recordRunningNumber=" + result.connId + "&callTimes=" + "" + "&areaName=" + encodeURI("");
            var index = "热线呼入" + result.ani;
            var title = "热线呼入";
            self.parent.frame_main.addTab(index, path, title);
        }
    }
    else if (result.callType == CALLTYPE.OUTBOUND) {
        if (result.messageId == MessageID.EventPartyChanged && result.callState == CALLSTATE.Transferred) {
            var path = "/elasticScreen/showElasticScreen?screenType=2&callTel=" + result.otherDN + "&recordRunningNumber=" + result.connId + "&callTimes=" + "" + "&areaName=" + encodeURI("") + "&transferRecordNumber=" + result.connId + "&attachedDataMap=" + attachedData;
            var index = "转接热线呼出" + result.otherDN;
            var title = "转接热线呼出";
            self.parent.frame_main.addTab(index, path, title);
        } else if(result.userData.v_gvpType != null){
            var path = "/elasticScreen/showElasticScreen?screenType=2&callTel=" + result.dnis + "&recordRunningNumber=" + result.connId + "&callTimes=" + "" + "&areaName=" + encodeURI("") + "&attachedDataMap=" + attachedData;
            var index = "自主外呼弹屏" + result.dnis;
            var title = "自主外呼弹屏";
            self.parent.frame_main.addTab(index, path, title);
        }
    }
    else {
        window.console.log("电话号码" + result.ani);
    }
}

function setReasonCode() {
    if ($("#reasonCode").val() != '') {
        notReady("voice", $("#reasonCode").val(), "0");
    }
}


function popPinResult(result) {
    var attachedData = result.attachedData;
    if (attachedData.ivrResult == "1") {
        alert("密码验证成功!")
    }
    else {
        alert("密码验证失败!")
    }
}

