package com.wealthfreedom.fms.merchantmaster.utils.exception;

public class RecordExistException  extends RuntimeException{
	
    public RecordExistException() {
        super();
    }

    public RecordExistException(String message) {
        super(message);
    }
}
