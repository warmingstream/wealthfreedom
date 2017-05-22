package com.jd.fms.merchantmaster.dao.impl;

import com.jd.fms.merchantmaster.dao.BusinessDepartmentDao;
import com.jd.fms.merchantmaster.dao.InnerbankMethodDao;
import com.jd.pops.merchantmaster.domain.model.BusinessDepartment;
import com.jd.pops.merchantmaster.domain.model.InnerbankMethod;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Title
 * @Author warming.
 * @Date 2017/5/9.
 */
@Repository
public class InnerbankMethodDaoImpl extends BaseIbatis3Dao<InnerbankMethod, Long> implements InnerbankMethodDao {

   @Override
   public String getIbatisMapperNamesapce() {
       return "InnerbankMethod";
   }

    @Override
    public List<InnerbankMethod> findByFields(InnerbankMethod record) {
        return this.getSqlSession().selectList("InnerbankMethod.findByFields", record);
    }

}
