package com.jd.fms.merchantmaster.dao;

import com.jd.pops.merchantmaster.domain.model.InnerbankMethod;
import com.jd.pops.merchantmaster.domain.model.JdWalletMethod;
import org.apache.ibatis.annotations.Param;

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