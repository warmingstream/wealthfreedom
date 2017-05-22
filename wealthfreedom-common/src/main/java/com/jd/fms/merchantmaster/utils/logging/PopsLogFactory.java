package com.jd.fms.merchantmaster.utils.logging;

import java.lang.reflect.Constructor;

public class PopsLogFactory {

	private static Constructor<? extends PopsLogger> logConstructor;

	static {
		tryImplementation(new Runnable() {
			public void run() {
				useLog4JLogging();
			}
		});
	}

	public static PopsLogger getLog(Class<?> aClass) {
		try {
			return logConstructor.newInstance(new Object[] { aClass });
		} catch (Throwable t) {
			throw new RuntimeException("Error creating logger for class " + aClass + ".  Cause: " + t);
		}
	}

	public static synchronized void useLog4JLogging() {
		setImplementation("com.jd.pops.settlement.utils.logging.impl.PopsLoggerLog4j");
	}

	private static void tryImplementation(Runnable runnable) {
		if (logConstructor == null) {
			try {
				runnable.run();
			} catch (Throwable t) {
				// ignore
			}
		}
	}

	private static void setImplementation(String implClassName) {
		try {
			@SuppressWarnings("unchecked")
			Class<? extends PopsLogger> implClass = (Class<? extends PopsLogger>) PopsLogFactory.class.forName(implClassName);
			
			Constructor<? extends PopsLogger> candidate = implClass.getConstructor(new Class[] { Class.class });
			
			PopsLogger log = candidate.newInstance(new Object[] { PopsLogFactory.class });
			log.debug("Logging initialized using '" + implClassName + "' adapter.");
			
			logConstructor = candidate;
		} catch (Throwable t) {
			throw new RuntimeException("Error setting Log implementation.  Cause: " + t, t);
		}
	}
}
