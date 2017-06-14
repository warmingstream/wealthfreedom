package com.wealthfreedom.fms.merchantmaster.dao;

import com.wealthfreedom.pops.merchantmaster.domain.model.OuterbankMethod;

import java.util.List;

public interface OuterbankMethodDao {

//    int deleteByPrimaryKey(@Param("id")Long id);
//
//    int insert(OuterbankMethod record);
//
//    OuterbankMethod selectByPrimaryKey(@Param("id")Long id);
//
//    int updateByPrimaryKey(OuterbankMethod record);


    List<OuterbankMethod> findByFields(OuterbankMethod record);

}