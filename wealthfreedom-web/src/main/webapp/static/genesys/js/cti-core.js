/**
 * author:ZHL 2014.12.12
**/
jQuery.namespace('cti');

cti.Agent = function(){
	this.state = 'LoggedOut';
	this.reason = -1;
	this.thisDN = '';
	this.agentID = '';
};

cti.Agent.instance = null;

cti.Agent.getInstance = function(){
	if (cti.Agent.instance == null) {
		cti.Agent.instance = new cti.Agent();
	}
	return cti.Agent.instance;
};

cti.Agent.prototype.init = function(thisDN, agentID){
	this.thisDN = thisDN;
	this.agentID = agentID;
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

cti.Agent.prototype.getThisDN = function(){
	return this.thisDN;
};

cti.Agent.prototype.getAgentID = function(){
	return this.agentID;
};

cti.Agent.prototype.updateAgentState = function(state, reason){
	this.setState(state);
	this.setReason(reason);
};

cti.LineData = function () {
	this.lineState = "";
	this.phoneNumber = "";
	this.callType = -1;
	this.connId = "";
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
		if(this.lineDatas[index].connId == ""){
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

cti.Line.prototype.getConsultLine = function() {
	var lineId = -1;
	for (var index = 0; index < this.MAX_LINES; index++) {
		if(this.lineDatas[index].callType == "Consult"){
			lineId = index;
			break;
		}
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


cti.Line.prototype.getLineByConnId = function(connId) {
	for (var index = 0; index < this.MAX_LINES; index++) {
		if(this.lineDatas[index].connId == connId){
			return index;
		}
	}
	return -1;
};

cti.Line.prototype.setCurrentLineId = function(lineId) {
	this.lineId = lineId;
};
			
cti.Line.prototype.getCurrentLineId = function () {
	return this.lineId;
};

cti.Line.prototype.stateChange = function (eventId, lineId, callType, callState, connId, otherDN) {
	switch(eventId){
		case EVENT.Released:
		case EVENT.Abandoned:
			this.lineDatas[lineId].lineState = "";
			this.lineDatas[lineId].phoneNumber = "";
			this.lineDatas[lineId].callType = -1;
			this.lineDatas[lineId].callState = callState;
			this.lineDatas[lineId].connId = "";
			break;
		case EVENT.Dialing:
			this.lineDatas[lineId].lineState = "Dialing";
			this.lineDatas[lineId].phoneNumber = otherDN!=null?otherDN:"";
			this.lineDatas[lineId].callType = callType;
			this.lineDatas[lineId].callState = callState;
			this.lineDatas[lineId].connId = connId;
			break;
		case EVENT.Established:
			if(connId == "" || connId == null) break;
			this.lineDatas[lineId].parties = new Array();
			this.lineDatas[lineId].lineState = "Talking";
			this.lineDatas[lineId].callType = callType;
			this.lineDatas[lineId].callState = callState;
			this.lineDatas[lineId].connId = connId;
			this.lineDatas[lineId].parties.push(otherDN);
			this.lineDatas[lineId].phoneNumber = otherDN!=null&&otherDN!="Unknown"?otherDN:"";
			break;
		case EVENT.Ringing:
			this.lineDatas[lineId].lineState = "Ringing";
			this.lineDatas[lineId].callType = callType;
			this.lineDatas[lineId].callState = callState;
			this.lineDatas[lineId].connId = connId;
			this.lineDatas[lineId].phoneNumber = otherDN!=null&&otherDN!="Unknown"?otherDN:"";
			break;
		case EVENT.Held:
			this.lineDatas[lineId].lineState = "Hold";
			break;
		case EVENT.Retrieved:
			this.lineDatas[lineId].lineState = "Talking";
			break;
		case EVENT.PartyChanged:
			this.lineDatas[lineId].parties = new Array();
			this.lineDatas[lineId].lineState = "Talking";
			this.lineDatas[lineId].callType = callType;
			this.lineDatas[lineId].callState = callState;
			this.lineDatas[lineId].connId = connId;
			this.lineDatas[lineId].parties.push(otherDN);
			this.lineDatas[lineId].phoneNumber = otherDN!=null&&otherDN!="Unknown"?otherDN:"";
			break;
		default:
			break;
	}
};
					
cti.Line.prototype.isPhoneIdle = function(){
	var isIdle = true;
	for(var index = 0; index < this.MAX_LINES; index++){
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
			this.lineDatas[index].connId = "";
		}
	}
	this.lineId = 0;
}

cti.updateContent = function(elementName,value){
	$("#"+elementName).text(value);
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