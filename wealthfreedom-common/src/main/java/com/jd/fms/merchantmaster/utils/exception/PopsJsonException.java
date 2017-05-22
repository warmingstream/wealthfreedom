package com.jd.fms.merchantmaster.utils.exception;

import com.jd.fms.merchantmaster.utils.exception.base.ExceptionCode;

/**
 * Created by bjyfzcl.
 */
public class PopsJsonException extends PopsRuntimeException{

    private static final long serialVersionUID = 3211697889252771850L;

    /**
     * 适用于根据参数枚举完成对外输出信息和log列印信息
     * @param errorCode
     */
    public PopsJsonException(ExceptionCode errorCode) {
        super(errorCode);
    }

    /**
     * 适用于根据制定补充消息和参数枚举完成对外输出信息和log列印信息
     * @param msg 补充消息 如：异常发生是调用的参数或返回值
     * @param errorCode
     */
    public PopsJsonException(String msg, ExceptionCode errorCode) {
        super(msg,errorCode);
    }

    public PopsJsonException(String msg) {
        super(msg);
    }

    /**
     * 适用于根据参数枚举完成对外输出信息（需替换占位符）和log列印信息
     * @param args 填充对外提供异常信息中的占位符
     * @param errorCode
     */
    public PopsJsonException(ExceptionCode errorCode, String... args) {
        super(errorCode);
    }

    /**
     * 适用于根据制定补充消息和参数枚举完成对外输出信息（需替换占位符）和log列印信息
     * @param msg 补充消息 如：异常发生是调用的参数或返回值
     * @param errorCode
     * @param args
     */
    public PopsJsonException(String msg, ExceptionCode errorCode, String... args) {
        super(msg,errorCode,args);
    }

    public PopsJsonException(Throwable cause, ExceptionCode errorCode) {
        super(cause,errorCode);
    }

    public PopsJsonException(String msg, Throwable cause, ExceptionCode errorCode) {
        super(msg,cause,errorCode);
    }

    public PopsJsonException(Throwable cause, ExceptionCode errorCode, String... args) {
        super(cause,errorCode,args);
    }

    public PopsJsonException(String msg, Throwable cause, ExceptionCode errorCode, String... args) {
        super(msg,cause,errorCode,args);
    }
}
