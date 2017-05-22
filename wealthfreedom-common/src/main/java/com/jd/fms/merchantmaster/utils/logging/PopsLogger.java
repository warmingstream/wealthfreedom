package com.jd.fms.merchantmaster.utils.logging;

public interface PopsLogger {

	boolean isDebugEnabled();

	void error(String s, Throwable e);

	void error(String s);

	public void debug(String s);

	public void warn(String s);

	public void info(String s);
}
