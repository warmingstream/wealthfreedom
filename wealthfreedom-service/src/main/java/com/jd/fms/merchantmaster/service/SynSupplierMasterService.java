package com.jd.fms.merchantmaster.service;

import com.jd.pop.finance.accounts.spi.fundaccount.mo.FinanceAccountMO;
import com.jd.pops.merchantmaster.domain.model.SupplierInfo;

/**
 * 同步商家主数据接口
 *
 * Created by wangming3 on 2017/4/26.
 */
public interface SynSupplierMasterService {

    /**
     * 同步所有商家主数据
     * @throws Exception
     */
    public void synSupplierInfoAll() throws Exception;

    /**
     * 通过accountId同步商家主数据
     * @throws Exception
     */
    public void synSupplierInfoByAccountId(SupplierInfo supplierInfo) throws Exception;

    /**
     * 通过accountId同步商家主数据
     * @param accountIds   以逗号分隔   "1235435,123123412"
     * @throws Exception
     */
    public void synSupplierInfoByAccountId(String accountIds) throws Exception;

}
