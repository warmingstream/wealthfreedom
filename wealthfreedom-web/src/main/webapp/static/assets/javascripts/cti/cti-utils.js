/**
 * author:ZHL 2015.10.27
**/
jQuery.namespace = function() {
	var a=arguments, o=null, i, j, d;
	for (i=0; i<a.length; i=i+1) {
		d=a[i].split(".");
		o=window;
		for (j=0; j<d.length; j=j+1) {
			o[d[j]]=o[d[j]] || {};
			o=o[d[j]];
		}
	}
	return o;
};

var CHANNELSTATE = {
	Opened: 1,
	Closed: 3
};

var CALLTYPE = {
	UNKNOWN: 0,
	INTERNAL: 1,
	INBOUND: 2,
	OUTBOUND: 3,
	CONSULT: 4
};

var AGENTSTATE = {
	LOGOUT: 0,
	READY: 1,
	NOTREADY: 2
};

var PARTYROLE = {
	Origination: 1,
	Destination: 2
};

var CALLSTATE = {
	OK: 1,
	Conferenced: 2,
	Transferred: 3,
	Conferencing: 8,
	Transfering: 9
};

var MessageID = {
	EventError: 0,
	RequestLinkConnect: 1,
	RequestLinkDisconnect: 2,

	EventWelcome: 11,
	EventPong: 12,

	EventLinkConnected: 51,
	EventLinkDisconnected: 52,
	EventServerConnected: 53,
	EventServerDisconnected: 54,

	RequestAgentLogin: 100,
	RequestAgentReady: 101,
	RequestAgentNotReady: 102,
	RequestAgentLogout: 103,
	RequestMakeCall: 200,
	RequestAnswerCall: 201,
	RequestReleaseCall: 202,
	RequestHoldCall: 203,
	RequestRetrieveCall: 204,
	RequestRedirectCall: 205,
	RequestSingleStepConference: 206,
	RequestSingleStepTransfer: 207,
	RequestDeleteFromConference: 216,
	RequestInitiateConference: 208,
	RequestInitiateTransfer: 209,
	RequestCompleteConference: 210,
	RequestCompleteTransfer: 211,
	RequestAttachUserData: 212,
	RequestDeleteUserData: 213,
	RequestUpdateUserData: 214,
	RequestSendDtmf: 215,
	
	EventAgentLogin: 580,
	EventAgentLogout: 581,
	EventAgentNotReady: 582,
	EventAgentReady: 583,
	EventRinging: 501,
	EventAbandoned: 502,
	EventDialing: 503,
	EventEstablished: 504,
	EventHeld: 505,
	EventRetrieved: 506,
	EventReleased: 507,
	EventAttachedDataChanged: 508,
	EventDtmfSent: 509,
	EventPartyAdded: 510,
	EventPartyChanged: 511,
	EventPartyDeleted: 512
};

Map = function(){
	this.elements = new Array();
 
	this.size = function() {
		return this.elements.length;
	}
 
	this.isEmpty = function() {
		return (this.elements.length < 1);
	}

	this.clear = function() {
		this.elements = new Array();
	}

	this.put = function(_key, _value) {
		this.elements.push({key:_key, value:_value});
	}
 
	this.remove = function(_key) {
		var bln = false;
		try{   
			for (i = 0; i < this.elements.length; i++){  
				if (this.elements[i].key == _key){
					this.elements.splice(i, 1);
					return true;
				}
			}
		}catch(e){
			bln = false;    
		}
		return bln;
	}

	this.get = function(_key) {
		try{   
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		}catch(e) {
			return null;   
		}
		return null;
	}
 
	this.element = function(_key) {
		if (_key < 0 || _key >= this.elements.length){
			return null;
		}
		return this.elements[_key];
	}

	this.containsKey = function(_key) {
		var bln = false;
		try{
			for (i = 0; i < this.elements.length; i++){  
				if (this.elements[i].key == _key){
					bln = true;
				}
			}
		}catch(e) {
			bln = false;    
		}
		return bln;
	}

	this.containsValue = function(_value){
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {  
				if (this.elements[i].value == _value){
					bln = true;
				}
			}
		}catch(e) {
			bln = false;    
		}
		return bln;
	}
 
	this.values = function() {
		var arr = new Array();
			for (i = 0; i < this.elements.length; i++) {  
				arr.push(this.elements[i].value);
			}
		return arr;
	}
 
	this.keys = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {  
			arr.push(this.elements[i].key);
		}
		return arr;
	}
};

var showMessage = function(msg){
	alert(msg);
}

var checkPhoneNumber = function(phoneNumber){
	if(phoneNumber==null || phoneNumber.length==0)
		return false;
	else{
		var validNumber = "0123456789";
		phoneNumber = $.trim(phoneNumber);
		for (var i = 0; i < phoneNumber.length; i++) {
			var c = phoneNumber.charAt(i);
			if (validNumber.indexOf(c) == -1) {
				showMessage("电话号码不符合规范，请检查是否含有空格或者其他非法字符");
				return false;
			}
		}
		return true;
	}
}

var toJSON = function(result) {
	return eval('(' + result + ')');
}

jQuery.fn.inputNumber = function () {
	$(this).bind("keyup", function () {
		this.value=this.value.replace(/\D/g,'')
	}).bind("afterpaste", function () {
		this.value=this.value.replace(/\D/g,'')
	}).bind("contextmenu", function () {
		return false;
	});
};