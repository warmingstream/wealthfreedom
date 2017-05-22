/**
 * author:ZHL 2014.12.12
**/
jQuery.namespace('cti');

var reasonMap = new Map();

$(document).ready(function(){
	
	cti.onCTIClick = function(buttonName) {
		var status = statusMap.get("sipServer");
		if(status=="Disconnected") {
			showMessage("SIP Server未连接");
			return;
		}
		if(buttonName=="loginBtn"){
			var state = cti.Agent.getInstance().getState();
			if(state=="LoggedOut") {
				login("voice");
			} else {
				var isPhoneIdle = cti.Line.getInstance().isPhoneIdle();
				if(isPhoneIdle) {
					logout("voice");
				} else {
					showMessage("当前坐席有未结束的通话，禁止登出");
				}
			}
		}else if(buttonName=="stateBtn"){
			var state = cti.Agent.getInstance().getState();
			if(state=='LoggedOut'){
				showMessage('坐席未登入，不能切换状态');
				return;
			}
			if(state=='Ready'){
				var reasonCode = $("#reasonCode").val();
				if(reasonCode==""){
					showMessage('请您在左边的下拉菜单中选择需要设置的忙碌原因');
					return;
				}
				notReady("voice", reasonCode, "0");
			}else{
				ready("voice");				
			}
		}else if(buttonName=="answerBtn"){
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
			if(lineData.lineState == "Ringing"){
				answerCall(lineData.connId);
			}
		}else if(buttonName=="dialBtn"){
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
			if(lineData.lineState == "" && cti.Agent.getInstance().getState() != 'LoggedOut'){
				var phoneNumber = $('#phoneNumber').val();
				if(phoneNumber==""){
					showMessage("请输入号码");
					return;
				}
                else if (resetPhoneNum(phoneNumber)=="false"){
                    return;
                }
            		makeCall(resetPhoneNum(phoneNumber));
			}
		}else if(buttonName=="hangupBtn"){
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
			if(lineData.lineState == ""){
				showMessage("当前线路没有电话,无需挂断");
			}else{
				if(lineData.callType=="Inbound" || lineData.callType=="Outbound") {
					if(lineData.lineState=="Dialing" || lineData.lineState=="Ringing") {
						releaseCall(lineData.connId);
					}else{
						var otherNumber = getConfigValue("satisfactionTransferDN");
						if(otherNumber!="") {
							singleStepTransfer(otherNumber, lineData.connId);
						}else{
							releaseCall(lineData.connId);
						}
					}
				} else {
					releaseCall(lineData.connId);
				}
			}
			
		}else if(buttonName=="holdBtn"){
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
			if(lineData.lineState == "Hold"){
				retrieveCall(lineData.connId);
			}else if(lineData.lineState == "Talking" || lineData.lineState == "Dialing"){
				if(lineData.callType=="Consult") {
					releaseCall(lineData.connId);
				}else{
					holdCall(lineData.connId);
				}
			}
		}else if(buttonName=="transferBtn"){
			var skill = $("#skillInfo").val();
			var phoneNumber = $('#phoneNumber').val();
			if(skill=="" && phoneNumber=="") {
				showMessage('请选择要咨询转接的技能组');
				return;
			}
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
            if(lineData.lineState == "Talking" || lineData.lineState == "Hold"){
            	if(lineData.callType=="Consult") {
            		var holdLineId = cti.Line.getInstance().getHoldLine();
            		if(holdLineId!=-1) {
            			var holdLineData = cti.Line.getInstance().getLineData(holdLineId);
            			completeTransfer(holdLineData.connId, lineData.connId);
            		} else {
            			showMessage("一线已挂断，不能完成转接");
            		}
            	} else {
            		if(skill!="") {
	            		var otherNumber = getConfigValue("consultTransferDN");
	            		var params = '{"UserData":{"operation":"transfer", "transferTarget":"'+skill+'"}}';
	            		initiateTransfer(otherNumber, lineData.connId, toJSON(params));
            		} else {
            			var otherNumber = getConfigValue("otoTransferDN");
	            		var params = '{"UserData":{"operation":"transfer", "oto_ani":"'+phoneNumber+'"}}';
	            		singleStepTransfer(otherNumber, lineData.connId, toJSON(params));
            		}
            	}
            }else{
                showMessage("当前线路未在通话中，不能转接");
            }
		}else if(buttonName=="conferenceBtn"){
			var phoneNumber = $('#phoneNumber').val();
			if(phoneNumber==""){
				showMessage("请输入会议号码");
				return;
			}
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
			var otherNumber = lineData.phoneNumber;
            var thisDN = cti.Agent.getInstance().getThisDN();
            if(lineData.lineState == "Talking" || lineData.lineState == "Hold"){
            	if(lineData.callType=="Consult") {
            		var holdLineId = cti.Line.getInstance().getHoldLine();
            		if(holdLineId!=-1) {
            			var holdLineData = cti.Line.getInstance().getLineData(holdLineId);
            			completeConference(holdLineData.connId, lineData.connId);
            		} else {
            			showMessage("一线已挂断，不能完成会议");
            		}
            	} else {
            		if(phoneNumber == thisDN) {
            			showMessage("不能会议自己");
            		} else if(phoneNumber == otherNumber) {
                     	showMessage("不能会议正在通话的号码");
            		} else {
            			var params = {"UserData":{"operation":"conference"}};
            			initiateConference(phoneNumber, lineData.connId, params);
            		}
            	}
            }else{
                showMessage("当前线路未在通话中，不能会议");
            }
		}else if(buttonName=="ivrBtn"){
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
			var otherDN = getConfigValue("ivrTransferDN");
			var params = {"UserData":{"operation":"ivr"}};
			initiateTransfer(otherDN, lineData.connId, params);
		}else if(buttonName=="tpinBtn"){
			var lineId = cti.Line.getInstance().getCurrentLineId();
			var lineData = cti.Line.getInstance().getLineData(lineId);
			if(lineData.lineState == "Hold"){
				var otherDN = getConfigValue("tpinCancelDN");
				forceOut(lineData.connId, otherDN, 1);
			}else{
				var ivr = $("#ivrInfo").val();
				if(ivr=="") {
					showMessage('请选择密码 护航路由点');
					return;
				}
				var otherNumber = lineData.phoneNumber;
				var params = '{"UserData":{"operation":"tpin","v_ani":"'+otherNumber+'"}}';
				initiateConference(ivr, lineData.connId, toJSON(params));
			}
		}
	};
	
	cti.onCTIMouseOver = function(event) {
		var buttonName = event.data.buttonName;
	};
	
	cti.onCTIMouseOut = function(event) {
		var buttonName = event.data.buttonName;
	};
	
	cti.onCTIMouseDown = function(event) {
		var buttonName = event.data.buttonName;
	};
	
	cti.onCTIMouseUp = function(event) {
		var buttonName = event.data.buttonName;
	};
	
	reasonMap.put("R00", "会议");
	reasonMap.put("R01", "用餐");
	reasonMap.put("R02", "上课");
	reasonMap.put("R03", "洗手间");
	reasonMap.put("R04", "外拨");
	reasonMap.put("R05", "小休");
	reasonMap.put("R06", "关单");
	
	$("#reasonCode").append("<option value=''>请选择事由</option>");
	var keys = reasonMap.keys();
	for(var i in keys) {
		$("#reasonCode").append("<option value='"+keys[i]+"'>"+reasonMap.get(keys[i])+"</option>");
	}
	
	$("#ivrInfo").append("<option value=''>请选择路由点</option>");
	$("#ivrInfo").append("<option value='100081'>100081</option>");
	$("#ivrInfo").append("<option value='100082'>100082</option>");
	$("#ivrInfo").append("<option value='100083'>100083</option>");
	$("#ivrInfo").append("<option value='100084'>100084</option>");
	$("#ivrInfo").append("<option value='100085'>100085</option>");
	$("#ivrInfo").append("<option value='100086'>100086</option>");
	$("#ivrInfo").append("<option value='100087'>100087</option>");
	$("#ivrInfo").append("<option value='100088'>100088</option>");
	$("#ivrInfo").append("<option value='100089'>100089</option>");
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

cti.UIManager.prototype.changeButtonWhenNotReady = function(){
	this.changeToEnabled("stateBtn");
	if(cti.Line.getInstance().isPhoneIdle()){
		this.changeToEnabled("dialBtn");
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

cti.UIManager.prototype.changeButtonWhenRinging = function(){
	this.changeToEnabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
	this.changeToDisabled("ivrBtn");
	this.changeToDisabled("tpinBtn");
};

cti.UIManager.prototype.changeButtonWhenDialing = function(){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
	this.changeToDisabled("ivrBtn");
	this.changeToDisabled("tpinBtn");
};

cti.UIManager.prototype.changeButtonWhenConsultDialing = function(){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToDisabled("hangupBtn");
	this.changeToEnabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
	this.changeToDisabled("ivrBtn");
	this.changeToDisabled("tpinBtn");
};

cti.UIManager.prototype.changeButtonWhenTalking = function(){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	this.changeToEnabled("holdBtn");
	this.changeToEnabled("conferenceBtn");
	this.changeToEnabled("transferBtn");
	this.changeToEnabled("ivrBtn");
	this.changeToEnabled("tpinBtn");
};

cti.UIManager.prototype.changeButtonWhenConsultTalking = function(operation){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToDisabled("hangupBtn");
	this.changeToEnabled("holdBtn");
	if(operation=="Transfer") {
		this.changeToDisabled("conferenceBtn");
		this.changeToEnabled("transferBtn");
	}else if(operation=="Conference") {
		this.changeToEnabled("conferenceBtn");
		this.changeToDisabled("transferBtn");
	}else if(operation=="Consult") {
		this.changeToDisabled("conferenceBtn");
		this.changeToDisabled("transferBtn");
	}
	this.changeToDisabled("ivrBtn");
	this.changeToDisabled("tpinBtn");
};


cti.UIManager.prototype.changeButtonWhenHold = function(){						
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	this.changeToEnabled("holdBtn");
	this.changeToEnabled("conferenceBtn");
	this.changeToEnabled("transferBtn");
	this.changeToEnabled("ivrBtn");
	this.changeToEnabled("tpinBtn");
};

cti.UIManager.prototype.changeButtonWhenTPinHold = function(){						
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
	this.changeToDisabled("ivrBtn");
	this.changeToEnabled("tpinBtn");
};

cti.UIManager.prototype.changeButtonWhenIdle = function(){
	this.changeToDisabled("answerBtn");
	this.changeToEnabled("dialBtn");
	this.changeToDisabled("hangupBtn");
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
	this.changeToDisabled("ivrBtn");
	this.changeToDisabled("tpinBtn");
};

cti.UIManager.prototype.changeButtonWhenFirstIdle = function(){
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToEnabled("hangupBtn");
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
	this.changeToDisabled("ivrBtn");
	this.changeToDisabled("tpinBtn");
};

cti.UIManager.prototype.reset = function(){
	$("#loginBtn").linkbutton({'text':'登录'});
	$("#holdBtn").linkbutton({'text':'保持'});
	$("#transferBtn").linkbutton({'text':'转接'});
	$("#conferenceBtn").linkbutton({'text':'会议'});
	this.changeToDisabled("answerBtn");
	this.changeToDisabled("dialBtn");
	this.changeToDisabled("hangupBtn");
	this.changeToDisabled("holdBtn");
	this.changeToDisabled("conferenceBtn");
	this.changeToDisabled("transferBtn");
	this.changeToDisabled("ivrBtn");
	this.changeToDisabled("tpinBtn");
	cti.updateContent("agentState","离线");
	cti.updateContent("dnState","");
};

cti.UIManager.prototype.changeToEnabled = function(buttonName){
	$("#"+buttonName).linkbutton('enable');
};

cti.UIManager.prototype.changeToDisabled = function(buttonName){
	$("#"+buttonName).linkbutton('disable');
};

cti.UIManager.prototype.show = function(buttonName){
	$("#"+buttonName).show();
};

cti.UIManager.prototype.hide = function(buttonName){
	$("#"+buttonName).hide();
};