/**
 * Created by songyang10 on 2016/4/12.
 */
var popupTool = {
    /**
     * 成功提示
     * @param title
     * @param content
     */
    success : function(title, content){
        if(!content){
            content = "";
        }
        var type = "success";
        var msgHtml = '<div class="prompt-text text-success"><i class="fa fa-check"></i> 操作成功！</div>';
        var buttonHtml = '<button type="button" class="btn btn-green btn-confirm" data-dismiss="modal">确 定</button>';
        this.doPopup(title, content, type, msgHtml, buttonHtml);
    },
    /**
     * 提醒
     * @param title
     * @param content
     */
    info : function(title, content){
        if(!content){
            content = "";
        }
        var type = "info";
        var msgHtml = '<div class="prompt-text text-info"><i class="fa fa-exclamation-circle"></i> 信息！请注意这个信息。</div>';
        var buttonHtml = '<button type="button" class="btn btn-green" data-dismiss="modal">确 定</button>';
        this.doPopup(title, content, type, msgHtml, buttonHtml);
    },
    /**
     * 失败错误
     * @param title
     * @param content
     */
    error : function(title, content){
        if(!content){
            content = "";
        }
        var type = "error";
        var msgHtml = '<div class="prompt-text text-danger"><i class="fa fa-times"></i> 错误！</div>';
        var buttonHtml = '<button type="button" class="btn btn-green" data-dismiss="modal">确 定</button>';
        this.doPopup(title, content, type, msgHtml, buttonHtml);
    },
    /**
     * 警告
     * @param title
     * @param content
     */
    warning : function(title, content){
        if(!content){
            content = "";
        }
        var type = "warning";
        var msgHtml = '<h4 class="prompt-text text-warning"><i class="fa fa-exclamation-triangle"></i> 警告！</h4>';
        var buttonHtml = '<button type="button" class="btn btn-green" data-dismiss="modal">确 定</button>';
        this.doPopup(title, content, type, msgHtml, buttonHtml);
    },
    /**
     * 开启加载
     * @param title
     * @param content
     */
    openLoading : function(msg){
        var title = "loading";
        var content = "";
        var type = "loading";
        var  defaultMsg = "正在加载中，请稍后……";
        if(msg){
            defaultMsg = msg;
        }
        var msgHtml = '<p><img src="static/assets/images/loading.gif"></p><div class="prompt-text" id="loadingContent"></div>';
        var buttonHtml = '';
        this.doPopup(title, content, type, msgHtml, buttonHtml);
        $("#loadingContent").html(defaultMsg);
    },
    /**
     * 关闭加载
     * @param title
     * @param content
     */
    closeLoading : function(){
        var obj = $("#loadingModal");
        if(obj.length != 0){
            $("#loadingModal").modal("hide");
        }
    },

    /**
     * 确认
     * @param o
     */
    confirm : function(o){
        var op = {
            title:'确认',
            content:"",
            onConfirm:null
        }
        op.title = o.title?o.title:op.title;
        op.content = o.content?o.content:op.content;
        op.onConfirm = o.onConfirm?o.onConfirm:op.onConfirm;
        var type = "confirm";
        var msgHtml = '<h4 class="prompt-text text-warning"><i class="fa fa-exclamation-triangle"></i> 确认！</h4>';
        var buttonHtml = '<button type="button" class="btn btn-green" id="onConfirm">确 定</button>' +
            '<button type="button" class="btn btn-gray" data-dismiss="modal">取 消</button>';
        this.doPopup(op.title, op.content, type, msgHtml, buttonHtml);
        $('#onConfirm').click(function(){
            if(op.onConfirm){
                $("#" + type + "Modal").modal("hide");
                op.onConfirm.call();
                op.onConfirm = null;
            }else{
                return;
            }
        });

    },
    doPopup : function(title, content, type, msgHtml, buttonHtml){
        var obj = $("#"+ type +"Modal");
        if(obj.length == 0){
            var html = this.getHtml(title, content, type, msgHtml, buttonHtml);
            //document.body.innerHTML += html; 这种写法会使注册的事件失效
             $(document.body).append(html);
        }else{
            $("#my"+ type +"ModalLabel").html(title);
            $("#my"+ type +"ModalContent").html(content);
        }
        $("#" + type + "Modal").modal("show");
    },
    getHtml : function(title, content, type, msgHtml, buttonHtml){
        var pclass = "pd10";
        if(type!="confirm"){
            var buttonHtml = buttonHtml +
                '<button type="button" class="btn btn-gray" data-dismiss="modal">关闭</button>';
        }
        if(type == "loading"){
            var pclass = "loading";
            buttonHtml = "";
        }

        var html = '<div class="modal fade" id="'+ type +'Modal" style="display: block;" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<a class="close" data-dismiss="modal" aria-hidden="true"> &times; </a>' +
            '<h4 class="modal-title" id="my'+ type +'ModalLabel">' +
            title +
            ' </h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<div class="'+ pclass +'">' +
            msgHtml +
            '<p id="my'+ type +'ModalContent">'+ content +'</p>' +
            '</div>' +
            '</div>' +
            '<div class="modal-footer">' +
            buttonHtml +
            '</div>' +
            '</div>';
        return html;
    },
    /**
     * 提示文本框输入
     * @param title
     * @param content
     */
    tip : function(title, content){
        if(!content){
            content = "";
        }
        var type = "tip";
        var msgHtml = '<h4 class="prompt-text text-info"><i class="fa fa-exclamation-circle"></i> 提示！</h4>';
        var buttonHtml = '<button type="button" class="btn btn-green" data-dismiss="modal">确 定</button>';
        this.doPopup(title, content, type, msgHtml, buttonHtml);
    }
}