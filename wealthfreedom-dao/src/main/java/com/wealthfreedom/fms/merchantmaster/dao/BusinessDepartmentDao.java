package com.wealthfreedom.fms.merchantmaster.dao;

import com.wealthfreedom.pops.merchantmaster.domain.model.BusinessDepartment;
import java.util.List;

public interface BusinessDepartmentDao {

//    int deleteByPrimaryKey(@Param("id")Long id);
//
//    int insert(BusinessDepartment record);
//
//    BusinessDepartment selectByPrimaryKey(@Param("id")Long id);
//
//    int updateByPrimaryKey(BusinessDepartment record);

    List<BusinessDepartment> findByFields(BusinessDepartment record);

}