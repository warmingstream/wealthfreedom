package com.jd.fms.merchantmaster.dao;

import com.jd.pops.merchantmaster.domain.model.PayoneerMethod;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PayoneerMethodDao extends BaseDao<PayoneerMethod, java.lang.Long>{

//    int deleteByPrimaryKey(@Param("id")Long id);
//
//    int insert(PayoneerMethod record);
//
//    PayoneerMethod selectByPrimaryKey(@Param("id")Long id);
//
//    int updateByPrimaryKey(PayoneerMethod record);

    List<PayoneerMethod> findByFields(PayoneerMethod record);

}