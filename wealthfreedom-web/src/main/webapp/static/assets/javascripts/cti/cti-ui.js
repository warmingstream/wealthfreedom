/**
 * author:ZHL 2015.10.26
**/
jQuery.namespace('cti');

var reasonMap = new Map();

$(document).ready(function(){
	
	cti.onCTIClick = function(event) {
		if(msgState==CHANNELSTATE.Closed) {
			showMessage("与消息服务器连接已断开，请刷新重试");
			return;
		}
		if(ctiState==CHANNELSTATE.Closed) {
			showMessage("与CTI服务器连接已断开，请检查服务运行状态");
			return;
		}
		var buttonName = event.data.buttonName;
		var className = $("#"+buttonName).attr("class");
		if(/disabled/.test(className)){
			return;
		}
		if(buttonName=="loginBtn"){
			var state = cti.Agent.getInstance().getState();
			if(state=="Logout") {
				cti.agentLogin();
			} else {
				var isPhoneIdle = cti.Line.getInstance().isPhoneIdle();
				if(isPhoneIdle) {
					cti.agentLogout();
				} else {
					showMessage("当前坐席有未结束的通话，禁止登出");
				}
			}
		}else if(buttonName=="stateBtn"){
			var state = cti.Agent.getInstance().getState();
			if(state=='Logout'){
				showMessage('坐席未登入，不能切换状态');
				return;
			}
			var isPhoneIdle = cti.Line.getInstance().isPhoneIdle();
			if(!isPhoneIdle) {
				showMessage('坐席通话中，不能切换状态');
				return;
			}
			if(state=='Ready'){
				var reasonCode = $("#reasonCode").val();
				if(reasonCode==""){
					showMessage('请您在左边的下拉菜单中选择需要设置的忙碌原因');
					return;
				}
				cti.agentNotReady(reasonCode, 0);
			}else{
				cti.agentReady();
				document.getElementById("reasonCode").value = "";
			}
		}else if(buttonName=="reasonCode"){
			var isPhoneIdle = cti.Line.getInstance().isPhoneIdle();
			if(!isPhoneIdle) {
				showMessage('坐席通话中，不能切换状态');
				return;
			}
			var reasonCode = $("#reasonCode").val();
			if(reasonCode!=""){
				cti.agentNotReady(reasonCode, 0);
			}
		}else if(buttonName=="answerBtn") {
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
			if(lineData.lineState == "Ringing"){
				cti.answerCall(lineData.callId);
			}
		}else if(buttonName=="dialBtn"){
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
			if(lineData.lineState == "" && cti.Agent.getInstance().getState() != 'Logout'){
				var phoneNumber = $('#phoneNumber').val();
				if(phoneNumber==""){
					showMessage("请输入号码");
					return;
				}
				if(phoneNumber==cti.Agent.getInstance.getThisDN){
					showMessage("不能呼叫自己");
					return;
				}
            	cti.makeCall(phoneNumber);
			}
		}else if(buttonName=="hangupBtn"){
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
			if(lineData.lineState == ""){
				showMessage("当前线路没有电话,无需挂断");
			}else{
				if(lineData.callType==CALLTYPE.INBOUND || lineData.callType==CALLTYPE.OUTBOUND) {
					if(lineData.lineState=="Dialing" || lineData.lineState=="Ringing") {
						cti.releaseCall(lineData.callId);
					}else{
						if(lineData.action!=""){
							if(lineData.action=="internal") {
								var params = '{"extensions":{"Operation":"csr"}}';
								cti.singleStepTransfer(lineData.callId, "8002", params);
							} else {
								cti.releaseCall(lineData.callId);
							}
						} else {
							if(lineData.callState==CALLSTATE.Conferenced) {
								cti.releaseCall(lineData.callId);
							} else {
								var params = '{"extensions":{"Operation":"csr"}}';
								cti.singleStepTransfer(lineData.callId, "8002", params);
							}
						}
					}
				} else {
					cti.releaseCall(lineData.callId);
				}
			}
			
		}else if(buttonName=="holdBtn"){
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
			if(lineData.lineState == "Hold"){
				cti.retrieveCall(lineData.callId);
			}else if(lineData.lineState == "Talking" || lineData.lineState == "Dialing"){
				if(lineData.callType==CALLTYPE.CONSULT) {
					cti.retrieveCall(lineData.callId);
				}else{
					cti.holdCall(lineData.callId);
				}
			}
		}else if(buttonName=="transferBtn"){
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
            if(lineData.lineState == "Talking" || lineData.lineState == "Hold"){
            	if(lineData.callType==CALLTYPE.CONSULT) {
            		var holdLineId = cti.Line.getInstance().getHoldLine();
            		if(holdLineId!=-1) {
            			var holdLineData = cti.Line.getInstance().getLineData(holdLineId);
            			cti.completeTransfer(holdLineData.callId, lineData.callId);
            		} else {
            			showMessage("一线已挂断，不能完成转接");
            		}
            	} else {
					var phoneNumber = $('#phoneNumber').val();
					if(phoneNumber=="") {
						showMessage('请输入要转接的号码');
						return;
					}
	            	cti.initiateTransfer(lineData.callId, phoneNumber);
            	}
            }else{
                showMessage("当前线路未在通话中，不能转接");
            }
		}else if(buttonName=="conferenceBtn"){
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
			var otherDN = lineData.phoneNumber;
            var thisDN = cti.Agent.getInstance().getThisDN();
            if(lineData.lineState == "Talking" || lineData.lineState == "Hold"){
            	if(lineData.callType==CALLTYPE.CONSULT) {
            		var holdLineId = cti.Line.getInstance().getHoldLine();
            		if(holdLineId!=-1) {
            			var holdLineData = cti.Line.getInstance().getLineData(holdLineId);
            			cti.completeConference(holdLineData.callId, lineData.callId);
            		} else {
            			showMessage("一线已挂断，不能完成会议");
            		}
            	} else {
					var phoneNumber = $('#phoneNumber').val();
					if(phoneNumber==""){
						showMessage("请输入会议号码");
						return;
					}
            		if(phoneNumber == thisDN) {
            			showMessage("不能会议自己");
            		} else if(phoneNumber == otherDN) {
                     	showMessage("不能会议正在通话的号码");
            		} else {
            			cti.initiateConference(lineData.callId, phoneNumber);
            		}
            	}
            }else{
                showMessage("当前线路未在通话中，不能会议");
            }
		}
	};
	
	cti.onCTIMouseOver = function(event) {
	};
	
	cti.onCTIMouseOut = function(event) {
	};
	
	cti.onCTIMouseDown = function(event) {
	};
	
	cti.onCTIMouseUp = function(event) {
	};
	
	$("#stateBtn").bind('click',{buttonName:'stateBtn'},cti.onCTIClick);
	$("#reasonCode").bind('change',{buttonName:'reasonCode'},cti.onCTIClick);
	$("#loginBtn").bind('click',{buttonName:'loginBtn'},cti.onCTIClick);
	$("#answerBtn").bind('click',{buttonName:'answerBtn'},cti.onCTIClick);
	$("#dialBtn").bind('click',{buttonName:'dialBtn'},cti.onCTIClick);
	$("#hangupBtn").bind('click',{buttonName:'hangupBtn'},cti.onCTIClick);
	$("#holdBtn").bind('click',{buttonName:'holdBtn'},cti.onCTIClick);
	$("#transferBtn").bind('click',{buttonName:'transferBtn'},cti.onCTIClick);
	$("#conferenceBtn").bind('click',{buttonName:'conferenceBtn'},cti.onCTIClick);
	
	reasonMap.put("R00", "会议");
	reasonMap.put("R01", "用餐");
	reasonMap.put("R02", "上课");
	reasonMap.put("R03", "洗手间");
	reasonMap.put("R04", "外拨");
	reasonMap.put("R05", "小休");
	reasonMap.put("R06", "关单");
	
	$("#reasonCode").append("<option value=''>离开原因</option>");
	var keys = reasonMap.keys();
	for(var i in keys) {
		$("#reasonCode").append("<option value='"+keys[i]+"'>"+reasonMap.get(keys[i])+"</option>");
	}

	$("#phoneNumber").inputNumber();
});
cti.UIManager = function(){
	this._initialized = false;
};
	
