/**
 * author:ZHL 2013.05.27
**/
var VOICE_STATUS_UNKNOWN="Unknown";
var VOICE_STATUS_DIALING="Dialing";
var VOICE_STATUS_TALKING="Established";
var VOICE_STATUS_RINGING="Ringing";
var VOICE_STATUS_HELD="Held";
var VOICE_STATUS_IDLE="Idle";
    
function checkSoftPhoneApplet(){
	if(SoftPhone){
		return true;
	}
	alert("未安装软电话插件");
	return false;
}

/**
 * 更新配置参数
 * @param key
 * @param value
 * @return
 */
function setParameter(key, value){
    if(!checkSoftPhoneApplet()){
		return ;
	}
    var result = SoftPhone.setParameter(key, value);
    return result;
}

/**
 * 座席登入
 * @param mediaType(voice, mm)
 * @return
 */
function login(mediaType) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.login(mediaType);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 签入指定的媒体类型
 * @param mediaType
 * @return
 */
function addMeida(mediaType) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.addMedia(mediaType);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 座席登出
 * @param mediaType(voice, mm)
 * @return
 */
function logout(mediaType) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.logout(mediaType);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 签出指定的媒体类型
 * @param mediaType
 * @return
 */
function removeMeida(mediaType) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.removeMedia(mediaType);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 置座席状态为Ready
 * @param mediaType
 * @return
 */
function ready(mediaType) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.ready(mediaType);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 置座席状态为NotReady
 * @param mediaType
 * @param reasonCode
 * @param workMode
 * @return
 */
function notReady(mediaType, reasonCode, workMode) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.notReady(mediaType, reasonCode, workMode);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 外拨电话
 * @param phoneNumber
 * @param params
 * @return
 */
function makeCall(phoneNumber, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==2){
		params = JSON.stringify(params);
		SoftPhone.makeCall(phoneNumber, params);
	}else{
		SoftPhone.makeCall(phoneNumber);
	}
}

/**
 * 接听电话
 * @param connId
 * @param params 可选参数
 * @return
 */
function answerCall(connId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==2){
		params = JSON.stringify(params);
		SoftPhone.answerCall(connId, params);
	}else{
		SoftPhone.answerCall(connId);
	}
}

/**
 * 挂断电话
 * @param connId
 * @param params 可选参数
 * @return
 */
function releaseCall(connId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==2){
		params = JSON.stringify(params);
		SoftPhone.releaseCall(connId, params);
	}else{
		SoftPhone.releaseCall(connId);
	}
}

/**
 * 保持电话
 * @param connId
 * @param params 可选参数
 * @return
 */
function holdCall(connId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==2){
		params = JSON.stringify(params);
		SoftPhone.holdCall(connId, params);
	}else{
		SoftPhone.holdCall(connId);
	}
}

/**
 * 保持取回
 * @param connId
 * @param params 可选参数
 * @return
 */
function retrieveCall(connId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	var status = getLineStatus(connId);
	if(status!=VOICE_STATUS_HELD){
		return ;
	}
	if(arguments.length==2){
		params = JSON.stringify(params);
		SoftPhone.retrieveCall(connId, params);
	}else{
		SoftPhone.retrieveCall(connId);
	}
}

/**
 * 发起转接(两步转接第一步)
 * @param phoneNumber
 * @param connId
 * @param params 可选参数
 * @return
 */
function initiateTransfer(phoneNumber, connId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==3){
		params = JSON.stringify(params);
		SoftPhone.initiateTransfer(connId, phoneNumber, params);
	}else{
		SoftPhone.initiateTransfer(connId, phoneNumber);
	}
}

/**
 * 完成转接(两步转接第二步)
 * @param connId
 * @param transferConnId
 * @param params 可选参数
 * @return
 */
function completeTransfer(connId, transferConnId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==3){
		params = JSON.stringify(params);
		SoftPhone.completeTransfer(connId, transferConnId, params);
	}else{
		SoftPhone.completeTransfer(connId, transferConnId);
	}
}

/**
 * 发起会议(两步会议第一步)
 * @param phoneNumber
 * @param connId
 * @param params 可选参数
 * @return
 */
