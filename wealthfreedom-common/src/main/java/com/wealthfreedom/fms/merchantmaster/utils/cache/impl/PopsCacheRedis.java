package com.wealthfreedom.fms.merchantmaster.utils.cache.impl;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import com.wealthfreedom.fms.merchantmaster.utils.cache.PopsCache;
import com.wealthfreedom.fms.merchantmaster.utils.logging.PopsLogFactory;
import com.wealthfreedom.fms.merchantmaster.utils.logging.PopsLogger;
import com.wealthfreedom.fms.merchantmaster.utils.serializer.PopsSerializer;
import org.apache.commons.lang.StringUtils;

import com.jd.jim.cli.Cluster;

public class PopsCacheRedis implements PopsCache {
	PopsLogger amsLogger = PopsLogFactory.getLog(PopsCacheRedis.class);

	private Cluster jimClient;

	private String cacheVersion;

	public PopsCacheRedis() {
	}

	public PopsCacheRedis(Cluster jimClient) {
		this.jimClient = jimClient;
	}

	/**
	 * 带缓存版本的初始化
	 * @param jimClient
	 * @param version 缓存key前缀
	 */
	public PopsCacheRedis(Cluster jimClient, String version) {
		this.jimClient = jimClient;
		this.cacheVersion = version;
	}

	//private Object getKeyWithVersion(Object key) {
	private String getKeyWithVersion(String key) {
		if (StringUtils.isNotBlank(key) && StringUtils.isNotBlank(cacheVersion)){
			key = cacheVersion + key;
		}
		return key;
	}

	private byte[] getSerializedKey(String key,boolean addKeyVersion) {
		try {
			if(addKeyVersion){
				key = getKeyWithVersion(key);
			}
//			return AmsSerializer.serialize(key);
			return key.getBytes("utf-8");
		} catch (IOException e) {
			amsLogger.error("序列化缓存key异常：", e);
			return null;
		}
	}

	@Override
	public Object get(String key) {
		return get(key,true);
	}

	@Override
	public Object get(String key, boolean addKeyVersion) {
		if (key == null) {
			return null;
		}
		if (!checkCacheInit()) {
			return null;
		}
		byte[] buf;
		Object returnValue = null;
		try {
			buf = jimClient.get(getSerializedKey(key,addKeyVersion));
			if (buf == null) {
				amsLogger.warn("没有查找到key:[" + (addKeyVersion ? getKeyWithVersion(key):key) + "]");
				return buf;
			}
			returnValue = PopsSerializer.deSerialize(buf);
		} catch (Exception e) {
			amsLogger.error("调用缓存服务器get操作出错:", e);
		}
		return returnValue;
	}

	@Override
	public void put(String key, Object value) {
		put(key,true,value,43200);
	}

	@Override
	public void put(String key, Object value, int seconds) {
		put(key,true,value,seconds);
	}

	@Override
	public void put(String key, boolean addKeyVersion, Object value, int seconds) {
		if (key == null) {
			return;
		}
		if (!checkCacheInit()) {
			return;
		}
		if (value == null) {
			return;
		}
		try {
			jimClient.setEx(getSerializedKey(key,addKeyVersion),PopsSerializer.serialize(value),seconds, TimeUnit.SECONDS);
		} catch (Exception e){
			amsLogger.error("调用缓存服务器put操作出错:", e);
		}
	}

	@Override
	public void evict(String key) {
		evict(key,true);
	}

	@Override
	public void evict(String key, boolean addKeyVersion) {
		if (key == null) {
			return;
		}
		if (!checkCacheInit()) {
			return;
		}
		try {
			final byte[] keyArray = getSerializedKey(key,addKeyVersion);
			jimClient.del(keyArray);
		} catch (Exception e) {
			amsLogger.error("调用缓存服务器evict操作出错:", e);
		}
	}

	private boolean checkCacheInit() {
		if (jimClient == null) {
			amsLogger.error("缓存服务器没有初始化");
			return false;
		}
		return true;
	}

}
