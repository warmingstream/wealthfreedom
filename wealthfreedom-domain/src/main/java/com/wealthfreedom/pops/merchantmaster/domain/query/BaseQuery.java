package com.wealthfreedom.pops.merchantmaster.domain.query;

import cn.org.rapid_framework.page.PageRequest;

public class BaseQuery extends PageRequest implements java.io.Serializable {
	private static final long serialVersionUID = -360860474471966681L;
	public static final int DEFAULT_PAGE_SIZE = 10;
	protected static final String DATE_FORMAT = "yyyy-MM-dd";
	protected static final String TIME_FORMAT = "HH:mm:ss";
	protected static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	protected static final String TIMESTAMP_FORMAT = "yyyy-MM-dd HH:mm:ss.S";

	public BaseQuery() {
		setPageSize(DEFAULT_PAGE_SIZE);
	}
	
	protected Integer page;
	protected Integer rows;

	public Integer getPage() {
		return page;
	}
	public void setPage(Integer page) {
		this.page = page;
		setPageNumber(page);
	}
	public Integer getRows() {
		return rows;
	}
	public void setRows(Integer rows) {
		this.rows = rows;
		setPageSize(rows);
	}
}