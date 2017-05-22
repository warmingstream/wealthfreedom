/**
 * Created by heshuang10 on 2016/4/15.
 */
var regexTools = {

    //匹配国内电话号码：d{3}-d{8}|d{4}-d{7}
    phone : function(phone){
        var reg=/^1[3|4|5|7|8]\d{9}$/;
        if(!reg.exec(phone)){
            popupTool.tip("提示","手机号码格式错误！");
            return false;
        }
        return true;
    },
    //匹配Email地址的正则表达式：w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*
    emails : function(emails){
        var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
        if(!reg.exec(emails)){
            popupTool.tip("提示","邮箱格式错误！");
            return false;
        }
        return true;
    },

    //tag为字段名称
    strName : function(strName,tagName){
        var reg = /[\u4E00-\u9FA5A-Za-z]+$/;
        if(!strName || !$.trim(strName)){
            popupTool.tip("提示","请输入"+tagName+"!");
            return false;
        }else if(!reg.exec(strName)){
            popupTool.tip("提示",tagName+"只允许输入中文或英文!");
            return false;
        }
        return true;
    },

    //不能为空,长度32字符，包含英文，数字，”_”,“@”，“-”，“.”需以字母开头
    //tag为字段名称
    strVal : function(strVal,tagName){
        ;
        var reg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._@-]){1,31}$/;
        if(!strVal || !$.trim(strVal)){
            popupTool.tip("提示","请输入"+tagName+"!");
            return false;
        }else if(!reg.exec(strVal)){
            popupTool.tip("提示",tagName+"只允许输入长度32字符，包含英文，数字，”_”,“@”，“-”，“.”需以字母开头！");
            return;
        }
        return true;
    }
}
