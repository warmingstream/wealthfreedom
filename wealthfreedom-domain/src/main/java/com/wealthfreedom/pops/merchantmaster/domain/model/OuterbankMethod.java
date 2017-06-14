package com.wealthfreedom.pops.merchantmaster.domain.model;

import java.io.Serializable;
import java.util.Date;

/**
 * 国外银行支付方式
 *
 * Created by wangming3 on 2017/4/26.
 */
public class OuterbankMethod implements Serializable {

    public static final String TABLE_ALIAS = "OuterbankMethod";

    private Long id;//主键

    private Long accountId;//结算账户id

    private String depositId;//银行账户

    private String depositCompanyName;//公司名

    private String depositName;//开户名

    private String depositBankName;//开户行支行名称

    private String depositBankAddress;//开户银行支行所在地址

    private String associatedLineNum;//开户行swift代码

    private String depositBankCountry;//开户行国家

    private String depositBankCountryCode;//开户行国家代码

    private String depositBankBranchCode;//开户行分行代码（新加坡）

    private String depositBankRountingNumber;//开户行rountingNumber

    private String depositBankIbanNumber;//开户行ibanNumber

    private String interBankName;//中转行名称

    private String interBankAddress;//中转行地址

    private String interBankCountryCode;//中转行国家代码

    private Boolean yn;

    private Integer sysVersion;

    private String createPin;

    private Date createDate;

    private String updatePin;

    private Date updateDate;


    //constructors
    public OuterbankMethod() {
    }

    public OuterbankMethod(Long accountId) {
        this.accountId = accountId;
    }


    public OuterbankMethod(Long accountId, Boolean yn) {
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

    public String getDepositBankName() {
        return depositBankName;
    }

    public void setDepositBankName(String depositBankName) {
        this.depositBankName = depositBankName == null ? null : depositBankName.trim();
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

    public String getDepositBankCountry() {
        return depositBankCountry;
    }

    public void setDepositBankCountry(String depositBankCountry) {
        this.depositBankCountry = depositBankCountry == null ? null : depositBankCountry.trim();
    }

    public String getDepositBankCountryCode() {
        return depositBankCountryCode;
    }

    public void setDepositBankCountryCode(String depositBankCountryCode) {
        this.depositBankCountryCode = depositBankCountryCode == null ? null : depositBankCountryCode.trim();
    }

    public String getDepositBankBranchCode() {
        return depositBankBranchCode;
    }

    public void setDepositBankBranchCode(String depositBankBranchCode) {
        this.depositBankBranchCode = depositBankBranchCode == null ? null : depositBankBranchCode.trim();
    }

    public String getDepositBankRountingNumber() {
        return depositBankRountingNumber;
    }

    public void setDepositBankRountingNumber(String depositBankRountingNumber) {
        this.depositBankRountingNumber = depositBankRountingNumber == null ? null : depositBankRountingNumber.trim();
    }

    public String getDepositBankIbanNumber() {
        return depositBankIbanNumber;
    }

    public void setDepositBankIbanNumber(String depositBankIbanNumber) {
        this.depositBankIbanNumber = depositBankIbanNumber == null ? null : depositBankIbanNumber.trim();
    }

    public String getInterBankName() {
        return interBankName;
    }

    public void setInterBankName(String interBankName) {
        this.interBankName = interBankName == null ? null : interBankName.trim();
    }

    public String getInterBankAddress() {
        return interBankAddress;
    }

    public void setInterBankAddress(String interBankAddress) {
        this.interBankAddress = interBankAddress == null ? null : interBankAddress.trim();
    }

    public String getInterBankCountryCode() {
        return interBankCountryCode;
    }

    public void setInterBankCountryCode(String interBankCountryCode) {
        this.interBankCountryCode = interBankCountryCode == null ? null : interBankCountryCode.trim();
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