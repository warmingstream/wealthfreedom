package com.wealthfreedom.fms.merchantmaster.dao;

import cn.org.rapid_framework.page.Page;
import com.wealthfreedom.pops.merchantmaster.domain.model.SupplierInfo;
import com.wealthfreedom.pops.merchantmaster.domain.query.SupplierInfoQuery;

import java.util.List;

public interface SupplierInfoDao  {


//    int deleteByPrimaryKey(@Param("id")Long id);
//
//    int insert(SupplierInfo record);
//
//    SupplierInfo selectByPrimaryKey(@Param("id")Long id);
//
//    int updateByPrimaryKey(SupplierInfo record);

    /**
     * 根据accountId查询
     * @param accountId
     * @return
     */
    SupplierInfo selectByAccountId(Long accountId);


    /**
     * 条件查询
     * @param supplierInfo
     * @return
     */
    List<SupplierInfo> findByFields(SupplierInfo supplierInfo);

    /**
     * 分页查询
     * @param query
     * @return
     */
    Page<SupplierInfo> findPage(SupplierInfoQuery query);

    /**
     * 保存supplierInfo
     * @param supplierInfo
     * @return
     */
    public int saveOrUpdate(SupplierInfo supplierInfo);


}