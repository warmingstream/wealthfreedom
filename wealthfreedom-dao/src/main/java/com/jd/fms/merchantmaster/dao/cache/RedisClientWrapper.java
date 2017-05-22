package com.jd.fms.merchantmaster.dao.cache;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.apache.ibatis.logging.Log;
import org.apache.ibatis.logging.LogFactory;

import com.jd.fms.merchantmaster.utils.MD5Util;
import com.jd.jim.cli.Cluster;
import com.jd.jim.cli.ReloadableJimClientFactory;
import com.jd.jim.cli.config.client.ConfigLongPollingClientFactoryBean;

/**
 * redis缓存客户端包装类 
 */
final class RedisClientWrapper {

	/**
	 * This class log.
	 */
	private final Log log = LogFactory.getLog(RedisCache.class);

	private static Cluster client;

	protected static ReloadableJimClientFactory clientFactory;

	private static final String REDIS_RESOURCE = "cache/redis.properties";

	private String jimUrl;
	private String serviceEndpoint;
	private String prefix;
	private int expiretime;

	public RedisClientWrapper() {
		try {
			Properties config = new Properties();
			InputStream input = getClass().getClassLoader()
					.getResourceAsStream(REDIS_RESOURCE);
			if (input != null) {
				try {
					config.load(input);
					jimUrl = config.getProperty("cache.jimUrl");
					serviceEndpoint = config
							.getProperty("cache.serviceEndpoint");
					prefix = config.getProperty("cache.redis.prefix");
					expiretime = Integer.parseInt(config
							.getProperty("cache.redis.expiretime"));
				} catch (IOException e) {
					log.error("REDIS_CONFIG_LOAD_IO_EXCEPTION", e);
					throw new RuntimeException(
							"An error occurred while reading classpath property '"
									+ REDIS_RESOURCE
									+ "', see nested exceptions", e);
				} finally {
					try {
						input.close();
					} catch (IOException e) {
						log.error("REDISCONFIG_IO_EXCEPTION", e);
					}
				}
			}

			ConfigLongPollingClientFactoryBean configClient = new ConfigLongPollingClientFactoryBean();
			configClient.setServiceEndpoint(serviceEndpoint);
			clientFactory = new ReloadableJimClientFactory();
			clientFactory.setConfigClient(configClient.create());
			clientFactory.setJimUrl(jimUrl);
			client = clientFactory.getClient();
		} catch (Exception e) {
			String message = "Impossible to instantiate a new redis client instance, see nested exceptions";
			log.error(message, e);
			throw new RuntimeException(message, e);
		}
	}

	/**
	 * Converts the iBatis object key in the proper string representation.
	 * 转换CacheKey成为redis的缓存键
	 * 
	 * @param nameSpaceId
	 * @param key
	 *            the iBatis object key.
	 * @return the proper string representation.
	 */
	private String toKeyString(String nameSpaceId, Object key) {
		String keyString = prefix + "_" + nameSpaceId.toLowerCase() + "_"
				+ MD5Util.md5Hex(key.toString());
		return keyString;
	}

	/**
	 * 获取CacheKey对应的缓存
	 * 
	 * @param nameSpaceId
	 * @param key
	 * @return
	 */
	public Object getObject(String nameSpaceId, Object key) {
		String keyString = toKeyString(nameSpaceId, key);
		Object ret = retrieve(keyString);
		return ret;
	}

	/**
	 * Return the stored group in redis identified by the specified key.
	 * 获取命名空间下所有的缓存键列表
	 * 
	 * @param groupKey
	 *            the group key.
	 * @return the group if was previously stored, null otherwise.
	 */
	@SuppressWarnings("unchecked")
	private Set<byte[]> getGroup(String groupKey) {
		// Object groups = null;
		// try {
		// groups = retrieve(groupKey);
		// } catch (Exception e) {
		// log.error("GET_GROUP_KEYS_ERROR" + groupKey, e);
		// }

		Set<byte[]> groups = null;
		try {
			groups = client
					.sMembers(groupKey.getBytes(Charset.defaultCharset()));
		} catch (Exception e) {
			log.error("MYBATIS_CACHE_ERROR_RETRIEVE|" + groupKey, e);
		}

		return groups;
		// if (groups == null) {
		// return null;
		// }
		//
		// return (Set<String>) groups;
	}

