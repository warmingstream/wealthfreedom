package com.jd.fms.merchantmaster.dao.impl;


import cn.org.rapid_framework.beanutils.PropertyUtils;
import cn.org.rapid_framework.page.Page;
import cn.org.rapid_framework.page.PageRequest;
import com.jd.fms.merchantmaster.dao.BaseDao;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSession;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author badqiu
 * @version 1.0
 * @param <E>
 * @param <PK>
 */
public abstract class BaseIbatis3Dao<E, PK extends Serializable> extends SqlSessionDaoSupport {
    @Autowired
    public void setSqlSessionTemplate(SqlSessionTemplate sqlSessionTemplate)
    {
        super.setSqlSessionTemplate(sqlSessionTemplate);
    }

    /**
     * 根据主键查询数据
     * @param primaryKey
     * @return
     */
    public E getById(PK primaryKey) {
        E object = (E)this.getSqlSession().selectOne(getFindByPrimaryKeyStatement(), primaryKey);
        return object;
    }

    /**
     * 删除数据
     * @param id
     * @return
     */
    public int deleteById(PK id) {
        return this.getSqlSession().delete(getDeleteStatement(), id);
    }

    /**
     * 保存数据
     * @param entity
     * @return
     */
    public int save(E entity) {
        prepareObjectForSaveOrUpdate(entity);
        return this.getSqlSession().insert(getInsertStatement(), entity);
    }


    /**
     * 批量插入数据
     * @param eList
     * @return
     */
    public  int batchSave(List<E> eList){
        return this.getSqlSession().insert(getBatchInsertStatement(), eList);
    }

    /**
     * 保存数据
     * @param entity
     * @return
     */
    public int update(E entity) {
        prepareObjectForSaveOrUpdate(entity);
        return this.getSqlSession().update(getUpdateStatement(), entity);
    }

    /** 比较实体是否相同 */
    public boolean isUnique(E entity, String uniquePropertyNames) {
        throw new UnsupportedOperationException();
    }

    /** 刷新 */
    public void flush() {
        //ignore
    }

    /**
     * 查询指定行数数据
     * @return
     */
    public List queryForLimitList(String statement, PageRequest parameter) {
        RowBounds rowBounds = new RowBounds(RowBounds.NO_ROW_OFFSET, parameter.getPageSize());
        return this.getSqlSession().selectList(statement, parameter, rowBounds);
    }

    /**
     * 定制查询
     * @param statement
     * @param parameter
     * @return
     */
    public Object queryForObject(String statement, Object parameter){
        Object object = this.getSqlSession().selectOne(statement, parameter);
        return object;
    }

    /**
     * 查询有限数据
     * @param statement
     * @return
     */
    public List queryForList(String statement) {
        return this.queryForList(statement, null);
    }

    /**
     * 查询有限数据
     * @param statement
     * @param parameter
     * @return
     */
    public List queryForList(String statement, Object parameter) {
        return this.queryForList(this.getSqlSession(), statement, parameter);
    }

    /**
     * 查询有限数据
     * @param sqlSessionTemplate
     * @param statement
     * @param parameter
     * @return
     */
    private List queryForList(SqlSession sqlSessionTemplate, String statement, Object parameter) {
        RowBounds rowBounds = new RowBounds(RowBounds.NO_ROW_OFFSET, BaseDao.NO_ROW_LIMIT);
        return sqlSessionTemplate.selectList(statement, parameter, rowBounds);
    }

    /**
     * 保存数据
     * @param statement
     * @param entity
     * @return
     */
    protected int insert(String statement,E entity){
        return this.getSqlSession().insert(statement, entity);
    }

    /**
     * 保存数据
     * @param statement
     * @param parameter
     * @return
     */
    protected int update(String statement, Object parameter) {
        return this.getSqlSession().update(statement, parameter);
    }

    /**
     * 用于子类覆盖,在insert,update之前调用
     *
     * @param o
     */
    protected void prepareObjectForSaveOrUpdate(E o) {
    }

    /**
     * 抽象方法
     * @return
     */
    protected String getIbatisMapperNamesapce() {
        throw new RuntimeException("not yet implement");
    }

    /**
     * 查询sql
     * @return
     */
    protected String getFindByPrimaryKeyStatement() {
        return getIbatisMapperNamesapce() + ".getById";
    }

    /**
     * 保存sql
     * @return
     */
    protected String getInsertStatement() {
        return getIbatisMapperNamesapce() + ".insert";
    }

    protected String getBatchInsertStatement() {
        return getIbatisMapperNamesapce() + ".batchInsert";
    }



    /**
     * 保存sql
     * @return
     */
    protected String getUpdateStatement() {
        return getIbatisMapperNamesapce() + ".update";
    }

    /**
     * 删除sql
     * @return
     */
    protected String getDeleteStatement() {
        return getIbatisMapperNamesapce() + ".delete";
    }

    /**
     * 查询计数
     * @param statementName
     * @return
     */
    protected String getCountStatementForPaging(String statementName) {
        return statementName + ".count";
    }

    /**
     * 分页查询
     * @param statementName
     * @param pageRequest
     * @return
     */
    protected Page<E> pageQuery(String statementName, PageRequest pageRequest) {
        return pageQuery(this.getSqlSession(), statementName, getCountStatementForPaging(statementName), pageRequest);
    }

    /**
     * 分页查询
     * @param sqlSessionTemplate
     * @param statementName
     * @param countStatementName
     * @param pageRequest
     * @return
     */
    protected Page<E> pageQuery(SqlSession sqlSessionTemplate, String statementName, String countStatementName, PageRequest pageRequest) {

        Number totalCount = (Number) sqlSessionTemplate.selectOne(countStatementName, pageRequest);
        if (totalCount == null || totalCount.longValue() <= 0) {
            return new Page<E>(pageRequest, 0);
        }

        Page<E> page = new Page<E>(pageRequest, totalCount.intValue());

        //其它分页参数,用于不喜欢或是因为兼容性而不使用方言(Dialect)的分页用户使用. 与getSqlMapClientTemplate().queryForList(statementName, parameterObject)配合使用
        Map filters = new HashMap();
        filters.put("offset", page.getFirstResult());
        filters.put("pageSize", page.getPageSize());
        filters.put("lastRows", page.getFirstResult() + page.getPageSize());
        filters.put("sortColumns", pageRequest.getSortColumns());

        Map parameterObject = PropertyUtils.describe(pageRequest);
        filters.putAll(parameterObject);

        List<E> list = sqlSessionTemplate.selectList(statementName, filters, new RowBounds(page.getFirstResult(), page.getPageSize()));
        page.setItemList(list);
        return page;
    }
}
