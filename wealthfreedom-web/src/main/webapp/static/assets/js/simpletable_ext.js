/**
 * author: badqiu depend on JQuery
 */
var SimpleTable = function(formId,pageNumber,pageSize,sortColumns,pageNumberKey,pageSizeKey,sortColumnsKey) {
	this.form = formId;
	this.pageNumber = pageNumber;
	this.pageSize = pageSize;
	this.sortColumns = sortColumns;
	this.pageNumberKey = pageNumberKey || 'pageNumber';
	this.pageSizeKey = pageSizeKey || 'pageSize';
	this.sortColumnsKey = sortColumnsKey || 'sortColumns';
	
	// handle sort
	_this = this;
	$("#"+formId+" .gridBody th[sortColumn]").click(function() {
		// handle click sort header
		var column = $(this).attr('sortColumn');
		if(SimpleTableUtils.getSortDirection(sortColumns,column) == 'asc') {
			_this.toggleSort("");
		}else if(SimpleTableUtils.getSortDirection(sortColumns,column) == 'desc') {
			_this.toggleSort(column + " asc");
		}else {
			_this.toggleSort(column + " desc");
		}
	}).mouseover(function() {
		$(this).toggleClass('tableHeaderSortHover',true);
	}).mouseout(function() {
		$(this).toggleClass('tableHeaderSortHover',false);
	});

	// 禁止回车提交表单操作
	$("#"+formId).keypress(function(e) {
		if (e.which == 13) {
			return false;
		}
	});
	
	// add 'desc' or 'asc' class to sorted tableHeader
	var sortInfos = SimpleTableUtils.getSortInfos(sortColumns);
	for(var i = 0; i < sortInfos.length; i++) {
		var info = sortInfos[i];
		var selector = "#"+formId+' .gridBody th[sortColumn="'+info.column+'"]';
		var order = info.order ? info.order : 'asc';
		$(selector).addClass("sort " + order.toLowerCase());
	}
	
	// handle highlight on mouseover
	$("#"+formId+" .gridBody tbody tr").mouseover(function() {
		$(this).toggleClass('highlight',true);
	}).mouseout(function() {
		$(this).toggleClass('highlight',false);
	});
	
};
SimpleTable.prototype = {
	doJump : function(pageNumber,pageSize,sortColumns) {
		// alert("pageNumber:"+pageNumber+" pageSize:"+pageSize+"
		// sortColumns:"+sortColumns+" this.form:"+this.form);
		var pair = function(k,v) {return ' <input type="hidden" name="'+k+'" value="'+v+'" />'};
		var params = pair(this.pageNumberKey,this.pageNumber)+pair(this.pageSizeKey,this.pageSize)+pair(this.sortColumnsKey,this.sortColumns)
		$('#'+this.form).append(params);
		SimpleTableUtils.fireSubmit(this.form);
	},
	togglePage : function(pageNumber) {
		this.pageNumber = pageNumber;
		this.doJump(pageNumber,null,null);
	},
	togglePageSize : function(pageSize) {
		this.pageSize = pageSize;
		this.doJump(null,pageSize,null);
	},
	toggleSort : function(sortColumns) {
		this.sortColumns = sortColumns;
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
		$("#"+form).submit(function(){
			//var loading ;
			$(this).ajaxSubmit({
				beforeSubmit:function(){
					 //loading = jqm.loading({
					//		size: 64,//等待图标大小，有三种大小：16px,24px,32px,48px,64px
					//		content: '努力查询中...'//要添加的文字内容，缺省为空，即无文字
					//});
				},
				success:function(response){
					var $simpleTableExt = $("#"+form).closest("div#simpleTableExt");
					$simpleTableExt.empty();
					// $simpleTableExt.append(response);
					// 解决ie9 table大数据量错行
					response = response.replace(/td>\s+<td/g, 'td><td');
					$simpleTableExt.replaceWith(response);
					//loading.jqmHide().remove();
				}
			});
			return false;
		});
		$("#"+form).submit();

	    // if (form.fireEvent) { //for ie
	    // if(form.fireEvent('onsubmit')){
	    // form.submit();
	    // }
	    // } else if (document.createEvent) { // for dom level 2
			// var evt = document.createEvent("HTMLEvents");
	    // //true for can bubble, true for cancelable
	    // evt.initEvent('submit', true, true);
	    // form.dispatchEvent(evt);
	    // if(navigator.userAgent.indexOf('Chrome') >= 0) {
	    // form.submit();
	    // }
	    // }
	}
}