package com.wealthfreedom.fms.merchantmaster.dao.cache;

import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import org.apache.ibatis.cache.Cache;

public final class RedisCache implements Cache {

	private static final RedisClientWrapper REDIS_CLIENT = new RedisClientWrapper();

	/**
	 * The {@link java.util.concurrent.locks.ReadWriteLock}.
	 */
	private final ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

	/**
	 * The cache id.
	 */
	private final String id;

	/**
	 * Builds a new Memcached-based Cache.
	 * 
	 * @param id
	 *            the Mapper id.
	 */
	public RedisCache(final String id) {
		this.id = id;
	}

	/**
	 * {@inheritDoc}
	 */
	public String getId() {
		return this.id;
	}

	/**
	 * {@inheritDoc}
	 */
	public int getSize() {
		return Integer.MAX_VALUE;
	}

	/**
	 * {@inheritDoc}
	 */
	public ReadWriteLock getReadWriteLock() {
		return this.readWriteLock;
	}

	/**
	 * {@inheritDoc}
	 */
	public Object getObject(Object key) {
		return REDIS_CLIENT.getObject(this.id, key);
	}

	/**
	 * {@inheritDoc}
	 */
	public void putObject(Object key, Object value) {
		REDIS_CLIENT.putObject(this.id, key, value);
	}

	/**
	 * {@inheritDoc}
	 */
	public Object removeObject(Object key) {
		return REDIS_CLIENT.removeObject(this.id, key);
	}

	/**
	 * {@inheritDoc}
	 */
	public void clear() {
		REDIS_CLIENT.removeGroup(this.id);
	}

}