function initiateConference(phoneNumber, connId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==3){
		params = JSON.stringify(params);
		SoftPhone.initiateConference(connId, phoneNumber, params);
	}else{
		SoftPhone.initiateConference(connId, phoneNumber);
	}
}

/**
 * 完成会议(两步会议第二步)
 * @param connId
 * @param conferenceConnId
 * @param params 可选参数
 * @return
 */
function completeConference(connId, conferenceConnId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==3){
		params = JSON.stringify(params);
		SoftPhone.completeConference(connId, conferenceConnId, params);
	}else{
		SoftPhone.completeConference(connId, conferenceConnId);
	}
}

/**
 * 单步转接
 * @param phoneNumber
 * @param connId
 * @param params 可选参数
 * @return
 */
function singleStepTransfer(otherDN, connId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==3){
		params = JSON.stringify(params);
		SoftPhone.singleStepTransfer(connId, otherDN, params);
	}else{
		SoftPhone.singleStepTransfer(connId, otherDN);
	}
}

/**
 * 盲转（SIP环境不支持）
 * @param otherDN
 * @param connId
 * @param params 可选参数
 * @return
 */
function muteTransfer(otherDN, connId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==3){
		params = JSON.stringify(params);
		SoftPhone.muteTransfer(connId, otherDN, params);
	}else{
		SoftPhone.muteTransfer(connId, otherDN);
	}
}

/**
 * 单步会议
 * @param otherDN
 * @param connId
 * @param params 可选参数
 * @return
 */
function singleStepConference(otherDN, connId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==3){
		params = JSON.stringify(params);
		SoftPhone.singleStepConference(connId, otherDN, params);
	}else{
		SoftPhone.singleStepConference(connId, otherDN);
	}
}

/**
 * 获取线路状态
 * @param connId
 * @return
 */
function getLineStatus(connId) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	return SoftPhone.getLineStatus(connId);
}

/**
 * 开启静音
 * @param connId
 * @param params 可选参数
 * @return
 */
function muteOn(connId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==2){
		params = JSON.stringify(params);
		SoftPhone.muteOn(connId, params);
	}else{
		SoftPhone.muteOn(connId);
	}
}

/**
 * 关闭静音
 * @param connId
 * @param params 可选参数
 * @return
 */
function muteOff(connId, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==2){
		params = JSON.stringify(params);
		SoftPhone.muteOff(connId, params);
	}else{
		SoftPhone.muteOff(connId);
	}
}

/**
 * 发送DTMF
 * @param connId
 * @param dtmfDigits
 * @return
 */
function sendDtmf(connId, dtmfDigits) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	SoftPhone.sendDtmf(connId, dtmfDigits);
}

/**
 * 发送UserEvent
 * @param targetDN
 * @param params
 * @return
 */
function sendUserEvent(targetDN, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	params = JSON.stringify(params);
	SoftPhone.sendUserEvent(targetDN, params);
}

/**
 * 监听坐席下一通电话
 * @param targetDN
 * @param monitorType(0:OneCall, 1:AllCalls)
 * @param monitorScope(call, agent)
 * @param monitorMode(mute, coach)
 * @return
 */
function monitorNextCall(targetDN, monitorType, monitorScope, monitorMode) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	SoftPhone.monitorNextCall(targetDN, monitorType, monitorScope, monitorMode);
}

/**
 * 取消监听坐席电话
 * @param targetDN
 * @return
 */
function cancelMonitoring(targetDN) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	SoftPhone.cancelMonitoring(targetDN);
}

/**
 * 班长强插坐席通话
 * @param connId
 * @param monitorScope(call, agent)
 * @return
 */
function bargeIn(connId, monitorScope) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	SoftPhone.bargeIn(connId, monitorScope);
}

/**
 * 班长强拆坐席通话
 * @param connId
 * @param targetDN
 * @param hasBargeIn
 * @return
 */
function forceOut(connId, targetDN, hasBargeIn) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	SoftPhone.forceOut(connId, targetDN, hasBargeIn);
}

/**
 * 将会议中的一方置为耳聋模式
 * @param connId
 * @param otherDN
 * @param params 可选参数
 * @return
 */
function listenDisconnect(connId, otherDN, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==3){
		params = JSON.stringify(params);
		SoftPhone.listenDisconnect(connId, otherDN, params);
	}else{
		SoftPhone.listenDisconnect(connId, otherDN);
	}
}

