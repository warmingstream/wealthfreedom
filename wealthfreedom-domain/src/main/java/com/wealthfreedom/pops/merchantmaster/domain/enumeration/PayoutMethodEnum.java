package com.wealthfreedom.pops.merchantmaster.domain.enumeration;

/**
 * 支付方式枚举
 *
 * Created by wangming3 on 2017/4/26.
 */
public enum PayoutMethodEnum {
    INNER_BANK(4000,"境内银行", "fms_merchantmaster_innerbank"),
    OUTER_BANK(2000, "境外银行", "fms_merchantmaster_outerbank"),
    JD_PAY(5000,"网银钱包", "fms_merchantmaster_jd_wallet"),
    PAYONEER(1000, "PAYONEER", "fms_merchantmaster_payoneer"),
    COMMON(8000,"直连POP商家银行信息", "fms_merchantmaster_innerbank")
//    PAYPAL(3000, "PAYPAL", ""),
   ;

    private int key;
    private String value;
    private String tableName;//数据库对应表名称

    private PayoutMethodEnum(int p_key, String p_value, String tableName) {
        this.key = p_key;
        this.value = p_value;
        this.tableName = tableName;
    }

    public int getKey() {
        return key;
    }

    public String getValue() {
        return value;
    }

    public String getTableName() {
        return tableName;
    }

    public static PayoutMethodEnum getEnumByKey(int key) {
        for (PayoutMethodEnum p : PayoutMethodEnum.values()) {
            if (p.getKey() == key) {
                return p;
            }
        }
        return null;
    }
}
