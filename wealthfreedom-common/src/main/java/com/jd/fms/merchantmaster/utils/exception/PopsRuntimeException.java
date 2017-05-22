package com.jd.fms.merchantmaster.utils.exception;

import com.jd.fms.merchantmaster.utils.exception.base.ExceptionCode;

/**
 * Created by bjyfzcl.
 */
public class PopsRuntimeException extends RuntimeException {

    private static final long serialVersionUID = 6444691950839485557L;

    //异常信息枚举
    private ExceptionCode errorCode;
    //对外异常提示信息动态信息部分
    private String[] args;

    /**
     * 适用于根据参数枚举完成对外输出信息和log列印信息
     * @param errorCode
     */
    public PopsRuntimeException(ExceptionCode errorCode) {
        super(errorCode.getCode()+":"+errorCode.getLogMsg());
        this.errorCode = errorCode;
        this.args = null;
    }

    /**
     * 适用于根据制定补充消息和参数枚举完成对外输出信息和log列印信息
     * @param msg 补充消息 如：异常发生是调用的参数或返回值
     * @param errorCode
     */
    public PopsRuntimeException(String msg,ExceptionCode errorCode) {
        super(errorCode.getCode()+":"+errorCode.getLogMsg()+" ["+msg+"]");
        this.errorCode = errorCode;
        this.args = null;
    }

    /**
     * 适用于根据制定补充消息和参数枚举完成对外输出信息和log列印信息
     * @param msg 补充消息 如：异常发生是调用的参数或返回值
     */
    public PopsRuntimeException(String msg) {
        super("["+msg+"]");
        this.args = null;
    }

    /**
     * 适用于根据参数枚举完成对外输出信息（需替换占位符）和log列印信息
     * @param args 填充对外提供异常信息中的占位符
     * @param errorCode
     */
    public PopsRuntimeException(ExceptionCode errorCode,String... args) {
        super(errorCode.getCode()+":"+errorCode.getLogMsg());
        this.errorCode = errorCode;
        this.args = args;
    }

    /**
     * 适用于根据制定补充消息和参数枚举完成对外输出信息（需替换占位符）和log列印信息
     * @param msg 补充消息 如：异常发生是调用的参数或返回值
     * @param errorCode
     * @param args
     */
    public PopsRuntimeException(String msg,ExceptionCode errorCode,String... args) {
        super(errorCode.getCode()+":"+errorCode.getLogMsg()+" ["+msg+"]");
        this.errorCode = errorCode;
        this.args = args;
    }

    public PopsRuntimeException(Throwable cause,ExceptionCode errorCode) {
        super(errorCode.getCode()+":"+errorCode.getLogMsg(),cause);
        this.errorCode = errorCode;
        this.args = null;
    }

    public PopsRuntimeException(String msg, Throwable cause,ExceptionCode errorCode) {
        super(errorCode.getCode()+":"+errorCode.getLogMsg()+" ["+msg+"]",cause);
        this.errorCode = errorCode;
        this.args = null;
    }

    public PopsRuntimeException(Throwable cause,ExceptionCode errorCode,String... args) {
        super(errorCode.getCode()+":"+errorCode.getLogMsg(),cause);
        this.errorCode = errorCode;
        this.args = args;
    }

    public PopsRuntimeException(String msg, Throwable cause,ExceptionCode errorCode,String... args) {
        super(errorCode.getCode()+":"+errorCode.getLogMsg()+" ["+msg+"]",cause);
        this.errorCode = errorCode;
        this.args = args;
    }

    public ExceptionCode getErrorCode() {
        return errorCode;
    }

    public String[] getArgs() {
        return args;
    }
}
