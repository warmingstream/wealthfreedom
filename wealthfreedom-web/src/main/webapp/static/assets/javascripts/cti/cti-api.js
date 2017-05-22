/**
 * author:ZHL 2015.10.22
**/
jQuery.namespace('cti');

cti.agentLogin = function() {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var agentId = cti.Agent.getInstance().getAgentId();
	var data = {"messageId":100,"thisDN":thisDN,"agentId":agentId};
	cti.send(data);
}
cti.agentReady = function() {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var agentId = cti.Agent.getInstance().getAgentId();
	var data = {"messageId":101,"thisDN":thisDN,"agentId":agentId};
	cti.send(data);
}
cti.agentNotReady = function(reasonCode, workMode) {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var agentId = cti.Agent.getInstance().getAgentId();
	var data = {"messageId":102,"thisDN":thisDN,"agentId":agentId,"reasonCode":reasonCode,"agentWorkMode":workMode};
	cti.send(data);
}
cti.agentLogout = function() {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var agentId = cti.Agent.getInstance().getAgentId();
	var data = {"messageId":103,"thisDN":thisDN,"agentId":agentId};
	cti.send(data);
}
cti.makeCall = function(phoneNumber, params) {
	if(checkPhoneNumber(phoneNumber)){
		var thisDN = cti.Agent.getInstance().getThisDN();
		var data = {"messageId":200,"thisDN":thisDN,"otherDN":phoneNumber,"params":params};
		cti.send(data);
		return true;
	}else{
		return false;
	}
}
cti.answerCall = function(callId) {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var data = {"messageId":201,"thisDN":thisDN,"callId":callId};
	cti.send(data);
}
cti.releaseCall = function(callId) {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var data = {"messageId":202,"thisDN":thisDN,"callId":callId};
	cti.send(data);
}
cti.holdCall = function(callId) {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var data = {"messageId":203,"thisDN":thisDN,"callId":callId};
	cti.send(data);
}
cti.retrieveCall = function(callId) {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var data = {"messageId":204,"thisDN":thisDN,"callId":callId};
	cti.send(data);
}
cti.redirectCall = function(callId, otherDN) {
	if(checkPhoneNumber(otherDN)){
		var thisDN = cti.Agent.getInstance().getThisDN();
		var data = {"messageId":205,"thisDN":thisDN,"callId":callId,"otherDN":otherDN};
		cti.send(data);
	}
}
cti.initiateTransfer = function(callId, otherDN) {
	if(checkPhoneNumber(otherDN)){
		var thisDN = cti.Agent.getInstance().getThisDN();
		var data = {"messageId":209,"thisDN":thisDN,"callId":callId,"otherDN":otherDN};
		cti.send(data);
	}
}
cti.completeTransfer = function(callId, consultCallId) {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var data = {"messageId":211,"thisDN":thisDN,"callId":callId,"consultCallId":consultCallId};
	cti.send(data);
}
cti.singleStepTransfer = function(callId, otherDN, params) {
	if(checkPhoneNumber(otherDN)){
		var thisDN = cti.Agent.getInstance().getThisDN();
		var data = {"messageId":207,"thisDN":thisDN,"callId":callId,"otherDN":otherDN, "params":params};
		cti.send(data);
	}
}
cti.initiateConference = function(callId, otherDN) {
	if(checkPhoneNumber(otherDN)){
		var thisDN = cti.Agent.getInstance().getThisDN();
		var data = {"messageId":208,"thisDN":thisDN,"callId":callId,"otherDN":otherDN};
		cti.send(data);
	}
}
cti.completeConference = function(callId, consultCallId) {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var data = {"messageId":210,"thisDN":thisDN,"callId":callId,"consultCallId":consultCallId};
	cti.send(data);
}
cti.singleStepConference = function(callId, otherDN) {
	if(checkPhoneNumber(otherDN)){
		var thisDN = cti.Agent.getInstance().getThisDN();
		var data = {"messageId":206,"thisDN":thisDN,"callId":callId,"otherDN":otherDN};
		cti.send(data);
	}
}
cti.sendDtmf = function(callId, dtmfDigits) {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var data = {"messageId":215,"thisDN":thisDN,"callId":callId,"dtmfDigits":dtmfDigits};
	cti.send(data);
}
cti.addAttachedData = function(callId, userData) {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var data = {"messageId":212,"thisDN":thisDN,"callId":callId,"userData":userData};
	cti.send(data);
}
cti.updateAttachedData = function(callId, userData) {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var data = {"messageId":214,"thisDN":thisDN,"callId":callId,"userData":userData};
	cti.send(data);
}
cti.deleteAttachedData = function(callId, userDataKeys) {
	var thisDN = cti.Agent.getInstance().getThisDN();
	var data = {"messageId":213,"thisDN":thisDN,"callId":callId,"userDataKeys":userDataKeys};
	cti.send(data);
}