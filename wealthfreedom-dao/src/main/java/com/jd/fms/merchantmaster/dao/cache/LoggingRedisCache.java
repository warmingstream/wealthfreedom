package com.jd.fms.merchantmaster.dao.cache;

import org.apache.ibatis.cache.decorators.LoggingCache;


public final class LoggingRedisCache extends LoggingCache {

    public LoggingRedisCache(final String id) {
        super(new RedisCache(id));
    }

}