cti.UIManager.instance = null;

cti.UIManager.getInstance = function(){
	if (cti.UIManager.instance == null) {
		cti.UIManager.instance = new cti.UIManager();
	}
	return cti.UIManager.instance;
};

cti.UIManager.prototype.changeButtonWhenLogin = function(){
	if(!this._initialized){
		this._initialized = true;
		this.changeToEnabled("dialBtn");
	}
};

cti.UIManager.prototype.changeButtonWhenNotReady = function(workMode){
	this.changeToEnabled("stateBtn");
	if(cti.Line.getInstance().isPhoneIdle()){
		if(workMode==3) {
			this.changeToDisabled("dialBtn");
		} else {
			this.changeToEnabled("dialBtn");
		}
	}else{
		this.changeToDisabled("dialBtn");
	}
};
					
cti.UIManager.prototype.changeButtonWhenReady = function(){
	this.changeToEnabled("stateBtn");
	if(cti.Line.getInstance().isPhoneIdle()){
		this.changeToEnabled("dialBtn");
	}else{
		this.changeToDisabled("dialBtn");
	}
};

cti.UIManager.prototype.changeButtonWhenLogout = function(){
	this._initialized = false;
	this.changeToDisabled("stateBtn");
	this.changeToDisabled("dialBtn");
};

