package com.jd.fms.merchantmaster.dao;


import cn.org.rapid_framework.page.PageRequest;

import java.io.Serializable;
import java.util.List;

/**
 * @author badqiu
 * @param <E>
 * @param <PK>
 */
public interface BaseDao<E, PK extends Serializable> {

    public final static int NO_ROW_LIMIT = 1000;

    /**
     * 根据主键查询数据
     * @param id
     * @return
     */
    public E getById(PK id);

    /** 删除数据 */
    public int deleteById(PK id);

    /** 插入数据 */
    public int save(E entity);

    /**
     * 批量插入数据
     * @param eList
     * @return
     */
    public  int batchSave(List<E> eList);

    /** 更新数据 */
    public int update(E entity);

    /** 根据id检查是否插入或是更新数据 */
//    public int saveOrUpdate(E entity);

    /** 比较实体是否相同 */
    public boolean isUnique(E entity, String uniquePropertyNames);

    /** 用于hibernate.flush() 有些dao实现不需要实现此类  */
    public void flush();

    /** 查询指定行数数据 */
    public List queryForLimitList(String statement, PageRequest parameter);

    /** 查询有限数据 */
    public Object queryForObject(String statement, Object parameter);

    /** 查询有限数据 */
    public List queryForList(String statement);

    /** 查询有限数据 */
    public List queryForList(String statement, Object parameter);

}