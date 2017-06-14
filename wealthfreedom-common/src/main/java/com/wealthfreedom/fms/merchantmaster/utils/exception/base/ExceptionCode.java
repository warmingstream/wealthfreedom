package com.wealthfreedom.fms.merchantmaster.utils.exception.base;


public enum ExceptionCode {
    SYS_ERROR("A0000","系统处理异常！"),
    DB_ERROR("A0001","数据库操作异常！"),
    BIZ_ERROR("A0002","业务异常！"),
    PRIVILEGE_ERROR("A0003","登陆异常！"),
    EXCEL_DOWNLOAD_ERROR("A0004","文件下载异常！"),
    PARAM_ERROR("A0005","必要参数缺失！"),
    CACHE_ERROR("A0006","缓存异常！"),
    ERP_WS_ERROR("A0007","ERP获取用户WebService访问异常！"),
    LOGIN_ERROR("A0008","登录已超时，请重新登录！"),
    MOBILE_ERROR("A0009","请输入正确的手机号码"),
    SAMUSER_NOTEXIST_ERROR("D0000","用户不存在异常!"),
    USERSPACCOUNT_NOTEXIST_ERROR("D0001","用户工号不存在异常！"),
    SAMUSER_CANCELLATION("D0002","用户已经被注销!");

    ExceptionCode(String code, String logMsg) {
        this.code=code;
        this.logMsg=logMsg;
    }

    //对用户输出信息，国际化异常信息代码（见message文件）
    private String code;
    //后台异常列印信息（输出到log文件）
    private String logMsg;

    public String getCode() {
        return code;
    }

    public String getLogMsg() {
        return logMsg;
    }
}
