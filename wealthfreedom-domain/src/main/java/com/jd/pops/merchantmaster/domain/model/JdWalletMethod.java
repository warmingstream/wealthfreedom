package com.jd.pops.merchantmaster.domain.model;

import java.io.Serializable;
import java.util.Date;

/**
 * 钱包支付方式
 *
 * Created by wangming on 2017/4/26.
 */
public class JdWalletMethod implements Serializable {

    public static final String TABLE_ALIAS = "JdWalletMethod";

    private Long id;//主键

    private Long accountId;//结算账户id

    private String accountName;//账户名称

    private String userName;//用户名称(对应网银钱包的email)

    private String merchantId;//商户号

    private String customId;//客户编号

    private String alias;//账户别名

    private Integer type;//网银账户类型

    private Boolean yn;

    private Integer sysVersion;

    private String createPin;

    private Date createDate;

    private String updatePin;

    private Date updateDate;

    //constructors
    public JdWalletMethod() {
    }

    public JdWalletMethod(Long accountId) {
        this.accountId = accountId;
    }

    public JdWalletMethod(Long accountId, Boolean yn) {
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

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName == null ? null : accountName.trim();
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName == null ? null : userName.trim();
    }

    public String getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId == null ? null : merchantId.trim();
    }

    public String getCustomId() {
        return customId;
    }

    public void setCustomId(String customId) {
        this.customId = customId == null ? null : customId.trim();
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias == null ? null : alias.trim();
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
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