/**
 * 将会议中的一方取消耳聋模式
 * @param connId
 * @param otherDN
 * @param params 可选参数
 * @return
 */
function listenReconnect(connId, otherDN, params) {
	if(!checkSoftPhoneApplet()){
		return;
	}
	if(arguments.length==3){
		params = JSON.stringify(params);
		SoftPhone.listenReconnect(connId, otherDN, params);
	}else{
		SoftPhone.listenReconnect(connId, otherDN);
	}
}

/**
 * 接听会话
 * @param interactionId
 * @return
 */
function accept(interactionId) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.accept(interactionId);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 停止会话
 * @param interactionId
 * @return
 */
function stop(interactionId) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.stop(interactionId, "");
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 拒接会话
 * @param interactionId
 * @return
 */
function reject(interactionId) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.reject(interactionId, "");
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 转接会话到队列
 * @param interactionId
 * @param queue
 * @param params 可选参数
 * @return
 */
function transferQueue(interactionId, queue, params) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result;
	if(arguments.length==3){
		params = JSON.stringify(params);
		result = SoftPhone.transferQueue(interactionId, queue, params);
	}else{
		result = SoftPhone.transferQueue(interactionId, queue);
	}
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 转接会话给其他坐席
 * @param interactionId
 * @param agentId
 * @param params 可选参数
 * @return
 */
function transferAgent(interactionId, agentId, params) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result;
	if(arguments.length==3){
		params = JSON.stringify(params);
		result = SoftPhone.transferAgent(interactionId, agentId, params);
	}else{
		result = SoftPhone.transferAgent(interactionId, agentId);
	}
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 加坐席进行会议
 * @param interactionId
 * @param agentId
 * @param params 可选参数
 * @return
 */
function conferenceAgent(interactionId, agentId, params) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result;
	if(arguments.length==3){
		params = JSON.stringify(params);
		var result = SoftPhone.conferenceAgent(interactionId, agentId, params);
	}else{
		result = SoftPhone.conferenceAgent(interactionId, agentId);
	}
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 获取随路数据
 * @param interactionId
 * @param userData
 * @param mediaType(voice, mm)
 * @return
 */
function getAttachedData(interactionId, mediaType) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.getAttachedData(interactionId, mediaType);
	return result;
}

/**
 * 添加随路数据
 * @param interactionId
 * @param attachedData json格式字符串
 * @param mediaType(voice, mm)
 * @return
 */
function addAttachedData(interactionId, attachedData, mediaType) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	attachedData = JSON.stringify(attachedData);
	var result = SoftPhone.addAttachedData(interactionId, attachedData, mediaType);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 更新随路数据
 * @param interactionId
 * @param attachedData
 * @param mediaType
 * @return
 */
function updateAttachedData(interactionId, attachedData, mediaType) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	attachedData = JSON.stringify(attachedData);
	var result = SoftPhone.updateAttachedData(interactionId, attachedData, mediaType);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 删除随路数据
 * @param interactionId
 * @param attachedData
 * @param mediaType
 * @return
 */
function deleteAttachedData(interactionId, attachedData, mediaType) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	attachedData = JSON.stringify(attachedData);
	var result = SoftPhone.deleteAttachedData(interactionId, attachedData, mediaType);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 删除所有随路数据
 * @param interactionId
 * @param mediaType
 * @return
 */
function deleteAllAttachedData(interactionId, mediaType) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.deleteAllAttachedData(interactionId, mediaType);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 请求加入一通正在处理中的会话
 * @param interactionId
 * @param visibilityMode(0-unknown,1-conference,2-monitor,3-coach)
 * @return
 */
