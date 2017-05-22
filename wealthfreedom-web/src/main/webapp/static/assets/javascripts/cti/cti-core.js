/**
 * author:ZHL 2015.10.26
**/
jQuery.namespace('cti');

cti.Agent = function(){
	this.state = 'Logout';
	this.reason = '';
	this.thisDN = '';
	this.agentId = '';
	this.workMode = '';
};

cti.Agent.instance = null;

cti.Agent.getInstance = function(){
	if (cti.Agent.instance == null) {
		cti.Agent.instance = new cti.Agent();
	}
	return cti.Agent.instance;
};

cti.Agent.prototype.init = function(thisDN, agentId){
	this.thisDN = thisDN;
	this.agentId = agentId;
};

cti.Agent.prototype.setState = function(state){
	this.state = state;
};

cti.Agent.prototype.getState =function(){
	return this.state;
};

cti.Agent.prototype.setReason = function(reason){
	this.reason = reason;
};
 
cti.Agent.prototype.getReason = function(){
	return this.reason;
};

cti.Agent.prototype.setWorkMode = function(workMode){
	this.workMode = workMode;
};
 
cti.Agent.prototype.getWorkMode = function(){
	return this.workMode;
};

cti.Agent.prototype.getThisDN = function(){
	return this.thisDN;
};

cti.Agent.prototype.getAgentId = function(){
	return this.agentId;
};

cti.Agent.prototype.changeAgentState = function(messageId, state, reasonCode, workMode){
	this.setState(state);
	this.setReason(reasonCode);
	this.setWorkMode(workMode);
	switch(messageId){
		case MessageID.EventAgentLogin:
			cti.UIManager.getInstance().changeButtonWhenLogin();
			break;
		case MessageID.EventAgentReady:
			cti.UIManager.getInstance().changeButtonWhenReady();
			break;
		case MessageID.EventAgentNotReady:
			cti.UIManager.getInstance().changeButtonWhenNotReady(workMode);
			break;
		case MessageID.EventAgentLogout:
			cti.UIManager.getInstance().changeButtonWhenLogout();
			break;
	}
};

cti.Agent.prototype.reset = function(){
	this.state = 'Logout';
	this.reason = '';
	this.workMode = '';
}

cti.LineData = function () {
	this.lineState = "";
	this.phoneNumber = "";
	this.callType = -1;
	this.callId = "";
	this.action = "";
	this.parties = new Array();
};

cti.Line = function () {
	this.MAX_LINES = 2;
	this.lineId = 0;
	this.lineDatas = new Array(this.MAX_LINES);
};

cti.Line.instance = null;

cti.Line.getInstance = function(){
	if (cti.Line.instance == null) {
		cti.Line.instance = new cti.Line();
	}
	return cti.Line.instance;
};

cti.Line.prototype.init = function(){
	for (var index = 0; index < this.MAX_LINES; index++) {
		this.lineDatas[index] = new cti.LineData();
	}
};
	
cti.Line.prototype.getLineData = function(lineId) {
	return this.lineDatas[lineId];
};

cti.Line.prototype.getFreeLine = function() {
	var lineId = -1;
	for (var index = 0; index < this.MAX_LINES; index++) {
		if(this.lineDatas[index].callId == ""){
			lineId = index;
			break;
		}
	}
	if(lineId == this.MAX_LINES){
		showMessage("没有空闲线路");
	}
	return lineId;
};

cti.Line.prototype.getTalkingLine = function() {
	var lineId = -1;
	for (var index = 0; index < this.MAX_LINES; index++) {
		if(this.lineDatas[index].lineState == "Talking"){
			lineId = index;
			break;
		}
	}
	if(lineId == this.MAX_LINES){
		showMessage("没有通话线路");
	}
	return lineId;
};

cti.Line.prototype.getHoldLine = function() {
	var lineId = -1;
	for (var index = 0; index < this.MAX_LINES; index++) {
		if(this.lineDatas[index].lineState == "Hold"){
			lineId = index;
			break;
		}
	}
	if(lineId == this.MAX_LINES){
		showMessage("没有保持线路");
	}
	return lineId;
};

cti.Line.prototype.getBusyLine = function() {
	var lineId = -1;
	for (var index = 0; index < this.MAX_LINES; index++) {
		if(this.lineDatas[index].lineState!=""){
			lineId = index;
			break;
		}
	}
	return lineId;
};

