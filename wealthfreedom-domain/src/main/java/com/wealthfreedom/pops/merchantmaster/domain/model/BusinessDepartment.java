package com.wealthfreedom.pops.merchantmaster.domain.model;

import java.io.Serializable;
import java.util.Date;

public class BusinessDepartment implements Serializable {

    public static final String TABLE_ALIAS = "BusinessDepartment";

    private Long id;

    private Long buId;

    private String buName;

    private Byte yn;

    private Short sysVersion;

    private String createPin;

    private Date createDate;

    private String updatePin;

    private Date updateDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBuId() {
        return buId;
    }

    public void setBuId(Long buId) {
        this.buId = buId;
    }

    public String getBuName() {
        return buName;
    }

    public void setBuName(String buName) {
        this.buName = buName == null ? null : buName.trim();
    }

    public Byte getYn() {
        return yn;
    }

    public void setYn(Byte yn) {
        this.yn = yn;
    }

    public Short getSysVersion() {
        return sysVersion;
    }

    public void setSysVersion(Short sysVersion) {
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