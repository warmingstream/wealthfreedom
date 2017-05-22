package com.jd.fms.merchantmaster.dao.impl;

import com.jd.fms.merchantmaster.dao.JdWalletMethodDao;
import com.jd.pops.merchantmaster.domain.model.JdWalletMethod;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Title
 * @Author warming.
 * @Date 2017/5/9.
 */
@Repository
public class JdWalletMethodDaoImpl extends BaseIbatis3Dao<JdWalletMethod, java.lang.Long> implements JdWalletMethodDao {

   @Override
   public String getIbatisMapperNamesapce() {
       return "JdWalletMethod";
   }

    @Override
    public List<JdWalletMethod> findByFields(JdWalletMethod record) {
        return this.getSqlSession().selectList("JdWalletMethod.findByFields", record);
    }

}