cti.Line.prototype.getLineByCallId = function(callId) {
	if(callId != null && callId != "") {
		for (var index = 0; index < this.MAX_LINES; index++) {
			if (this.lineDatas[index].callId == callId) {
				return index;
			}
		}
	}
};

cti.Line.prototype.setCurrentLineId = function(lineId) {
	this.lineId = lineId;
};
			
cti.Line.prototype.getCurrentLineId = function () {
	return this.lineId;
};

cti.Line.prototype.stateChange = function (messageId, lineId, callType, callState, callId, otherDN) {
	switch(messageId){
		case MessageID.EventReleased:
		case MessageID.EventAbandoned:
			this.lineDatas[lineId].lineState = "";
			this.lineDatas[lineId].phoneNumber = "";
			this.lineDatas[lineId].callType = -1;
			this.lineDatas[lineId].callState = callState;
			this.lineDatas[lineId].callId = "";
			this.lineDatas[lineId].action = "";
			break;
		case MessageID.EventDialing:
			this.lineDatas[lineId].lineState = "Dialing";
			this.lineDatas[lineId].phoneNumber = otherDN!=null?otherDN:"";
			this.lineDatas[lineId].callType = callType;
			this.lineDatas[lineId].callState = callState;
			this.lineDatas[lineId].callId = callId;
			break;
		case MessageID.EventEstablished:
			if(callId == "" || callId == null) break;
			this.lineDatas[lineId].parties = new Array();
			this.lineDatas[lineId].lineState = "Talking";
			this.lineDatas[lineId].callType = callType;
			this.lineDatas[lineId].callState = callState;
			this.lineDatas[lineId].callId = callId;
			this.lineDatas[lineId].parties.push(otherDN);
			this.lineDatas[lineId].phoneNumber = otherDN!=null&&otherDN!="Unknown"?otherDN:"";
			break;
		case MessageID.EventRinging:
			this.lineDatas[lineId].lineState = "Ringing";
			this.lineDatas[lineId].callType = callType;
			this.lineDatas[lineId].callState = callState;
			this.lineDatas[lineId].callId = callId;
			this.lineDatas[lineId].phoneNumber = otherDN!=null&&otherDN!="Unknown"?otherDN:"";
			break;
		case MessageID.EventHeld:
			this.lineDatas[lineId].lineState = "Hold";
			break;
		case MessageID.EventRetrieved:
			this.lineDatas[lineId].lineState = "Talking";
			break;
		case MessageID.EventPartyChanged:
			this.lineDatas[lineId].parties = new Array();
			this.lineDatas[lineId].lineState = "Talking";
			this.lineDatas[lineId].callType = callType;
			this.lineDatas[lineId].callState = callState;
			this.lineDatas[lineId].callId = callId;
			this.lineDatas[lineId].parties.push(otherDN);
			this.lineDatas[lineId].phoneNumber = otherDN!=null&&otherDN!="Unknown"?otherDN:"";
			break;
		case MessageID.EventPartyAdded:
			this.lineDatas[lineId].lineState = "Talking";
			this.lineDatas[lineId].callType = callType;
			this.lineDatas[lineId].callState = callState;
			this.lineDatas[lineId].callId = callId;
			this.lineDatas[lineId].phoneNumber = otherDN!=null&&otherDN!="Unknown"?otherDN:"";
			break;
		default:
			break;
	}
};	
					
cti.Line.prototype.isPhoneIdle = function(){
	var isIdle = true;
	for(var index = 0;index < this.MAX_LINES;index++){
	    if(this.lineDatas[index].lineState!=""){
	    	isIdle = false;
	        break;
	    }
	}
	return isIdle;
};

cti.Line.prototype.reset = function(){
	for(var index = 0; index < this.MAX_LINES; index++){
		if(this.lineDatas[index].lineState != ""){
			this.lineDatas[index].lineState = "";
			this.lineDatas[index].phoneNumber = "";
			this.lineDatas[index].callType = -1;
			this.lineDatas[index].callId = "";
			this.lineDatas[index].action = "";
		}
	}
	this.lineId = 0;
}

cti.updateContent = function(elementName,value){
	$("#"+elementName).html(value);
};

cti.indexOf = function(arr, obj){
	if(arr.length < 1) return -1;
	for(var temp = 0; temp < arr.length; temp++){
		if(arr[temp] == obj)
			return temp;
	}
};

$(document).ready(function(){
	cti.Line.getInstance().init();
});