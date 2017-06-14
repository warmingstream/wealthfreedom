package com.wealthfreedom.fms.merchantmaster.utils.domain;

/**
 * Created by bjyfzcl.
 */
public class ErrorKeyValueBean {
	private int errorCode;
	private String errorMsg;

	public ErrorKeyValueBean(int errorCode, String errorMsg) {
		this.errorCode = errorCode;
		this.errorMsg = errorMsg;
	}

	public int getErrorCode() {
		return errorCode;
	}

	public String getErrorMsg() {
		return errorMsg;
	}
}
