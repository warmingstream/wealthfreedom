/**
 * author:ZHL 2013.05.27
**/
var statusMap = new Map();
var numberArr = new Array();

function onAppletReady(){
	try {
		cti.UIManager.getInstance().changeToEnabled("loginBtn");
		var result = getSkillInfo();
		$("#skillInfo").append("<option value=''>请选择技能组</option>");
		if(result!="") {
			$.each(result, function (n, value) {
				$("#skillInfo").append("<option value='"+value.cn_name+"'>"+value.cn_name+"</option>");
			});
		}
		$("#loading-mask").fadeOut();
	} catch(e) {
		alert(e.description);
	}
}


function onInitFailed(){
    $("#loading-mask").fadeOut();
    alert("软电话加载失败");
}

function onForcedAgentStatusChanged(result){
	
}

/**
 * 连接状态发生变化触发此函数
 * @param mediaType
 * @param result
 * @return
 */
function onConnectionStatusChanged(result){
	if(result.serverType=="sipserver") {
		//logMesssage(JSON.stringify(result));
		statusMap.put("sipServer", result.status);
		if(result.status=="Connected" && result.switchOver=="true") {
			cti.Line.getInstance().reset();
			cti.UIManager.getInstance().reset();
		}
	}
}

/**
 * DN注册或取消注册时触发此函数
 * @param result
 * @return
 */
function onRegisteredEvent(result){
	//logMesssage(JSON.stringify(result));
	if(result.eventName=="EventRegistered") {
		cti.updateContent("dnState","空闲");
	}else if(result.eventName=="EventUnregistered") {
		cti.updateContent("dnState","离线");
	}
}

/**
 * 座席状态发生变化触发此函数（如Ready、NotReady）
 * @param result
 * @return
 */
function onAgentStatusChanged(result){
	//logMesssage(JSON.stringify(result));
	if(result.mediaType=="voice") {
		cti.Agent.getInstance().updateAgentState(result.status, result.reason);
		if(result.status=="LoggedOut"){
			$("#reasonCode").attr("disabled", true);
			$("#phoneNumber").attr("disabled", true);
            $("#phoneNumberSelect").attr("disabled", true);
			$("#skillInfo").attr("disabled", true);
			$("#ivrInfo").attr("disabled", true);
			$("#reasonCode").get(0).selectedIndex = 0;
			$("#skillInfo").get(0).selectedIndex = 0;
			$("#ivrInfo").get(0).selectedIndex = 0;
	    	cti.updateContent("agentState","登出");
	    	$("#loginBtn").linkbutton({'text':'登录'});
	    	cti.UIManager.getInstance().changeButtonWhenLogout();
		}else if(result.status=="LoggedIn"){
			$('#reasonCode').attr("disabled", false);
			$('#phoneNumber').attr("disabled", false);
            $('#phoneNumberSelect').attr("disabled", false);
			$('#skillInfo').attr("disabled", false);
			$('#ivrInfo').attr("disabled", false);
	    	cti.updateContent("agentState","");
	    	$("#loginBtn").linkbutton({'text':'登出'});
	    	cti.UIManager.getInstance().changeButtonWhenLogin();
		}else if(result.status=="Ready"){
			cti.updateContent("agentState","就绪");
			$("#stateBtn").linkbutton({'text':'休息'});
			cti.UIManager.getInstance().changeButtonWhenReady();
		}else if(result.status=="NotReady"){
			if(result.reason!="") {
				var reason = reasonMap.get(result.reason);
				cti.updateContent("agentState",reason);
			} else {
				cti.updateContent("agentState","忙碌");
			}
			$("#stateBtn").linkbutton({'text':'准备'});
			cti.UIManager.getInstance().changeButtonWhenNotReady();
		}else if(result.status=="ACW"){
			cti.updateContent("agentState","ACW");
			$("#stateBtn").linkbutton({'text':'准备'});
			cti.UIManager.getInstance().changeButtonWhenNotReady();
			$("#reasonCode").get(0).selectedIndex = 0;
		}
	}
}
/**
 * 软电话处理异常触发此函数
 * @param result
 * @return
 */
function onError(result){
	if (result.errorCode==1141){
		alert('客服同事好，系统切换中出现异常，请您重新登录，谢谢！');
	}
	else{
		alert(result.message);
	}

}

/**
 * 座席收到新会话触发此函数
 * @param result
 * @return
 */
