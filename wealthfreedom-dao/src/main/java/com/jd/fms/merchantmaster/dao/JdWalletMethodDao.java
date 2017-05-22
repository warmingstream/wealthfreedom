package com.jd.fms.merchantmaster.dao;

import com.jd.pops.merchantmaster.domain.model.JdWalletMethod;
import com.jd.pops.merchantmaster.domain.model.OuterbankMethod;
import com.jd.pops.merchantmaster.domain.model.PayoneerMethod;

import java.util.List;

public interface JdWalletMethodDao extends BaseDao<JdWalletMethod, java.lang.Long>{

//    int deleteByPrimaryKey(@Param("id")Long id);
//
//    int insert(JdWalletMethod record);
//
//    JdWalletMethod selectByPrimaryKey(@Param("id")Long id);
//
//    int updateByPrimaryKey(JdWalletMethod record);

    List<JdWalletMethod> findByFields(JdWalletMethod record);

}