function intrudeInteaction(interactionId, visibilityMode){
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.intrudeInteaction(interactionId, visibilityMode);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 请求离开会议，结束会话
 * @param interactionId
 * @return
 */
function leaveInteraction(interactionId){
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.leaveInteraction(interactionId);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 插入会话，会话内容坐席与访客均可见
 * @param interactionId
 * @return
 */
function bargeInInteraction(interactionId){
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.bargeInInteraction(interactionId);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 指导坐席会话，会话内容访客不可见
 * @param interactionId
 * @return
 */
function coachInteraction(interactionId){
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.coachInteraction(interactionId);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 监控会话
 * @param interactionId
 * @return
 */
function monitorInteraction(interactionId){
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.monitorInteraction(interactionId);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 发送聊天消息
 * @param interactionId
 * @param textMsg
 * @param visibility(0:All-visible for all participants, 1:Int-visible only for agents and supervisors)
 * @return
 */
function sendChatMessage(interactionId, textMsg, visibility){
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.sendChatMessage(interactionId, textMsg, visibility);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 发送通知
 * @param interactionId
 * @param textMsg
 * @return
 */
function sendNotify(interactionId, textMsg){
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.sendNotify(interactionId, textMsg);
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 回复邮件
 * @param interactionId
 * @param fromAddress
 * @param toAddress
 * @param ccAddress
 * @param bccAddress
 * @param subject
 * @param text
 * @param mimeType - text/plain, text/html
 * @param fileNames - array
 * @param params 可选参数
 * @return
 */
function replyEmail(interactionId, fromAddress, toAddress, ccAddress, bccAddress, subject, text, mimeType, fileNames, params){
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result;
	if(arguments.length==10){
		params = JSON.stringify(params);
		result = SoftPhone.replyEmail(interactionId, fromAddress, toAddress, ccAddress, bccAddress, subject, text, mimeType, formatArrayToString(fileNames), params);
	}else{
		result = SoftPhone.replyEmail(interactionId, fromAddress, toAddress, ccAddress, bccAddress, subject, text, mimeType, formatArrayToString(fileNames));
	}
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 发送新邮件
 * @param fromAddress
 * @param toAddress
 * @param ccAddress
 * @param bccAddress
 * @param subject
 * @param text
 * @param mimeType - text/plain, text/html
 * @param fileNames - array
 * @param params 可选参数
 * 
 * @return
 */
function sendNewEmail(fromAddress, toAddress, ccAddress, bccAddress, subject, text, mimeType, fileNames, params){
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result;
	if(arguments.length==9){
		params = JSON.stringify(params);
		result = SoftPhone.sendNewEmail(fromAddress, toAddress, ccAddress, bccAddress, subject, text, mimeType, formatArrayToString(fileNames), params);
	}else{
		result = SoftPhone.sendNewEmail(fromAddress, toAddress, ccAddress, bccAddress, subject, text, mimeType, formatArrayToString(fileNames));
	}
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 转发邮件
 * @param fromAddress
 * @param toAddress
 * @param ccAddress
 * @param bccAddress
 * @param subject
 * @param text
 * @param mimeType - text/plain, text/html
 * @param docIds - array
 * @param fileNames - array
 * @param params 可选参数
 * 
 * @return
 */
function forwardEmail(fromAddress, toAddress, ccAddress, bccAddress, subject, text, mimeType, docIds, fileNames, params){
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result;
	if(arguments.length==10){
		params = JSON.stringify(params);
		result = SoftPhone.forwardEmail(fromAddress, toAddress, ccAddress, bccAddress, subject, text, mimeType, formatArrayToString(docIds), formatArrayToString(fileNames), params);
	}else{
		result = SoftPhone.forwardEmail(fromAddress, toAddress, ccAddress, bccAddress, subject, text, mimeType, formatArrayToString(docIds), formatArrayToString(fileNames));
	}
	if (result == 1) {
		return true;
	}
	return false;
}

/**
 * 改变媒体状态事由
 * @param mediaType
 * @param reasonCode
 * @return
 */
function changeMediaStateReason(mediaType, reasonCode) {
	if(!checkSoftPhoneApplet()){
		return false;
	}
	var result = SoftPhone.changeMediaStateReason(mediaType, reasonCode);
	if (result == 1) {
		return true;
	}
	return false;
}

function getSkillInfo() {
	if(!checkSoftPhoneApplet()){
		return [];
	}
	var result = SoftPhone.getSkillInfo();
	result = toJSON(result);
	return result;
}

function formatArrayToString(dataArray) {
    var str = "";
    for (var index=0;index<dataArray.length;index++) {
        str += dataArray[index] + "##";
    }
    return str;
}

function getConfigValue(option) {
	if(!checkSoftPhoneApplet()){
		return "";
	}
	return SoftPhone.getConfigValue(option);
}