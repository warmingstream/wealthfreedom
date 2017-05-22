/**
 * author:ZHL 2015.10.27
**/
function onAgentEvent(data){}

function onVoiceEvent(data){
	var bizCallDeal = window.parent.BizCallDeal;
	if(data.messageId==MessageID.EventRinging || data.messageId==MessageID.EventDialing) {
		if(bizCallDeal){
			bizCallDeal.callBegin(data.creationTime);
		}

		if(data.callType!=CALLTYPE.CONSULT) {
			popScreenProcessCti(data);
		}
	}
	if(data.messageId==MessageID.EventPartyChanged) {
		if(data.callState==CALLSTATE.Transferred) {
			popScreenProcessCti(data);
		}
	}
	//通话建立时将会收到此消息
	if(data.messageId==MessageID.EventEstablished ) {
		bizCallDeal.talkBegin(data.creationTime);
	}
	//通话结束将会收到此消息
	if(data.messageId==MessageID.EventReleased){
		if(bizCallDeal && window.parent.BizCallRecords.taskId) {//从我的任务处理中拨打电话才记录通话记录
			bizCallDeal.callFinish(data.creationTime, data.callId, data.callType, data.thisDN, data.otherDN);
		}
	}
}