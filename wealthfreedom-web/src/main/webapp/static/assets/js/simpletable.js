/**
 * author: badqiu
 * depend on JQuery
 */
var SimpleTable = function(o) {
    //handle sort
    var _this = this;
    this.op = {
        container : undefined,
        pageNumber : 0,
        pageSize : 10,
        sortColumns : "",
        pageNumberKey :'page',
        pageSizeKey : 'size',
        sortColumnsKey : 'sortColumns',
        url : "",
        parameters : {},
        httpMethod : 'GET',
        successCallback:null,
        errorCallback:null
    }
    _this.op.container = o.container ? o.container : _this.op.container;
    _this.op.pageNumber = o.pageNumber ? o.pageNumber : _this.op.pageNumber;
    _this.op.pageSize = o.pageSize ? o.pageSize : _this.op.pageSize;
    _this.op.sortColumns = o.sortColumns ? o.sortColumns : _this.op.sortColumns;
    _this.op.pageNumberKey = o.pageNumberKey ? o.pageNumberKey : _this.op.pageNumberKey;
    _this.op.pageSizeKey = o.pageSizeKey ? o.pageSizeKey : _this.op.pageSizeKey;
    _this.op.sortColumnsKey = o.sortColumnsKey ? o.sortColumnsKey : _this.op.sortColumnsKey;
    _this.op.url = o.container ? o.url : _this.op.url;
    _this.op.parameters = o.parameters ? o.parameters : _this.op.parameters;
    _this.op.httpMethod = o.httpMethod ? o.httpMethod : _this.op.httpMethod;
    _this.op.successCallback = o.successCallback ? o.successCallback : _this.op.successCallback;
    _this.op.errorCallback = o.errorCallback ? o.errorCallback : _this.op.errorCallback;

    $("#" + _this.op.container + " .gridBody th[sortColumn]").click(function() {
        //handle click sort header
        var column = $(this).attr('sortColumn');
        if(SimpleTableUtils.getSortDirection(_this.op.sortColumns,column) == 'asc') {
            _this.toggleSort("");
        }else if(SimpleTableUtils.getSortDirection(_this.op.sortColumns,column) == 'desc') {
            _this.toggleSort(column + " asc");
        }else {
            _this.toggleSort(column + " desc");
        }
    }).mouseover(function() {
            $(this).toggleClass('tableHeaderSortHover',true);
        }).mouseout(function() {
            $(this).toggleClass('tableHeaderSortHover',false);
        });

    // add 'desc' or 'asc' class to sorted tableHeader
    var sortInfos = SimpleTableUtils.getSortInfos(_this.op.sortColumns);
    for(var i = 0; i < sortInfos.length; i++) {
        var info = sortInfos[i];
        var selector = "#" + _this.op.container + ' .gridBody th[sortColumn="'+info.column+'"]';
        var order = info.order ? info.order : 'asc';
        $(selector).addClass("sort " + order.toLowerCase());
    }

    //handle highlight on mouseover
    $("#" + _this.op.container + " .gridBody tbody tr").mouseover(function() {
        $(this).toggleClass('highlight',true);
    }).mouseout(function() {
            $(this).toggleClass('highlight',false);
        });
    function _togglePage(pageNumber){
        _this.op.pageNumber = pageNumber;
        var url = _this.op.url + "?" + _this.op.pageNumberKey + "=" + pageNumber + "&" + _this.op.pageSizeKey + "=" + _this.op.pageSize;
        if(_this.op.parameters){
            //不再用URL拼接参数
        }else{
            _this.op.parameters = {};
        }
        //this.doJump(pageNumber,null,null);
        //$("#"+op.container).load(url);

        jQuery.ajax({
            type:_this.op.httpMethod,
            url:url,
            data:_this.op.parameters,
            cache:false,
            success:function(pageHtml){
                $("#" + _this.op.container).empty().append(pageHtml);
                if(_this.op.successCallback){
                    _this.op.successCallback();
                }
            },
            error:function(){
                alert("失败，请重试");
                if(_this.op.errorCallback){
                    _this.op.errorCallback();
                }
            }
        });
    };

    function _togglePageSize(pageSize){
        _this.op.pageNumber=0;
        var url = _this.op.url + "?" + _this.op.pageNumberKey + "=" + _this.op.pageNumber + "&" + _this.op.pageSizeKey + "=" + pageSize;
        if(_this.op.parameters){
            //不再用URL拼接参数
        }else{
            _this.op.parameters = {};
        }
        //_this.op.pageSize = pageSize;
        //this.doJump(null,pageSize,null);
        //$("#" + _this.op.container).load(url);
        jQuery.ajax({
            type:_this.op.httpMethod,
            url:url,
            data:_this.op.parameters,
            cache:false,
            success:function(pageHtml){
                $("#" + _this.op.container).empty().append(pageHtml);
                if(_this.op.successCallback){
                    _this.op.successCallback();
                }
            },
            error:function(){
                alert("失败，请重试");
                if(_this.op.errorCallback){
                    _this.op.errorCallback();
                }
            }
        });
    }

    this.togglePage= function(pageNumber){
        return _togglePage(pageNumber);
    }

    this.togglePageSize = function(pageSize){
        return _togglePageSize(pageSize);
    }
};
SimpleTable.prototype = {
    doJump : function(pageNumber,pageSize,sortColumns) {
        //alert("pageNumber:"+pageNumber+" pageSize:"+pageSize+" sortColumns:"+sortColumns+" this.containerId:"+_this.op.container);
        var pair = function(k,v) {return ' <input type="hidden" name="'+k+'" value="'+v+'" />'};
        var params = pair(_this.op.pageNumberKey,_this.op.pageNumber)+pair(_this.op.pageSizeKey,_this.op.pageSize)+pair(_this.op.sortColumnsKey,_this.op.sortColumns)
        $('#' + _this.op.container).append(params);
        SimpleTableUtils.fireSubmit(_this.op.container);
    },
    /*togglePage : function(pageNumber) {
        _this.op.pageNumber = pageNumber;
        var url = _this.op.url + "?" + _this.op.pageNumberKey + "=" + pageNumber + "&" + _this.op.pageSizeKey + "=" + _this.op.pageSize;
        if(_this.op.parameters){
            //不再用URL拼接参数
        }else{
            _this.op.parameters = {};
        }
        //this.doJump(pageNumber,null,null);
        //$("#"+op.container).load(url);

        jQuery.ajax({
            type:_this.op.httpMethod,
            url:url,
            data:_this.op.parameters,
            cache:false,
            success:function(pageHtml){
                $("#" + _this.op.container).empty().append(pageHtml);
                if(_this.op.successCallback){
                    _this.op.successCallback();
                }
            },
            error:function(){
                alert("失败，请重试");
                if(_this.op.errorCallback){
                    _this.op.errorCallback();
                }
            }
        });
    },*/
    /*togglePageSize : function(pageSize) {
        _this.op.pageSize = pageSize;
        _this.op.pageNumber=0;
        var url = _this.op.url + "?" + _this.op.pageNumberKey + "=" + _this.op.pageNumber + "&" + _this.op.pageSizeKey + "=" + _this.op.pageSize;
        if(_this.op.parameters){
            //不再用URL拼接参数
        }else{
            _this.op.parameters = {};
        }
        //_this.op.pageSize = pageSize;
        //this.doJump(null,pageSize,null);
        //$("#" + _this.op.container).load(url);
        jQuery.ajax({
            type:_this.op.httpMethod,
            url:url,
            data:_this.op.parameters,
            cache:false,
            success:function(pageHtml){
                $("#" + _this.op.container).empty().append(pageHtml);
                if(_this.op.successCallback){
                    _this.op.successCallback();
                }
            },
            error:function(){
                alert("失败，请重试");
                if(_this.op.errorCallback){
                   _this.op.errorCallback();
                }
            }
        });
    },*/
    toggleSort : function(sortColumns) {
        _this.op.sortColumns = sortColumns;
        this.doJump(null,null,sortColumns);
    }
};

