package com.wealthfreedom.pops.merchantmaster.domain.query;

import java.io.Serializable;

/**
 *  商家主数据查询条件
 */
public class SupplierInfoQuery extends BaseQuery implements Serializable {

	private String supplierId;//商家id

	private String companyId;//公司id

	private String supplierName;//商家名称

	private String companyName;//公司名称

	private Long buId;//事业部id

	private Integer ftState;//冻结解冻状态

	public String getSupplierId() {
		return supplierId;
	}

	public void setSupplierId(String supplierId) {
		this.supplierId = supplierId;
	}

	public String getCompanyId() {
		return companyId;
	}

	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}

	public String getSupplierName() {
		return supplierName;
	}

	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public Long getBuId() {
		return buId;
	}

	public void setBuId(Long buId) {
		this.buId = buId;
	}

	public Integer getFtState() {
		return ftState;
	}

	public void setFtState(Integer ftState) {
		this.ftState = ftState;
	}
}

