/**
 * author:ZHL 2015.10.27
**/
jQuery.namespace('cti');

var ctiState = CHANNELSTATE.Closed;

var msgState = CHANNELSTATE.Closed;

var numberList = new Array();

var debug = true;

var initialized = false;

var loggedIn = false;

cti.handleCTIEvent = function(data){
	logMesssage(JSON.stringify(data));
	try{
		if(data.messageId==MessageID.EventLinkConnected){
			msgState = CHANNELSTATE.Opened;
			ctiState = data.ctiState;
			$("#loading").hide();
			if(ctiState==CHANNELSTATE.Closed) {
				showMessage("与CTI服务器连接已断开，请检查服务运行状态");
			} else {
				if(!initialized) {
					initialized = true;
					cti.agentLogin();
				}
			}
    	}else if(data.messageId==MessageID.EventLinkDisconnected){
			if(data.reason=="kickout") {
				showMessage("与消息服务器连接已被强制断开");
				cti.reset();
			} else {
				showMessage("与消息服务器连接已断开");
			}
    		msgState = CHANNELSTATE.Closed;
    	}else if(data.messageId==MessageID.EventServerConnected){
    		ctiState = CHANNELSTATE.Opened;
			showMessage("与CTI服务器已恢复连接");
    	}else if(data.messageId==MessageID.EventServerDisconnected){
    		ctiState = CHANNELSTATE.Closed;
        	showMessage("与CTI服务器连接已断开");
			cti.reset();
    	}else if(data.messageId==MessageID.EventError){
    	    showMessage(data.errorMessage);
    	}else if(data.messageId==MessageID.EventAgentLogin){
    		cti.handleAgentEvent(data);
    	}else if(data.messageId==MessageID.EventAgentNotReady){
    		cti.handleAgentEvent(data);
    	}else if(data.messageId==MessageID.EventAgentReady){
    		cti.handleAgentEvent(data);
    	}else if(data.messageId==MessageID.EventAgentLogout){
    		cti.handleAgentEvent(data);
    	}else{
    		cti.handleVoiceEvent(data);
    	}
	}catch(e){
		if (window.console && window.console.log) {
			window.console.log(e);
		}
	}
};

cti.reset = function() {
	$("#agentImgState").attr("class", "user-status off");
	$("#stateBtn").attr("class", "disabled");
	cti.updateContent("loginBtn", "登录");
	cti.updateContent("holdTxt", "保持");
	cti.updateContent("transferTxt", "转接");
	cti.updateContent("conferenceTxt", "会议");
	cti.updateContent("agentState", "离线");
	cti.updateContent("dnState", "空闲");
	cti.UIManager.getInstance().reset();
	cti.Line.getInstance().reset();
	cti.Agent.getInstance().reset();
};

cti.handleAgentEvent = function(data) {
	try {
		var messageId = data.messageId;
		if(messageId==MessageID.EventAgentLogin){
			$("#agentImgState").attr("class", "user-status leave");
			cti.updateContent("agentState","离席");
			cti.updateContent("loginBtn", "登出");
			$("#stateBtn").attr("class", "notReady");
			cti.Agent.getInstance().changeAgentState(messageId, "NotReady", "", "");
			loggedIn = true;
		}else if(messageId==MessageID.EventAgentReady){
			$("#agentImgState").attr("class", "user-status");
	    	cti.updateContent("agentState","就绪");
			$("#stateBtn").attr("class", "ready");
			cti.Agent.getInstance().changeAgentState(messageId, "Ready", "", "");
			if(!loggedIn) {
				loggedIn = true;
				cti.updateContent("loginBtn", "登出");
			}
		}else if(messageId==MessageID.EventAgentNotReady){
			var reasonCode = data.reasonCode==null?"":data.reasonCode;
			var agentWorkMode = data.agentWorkMode==null?"":data.agentWorkMode;
			$("#agentImgState").attr("class", "user-status leave");
			if(reasonCode!="") {
				cti.updateContent("agentState",reasonMap.get(reasonCode));
			} else {
				cti.updateContent("agentState","离席");
			}
			if(agentWorkMode=="3") {
				cti.updateContent("agentState","ACW");
				$("#reasonCode").val("");
			}
			$("#stateBtn").attr("class", "notReady");
			cti.Agent.getInstance().changeAgentState(messageId, "NotReady", reasonCode, agentWorkMode);
			if(!loggedIn) {
				loggedIn = true;
				cti.updateContent("loginBtn", "登出");
			}
		}else if(messageId==MessageID.EventAgentLogout){
			cti.updateContent("agentState","登出");
			$("#agentImgState").attr("class", "user-status off");
	    	cti.updateContent("loginBtn", "登录");
	    	$("#stateBtn").attr("class", "disabled");
	    	cti.Agent.getInstance().changeAgentState(messageId, "Logout", "", "");
		}
		onAgentEvent(data);
	} catch(e) {
		if (window.console && window.console.log) {
			window.console.log(e);
		}
	}
}

