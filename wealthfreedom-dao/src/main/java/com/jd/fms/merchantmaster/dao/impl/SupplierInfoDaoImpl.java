package com.jd.fms.merchantmaster.dao.impl;

import cn.org.rapid_framework.page.Page;
import com.jd.fms.merchantmaster.dao.OuterbankMethodDao;
import com.jd.fms.merchantmaster.dao.SupplierInfoDao;
import com.jd.pops.merchantmaster.domain.model.OuterbankMethod;
import com.jd.pops.merchantmaster.domain.model.SupplierInfo;
import com.jd.pops.merchantmaster.domain.query.SupplierInfoQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Title
 * @Author warming.
 * @Date 2017/5/9.
 */
@Repository
public class SupplierInfoDaoImpl extends BaseIbatis3Dao<SupplierInfo, java.lang.Long> implements SupplierInfoDao {

   @Override
   public String getIbatisMapperNamesapce() {
       return "SupplierInfo";
   }

    /**
     * 根据accountId查询
     *
     * @param accountId
     * @return
     */
    @Override
    public SupplierInfo selectByAccountId(Long accountId) {
        return this.getSqlSession().selectOne("SupplierInfo.selectByAccountId", accountId);
    }

    /**
     * 条件查询
     *
     * @param supplierInfo
     * @return
     */
    @Override
    public List<SupplierInfo> findByFields(SupplierInfo supplierInfo) {
        return this.getSqlSession().selectList("SupplierInfo.findByFields", supplierInfo);
    }

    /**
     * 分页查询
     *
     * @param query
     * @return
     */
    @Override
    public Page<SupplierInfo> findPage(SupplierInfoQuery query) {
        return pageQuery("SupplierInfo.findPage", query);
    }

    /**
     * 保存supplierInfo
     *
     * @param supplierInfo
     * @return
     */
    @Override
    public int saveOrUpdate(SupplierInfo supplierInfo) {
        if (supplierInfo.getId() == null){
             return save(supplierInfo);
        } else {
            return update(supplierInfo);
        }
    }
}
