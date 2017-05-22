package com.jd.fms.merchantmaster.service;

import cn.org.rapid_framework.page.Page;
import com.jd.pop.finance.accounts.spi.fundaccount.mo.FinanceAccountMO;
import com.jd.pops.merchantmaster.domain.model.SupplierInfo;
import com.jd.pops.merchantmaster.domain.query.SupplierInfoQuery;

import java.util.Map;

/**
 * @Title
 * @Author warming.
 * @Date 2017/5/3.
 */
public interface SupplierService {

    /**
     * 获取商家数据并保存
     * @param accountId
     * @throws Exception
     */
    public void saveRemoteSupplierData(Long accountId) throws Exception;


    /**
     * 分页查询
     * @param query
     * @return
     * @throws Exception
     */
    public Page findPage(SupplierInfoQuery query) throws Exception;


    /**
     * 测试方法
     * @throws Exception
     */
    public void testMethod() throws Exception;

    /**
     * 通过Id获取supplier
     * @param id
     * @return
     * @throws Exception
     */
    public SupplierInfo getById(Long id) throws Exception;

    /**
     * 保存数据
     * @param supplierInfo
     * @throws Exception
     */
    public void save(SupplierInfo supplierInfo) throws Exception;

    /**
     * 条件查询
     * @param accountId
     * @throws Exception
     */
    public SupplierInfo getByAccountId(Long accountId) throws Exception;

    /**
     * 通过 id 或者 accountId 查询商家信息以及钱包信息, 仅需传入单个参数
     * @param id   supplier 对象 id
     * @param accountId
     * @return
     * @throws Exception
     */
    public Map<String, Object> getSupplierAndPurchaseInfo(Long id, Long accountId) throws Exception;

    /**
     * 软删除商家及资金账户信息
     * @param supplierInfo
     * @throws Exception
     */
    public void deleteSupplierInfo(SupplierInfo supplierInfo) throws Exception;
}
