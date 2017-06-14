package com.wealthfreedom.fms.merchantmaster.utils.cache.impl;

import com.wealthfreedom.fms.merchantmaster.utils.cache.PopsCache;
import com.wealthfreedom.fms.merchantmaster.utils.cache.PopsCacheManager;
import com.wealthfreedom.fms.merchantmaster.utils.logging.PopsLogFactory;
import com.wealthfreedom.fms.merchantmaster.utils.logging.PopsLogger;
import com.jd.jim.cli.Cluster;

public class PopsCacheManagerRedis implements PopsCacheManager {
	
	private static final PopsLogger popslogger = PopsLogFactory
			.getLog(PopsCacheManagerRedis.class);

	private Cluster jimClient;

	private String version;

	private static PopsCacheManager instance;

	public static PopsCacheManager getInstance() {
		return instance;
	}

	public PopsCacheManagerRedis() {
		instance = this;
	}

	@Override
	public PopsCache getCache() {
		PopsCache amsCache = null;
		try {
			amsCache = new PopsCacheRedis(jimClient, version);
		} catch (Exception e) {
			popslogger.error("缓存服务器启动失败", e);
			amsCache = new PopsCacheRedis();
		}
		return amsCache;
	}

	public void setJimClient(Cluster jimClient) {
		this.jimClient = jimClient;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}
}
