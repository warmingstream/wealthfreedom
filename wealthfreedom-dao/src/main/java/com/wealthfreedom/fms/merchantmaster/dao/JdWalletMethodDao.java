package com.wealthfreedom.fms.merchantmaster.dao;

import com.wealthfreedom.pops.merchantmaster.domain.model.JdWalletMethod;

import java.util.List;

public interface JdWalletMethodDao {

//    int deleteByPrimaryKey(@Param("id")Long id);
//
//    int insert(JdWalletMethod record);
//
//    JdWalletMethod selectByPrimaryKey(@Param("id")Long id);
//
//    int updateByPrimaryKey(JdWalletMethod record);

    List<JdWalletMethod> findByFields(JdWalletMethod record);

}