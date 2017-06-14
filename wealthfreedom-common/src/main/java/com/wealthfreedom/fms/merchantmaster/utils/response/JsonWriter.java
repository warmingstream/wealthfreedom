package com.wealthfreedom.fms.merchantmaster.utils.response;

import com.wealthfreedom.fms.merchantmaster.utils.domain.ErrorKeyValueBean;

public class JsonWriter<T> {

	/** 提示信息 */
	private String msg;

	/** 是否成功 */
	private boolean success = true;

	/** 返回值 */
	private T data;

	/**
	 * 错误信息
	 */
	private String errorMsg;
	/**
	 * 错误代码
	 */
	private int errorCode;

	private String exceptionMsg;

	public JsonWriter() {
	}

	public JsonWriter(T data) {
		this.data = data;
	}

	public JsonWriter(String msg, boolean success, T data) {
		this.msg = msg;
		this.success = success;
		this.data = data;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public Object getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public int getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(int errorCode) {
		this.errorCode = errorCode;
	}

	public void setError(ErrorKeyValueBean error) {
		this.setErrorCode(error.getErrorCode());
		this.setErrorMsg(error.getErrorMsg());
	}

	public String getExceptionMsg() {
		return exceptionMsg;
	}

	public void setExceptionMsg(String exceptionMsg) {
		this.exceptionMsg = exceptionMsg;
	}
}
