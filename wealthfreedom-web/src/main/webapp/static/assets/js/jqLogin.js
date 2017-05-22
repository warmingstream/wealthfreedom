
function ErpSSOLogin(userInfo,call_back){
    var erp_jd_sso_url = "http://erp1.jd.com/newhrm/ssoResponse.aspx?";
    var userName = userInfo.userName;
    var password = userInfo.password;
    var params = {
        optiontype	:	"login",
        userName_erp	:	userName,
        userPassword_erp	:	password
    };
    jQuery.ajax({
        type	:	"GET",
        url		:	erp_jd_sso_url,
        data	:	params,
        async   :  false,
        dataType: "jsonp",
        beforeSend: function () {
        },
        error:function(xmlHttpRequest,textStatus, errorThrown){
            call_back(false,"ERP系统异常，登录失败！");
        },
        success:function(data, textStatus){
            if(data=='true'){
                call_back(true,null);
            }else{
                call_back(false,"ERP账户或密码输入有误，请重新登录！");
            }
        }
    });
};

