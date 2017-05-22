package com.jd.fms.merchantmaster.utils.exception;

import com.jd.fms.merchantmaster.utils.exception.base.ExceptionCode;

/**
 * Created by bjyfzcl.
 */
public class PopsSettleException extends PopsJsonException {
	public PopsSettleException(ExceptionCode code) {
		super(code);
	}

	public PopsSettleException(ExceptionCode code, String message) {
		super(message, code);
	}

	public PopsSettleException(String message) {
		super(message);
	}

	public PopsSettleException(String code, String message) {
		super("code=" + code + ",message=" + message, ExceptionCode.SYS_ERROR);
	}

	/**
	 * 适用于根据制定补充消息和参数枚举完成对外输出信息（需替换占位符）和log列印信息
	 * 
	 * @param msg
	 *            补充消息 如：异常发生是调用的参数或返回值
	 * @param errorCode
	 * @param args
	 */
	public PopsSettleException(ExceptionCode errorCode, String msg,
			String... args) {
		super(msg, errorCode, args);
	}
}
