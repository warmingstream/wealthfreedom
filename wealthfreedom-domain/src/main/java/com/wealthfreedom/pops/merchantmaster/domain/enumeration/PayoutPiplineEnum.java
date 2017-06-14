package com.wealthfreedom.pops.merchantmaster.domain.enumeration;

/**
 * 支付管道
 *
 * Created by wangming3 on 2017/4/26.
 */
public enum PayoutPiplineEnum {

    PAYONEER_PIPLINE(1000, "PAYONEER分账"),
    OUTER_BANK(2000, "渣打银企直连电汇"),
    JD_PAY(3000, "网银钱包分账"),
    PAY_PLATFORM(4000, "统一收付款平台电汇"),
    PAY_PLATFORM_COLLECTION(4001, "统一收付款平台银行托收"),
    COMMON(8000,"直连POP商家银行信息-统一收款平台电汇"),
    COMMON_COLLECTION(8001,"直连POP商家银行信息-统一收款平台托收");

    private int key;
    private String value;

    private PayoutPiplineEnum(int p_key, String p_value) {
        this.key = p_key;
        this.value = p_value;

    }

    public int getKey() {
        return key;
    }

    public String getValue() {
        return value;
    }

    public static PayoutPiplineEnum getEnumByKey(int key) {
        for (PayoutPiplineEnum p : PayoutPiplineEnum.values()) {
            if (p.getKey() == key) {
                return p;
            }
        }
        return null;
    }
}