function onInteractionAdded(result) {
	try {
		//logMesssage(JSON.stringify(result));
		var agentState = cti.Agent.getInstance().getState();
		//if(agentState!="LoggedOut" && result.mediaType=="voice"){
			if(result.status=="Dialing"){
				cti.updateContent("dnState","振铃");
				var lineId = cti.Line.getInstance().getFreeLine();
                cti.Line.getInstance().stateChange(result.eventId,lineId,result.callType,result.callState,result.connId,result.otherDN);
                
                if(result.callType=="Consult") {
                	var lineData = cti.Line.getInstance().getLineData(lineId);
                	var attachedData = result.attachedData;
                	if(attachedData.operation=="transfer") {
                		lineData.action = "transfer";
                	}else if(attachedData.operation=="conference") {
                		lineData.action = "conference";
                	}
                	cti.Line.getInstance().setCurrentLineId(lineId);
                	cti.UIManager.getInstance().changeButtonWhenConsultDialing();
                } else {
                	cti.UIManager.getInstance().changeButtonWhenDialing();
                }
			}else if(result.status=="Ringing"){
				var isPhoneIdle = cti.Line.getInstance().isPhoneIdle();
				if(isPhoneIdle==true) {
					cti.updateContent("dnState","振铃");
					var lineId = cti.Line.getInstance().getFreeLine();
					cti.Line.getInstance().stateChange(result.eventId,lineId,result.callType,result.callState,result.connId,result.otherDN);
					cti.UIManager.getInstance().changeButtonWhenRinging();
					popScreenProcess(result); //added by klein 20150527
				}
			}
		
			if(result.callType=="Inbound" || result.callType=="Outbound") {
				var otherDN = result.otherDN;

				$('#phoneNumber').val(otherDN);
				if(numberArr.length>=10){
					numberArr.pop();
				}
	
				numberArr.unshift(otherDN);
				
				$("#phoneNumberSelect").empty();
				$("#phoneNumberSelect").append("<option value=''></option>");
				$.each(numberArr,function(n,value) {
					$("#phoneNumberSelect").append("<option value='"+value+"'>"+value+"</option>");
				});
			}
		//}
	} catch (e) {
		alert(e);
	}
}

/**
 * 会话状态改变（如响铃到接起）触发此函数
 * @param result
 * @return
 */
function onInteractionUpdated(result) {
	var agentState = cti.Agent.getInstance().getState();
	//if(agentState!="LoggedOut" && result.mediaType=="voice"){
		//logMesssage(JSON.stringify(result));
		if(result.status=="Established"){
			cti.updateContent("dnState","通话");
			if(result.eventId==EVENT.Established){
				var lineId = cti.Line.getInstance().getLineByConnId(result.connId);
				if(lineId != undefined && lineId != -1) {
					cti.Line.getInstance().stateChange(result.eventId, lineId, result.callType, result.callState, result.connId, result.otherDN);
					if (result.callType == "Consult") {
						if (result.thisDNRole == "RoleOrigination") {
							var attachedData = result.attachedData;
							$("#holdBtn").linkbutton({'text': '取回'});
							if (attachedData.operation == "transfer") {
								cti.UIManager.getInstance().changeButtonWhenConsultTalking("Transfer");
								$("#transferBtn").linkbutton({'text': '完成'});
							} else if (attachedData.operation == "conference") {
								cti.UIManager.getInstance().changeButtonWhenConsultTalking("Conference");
								$("#conferenceBtn").linkbutton({'text': '完成'});
							} else if (attachedData.operation == "ivr") {
								cti.UIManager.getInstance().changeButtonWhenConsultTalking("Consult");
								var holdLineId = cti.Line.getInstance().getHoldLine();
								if (holdLineId != -1) {
									var holdLineData = cti.Line.getInstance().getLineData(holdLineId);
									completeTransfer(holdLineData.connId, result.connId);
								} else {
									showMessage("一线已挂断，不能完成转IVR操作");
								}
							} else if (attachedData.operation == "tpin") {
								cti.UIManager.getInstance().changeButtonWhenConsultTalking("Consult");
								var holdLineId = cti.Line.getInstance().getHoldLine();
								if (holdLineId != -1) {
									var holdLineData = cti.Line.getInstance().getLineData(holdLineId);
									completeConference(holdLineData.connId, result.connId);
								} else {
									showMessage("一线已挂断，不能完成密码护航操作");
								}
							}
						} else if (result.thisDNRole == "RoleDestination") {
							cti.UIManager.getInstance().changeButtonWhenConsultTalking("Consult");
						}
					} else {
						cti.UIManager.getInstance().changeButtonWhenTalking();
					}
				}
			}else if(result.eventId==EVENT.Retrieved) {
				var lineId = cti.Line.getInstance().getLineByConnId(result.connId);
				if(lineId != undefined && lineId != -1) {
					cti.Line.getInstance().stateChange(result.eventId, lineId, result.callType, result.callState, result.connId, result.otherDN);
					$("#holdBtn").linkbutton({'text': '保持'});
					cti.UIManager.getInstance().changeButtonWhenTalking();
					var attachedData = result.attachedData;
					if (attachedData.operation != "undefined" && attachedData.operation == "tpin") {
						$("#tpinBtn").linkbutton({'text': '密码护航'});
						popPinResult(result);  // 20150603 added by klein pop the result of tpin
					}
				}
			}else if(result.eventId==EVENT.PartyChanged) {
				var lineId = cti.Line.getInstance().getLineByConnId(result.previousConnId);
				if(lineId != undefined && lineId != -1) {
					cti.Line.getInstance().stateChange(result.eventId, lineId, result.callType, result.callState, result.connId, result.otherDN);
					cti.UIManager.getInstance().changeButtonWhenTalking();

					if (result.callType == "Inbound" || result.callType == "Outbound") {
						var otherDN = result.otherDN;
						$('#phoneNumber').val(otherDN);
						if (numberArr.length >= 10) {
							numberArr.pop();
						}

						numberArr.unshift(otherDN);

						$("#phoneNumberSelect").empty();
						$("#phoneNumberSelect").append("<option value=''></option>");
						$.each(numberArr, function (n, value) {
							$("#phoneNumberSelect").append("<option value='" + value + "'>" + value + "</option>");
						});
					}
				}
			}else if(result.eventId==EVENT.PartyAdded) {
				var attachedData = result.attachedData;
				if(attachedData.operation!="undefined" && attachedData.operation=="tpin") {
					$("#tpinBtn").linkbutton({'text':'取消验密'});
					holdCall(result.connId);
				}
			}
		}else if(result.status=="Held"){
			if(result.eventId==EVENT.Held) {
				cti.updateContent("dnState","保持");
				var lineId = cti.Line.getInstance().getLineByConnId(result.connId);
				if(lineId != undefined && lineId != -1) {
					cti.Line.getInstance().stateChange(result.eventId, lineId, result.callType, result.callState, result.connId, result.otherDN);
					var attachedData = result.attachedData;
					if (attachedData.operation != "undefined" && attachedData.operation == "tpin") {
						cti.UIManager.getInstance().changeButtonWhenTPinHold();
					} else {
						cti.UIManager.getInstance().changeButtonWhenHold();
					}
					$("#holdBtn").linkbutton({'text': '取回'});
				}
			} else if(result.eventId==EVENT.PartyDeleted) {
				var attachedData = result.attachedData;
				if(attachedData.operation!="undefined" && attachedData.operation=="tpin") {
					retrieveCall(result.connId);
				}
			}
		}
	//}
}

