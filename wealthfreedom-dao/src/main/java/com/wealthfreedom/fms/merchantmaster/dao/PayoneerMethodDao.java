package com.wealthfreedom.fms.merchantmaster.dao;

import com.wealthfreedom.pops.merchantmaster.domain.model.PayoneerMethod;

import java.util.List;

public interface PayoneerMethodDao {

//    int deleteByPrimaryKey(@Param("id")Long id);
//
//    int insert(PayoneerMethod record);
//
//    PayoneerMethod selectByPrimaryKey(@Param("id")Long id);
//
//    int updateByPrimaryKey(PayoneerMethod record);

    List<PayoneerMethod> findByFields(PayoneerMethod record);

}