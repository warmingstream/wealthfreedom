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

var EVENT = {
	Abandoned: 59,
	Ringing: 60,
	Dialing: 61,
	Established: 64,
	Released: 65,
	Held: 66,
	Retrieved: 67,
	PartyChanged: 68,
	PartyAdded: 69,
	PartyDeleted: 70
};

var Map = function(){
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
		for (var i = 0; i < this.elements.length; i++) {
			if ( this.elements[i].key === _key ) {
				this.elements[i].value = _value;
				return;
			}
		}
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