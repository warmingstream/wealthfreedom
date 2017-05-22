package com.jd.fms.merchantmaster.dao;

import com.jd.pops.merchantmaster.domain.model.BusinessDepartment;
import com.jd.pops.merchantmaster.domain.model.InnerbankMethod;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface BusinessDepartmentDao extends BaseDao<BusinessDepartment, java.lang.Long>{

//    int deleteByPrimaryKey(@Param("id")Long id);
//
//    int insert(BusinessDepartment record);
//
//    BusinessDepartment selectByPrimaryKey(@Param("id")Long id);
//
//    int updateByPrimaryKey(BusinessDepartment record);

    List<BusinessDepartment> findByFields(BusinessDepartment record);

}