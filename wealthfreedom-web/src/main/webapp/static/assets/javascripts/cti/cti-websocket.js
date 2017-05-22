/**
 * author:ZHL 2015.10.27
 **/
jQuery.namespace('cti');

$(document).ready(function() {
    var websocket = null;
    if (ws.browserSupportsWebSockets()) {
        websocket = new ws.webSocketClient();
    } else {
        var lMsg = ws.MSG_WS_NOT_SUPPORTED;
        showMessage(lMsg);
    }
    cti.logon = function(host, port) {
        var lURL = ws.getServerURL("ws", host, port, "/webSocket");
        var thisDN = cti.Agent.getInstance().getThisDN();
        var agentId = cti.Agent.getInstance().getAgentId();
        var data = {"messageId":1,"thisDN":thisDN,"agentId":agentId};
        var lRes = websocket.logon(lURL, thisDN, agentId, $.toJSON(data), {
            OnOpen: function(aEvent) {
            	websocket.startKeepAlive({ immediate: false, thisDN: thisDN, agentId: agentId, interval: 30000 });            	
            },
            OnMessage: function(aEvent) {
            	var msg = $.parseJSON(aEvent.data);
				cti.parseMessage(msg);
            },
            OnClose: function(aEvent) {
            	websocket.stopKeepAlive();
            }
        });
    };
    
    cti.doOpen = function(host, port) {
	    if (!websocket.isConnected()) {
	        cti.logon(host, port);
	    }
	};
	
    cti.doClose = function() {
        if (websocket.isConnected()) {
        	websocket.stopKeepAlive();
            websocket.close();
        }
    };
	
	cti.unsubscribe = function() {
		if (websocket) {
    		var thisDN = cti.Agent.getInstance().getThisDN();
    		var agentId = cti.Agent.getInstance().getAgentId();
		    var data = {"messageId":2,"thisDN":thisDN,"agentId":agentId};
		    cti.send(data);
	    } else {
	    	showMessage("与消息服务器连接断开");
	    }
	}

    cti.send=function(data) {
    	logMesssage(JSON.stringify(data));
        var thisDN = cti.Agent.getInstance().getThisDN();
        var agentId = cti.Agent.getInstance().getAgentId();
        if (websocket) {
            var lToken = {
                thisDN: thisDN,
                agentId: agentId,
                type: "request",
                message: $.toJSON(data)
            };
            websocket.sendToken(lToken);
        } else {
            showMessage("与消息服务器连接断开");
        }
    };
    
    cti.parseMessage = function(data){
    	if(data == null)return;
    	cti.handleCTIEvent(data);
    };
});