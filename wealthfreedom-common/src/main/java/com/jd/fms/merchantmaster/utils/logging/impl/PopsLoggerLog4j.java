package com.jd.fms.merchantmaster.utils.logging.impl;

import org.apache.log4j.Logger;

import com.jd.fms.merchantmaster.utils.logging.PopsLogger;

public class PopsLoggerLog4j implements PopsLogger {

	private Logger log;

	public PopsLoggerLog4j(Class<?> clazz) {
		log = Logger.getLogger(clazz);
	}

	public boolean isDebugEnabled() {
		return log.isDebugEnabled();
	}

	public void error(String s, Throwable e) {
		log.error(s, e);
	}

	public void error(String s) {
		log.error(s);
	}

	public void debug(String s) {
		log.debug(s);
	}

	public void warn(String s) {
		log.warn(s);
	}

	@Override
	public void info(String s) {
		log.info(s);
	}
}