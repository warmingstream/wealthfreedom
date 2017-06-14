package com.wealthfreedom.fms.merchantmaster.jsf.strategicbusiness.impl;

import com.wealthfreedom.fms.merchantmaster.dao.SupplierInfoDao;
import com.wealthfreedom.fms.merchantmaster.jsf.strategicbusiness.StrategicBusinessJsfService;
import com.wealthfreedom.pops.merchantmaster.domain.model.SupplierInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.LinkedList;
import java.util.List;


/**
 * @Title
 * @Author warming.
 * @Date 2017/5/8.
 */
public class StrategicBusinessJsfServiceImpl implements StrategicBusinessJsfService {

    Logger logger = LoggerFactory.getLogger(StrategicBusinessJsfServiceImpl.class);

    @Autowired
    private SupplierInfoDao supplierInfoDao;

    @Override
    public List<Long> getAllStrategicBusiness() throws Exception {
        List<Long> supplierIdList = null;
        try{
            //条件查询
            SupplierInfo condition = new SupplierInfo();
            condition.setStrategicSupplier(true);
            List<SupplierInfo> supplierList = supplierInfoDao.findByFields(condition);
            supplierIdList = new LinkedList();
            for (SupplierInfo supplier : supplierList){
                supplierIdList.add(supplier.getSupplierId());
            }
        } catch (Exception e){
            logger.error("获取所有战略商家supplierId集合出错：" + e.getMessage());
            e.printStackTrace();
        }
        return supplierIdList;
    }
}
