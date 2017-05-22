package com.jd.fms.merchantmaster.dao.impl;

import com.jd.fms.merchantmaster.dao.BusinessDepartmentDao;
import com.jd.pops.merchantmaster.domain.model.BusinessDepartment;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Title
 * @Author warming.
 * @Date 2017/5/9.
 */
@Repository
public class BusinessDepartmentDaoImpl extends BaseIbatis3Dao<BusinessDepartment, java.lang.Long> implements BusinessDepartmentDao {

   @Override
   public String getIbatisMapperNamesapce() {
       return "BusinessDepartment";
   }

    @Override
    public List<BusinessDepartment> findByFields(BusinessDepartment record) {
        return this.getSqlSession().selectList("BusinessDepartment.findByFields", record);
    }

}
