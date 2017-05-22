package com.jd.pops.merchantmaster.domain.model;

import java.io.Serializable;
import java.util.Date;

/**
 * 国内银行支付方式
 *
 * Created by wangming3 on 2017/4/26.
 */
public class InnerbankMethod implements Serializable {

    public static final String TABLE_ALIAS = "InnerbankMethod";

    private Long id;//主键

    private Long accountId;//结算账户id

    private String depositId;//银行账户

    private String depositCompanyName;//公司名

    private String depositName;//开户名

    private String deposotBankName;//开户行支行名称

    private String depositBankAddress;//开户银行支行所在地址

    private String associatedLineNum;//开户行支行联行号

    private Boolean yn;

    private Integer sysVersion;

    private String createPin;

    private Date createDate;

    private String updatePin;

    private Date updateDate;

    //constructors
    public InnerbankMethod() {
    }

    public InnerbankMethod(Long accountId) {
        this.accountId = accountId;
    }

    public InnerbankMethod(Long accountId, Boolean yn) {
        this.accountId = accountId;
        this.yn = yn;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public String getDepositId() {
        return depositId;
    }

    public void setDepositId(String depositId) {
        this.depositId = depositId == null ? null : depositId.trim();
    }

    public String getDepositCompanyName() {
        return depositCompanyName;
    }

    public void setDepositCompanyName(String depositCompanyName) {
        this.depositCompanyName = depositCompanyName;
    }

    public String getDepositName() {
        return depositName;
    }

    public void setDepositName(String depositName) {
        this.depositName = depositName == null ? null : depositName.trim();
    }

    public String getDeposotBankName() {
        return deposotBankName;
    }

    public void setDeposotBankName(String deposotBankName) {
        this.deposotBankName = deposotBankName == null ? null : deposotBankName.trim();
    }

    public String getDepositBankAddress() {
        return depositBankAddress;
    }

    public void setDepositBankAddress(String depositBankAddress) {
        this.depositBankAddress = depositBankAddress == null ? null : depositBankAddress.trim();
    }

    public String getAssociatedLineNum() {
        return associatedLineNum;
    }

    public void setAssociatedLineNum(String associatedLineNum) {
        this.associatedLineNum = associatedLineNum == null ? null : associatedLineNum.trim();
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
        this.createPin = createPin == null ? null : createPin.trim();
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
        this.updatePin = updatePin == null ? null : updatePin.trim();
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
}