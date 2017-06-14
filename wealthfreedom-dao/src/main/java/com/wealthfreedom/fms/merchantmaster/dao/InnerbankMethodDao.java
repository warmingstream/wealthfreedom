package com.wealthfreedom.fms.merchantmaster.dao;

import com.wealthfreedom.pops.merchantmaster.domain.model.InnerbankMethod;

import java.util.List;

public interface InnerbankMethodDao {

//    int deleteByPrimaryKey(@Param("id")Long id);
//
//    int insert(InnerbankMethod innerbankMethod);
//
//    InnerbankMethod selectByPrimaryKey(@Param("id")Long id);
//
//    int updateByPrimaryKey(InnerbankMethod innerbankMethod);

    List<InnerbankMethod> findByFields(InnerbankMethod record);

}