	/**
	 * 获取缓存键对应的值对象
	 * 
	 * @param keyString
	 * @return
	 * @throws Exception
	 */
	private Object retrieve(final String keyString) {
		Object retrieved = null;

		try {
			retrieved = SerialTool.deSerialize(client.get(keyString
					.getBytes(Charset.defaultCharset())));
		} catch (Exception e) {
			log.error("MYBATIS_CACHE_ERROR_RETRIEVE|" + keyString, e);
		}

		return retrieved;
	}

	public void putObject(String nameSpaceId, Object key, Object value) {
		String keyString = toKeyString(nameSpaceId, key);
		String groupKey = toKeyString(nameSpaceId, nameSpaceId);

		// 方案一
		// 先加入key，因为两个操作不能保证事物，操作1失败，不执行操作2
		try {
			client.sAdd(groupKey.getBytes(Charset.defaultCharset()),
					keyString.getBytes(Charset.defaultCharset()));
			// Set<byte[]> keys = getGroup(groupKey);
			// System.out.println("keysize="+keys==null ? 0:keys.size());
		} catch (Exception e) {
			log.error("MYBATIS_CACHE_ERROR_ADD_GROUPKEY|group=" + groupKey
					+ "|key=" + keyString, e);
			return;
		}

		try {
			client.setEx(keyString.getBytes(Charset.defaultCharset()),
					SerialTool.serialize(value), expiretime, TimeUnit.SECONDS);
		} catch (Exception e) {
			log.error("MYBATIS_CACHE_STORE_ERROR|" + keyString, e);
			return;
		}

		// 方案二（以下部分已被方案一替换）
		// storeInRedis(keyString, value);

		// add namespace key into cache
		// Set<String> group = getGroup(groupKey);
		// if (group == null) {
		// group = new HashSet<String>();
		// }
		// group.add(keyString);
		//
		// if (log.isDebugEnabled()) {
		// log.debug("Insert/Updating object ("
		// + groupKey
		// + ", "
		// + group
		// + ")");
		// }
		//
		// storeInRedis(groupKey, group);
	}

	// /**
	// * Stores an object identified by a key in redis.
	// *
	// * @param keyString the object key
	// * @param value the object has to be stored.
	// */
	// private void storeInRedis(String keyString, Object value) {
	// try {
	// client.setex(SerialTool.serialize(keyString), expiretime,
	// SerialTool.serialize(value));
	// } catch (Exception e) {
	// log.error("MYBATIS_CACHE_STORE_ERROR|"+keyString, e);
	// }
	// }

	public Object removeObject(String nameSpaceId, Object key) {
		String keyString = toKeyString(nameSpaceId, key);
		Object result = null;
		try {
			result = SerialTool.deSerialize(client.get(keyString
					.getBytes(Charset.defaultCharset())));
			if (result != null) {
				client.del(keyString.getBytes(Charset.defaultCharset()));
			}
		} catch (Exception e) {
			log.error("MYBATIS_CACHE_REMOVE_ERROR|" + keyString, e);
		}
		return result;
	}

	public void removeGroup(String nameSpaceId) {
		final String groupKey = toKeyString(nameSpaceId, nameSpaceId);

		// 先查询该命名空间下所有键的集合，逐个删除
		Set<byte[]> group = getGroup(groupKey);
		if (group == null) {
			return;
		}
		for (byte[] key : group) {
			try {
				client.del(key);
			} catch (Exception e) {
				log.error("MYBATIS_CACHE_REMOVE_ERROR|" + String.valueOf(key),
						e);
			}
		}

		try {
			client.del(groupKey.getBytes(Charset.defaultCharset()));
		} catch (Exception e) {
			log.error("MYBATIS_CACHE_REMOVE_GROUPKEY_ERROR|" + groupKey, e);
		}
	}

	@Override
	protected void finalize() throws Throwable {
		// 不能保证一定执行
		super.finalize();
		clientFactory.clear();
	}

}
