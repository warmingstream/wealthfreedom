package com.jd.fms.merchantmaster.dao.impl;

import com.jd.fms.merchantmaster.dao.InnerbankMethodDao;
import com.jd.fms.merchantmaster.dao.OuterbankMethodDao;
import com.jd.pops.merchantmaster.domain.model.InnerbankMethod;
import com.jd.pops.merchantmaster.domain.model.OuterbankMethod;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Title
 * @Author warming.
 * @Date 2017/5/9.
 */
@Repository
public class OuterbankMethodDaoImpl extends BaseIbatis3Dao<OuterbankMethod, java.lang.Long> implements OuterbankMethodDao {

   @Override
   public String getIbatisMapperNamesapce() {
       return "OuterbankMethod";
   }

    @Override
    public List<OuterbankMethod> findByFields(OuterbankMethod record) {
        return this.getSqlSession().selectList("OuterbankMethod.findByFields", record);
    }

}
