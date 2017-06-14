package com.wealthfreedom.fms.merchantmaster.jsf.strategicbusiness;

import java.util.List;


public interface StrategicBusinessJsfService {

    /**
     * 获取所有战略商家supplierId集合
     * @return supplierId
     * @throws Exception
     */
    public List<Long> getAllStrategicBusiness() throws Exception;

}
