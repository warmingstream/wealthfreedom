package com.jd.fms.merchantmaster.dao;

import com.jd.pops.merchantmaster.domain.model.OuterbankMethod;
import com.jd.pops.merchantmaster.domain.model.PayoneerMethod;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface OuterbankMethodDao extends BaseDao<OuterbankMethod, java.lang.Long>{

//    int deleteByPrimaryKey(@Param("id")Long id);
//
//    int insert(OuterbankMethod record);
//
//    OuterbankMethod selectByPrimaryKey(@Param("id")Long id);
//
//    int updateByPrimaryKey(OuterbankMethod record);


    List<OuterbankMethod> findByFields(OuterbankMethod record);

}