cti.handleVoiceEvent = function(data){
	var messageId = data.messageId;
	try {
		switch(messageId){
			case MessageID.EventRinging:
				var isPhoneIdle = cti.Line.getInstance().isPhoneIdle();
				if(isPhoneIdle==true) {
					$("#agentImgState").attr("class", "user-status busy");
					cti.updateContent("dnState","振铃");
					cti.updateContent("ani",data.otherDN);
					var lineId = cti.Line.getInstance().getFreeLine();
					cti.Line.getInstance().stateChange(messageId,lineId,data.callType,data.callState,data.callId,data.otherDN);
					cti.UIManager.getInstance().changeButtonWhenRinging(data.callType);
					if(data.callType!=CALLTYPE.CONSULT) {
						addCallingList(data.otherDN);
					}
				}
				break;
			case MessageID.EventDialing:
				$("#agentImgState").attr("class", "user-status busy");
				cti.updateContent("dnState","振铃");
				var lineId = cti.Line.getInstance().getFreeLine();
	            cti.Line.getInstance().stateChange(messageId,lineId,data.callType,data.callState,data.callId,data.otherDN);
	            if(data.callType==CALLTYPE.CONSULT) {
	            	var lineData = cti.Line.getInstance().getLineData(lineId);
	            	cti.Line.getInstance().setCurrentLineId(lineId);
	            	cti.UIManager.getInstance().changeButtonWhenConsultDialing();
	            } else {
	            	cti.UIManager.getInstance().changeButtonWhenDialing();
	            }
				if(data.callType!=CALLTYPE.CONSULT) {
					addCallingList(data.otherDN);
					$("#phoneNumber").val(data.otherDN);
				}
	            break;
			case MessageID.EventEstablished:
				cti.updateContent("dnState","通话");
				var lineId = cti.Line.getInstance().getLineByCallId(data.callId);
				if(lineId != undefined && lineId != -1) {
					cti.Line.getInstance().stateChange(messageId, lineId, data.callType, data.callState, data.callId, data.otherDN);
					if (data.callType == CALLTYPE.CONSULT) {
						if (data.thisDNRole == PARTYROLE.Origination) {
							var callState = data.callState;
							cti.updateContent("holdTxt", "取回");
							if (callState == CALLSTATE.Transfering) {
								cti.UIManager.getInstance().changeButtonWhenConsultTalking("Transfer");
								cti.updateContent("transferTxt", "完成");
							} else if (callState == CALLSTATE.Conferencing) {
								cti.UIManager.getInstance().changeButtonWhenConsultTalking("Conference");
								cti.updateContent("conferenceTxt", "完成");
							}
						} else if (data.thisDNRole == PARTYROLE.Destination) {
							cti.UIManager.getInstance().changeButtonWhenConsultTalking("Consult");
						}
					} else {
						cti.UIManager.getInstance().changeButtonWhenTalking();
					}
				}
				break;
			case MessageID.EventHeld:
				cti.updateContent("dnState","保持");
				var lineId = cti.Line.getInstance().getLineByCallId(data.callId);
				if(lineId != undefined && lineId != -1) {
					cti.Line.getInstance().stateChange(messageId, lineId, data.callType, data.callState, data.callId, data.otherDN);
					cti.UIManager.getInstance().changeButtonWhenHold();
					cti.updateContent("holdTxt", "取回");
				}
				break;
			case MessageID.EventRetrieved:
				cti.updateContent("dnState","通话");
				var lineId = cti.Line.getInstance().getLineByCallId(data.callId);
				if(lineId != undefined && lineId != -1) {
					cti.Line.getInstance().stateChange(messageId, lineId, data.callType, data.callState, data.callId, data.otherDN);
					cti.UIManager.getInstance().changeButtonWhenTalking();
					cti.updateContent("holdTxt", "保持");
				}
				break;
			case MessageID.EventReleased:
			case MessageID.EventAbandoned:
				var lineId = cti.Line.getInstance().getLineByCallId(data.callId);
				if(lineId != undefined && lineId != -1) {
					cti.Line.getInstance().stateChange(messageId, lineId, data.callType, data.callState, data.callId, data.otherDN);
					if (data.callType == CALLTYPE.CONSULT) {
						var callState = data.callState;
						if (callState == CALLSTATE.Transferred || callState == CALLSTATE.Transfering) {
							cti.updateContent("transferTxt", "转接");
						} else if (callState == CALLSTATE.Conferenced || callState == CALLSTATE.Conferencing) {
							cti.updateContent("conferenceTxt", "会议");
						}
						cti.Line.getInstance().setCurrentLineId(0);
						var firstLineId = cti.Line.getInstance().getLineByCallId(data.previousCallId);
						if (firstLineId != undefined && firstLineId != -1) {
							var lineData = cti.Line.getInstance().getLineData(firstLineId);
							if (lineData.lineState == "Hold") {
								cti.updateContent("dnState", "保持");
								cti.UIManager.getInstance().changeButtonWhenHold();
							}
						} else {
							var state = cti.Agent.getInstance().getState();
							if(state=="Ready") {
								$("#agentImgState").attr("class", "user-status");
							} else {
								$("#agentImgState").attr("class", "user-status leave");
							}
							cti.updateContent("dnState", "空闲");
							cti.UIManager.getInstance().changeButtonWhenIdle();
						}
					} else {
						var isPhoneIdle = cti.Line.getInstance().isPhoneIdle();
						if (isPhoneIdle == false) {
							var secondLineId = cti.Line.getInstance().getBusyLine();
							var secondLineData = cti.Line.getInstance().getLineData(secondLineId);
							if (secondLineData.callType == CALLTYPE.CONSULT) {
								cti.updateContent("holdTxt", "保持");
								cti.UIManager.getInstance().changeButtonWhenFirstIdle();
							}
						} else {
							var state = cti.Agent.getInstance().getState();
							if(state=="Ready") {
								$("#agentImgState").attr("class", "user-status");
							} else {
								$("#agentImgState").attr("class", "user-status leave");
							}
							cti.updateContent("dnState", "空闲");
							cti.UIManager.getInstance().changeButtonWhenIdle();
							cti.updateContent("holdTxt", "保持");
						}
					}
				}
				break;
			case MessageID.EventPartyAdded:
				var lineId = cti.Line.getInstance().getLineByCallId(data.callId);
				if(lineId != undefined && lineId != -1) {
					cti.Line.getInstance().stateChange(messageId, lineId, data.callType, data.callState, data.callId, data.otherDN);
					cti.updateContent("dnState","会议");
					cti.UIManager.getInstance().changeButtonWhenPartyAdded();
				}
				break;
			case MessageID.EventPartyChanged:
				var lineId = cti.Line.getInstance().getLineByCallId(data.previousCallId);
				if(lineId != undefined && lineId != -1) {
					cti.Line.getInstance().stateChange(messageId, lineId, data.callType, data.callState, data.callId, data.otherDN);
					if (data.callState == CALLSTATE.Conferenced) {
						cti.updateContent("dnState", "会议");
						cti.UIManager.getInstance().changeButtonWhenPartyChanged(CALLSTATE.Conferenced);
					} else if(data.callState == CALLSTATE.Transferred) {
						cti.UIManager.getInstance().changeButtonWhenPartyChanged(CALLSTATE.Transferred);
						cti.updateContent("ani",data.otherDN);
					}
					if (data.callType != CALLTYPE.CONSULT) {
						addCallingList(data.otherDN);
					}
				}
				break;
			case MessageID.EventPartyDeleted:
				var lineId = cti.Line.getInstance().getLineByCallId(data.callId);
				if(lineId != undefined && lineId != -1) {
					cti.updateContent("dnState","通话");
					var lineData = cti.Line.getInstance().getLineData(lineId);
					lineData.action = data.extensions.type;
					cti.UIManager.getInstance().changeButtonWhenPartyDeleted();
				}
				break;
			default:
				break;
		}
		onVoiceEvent(data);
	} catch(e) {
		if (window.console && window.console.log) {
			window.console.log(e);
		}
	}
};

function addCallingList(phoneNumber) {
	//如果已经存在此电话号码，则删除一个。
	for (i = 0; i < numberList.length; i++){
		if(numberList[i]==phoneNumber) {
			numberList.splice(i, 1);
		}
	}

	//插入一个到第一位
	var len = numberList.unshift(phoneNumber);
	if(len > 10){
		numberList.pop();
	}
	$("#phoneNumberList").empty();
	$("#phoneNumberList").append("<option value=''></option>");
	$.each(numberList,function(n,value) {
		$("#phoneNumberList").append("<option value='"+value+"'>"+value+"</option>");
	});
}

function logMesssage(result) {
	if (debug && window.console && window.console.log) {
		window.console.log(result);
	}
}