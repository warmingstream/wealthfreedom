$(function(){
    //bootbox全局配置
    bootbox.setDefaults({
        locale: "zh_CN"
    });

    //Messenger
    Messenger.options = {
        extraClasses: 'messenger-fixed messenger-on-top  messenger-on-right',
        theme: 'flat'
    };

    //ajax全局配置
    $.ajaxSetup({
        cache: false,
        beforeSend: function(xhr) {
            //headers["X-Requested-With"] = "XMLHttpRequest";

            //top process bar start
            Pace.start();
        },
        complete: function(request, textStatus){
            //top process bar stop
            Pace.stop();
        },
        error: function(request, ajaxOptions, thrownError){

            /*if(request.status == 401){
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

            } else if(request.status == 550
                || request.status == 551
                || request.status == 552
                || request.status == 553
                || request.status == 554
                || request.status == 555
                || request.status == 556){

                Messenger().post({
                    message: decodeURIComponent(request.getResponseHeader("Reason-Message")), //, decodeURIComponent(request.getResponseHeader("Reason-Title"))
                    type: 'error',
                    showCloseButton: true
                });

            }else {
                Messenger().post({
                    message: "未知错误：" + request.status,
                    type: 'error',
                    showCloseButton: true
                });
            }*/

        }
    });

    $('body').on('click', '.close-form', function(e) {
        e.preventDefault();

        $('.bootbox-close-button').trigger('click');
    });

    $('body').on('submit', '.form-edit', function(e) {
        console.log(".form-edit submit")
        e.preventDefault();
        var $this = $(this);

        JUN.ajax.put({
            url: $this.attr('action'),
            data: $this.serializeJSON(),
            success: function(result) {
                Messenger().post({
                    message: '操作成功',
                    type: 'success',
                    showCloseButton: true
                });

                $this.reset();
            },
            error: function(request, ajaxOptions, thrownError) {
                if(request.status == 400 && request.responseJSON) {
                    var responseJSON = request.responseJSON;
                    var errors = [];
                    $.each(responseJSON.fieldErrors, function() {
                        var title = $this.find("label[for=" + this.field + "]").text();
                        errors.push({
                            title: title,
                            message: this.message
                        })
                    });

                    var tpl = JUN.tpl.form_errors({
                        errors: errors
                    });

                    $this.find('.form-errors').remove();

                    $this.prepend(tpl);

                }else if(request.status == 400 && request.responseText) {
                    var responseText = request.responseText;
                    var errors = [];
                    errors.push({
                        title: "提示",
                        message: responseText
                    });
                    var tpl = JUN.tpl.form_errors({
                        errors: errors
                    });

                    $this.find('.form-errors').remove();

                    $this.prepend(tpl);

                }
            }
        });
    });

    $('body').on('submit', '.form-newEdit', function(e) {
        console.log(".form-newEdit submit")
        e.preventDefault();
        var $this = $(this);

        JUN.ajax.post({
            url: $this.attr('action'),
            data: $this.serializeJSON(),
            success: function(result) {
                Messenger().post({
                    message: '操作成功',
                    type: 'success',
                    showCloseButton: true
                });

                $this.trigger("reset");
            },
            error: function(request, ajaxOptions, thrownError) {
                if(request.status == 400 && request.responseJSON) {
                    var responseJSON = request.responseJSON;
                    var errors = [];
                    $.each(responseJSON.fieldErrors, function() {
                        var title = $this.find("label[for=" + this.field + "]").text();
                        errors.push({
                            title: title,
                            message: this.message
                        })
                    });

                    var tpl = JUN.tpl.form_errors({
                        errors: errors
                    });

                    $this.find('.form-errors').remove();

                    $this.prepend(tpl);

                } else if(request.status == 400 && request.responseText) {
                    var responseText = request.responseText;
                    var errors = [];
                    errors.push({
                        title: "提示",
                        message: responseText
                    });
                    var tpl = JUN.tpl.form_errors({
                        errors: errors
                    });

                    $this.find('.form-errors').remove();

                    $this.prepend(tpl);

                }
            }
        });
    });

    $.fn.modules = function(module){

        var module = this.selector;

        var modulePath = module.replace('.', '/');
        var moduleFn = module.replace('.', '_');
        var funName = "$.fn." + moduleFn + "()"

        var url = CONTEXT_PATH + '/static/app/' + modulePath + '.js';

        if(!$.fn[moduleFn]) {
            console.log('load')
            $.getScript( url, function () {
                eval(funName);
            });
        }else {
            eval(funName);
        }
    };

});
