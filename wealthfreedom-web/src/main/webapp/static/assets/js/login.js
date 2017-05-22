var erpLoginTools = erpLoginTools ||{};

var lastUserPin = "";


function callBackPrompt(promptType) {
    var msg = "";
    switch (promptType) {
        case '00':
            msg = "登录账号不能为空!";
            break;
        case '01':
            msg = "你输入的账号不存在!";
            break;
        case '02':
            msg = "密码不能为空!";
            break;
        case '03':
            msg = "密码的长度必须在6-12之间!";
            break;
        case '04':
            msg = "账号录入有误，请重新输入!";
            break;
        case '05':
            msg = "请录入分机号!";
            break;
        case '06':
            msg = "分机号只能是数字，请输入数字!";
            break;
        case '07':
            msg = "分机号的长度必须小于等于11之间!";
            break;
        case '08':
            msg = "登录账号的长度必须小于等于18之间!";
            break;
    }
    showMsg(msg);
}

function showMsg(msg) {
    $("#msgBox").empty();
    $("#msgBox").append(msg).show();
}


//根据用户账号加载可登陆中心
function getUserVicPlatFormList() {
    $(".login-btn").attr("disabled",false).empty().html("<b><span>登录</span></b>");
    var thisUserPin = $.trim($("#userPin").val());
    if (thisUserPin != '' && lastUserPin != thisUserPin) {
        lastUserPin = $("#userPin").val();

        $('#telSystem').empty();
        $("<option ctiNum=''>").val('').text("请选择中心").appendTo($('#telSystem'));
        $('#CTINum').val('');
        $("#msgBox").empty();
        if (checkUserCode(callBackPrompt) && patternUsername(callBackPrompt)) {
            $.ajax({
                url: '/getUserVicpFormByUserPin',
                type: "post",
                async: false,
                cache: false,
                dataType: 'json',
                data: {userPin: $("#userPin").val()},
                beforeSend: function () {
                    $("#loadingModal").modal("show");
                },
                error: function (xhr) {
                    popupTool.error("", "系统暂时无法获取可登陆的语音平台中心！请稍后再试。")
                },
                success: function (result) {
                    if (result.success) {
                        var resData = result.data;
                        for (var i = 0; i < resData.length; i++) {
                            if (resData[i].isDefault == 1) {
                                //$("#telSystem").find("option[val='" + resData[i].platformId + "']").attr("selected", true);
                                $("<option ctiNum='" + resData[i].ctiNo + "' selected>").val(resData[i].platformId).text(resData[i].platformName).appendTo($('#telSystem'));
                                $("#CTINum").val(resData[i].ctiNo);
                            }else{
                                $("<option ctiNum='" + resData[i].ctiNo + "'>").val(resData[i].platformId).text(resData[i].platformName).appendTo($('#telSystem'));
                            }
                        }
                    }
                    else {
                        showMsg(result.msg);
                        $(".login-btn").attr("disabled",true).empty().html("<s><b><span>登录</span></b></s>");
                        return false;
                    }
                }
            });
        }
    }
}


function initLoad(){
    //绑定登录按钮事件
    $(".login-btn").click(function(){
        $(".login-btn").attr("disabled",false).empty().html("<s><b><span>正在登录...</span></b></s>");
        var userInfo = {
            userName:$("#userPin").val(),
            password:$("#password").val()
        };

        if(checkForm()){
            //ERP登录
            ErpSSOLogin(userInfo,function(flag,msgText){
                if(flag){
                    //用户信息
                    var ctiNum = $("#CTINum").val();//cti工号
                    var extTelNum = $.trim($("#extNum").val());//分机号
                    var telSystemId = $("#telSystem").val();//中心

                    var loginUrl = "/erpLogin/login?userPin="+ userInfo.userName +"&CTINum=" + ctiNum + "&extTelNum=" + extTelNum + "&telSystemId=" + telSystemId;

                    jQuery("#erploginForm").attr("action",loginUrl).submit();
                }else{
                    showMsg(msgText);
                    $(".login-btn").attr("disabled",false).empty().html("<s><b><span>登录</span></b></s>");
                }
            });
        }else{
            $(".login-btn").attr("disabled",false).empty().html("<s><b><span>登录</span></b></s>");
        }
    });

    //绑定Enter登录事件
    $("body").bind("keypress",function(e){
        if(e.keyCode == 13){
            $(".login-btn").click();
        }
    });

    //延迟执行获取工号接口，浏览器可能会记录账号信息
    //setTimeout('getUserVicPlatFormList(false)',200);
}

function checkUserCode(callBackPrompt) {
    var pinVal = $.trim($("#userPin").val());
    var pin = pinVal == "请输入您的账号"?"":pinVal;  //IE
    if(pin == "") {
        callBackPrompt('00');//登录账号不能为空!
        return false;
    }
    if(pin.length<=2){
        callBackPrompt('01');//你输入的账号不存在!
        return false;
    }
    return true;
}


function checkPassword(callBackPrompt) {
    var password = $.trim($("#password").val());
    $("#password").val(password);
    if (password == "") {
        callBackPrompt('02');//密码不能为空!
        return false;
    }
    if (password.length < 6 || password.length > 18) {
        callBackPrompt('03');//密码的长度必须在6-18之间!
        return false;
    }
    return true;
}

function patternUsername(callBackPrompt){
    var username =  $("#userPin").val();
    var pattern = new RegExp("[\u4e00-\u9fa5a-zA-Z0-9@.-]+");
    var len = username.length;
    var name = ""+pattern.exec(username);
    var length = name.length;

    if(len != length){
        callBackPrompt('04');//账号录入有误，请重新输入！
        return false;
    }
    return true;
}


function checkExtNum(callBackPrompt){
    var telNoVal = $.trim($('#extNum').val());
    var telNo = telNoVal == "请输入分机号"?"":telNoVal;//IE
    var telSysId = $("#telSystem").val();
    if(telSysId.length>0 && !telNo) {
        callBackPrompt('05');//请录入分机号！
        $('#extNum').focus();
        return false;
    }else{
        var reg = new RegExp("^[0-9]*$");
        if (!reg.test(telNo)) {
            callBackPrompt('06');//分机号只能是数字，请输入数字!
            $('#extNum').focus();
            return false;
        }

        if (telNo.length > 12) {
            callBackPrompt('07');//机号的长度小于等于12位!
            $('#extNum').focus();
            return false;
        }
    }

    return true;
}


function checkForm() {
    $("#msgBox").empty().hide();
    if(lastUserPin == ''){
        getUserVicPlatFormList(false);//自动填充直接提交触发
    }
    if (checkUserCode(callBackPrompt) && patternUsername(callBackPrompt) && checkPassword(callBackPrompt) && checkExtNum(callBackPrompt)) {
        return true;
    }
    return false;
}

function changeTelSystem(){
    var newCTINum = $('#telSystem').find("option:selected").attr("ctiNum");
    $("#CTINum").val(newCTINum);
}


