/**
 * Created by songyang10 on 2016/4/26.
 */
var contentWin = window.frames["iframe_softphone"].contentWindow;
var BizCallRecords = {
    taskId : null,  //任务主键
    logId : null,   //任务日志主键
    callingPin : null,//主叫坐席
    callingName : null,//主叫姓名
    callingNumber : null,//主叫号码
    calledNumber : null,//被叫号码
    callDuration : null,//呼叫时长
    tenantId : null,//租户id
    startTime : null,//呼叫开始时间
    type : null,//呼叫类型
    callId : null,//呼叫id
    talkStartTime : null,//通话接听开始时间
    callStartTime : null, //通话拨打开始时间
    clear : function(){
        this.taskId = null;  //任务主键
        this.logId = null;   //任务日志主键
        this.callingPin = null;//主叫坐席
        this.callingName = null;//主叫姓名
        this.callingNumber = null;//主叫号码
        this.calledNumber = null;//被叫号码
        this.callDuration = null;//呼叫时长
        this.tenantId = null;//租户id
        this.startTime = null;//呼叫开始时间
        this.type = null;//呼叫类型
        this.callId = null;//呼叫id
        this.talkStartTime = null;//通话接听开始时间
        this.callStartTime = null; //通话拨打开始时间
    }
}
/**
 * 通话处理类
 * @type {{callBegin: Function, callFinish: Function}}
 */
var BizCallDeal = {
    /**
     * 通话拨打开始时间回调方法
     * @param startTime
     */
    callBegin : function(startTime){
        BizCallRecords.callStartTime = startTime;
    },
    /**
     * 通话接听开始时间回调方法
     * @param startTime
     */
    talkBegin : function(talkStartTime){
        BizCallRecords.talkStartTime = talkStartTime;
    },
    /**
     * 通话结束回调方法
     * @param endTime
     * @param calledId
     * @param callType
     */

    callFinish : function(endTime, calledId, callType, callingNumber, calledNumber){
        if(callType == contentWin.CALLTYPE.INBOUND || callType == contentWin.CALLTYPE.OUTBOUND){
            if(BizCallRecords.talkStartTime){
                BizCallRecords.callDuration = parseInt((endTime - BizCallRecords.talkStartTime) / 1000);
            }else{
                BizCallRecords.callDuration = 0;   //未接听
            }
            BizCallRecords.callId = calledId;
            BizCallRecords.type = callType;
            BizCallRecords.callingNumber = callingNumber;
            BizCallRecords.calledNumber = calledNumber;
            jQuery.ajax({
                url: "/biz/bizCallRecords/save",
                type: "POST",
                cache: false,
                async: false,
                dataType: "json",
                data: BizCallRecords,
                beforeSend: function () {

                },
                error: function (xhr) {
                    popupTool.error("系统异常！");
                },
                success: function (result) {
                    if (result.success){
                        popupTool.success("保存成功！");
                        //刷新联络历史
                        JUN.ui.loadPage($("#task_oper_his_detail"),"/biz/bizTask/showTaskOperHisDetail?taskId="+BizCallRecords.taskId);
                    }else{
                        popupTool.error(result.msg);
                    }
                }
            });
        }
    }
}