cti.UIManager.prototype.changeButtonWhenRinging = function(callType){
	this.changeToEnabled("answerBtn");
	this.changeToDisabled("dialBtn");
	if(callType==CALLTYPE.INTERNAL || callType==CALLTYPE.CONSULT) {
		this.changeToEnabled("hangupBtn");
	} else {
		this.changeToDisabled("hangupBtn");
	}
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
};

cti.UIManager.prototype.changeButtonWhenDialing = function(){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
};

cti.UIManager.prototype.changeButtonWhenConsultDialing = function(){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToDisabled("hangupBtn");
	this.changeToEnabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
};

cti.UIManager.prototype.changeButtonWhenTalking = function(){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	this.changeToEnabled("holdBtn");
	this.changeToEnabled("conferenceBtn");
	this.changeToEnabled("transferBtn");
};

cti.UIManager.prototype.changeButtonWhenConsultTalking = function(operation){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	if(operation=="Transfer") {
		this.changeToDisabled("hangupBtn");
		this.changeToEnabled("holdBtn");
		this.changeToDisabled("conferenceBtn");
		this.changeToEnabled("transferBtn");
	}else if(operation=="Conference") {
		this.changeToDisabled("hangupBtn");
		this.changeToEnabled("holdBtn");
		this.changeToEnabled("conferenceBtn");
		this.changeToDisabled("transferBtn");
	}else if(operation=="Consult") {
		this.changeToEnabled("hangupBtn");
		this.changeToDisabled("holdBtn");
		this.changeToDisabled("conferenceBtn");
		this.changeToDisabled("transferBtn");
	}
};

cti.UIManager.prototype.changeButtonWhenHold = function(){						
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	this.changeToEnabled("holdBtn");
	this.changeToEnabled("conferenceBtn");
	this.changeToEnabled("transferBtn");
};

cti.UIManager.prototype.changeButtonWhenIdle = function(){
	this.changeToDisabled("answerBtn");
	this.changeToEnabled("dialBtn");
	this.changeToDisabled("hangupBtn");
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
};

cti.UIManager.prototype.changeButtonWhenFirstIdle = function(){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
};

cti.UIManager.prototype.changeButtonWhenPartyAdded = function(){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
};

cti.UIManager.prototype.changeButtonWhenPartyDeleted = function(){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
};

cti.UIManager.prototype.changeButtonWhenPartyChanged = function(callState){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	if(callState==CALLSTATE.Conferenced) {
		this.changeToDisabled("holdBtn");
		this.changeToDisabled("conferenceBtn");
		this.changeToDisabled("transferBtn");
	}else{
		this.changeToEnabled("holdBtn");
		this.changeToEnabled("conferenceBtn");
		this.changeToEnabled("transferBtn");
	}
};

cti.UIManager.prototype.reset = function(){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToDisabled("hangupBtn");
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
	this.changeToDisabled("stateBtn");
};

cti.UIManager.prototype.changeToEnabled = function(buttonName){
	$("#"+buttonName).attr("disabled", false);
	if(buttonName!="stateBtn") {
		var currentClass = $("#"+buttonName).attr("class");
	    if(currentClass.lastIndexOf("_enabled") == -1){
	    	$("#"+buttonName).attr("class", buttonName+"_enabled");
	    }
	}
};

cti.UIManager.prototype.changeToDisabled = function(buttonName){
	$("#"+buttonName).attr("disabled", true);
	if(buttonName!="stateBtn") {
		var currentClass = $("#"+buttonName).attr("class");
	    if(currentClass.lastIndexOf("_disabled") == -1){
	    	$("#"+buttonName).attr("class", buttonName+"_disabled");
	    }
	}
};
