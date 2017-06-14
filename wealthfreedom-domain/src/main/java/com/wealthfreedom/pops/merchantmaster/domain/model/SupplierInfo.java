package com.wealthfreedom.pops.merchantmaster.domain.model;

import com.sun.org.apache.xpath.internal.operations.Bool;

import java.io.Serializable;
import java.util.Date;


/**
 * 商家主数据
 *
 * Created by wangming on 2017/4/26.
 */
public class SupplierInfo implements Serializable{

    public static final String TABLE_ALIAS = "SupplierInfo";

    private Long id;//主键

    private Long supplierId;//商家id

    private Long companyId;//公司id

    private String supplierName;//商家名称

    private String companyName;//公司名称（结算单上名称）

    private Long payeeId;//资金账户编号（计费系统id）

    private Long accountId;//结算账户id

    private Integer accountType;//结算账户类型（流水倒扣，收支两线，O2O等）

    private Integer supplierType;//店铺类型(sop、lbv等)

    private Boolean ftState;//冻结解冻状态 1冻结，0解冻

    private Boolean state;//店铺状态（启用、禁用）true : 启用

    private Integer paymentType;//获取支付方式（用哪种方式转换实体对象）

    private Integer payoutPipline;//获取支付管道 (对接下游的哪种支付网关)

    private Long buId;//事业部id

    private Boolean processStatus;//账户验证状态 true :通过验证

    private Boolean strategicSupplier;//战略商家

    private String operatorId;//运营人erp

    private Boolean yn;

    private Integer sysVersion;

    private String createPin;

    private Date createDate;

    private String updatePin;

    private Date updateDate;



    //constructors
    public SupplierInfo() {
    }

    public SupplierInfo(Long accountId) {
        this.accountId = accountId;
    }

    public SupplierInfo(Long accountId, Boolean yn) {
        this.accountId = accountId;
        this.yn = yn;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
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

    public Long getPayeeId() {
        return payeeId;
    }

    public void setPayeeId(Long payeeId) {
        this.payeeId = payeeId;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Integer getAccountType() {
        return accountType;
    }

    public void setAccountType(Integer accountType) {
        this.accountType = accountType;
    }

    public Integer getSupplierType() {
        return supplierType;
    }

    public void setSupplierType(Integer supplierType) {
        this.supplierType = supplierType;
    }

    public Boolean getFtState() {
        return ftState;
    }

    public void setFtState(Boolean ftState) {
        this.ftState = ftState;
    }

    public Boolean getState() {
        return state;
    }

    public void setState(Boolean state) {
        this.state = state;
    }

    public Integer getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(Integer paymentType) {
        this.paymentType = paymentType;
    }

    public Integer getPayoutPipline() {
        return payoutPipline;
    }

    public void setPayoutPipline(Integer payoutPipline) {
        this.payoutPipline = payoutPipline;
    }

    public Long getBuId() {
        return buId;
    }

    public void setBuId(Long buId) {
        this.buId = buId;
    }

    public Boolean getProcessStatus() {
        return processStatus;
    }

    public void setProcessStatus(Boolean processStatus) {
        this.processStatus = processStatus;
    }

    public Boolean getStrategicSupplier() {
        return strategicSupplier;
    }

    public void setStrategicSupplier(Boolean strategicSupplier) {
        this.strategicSupplier = strategicSupplier;
    }

    public String getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(String operatorId) {
        this.operatorId = operatorId;
    }

    public Boolean getYn() {
        return yn;
    }

    public void setYn(Boolean yn) {
        this.yn = yn;
    }

    public Integer getSysVersion() {
        return sysVersion;
    }

    public void setSysVersion(Integer sysVersion) {
        this.sysVersion = sysVersion;
    }

    public String getCreatePin() {
        return createPin;
    }

    public void setCreatePin(String createPin) {
        this.createPin = createPin;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getUpdatePin() {
        return updatePin;
    }

    public void setUpdatePin(String updatePin) {
        this.updatePin = updatePin;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
}