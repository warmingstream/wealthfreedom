package com.jd.fms.merchantmaster.dao.impl;

import com.jd.fms.merchantmaster.dao.OuterbankMethodDao;
import com.jd.fms.merchantmaster.dao.PayoneerMethodDao;
import com.jd.pops.merchantmaster.domain.model.OuterbankMethod;
import com.jd.pops.merchantmaster.domain.model.PayoneerMethod;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Title
 * @Author warming.
 * @Date 2017/5/9.
 */
@Repository
public class PayoneerMethodDaoImpl extends BaseIbatis3Dao<PayoneerMethod, java.lang.Long> implements PayoneerMethodDao {

   @Override
   public String getIbatisMapperNamesapce() {
       return "PayoneerMethod";
   }

    @Override
    public List<PayoneerMethod> findByFields(PayoneerMethod record) {
        return this.getSqlSession().selectList("PayoneerMethod.findByFields", record);
    }
}