/**
 * 会话结束触发此函数
 * @param result
 * @return
 */
function onInteractionRemoved(result) {
	var agentState = cti.Agent.getInstance().getState();
	//if(agentState!="LoggedOut" && result.mediaType=="voice"){
		//logMesssage(JSON.stringify(result));
		if(result.status == "Idle"){
			var lineId = cti.Line.getInstance().getLineByConnId(result.connId);
			if(lineId != undefined && lineId != -1) {
				cti.Line.getInstance().stateChange(result.eventId, lineId, result.callType, result.callState, result.connId, result.otherDN);
				if (result.callType == "Consult") {
					var attachedData = result.attachedData;
					if (attachedData.operation == "transfer") {
						$("#transferBtn").linkbutton({'text': '转接'});
					} else if (attachedData.operation == "conference") {
						$("#conferenceBtn").linkbutton({'text': '会议'});
					}
					cti.Line.getInstance().setCurrentLineId(0);
					var firstLineId = cti.Line.getInstance().getLineByConnId(result.transferConnId);
					if (firstLineId != -1) {
						var lineData = cti.Line.getInstance().getLineData(firstLineId);
						if (lineData.lineState == "Hold") {
							cti.updateContent("dnState", "保持");
							cti.UIManager.getInstance().changeButtonWhenHold();
							if (result.callState != 2) {
								retrieveCall(lineData.connId);
							}
						}
					} else {
						cti.updateContent("dnState", "空闲");
						cti.UIManager.getInstance().changeButtonWhenIdle();
					}
				} else {
					var isPhoneIdle = cti.Line.getInstance().isPhoneIdle();
					if (isPhoneIdle == false) {
						var secondLineId = cti.Line.getInstance().getBusyLine();
						var secondLineData = cti.Line.getInstance().getLineData(secondLineId);
						if (secondLineData.callType == "Consult") {
							$("#holdBtn").linkbutton({'text': '保持'});
							cti.UIManager.getInstance().changeButtonWhenFirstIdle();
						}
					} else {
						cti.updateContent("dnState", "空闲");
						cti.UIManager.getInstance().changeButtonWhenIdle();
						$("#holdBtn").linkbutton({'text': '保持'});

					}
				}
			}
		}
	//}
}

/**
 * 收到UserEvent触发此函数
 * @param result
 * @return
 */
function onUserEvent(result){
}

/**
 * 收到监听事件触发此函数
 * @param result
 * @return
 */
function onMonitoringEvent(result){
}

/**
 * 主备切换时触发此函数
 * @return
 */
function onPrimaryChangedEvent(){
	//showMessage("SIPServer主备发生切换");
}

/**
 * 收到会话消息触发此函数
 * @param result
 * @return
 */
function onSessionInfo(result) {

}

/**
 * 会话中有人加入触发此函数
 * @param result
 * @return
 */
function onPartyJoin(result){

}

/**
 * 会话中有人离开触发此函数
 * @param result
 * @return
 */
function onPartyLeft(result){

}

function logMesssage(result) {
	$("#eventDiv").append(result+"<br><br>");
	try {
		var div = document.getElementById("eventDiv");
		div.scrollTop = div.scrollHeight;
	}catch(e){
	}
}