/**
 * author:ZHL 2013.05.27
**/
function appletReady(){
	onAppletReady();
}

function initFailed(){
	onInitFailed();
}

function handleError(result) {
	result = toJSON(result);
	onError(result);
}

function handleAgentStatusChanged(result) {
	result = toJSON(result);
	onAgentStatusChanged(result);
}

function handleForcedAgentStatusChanged(result) {
	result = toJSON(result);
	onForcedAgentStatusChanged(result);
}

function handleConnectionStatusChanged(result){
	result = toJSON(result);
	onConnectionStatusChanged(result);
}

function handleForcedConnectionStatusChanged(result){
	result = toJSON(result);
	onForcedConnectionStatusChanged(result);
}

function handleInteractionAdded(result) {
	try {
		result = toJSON(result);
		onInteractionAdded(result);
	} catch (e) {
		alert(e);
	}
}

function handleInteractionUpdated(result) {
	try {
		result = toJSON(result);
		onInteractionUpdated(result);
	} catch (e) {
		alert(e);
	}
}

function handleInteractionRemoved(result) {
	try {
		result = toJSON(result);
		onInteractionRemoved(result);
	} catch (e) {
		alert(e);
	}
}

function handleUserEvent(result) {
	try {
		result = toJSON(result);
		onUserEvent(result);
	} catch (e) {
		alert(e);
	}
}

function handleMonitoringEvent(result) {
	try {
		result = toJSON(result);
		onMonitoringEvent(result);
	} catch (e) {
		alert(e);
	}
}

function handleRegisteredEvent(result) {
	try {
		result = toJSON(result);
		onRegisteredEvent(result);
	} catch (e) {
		alert(e);
	}
}

function handlePrimaryChangedEvent() {
	onPrimaryChangedEvent();
}

function handleSessionInfo(result) {
	result = toJSON(result);
	onSessionInfo(result);
}

function handlePartyJoin(result){
	result = toJSON(result);
	onPartyJoin(result);
}

function handlePartyLeft(result){
	result = toJSON(result);
	onPartyLeft(result);
}

function toJSON(result) {
	return eval('(' + result + ')');
}