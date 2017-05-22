;(function (define) {

    "use strict";

    define(['jquery'], function ($) {
        var version = "0.0.1";

        return (function(){

            var JUN = function(){
                console.log(version);
            };

            JUN.helpers = {
                random: function(){
                    return parseInt(Math.random()*9000+1000);
                },
                timestamp: function(){
                    return $.now();
                },
                uuid: function(){
                    //因UUID生成算法过于复杂耗时，此处使用时间戳+四位随机数
                    return JD.helpers.timestamp() + "" + JD.helpers.random();
                },
                merge: function(target, object){
                    return $.extend( true, target, object);
                }
            };

            /**
             * ajax
             * @type {{post: post, get: get, put: put, delete: delete}}
             */
            JUN.ajax = {
                _error_handler: function(request, ajaxOptions, thrownError) {
                    if(request.status == 401){
                        var location = request.getResponseHeader("Location");
                        if(location) {
                            window.location = location;
                        }

                        return ;
                    }else if(request.status == 500){

                        Messenger().post({
                            message: ajaxOptions + ":" + thrownError, //"服务器内部错误"
                            type: 'error',
                            showCloseButton: true
                        });

                    } else {
                        var message = request.responseText ? request.responseText : ("未知错误：" + request.status);

                        Messenger().post({
                            message: message,
                            type: 'error',
                            showCloseButton: true
                        });
                    }
                },
                post : function(options){
                    Ladda.bind( 'button[type=submit]' );
                    return $.ajax({
                        type: "POST",
                        url: options.url,
                        data: JSON.stringify(options.data),
                        dataType : 'json',
                        contentType : 'application/json',
                        success: options.success,
                        error: function(request, ajaxOptions, thrownError) {
                            if(options.error && $.isFunction(options.error)) {
                                options.error(request, ajaxOptions, thrownError);
                            } else {
                                JUN.ajax._error_handler(request, ajaxOptions, thrownError);
                            }

                        }
                    }).always(function () {
                        Ladda.stopAll();
                    });
                },
                get : function(options){
                    return $.ajax({
                        type: "GET",
                        cache: false,
                        url: options.url,
                        data: options.data,
                        dataType : 'json',
                        success: options.success
                    });
                },
                put : function(options){

                    Ladda.bind( 'button[type=submit]' );

                    return $.ajax({
                        type: "POST",
                        url: options.url + "?_method=PUT",
                        data: JSON.stringify(options.data),
                        dataType : 'json',
                        contentType : 'application/json',
                        success: options.success,
                        error: function(request, ajaxOptions, thrownError) {
                            if(options.error && $.isFunction(options.error)) {
                                options.error(request, ajaxOptions, thrownError);
                            } else {
                                JUN.ajax._error_handler(request, ajaxOptions, thrownError);
                            }

                        }
                    }).always(function () {
                        Ladda.stopAll();
                    });
                },
                delete : function(options){

                    return $.ajax({
                        type: "POST",
                        url: options.url + "?_method=DELETE",
                        data: options.data,
                        dataType : 'json',
                        success: options.success
                    });
                },
                script: function(options){

                },
                html: function(options){
                    $.ajax({
                        mimeType: 'text/html; charset=utf-8', // ! Need set mimeType only when run from local file
                        url: options.url,
                        type: 'GET',
                        dataType: "html",
                        async: false,
                        success: options.success
                    });
                }
            };

            JUN.ui = {
                load: function(options){
                    $('.preloader').show();

                    JUN.ajax.html({
                        url: options,
                        success: function(data){
                            $('#ajax-content').html(data);
                            $('.preloader').hide();
                        }
                    });

                },

                script: function(){

                },
                table: function(options){
                    //var elem,
                    //    hideHandler,
                    //    that = {};
                    //
                    //that.init = function(options) {
                    //    elem = $(options.selector);
                    //};

                    var settings = {
                        // icheck 参数设置
                        iCheck_setting: {
                            checkboxClass: "icheckbox_minimal-grey"
                        },
                        extra_data: null,
                        // 数据表格
                        table: null,
                        // 数据表格数据
                        oTable: null,
                        // 表格设置
                        tableSettings: null,
                        // 单一“删除记录”控件
                        deleteRow: null,
                        // 单一“删除记录”控件，选择事件
                        deleteRow_click: function(e) {
                            e.preventDefault();

                            //var ladda = Ladda.create(this);
                            //ladda.start();

                            //选择的单一“删除记录”控件
                            var $this = $(this);


                            bootbox.confirm({
                                title: '<span style="font-size: 14px;"><i class="fa fa-exclamation-triangle fa-2"></i> 确认操作</span>',
                                size: "small",
                                message: '<strong>确定删除所选记录吗？</strong>',
                                callback: function(result){
                                    if(result) {

                                        JUN.ajax.delete({
                                            url: $this.prop('href'),
                                            data: {
                                                id: $this.prop('id'),
                                                sysVersion: $this.attr('sysVersion')
                                            },
                                            success: function(response) {
                                                Messenger().post({
                                                    message: "删除记录成功！",
                                                    showCloseButton: true
                                                });

                                                settings.table.api().ajax.reload();
                                            }
                                        });
                                    }
                                }
                            });

                        },
                        editRow: null,
                        editRow_click: function(e) {
                            e.preventDefault();
                            var _self = $(this);
                            $.get(_self.attr('href'), function(data) {
                                bootbox.dialog({
                                    title: '<div><span class="glyphicon glyphicon-edit"></span> 编辑</div>',
                                    size: 'large',
                                    message: data,
                                    onEscape: function(){
                                        settings.table.api().ajax.reload();
                                    }
                                });
                            });

                        },

                        viewRow: null,
                        viewRow_click: function(e) {
                            e.preventDefault();
                            var _self = $(this);
                            $.get(_self.attr('href'), function(data) {
                                bootbox.dialog({
                                    title: '<div><span class="glyphicon glyphicon-align-justify"></span> 查看详情</div>',
                                    size: 'large',
                                    message: data
                                });
                            });

                        },
                        // 选择的单一“删除记录”控件
                        deleteRow_selected: null,
                        // 批量“删除记录”按钮
                        deleteRowsButton: null,
                        // 批量“删除记录”控件，选择事件
                        deleteRowsButton_click: function(e) {
                            e.preventDefault();
                        },
                        // 批量操作按钮
                        operateRowsButton: $("div.dataTables_wrapper a.operateRows"),
                        // 批量操作按钮，是否启用
                        operateRowsButton_enabled: false,
                        // “全选记录”控件
                        selectRows: null,
                        // “全选记录”控件，选择事件
                        selectRows_ifToggled: function(){
                            settings.selectRow_enabled.iCheck(this.checked ? "check" : "uncheck");
                        },
                        // 全部的“选择记录”控件
                        selectRow: null,
                        // 启用的“选择记录”控件
                        selectRow_enabled: null,
                        // 启用的“选择记录”控件，选择事件
                        selectRow_enabled_ifToggled: function(){
                            // 统计已选的“选择记录”个数
                            settings.selectRow_selected_size += this.checked ? 1 : -1;
                            // 切换“选择记录”控件所在表行（TR）的样式
                            $(this).closest("tr").toggleClass("selected");
                            // 已选的“选择记录”个数 > 0时
                            if(settings.selectRow_selected_size) {
                                // 批量操作按钮，禁用时
                                if(!settings.operateRowsButton_enabled) {
                                    // 批量操作按钮，启用（切换按钮样式）
                                    if(settings.operateRowsButton.length) {
                                        settings.operateRowsButton.toggleClass("disabled");
                                    }
                                    settings.operateRowsButton_enabled = true;
                                }
                            }
                            // 已选的“选择记录”个数 == 0时
                            else {
                                // 批量操作按钮，启用时
                                if(settings.operateRowsButton_enabled) {
                                    // 批量操作按钮，禁用（切换按钮样式）
                                    if(settings.operateRowsButton.length) {
                                        settings.operateRowsButton.toggleClass("disabled");
                                    }
                                    settings.operateRowsButton_enabled = false;
                                }
                            }
                        },

                        // 已选的“选择记录”个数
                        selectRow_selected_size: 0,
                        // 禁用的“选择记录”控件
                        selectRow_disabled: null,
                        // 禁用的“选择记录”控件，遍历函数
                        selectRow_disabled_each: function(index, input) {
                            var $input = $(input);
                            // 补充hint提示所需属性
                            $input.parent().attr("data-hint", $input.prop("title")).addClass("hint--top hint--error");
                            // 移除原title属性
                            $input.removeAttr("title");
                        },
                        set_extra_data: function(data) {
                            settings.extra_data = data;
                        },
                        clear_extra_data: function() {
                            settings.extra_data = null;
                        }

                    };

                    var events = {

                    };

                    var operations = {
                        table: {
                            init: function(){
                                // 表格参数设置
                                options.selector = options.selector ? options.selector : "table.dataTable";
                                settings.table = $(options.selector);
                                if(settings.table.length) {
                                    settings.tableSettings = {
                                        //默认分页条数
                                        "pageLength": 10,
                                        //每页显示选项
                                        "lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]],
                                        //延迟渲染
                                        "deferRender": true,
                                        // 正在加载画面
                                        "processing": true,
                                        // fixed 第一列默认排序
                                        //"aaSorting": [],
                                        "order": [],
                                        //服务器端分页
                                        "serverSide": true,
                                        //排序
                                        "ordering": true,
                                        //禁用多列排序
                                        "orderMulti": false,
                                        "searching": false,
                                        //bInitialised : true,
                                        "bDeferLoading": true
                                        //"iDeferLoading": 0
                                        //"scrollY": 410
                                        //"scrollCollapse": true

                                    };

                                    if(options.columns) {
                                        //init columns
                                        settings.tableSettings.columns = [];
                                        $.each(options.columns, function(index){
                                            //全选框
                                            if(this.xtype == 'selectRows') {
                                                this.header = '<input class="selectRows" type="checkbox" />';
                                                this.class = 'center tableCheckbox';
                                                this.width = "15px";
                                                this.render = function(value, record, metaRow){
                                                    return '<input class="selectRow" type="checkbox" name="id" value="' + value + '" />';
                                                }
                                            }

                                            var column = {
                                                title: this.header,
                                                data: this.field ? this.field : null,
                                                class: this.class ? this.class : "",
                                                orderable: this.sortable ? true : false,
                                                "visible": true,
                                                "orderSequence": [ "asc", "desc"],
                                                "searchable": false
                                            };

                                            if($.isFunction(this.render)) {
                                                var $render = this.render;

                                                column.render = function(data, type, row, meta){
                                                    var value = data;
                                                    var record = row;   //此行所有记录
                                                    //var type = type;
                                                    var tr_row_no = parseInt(meta.row) + 1;
                                                    //var td_cell_no = parseInt(meta.col) - 1;
                                                    var metaRow = $(options.selector).find("tr:eq(" + tr_row_no +   ")");
                                                    //var td = $(tr).find("td:eq(" + td_cell_no + ")");

                                                    /**
                                                     * @param value  当前行 field 值，如果field为null，则返整行record
                                                     * @param record 整行record
                                                     * @param metaRow jQuery tr 对象
                                                     */
                                                    return $render(value, record, metaRow)
                                                };
                                            }

                                            if(this.width) {
                                                column.width = this.width;
                                            }

                                            //列默认排序
                                            if(this.order) {
                                                settings.tableSettings.order.push([index, this.order]);
                                            }

                                            settings.tableSettings.columns.push(column);


                                        });
                                    }

                                    if(options.url) {
                                        settings.tableSettings.ajax = {
                                            //data:
                                            //"data": function ( d ) {
                                            //    return {
                                            //        "extra_search": $('#extra').val()
                                            //    };
                                            //},
                                            url : options.url,
                                            data : function(d) {
                                                //console.log(d)
                                                //?page=2&size=100&sort=email,asc
                                                //if(d.order.length > 0) {
                                                //    var column =
                                                //}

                                                var sort;
                                                $.each(d.order, function() {
                                                    var column = d.columns[this.column].data;
                                                    var dir = this.dir;

                                                    sort = column + "," + dir;
                                                    return ;
                                                });

                                                var pageable = {
                                                    page: (d.start / d.length),
                                                    size: d.length,
                                                    sort: sort    //sort=email,asc
                                                }

                                                $.extend(pageable, settings.extra_data);

                                                return pageable;
                                            }
                                        };

                                    }



                                    //console.log(settings.tableSettings)
                                    settings.oTable = settings.table.dataTable(settings.tableSettings);
                                    //oTable = iDataTable.dataTable.dataTable();

                                    //settings.table.css('min-height','400px')
                                }
                            }
                        },

                        // 初始化“全选记录”事件
                        select_row: {
                            init: function() {

                                // “全选记录”控件
                                settings.selectRows = $("table.dataTable th.tableCheckbox input.selectRows");
                                if(settings.selectRows.length) {
                                    // 添加iCheck效果
                                    settings.selectRows.iCheck(settings.iCheck_setting);
                                    // 选择事件
                                    settings.selectRows.on("ifToggled", settings.selectRows_ifToggled);
                                }

                            }
                        },
                        toolbar_actions: {
                            init: function(){
                                // 添加表格外置操作
                                var $dataTableActions = $("div.dataTableActions");
                                if($dataTableActions.length) {
                                    $("div.dataTables_wrapper .actions").append($("div.dataTableActions"));

                                    //刷新
                                    $(".dataTableActions").on("click","a.btn-reload", function(e) {
                                        e.preventDefault();
                                        settings.table.api().ajax.reload();
                                        e.stopPropagation();
                                        //return false;
                                    });

                                    // 新增
                                    $(".dataTableActions").on("click","a.btn-add", function(e) {
                                        e.preventDefault();
                                        var _self = $(this);
                                        $.get(_self.attr('href'), function(data) {
                                            bootbox.dialog({
                                                title: '<div><span class="glyphicon glyphicon-pencil"></span> 新建</div>',
                                                size: 'large',
                                                message: data,
                                                onEscape: function(){
                                                    settings.table.api().ajax.reload();
                                                }
                                            });
                                        });
                                    });
                                }





                                //else {
                                //    //采用js方式
                                //    if(options.toolbar) {
                                //        $dataTableActions = $('<div class="btn-group"/>');
                                //        $.each(options.toolbar.items, function() {
                                //            if(this.xtype && this.xtype == 'add') {
                                //                $dataTableActions.append(JD.ui.button({
                                //                    iconCls : 'glyphicon glyphicon-plus',
                                //                    text: '添加',
                                //                    cls: 'btn-default btn-sm add',
                                //                    handler: function(e){
                                //                        e.preventDefault();
                                //                        JD.ui.window({
                                //                            url: settings.url + '/newEdit',
                                //                            title: '添加',
                                //                            cls: 'glyphicon glyphicon-plus'
                                //
                                //                        });
                                //                    }
                                //                }));
                                //            }
                                //
                                //            if(this.xtype && this.xtype == 'refresh') {
                                //                $dataTableActions.append(JD.ui.button({
                                //                    iconCls : 'glyphicon glyphicon-refresh',
                                //                    text: '刷新',
                                //                    cls: 'btn-default btn-sm refresh',
                                //                    handler: function(e){
                                //                        e.preventDefault();
                                //
                                //                        settings.table.api().ajax.reload();
                                //                    }
                                //                }));
                                //            }
                                //
                                //            if(this.xtype && this.xtype == 'remove') {
                                //                $dataTableActions.append(JD.ui.button({
                                //                    iconCls : 'glyphicon glyphicon-remove',
                                //                    text: '删除',
                                //                    cls: 'btn-default btn-sm operateRows deleteRows'
                                //                }));
                                //            }
                                //
                                //
                                //
                                //        });
                                //
                                //        $("div.dataTables_wrapper .actions").append($dataTableActions.wrap('<div/>').parent().html());
                                //    }
                                //}

                            }
                        },
                        operate_rows: {
                            init: function() {
                                // 批量操作按钮
                                settings.operateRowsButton = $("div.dataTables_wrapper a.operateRows");
                                if(settings.operateRowsButton) {
                                    settings.operateRowsButton.addClass("disabled");
                                }
                            }
                        },
                        delete_rows: {
                            init: function(){
                                // 已选的“选择记录”控件
                                var $selectedRows = null;
                                settings.deleteRowsButton = $("div.dataTables_wrapper a.deleteRows");
                                // “删除记录”按钮，点击事件
                                if(settings.deleteRowsButton.length) {
                                    settings.deleteRowsButton.click(function(e) {
                                        e.preventDefault();

                                        var _deleteRowsButton = this;

                                        // 已选的“选择记录”控件
                                        $selectedRows = $("table.dataTable td.tableCheckbox input.selectRow:checked");
                                        // 已选的“选择记录”控件，数量 > 0时
                                        if ($selectedRows.length) {
                                            // colorbox对话框
                                            //$.colorbox({
                                            //    initialHeight: "0",
                                            //    initialWidth: "0",
                                            //    opacity: "0.3",
                                            //    href: ".deleteConfirmDialog",
                                            //    inline: true,
                                            //    closeButton: false
                                            //});
                                            //bootbox.confirm();

                                            bootbox.confirm({
                                                title: "确认操作",
                                                size: "small",
                                                message: "确定删除所选记录吗？",
                                                callback: function(result){
                                                    if(result) {
                                                        JUN.ajax.delete({
                                                            url: _deleteRowsButton.attr('href'),
                                                            data: {

                                                            },
                                                            success: function() {
                                                                settings.table.api().ajax.reload();
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                        // 已选的“选择记录”控件，数量 == 0时
                                        else {
                                            // HubSpot Messenger 提示
                                            $.globalMessenger().post({id: "needSelectRows", type: "error", message: "请选择需要删除的记录", showCloseButton: true });
                                        }

                                        return false;
                                    });
                                }
                            }
                        },
                        edit_rows: {
                            init: function(){

                            }
                        },
                        search_form: {
                            init: function(){
                                var searchForm = options.searchForm ? options.searchForm : "";

                                if(searchForm) {
                                    $(searchForm).submit(function(e) {
                                        e.preventDefault();


                                        settings.set_extra_data($(this).serializeJSON());

                                        settings.table.api().ajax.reload();
                                    })
                                }
                            }
                        }


                    };




                    // 新增表格fnDrawCallback事件（重绘事件）
                    $.extend(true, $.fn.dataTable.defaults, {
                        "fnDrawCallback": function(oSettings) {
                            //fixed 翻页及刷新时重新调用columns#render方法
                            oSettings.oInstance._fnAdjustColumnSizing();

                            // 全部的“选择记录”控件
                            settings.selectRow = $("table.dataTable td.tableCheckbox input.selectRow");
                            if(settings.selectRow.length) {
                                // 添加iCheck效果
                                settings.selectRow.iCheck(settings.iCheck_setting);

                                // 启用的“选择记录”控件
                                settings.selectRow_enabled = settings.selectRow.filter(":enabled");
                                if(settings.selectRow_enabled.length) {
                                    // 选择事件
                                    settings.selectRow_enabled.unbind("ifToggled");
                                    settings.selectRow_enabled.on("ifToggled", settings.selectRow_enabled_ifToggled);
                                }

                                // 禁用的“选择记录”控件
                                settings.selectRow_disabled = settings.selectRow.filter(":disabled");
                                if(settings.selectRow_disabled.length) {
                                    // 遍历并替换title提示为hint提示
                                    settings.selectRow_disabled.each(settings.selectRow_disabled_each);
                                }
                            }

                            // “删除行”控件
                            settings.deleteRow = $("table.dataTable td a.deleteRow");
                            if(settings.deleteRow.length) {
                                settings.deleteRow.unbind("click");

                                settings.deleteRow.click(settings.deleteRow_click);


                            }

                            // “编辑”控件
                            settings.editRow = $("table.dataTable td a.editRow");
                            if(settings.editRow.length) {
                                settings.editRow.unbind("click");

                                settings.editRow.click(settings.editRow_click);


                            }

                            // “查看”控件
                            settings.viewRow = $("table.dataTable td a.viewRow");
                            if(settings.viewRow.length) {
                                settings.viewRow.unbind("click");

                                settings.viewRow.click(settings.viewRow_click);


                            }

                        }
                    });

                    //初始化操作
                    operations.table.init();
                    operations.toolbar_actions.init();
                    operations.select_row.init();
                    operations.operate_rows.init();
                    operations.delete_rows.init();
                    operations.edit_rows.init();
                    operations.search_form.init();

                    return settings;
                },
                button: function(options){
                    var html = '<a href="<%-href %>" class="<%-cls %>" id="<%-id %>" sysVersion="<%-sysVersion %>">' +
                                    '<span class="<%-iconCls %>"></span> <%-text %>' +
                                '</a>';

                    return _.template(html)({
                        href: options.href,
                        cls: options.cls,
                        iconCls: options.iconCls,
                        id: options.id,
                        sysVersion: options.sysVersion,
                        text: options.text
                    });
                },
                window: function(options) {
                    $.get(options.url, function(data) {
                        bootbox.dialog({
                            title: '<span class="' + (options.iconCls ? options.iconCls : '') + '"></span> ' + options.title,
                            size: 'large',
                            message: data,
                            onEscape: $.isFunction(options.onEscape) ? options.onEscape : function(){},
                            buttons : options.buttons ? options.buttons : {}
                        });
                    });
                }
            };

            JUN.tpl = {
                form_errors: function(options){
                    var html = '<div class="alert alert-danger alert-dismissible form-errors" role="alert">' +
                                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                                    '<%_.each(errors, function(error) {%>' +
                                    '<div class="row">' +
                                        '<div class="col-sm-3" style="text-align: right;">' +
                                            '<strong><%=error.title %></strong>' +
                                        '</div>' +
                                        '<div class="col-sm-5">' +
                                            '<%=error.message %>' +
                                        '</div>' +
                                    '</div>' +
                                    '<%});%>' +
                                '</div>'

                    return _.template(html)(options);
                }
            }

            return JUN;
        })();
    });

}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
    if (typeof module !== 'undefined' && module.exports) { //Node
        module.exports = factory(require('jquery'));
    } else {
        window['JUN'] = factory(window['jQuery']);
    }
}));