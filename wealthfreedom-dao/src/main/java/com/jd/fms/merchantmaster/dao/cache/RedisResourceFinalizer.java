package com.jd.fms.merchantmaster.dao.cache;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 用于是否redis资源
 */
public class RedisResourceFinalizer {
	Logger logger = LoggerFactory.getLogger(RedisResourceFinalizer.class);

	protected void finalize() {
		try {
			logger.info("释放redis连接资源开始");
			if (RedisClientWrapper.clientFactory != null) {
				RedisClientWrapper.clientFactory.clear();
				logger.info("释放redis连接资源完成");
			}
		} catch (Exception e) {
			logger.info("释放redis连接资源出错:", e);
		}
	}
}
