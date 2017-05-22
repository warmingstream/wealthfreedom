package com.jd.fms.merchantmaster.utils.cache;

public interface PopsCache {
	/**
	 * 缓存查询
	 */
	Object get(String key);

	/**
	 * 缓存查询
	 */
	Object get(String key, boolean addKeyVersion);

	/**
	 * 向缓存中添加缓存项
	 */
	void put(String key, Object value);

	/**
	 * 向缓存中添加缓存项,seconds为存活时间
	 * 
	 * @param key
	 * @param value
	 * @param seconds
	 */
	void put(String key, Object value, int seconds);

	/**
	 * 向缓存中添加缓存项
	 * 
	 * @param key
	 * @param addKeyVersion
	 * @param value
	 * @param seconds
	 */
	void put(String key, boolean addKeyVersion, Object value, int seconds);

	/**
	 * 缓存项逐出
	 */
	void evict(String key);

	/**
	 * 缓存项逐出
	 */
	void evict(String key, boolean addKeyVersion);

}