// static methods
var SimpleTableUtils = {
    getSortInfos : function(sortColumns) {
        if(!sortColumns) return [];
        var results = [];
        var sorts = sortColumns.split(",");
        for(var i = 0; i < sorts.length; i++) {
            var columnAndOrder = sorts[i].split(/\s+/);
            var column = columnAndOrder[0];
            var order = columnAndOrder.length > 1 ? columnAndOrder[1] : null;

            var sortInfo = new Object();
            sortInfo.column = $.trim(column);
            sortInfo.order = $.trim(order);

            results.push(sortInfo);
        }
        return results;
    },
    getSortDirection : function(defaultSortColumns,currentColumn) {
        var infos = SimpleTableUtils.getSortInfos(defaultSortColumns);
        for(var i = 0; i < infos.length; i++) {
            var info = infos[i];
            var order = info.order ? info.order : 'asc';
            if(info.column == currentColumn) {
                return order;
            }
        }
        return null;
    },
    fireSubmit : function(form) {
        var form = document.getElementById(form);
        if (form.fireEvent) { //for ie
            if(form.fireEvent('onsubmit')){
                form.submit();
            }
        } else if (document.createEvent) { // for dom level 2
            var evt = document.createEvent("HTMLEvents");
            //true for can bubble, true for cancelable
            evt.initEvent('submit', false, true);
            form.dispatchEvent(evt);
            if(navigator.userAgent.indexOf('Chrome') >= 0) {
                form.submit();
            }
        }
    }
}