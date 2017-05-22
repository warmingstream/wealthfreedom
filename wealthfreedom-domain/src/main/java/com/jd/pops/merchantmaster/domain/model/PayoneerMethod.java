package com.jd.pops.merchantmaster.domain.model;

import java.io.Serializable;
import java.util.Date;

/**
 * payoneer支付方式
 *
 * Created by wangming3 on 2017/4/26.
 */
public class PayoneerMethod implements Serializable {

    public static final String TABLE_ALIAS = "PayoneerMethod";

    private Long id;//主键

    private Long accountId;//结算账户id

    private String payeeId;//payoneer系统中的payeeid

    private String firstName;//payoneer系统中的first_name

    private String lastName;//payoneer系统中的last_name

    private Boolean yn;

    private Integer sysVersion;

    private String createPin;

    private Date createDate;

    private String updatePin;

    private Date updateDate;

    //constructors
    public PayoneerMethod() {
    }

    public PayoneerMethod(Long accountId) {
        this.accountId = accountId;
    }

    public PayoneerMethod(Long accountId, Boolean yn) {
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

    public String getPayeeId() {
        return payeeId;
    }

    public void setPayeeId(String payeeId) {
        this.payeeId = payeeId == null ? null : payeeId.trim();
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName == null ? null : firstName.trim();
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName == null ? null : lastName.trim();
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