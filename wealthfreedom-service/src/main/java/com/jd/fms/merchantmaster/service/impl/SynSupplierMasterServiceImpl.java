package com.jd.fms.merchantmaster.service.impl;

import com.jd.fms.merchantmaster.dao.SupplierInfoDao;
import com.jd.fms.merchantmaster.service.SupplierService;
import com.jd.fms.merchantmaster.service.SynSupplierMasterService;
import com.jd.pop.finance.accounts.spi.fundaccount.FinanceAccountServiceProvider;
import com.jd.pop.finance.accounts.spi.fundaccount.mo.FinanceAccountMO;
import com.jd.pops.merchantmaster.domain.model.SupplierInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 *同步商家主数据接口
 *
 * Created by wangming on 2017/4/26.
 */
@Service
public class SynSupplierMasterServiceImpl implements SynSupplierMasterService {
    Logger logger = LoggerFactory.getLogger(SynSupplierMasterServiceImpl.class);

    @Autowired
    private FinanceAccountServiceProvider financeAccountService;

    @Autowired
    private SupplierInfoDao supplierInfoDao;

    @Autowired
    private SupplierService supplierService;

    @Override
    public void synSupplierInfoAll() throws Exception {
        logger.info("开始同步商家主数据" + System.currentTimeMillis());
        Long startRow = 0L;  //起始页
        final Long pageSize = 100L;  //分页
        Long activeAccountCount;  //结算账户总数
        List<FinanceAccountMO> financeAccountMOList;  //账户集合

        //查询活动结算账户总数
        activeAccountCount = financeAccountService.getActiveAccountCount();
        logger.info("查询活动结算账户总数:" + activeAccountCount);

        while (activeAccountCount > 0){
            //查询活动结算账户集合
            financeAccountMOList = financeAccountService.queryActiveAccountsByPage(startRow, pageSize);
            logger.info("++++手动醒目+++++++++第N条数据：" + startRow);

            //保存商户主数据列表
            if (financeAccountMOList != null && financeAccountMOList.size() > 0){
                for(FinanceAccountMO financeAccount : financeAccountMOList) {
                    try{
                        //查询是否本地存在
                        if (supplierInfoDao.selectByAccountId(financeAccount.getAccountId()) == null){
                            //保存
                            supplierService.saveRemoteSupplierData(financeAccount.getAccountId());
                        }
                    } catch (Exception e){
                        logger.error("保存商家主数据到本地失败！accountId: " + financeAccount.getAccountId()+ ",错误原因：" + e.getMessage());
                        e.printStackTrace();
                    } finally {

                    }
                }
            }
            activeAccountCount -= pageSize;
            startRow += pageSize;
        }
        logger.info("结束同步商家主数据" + System.currentTimeMillis());
    }


    @Override
    @Transactional
    public void synSupplierInfoByAccountId(SupplierInfo supplierInfo) throws Exception {
        //软删除数据
       supplierService.deleteSupplierInfo(supplierInfo);

        //保存
        supplierService.saveRemoteSupplierData(supplierInfo.getAccountId());
    }

    /**
     * 通过accountId同步商家主数据
     *
     * @param accountIds 以逗号分隔   "1235435,123123412"
     * @throws Exception
     */
    @Override
    public void synSupplierInfoByAccountId(String accountIds) throws Exception {
        if (accountIds != null && accountIds != "") {
            String[] idArr = accountIds.split(",");
            for (String accId : idArr){
                try {
                    //本地存在则删除后在插入
                    SupplierInfo supplierInfo = supplierInfoDao.selectByAccountId(Long.parseLong(accId));
                    if (supplierInfo != null){
                        this.synSupplierInfoByAccountId(supplierInfo);
                    } else {
                        supplierService.saveRemoteSupplierData(Long.parseLong(accId));
                    }
                } catch (Exception e){
                    e.printStackTrace();
                    logger.error("本地同步失败！accountId" +  accId + "，原因：" + e.getMessage());
                }
            }
        }
    }

}
