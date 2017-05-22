package com.jd.fms.merchantmaster.service.impl;

import cn.org.rapid_framework.page.Page;
import com.jd.fms.merchantmaster.dao.*;
import com.jd.fms.merchantmaster.service.SupplierService;
import com.jd.fms.merchantmaster.utils.SysConstants;
import com.jd.pop.finance.accounts.spi.Result;
import com.jd.pop.finance.accounts.spi.fundaccount.FinanceAccountPayeeServiceProvider;
import com.jd.pop.finance.accounts.spi.fundaccount.FinanceAccountServiceProvider;
import com.jd.pop.finance.accounts.spi.fundaccount.mo.FinanceInnerBankPayeeMO;
import com.jd.pop.finance.accounts.spi.fundaccount.mo.FinanceJdpayPayeeMO;
import com.jd.pop.finance.accounts.spi.fundaccount.mo.FinanceOuterBankPayeeMO;
import com.jd.pop.finance.accounts.spi.merchant.FinanceJdMerchantServiceProvider;
import com.jd.pop.finance.accounts.spi.merchant.mo.FinanceMerchantInfoMo;
import com.jd.pop.finance.accounts.spi.payoneer.mo.FinanceThirdPayAccountMO;
import com.jd.pops.merchantmaster.domain.enumeration.PayoutMethodEnum;
import com.jd.pops.merchantmaster.domain.model.*;
import com.jd.pops.merchantmaster.domain.query.SupplierInfoQuery;
import org.apache.commons.collections.map.HashedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @Title
 * @Author warming.
 * @Date 2017/5/3.
 */
@Service
public class SupplierServiceImpl implements SupplierService{

    Logger logger = LoggerFactory.getLogger(SupplierServiceImpl.class);

    @Autowired
    private FinanceAccountPayeeServiceProvider financeAccountPayeeService;

    @Autowired
    private FinanceJdMerchantServiceProvider financeJdMerchantService;//根据结算账号查询计费所需商户信息

    @Autowired
    private FinanceAccountServiceProvider financeAccountService;//国际站商家判定接口

    @Autowired
    private InnerbankMethodDao innerbankMethodDao;

    @Autowired
    private JdWalletMethodDao jdWalletMethodDao;

    @Autowired
    private OuterbankMethodDao outerbankMethodDao;

    @Autowired
    private PayoneerMethodDao payoneerMethodDao;

    @Autowired
    private SupplierInfoDao supplierInfoDao;

    @Override
    @Transactional
    public void saveRemoteSupplierData(Long accountId) throws Exception {
        try{
            Long beginTimeMills = System.currentTimeMillis();
            Result<Object> result = financeAccountPayeeService.getAllPlatFinAccountPayeeByAccountId(accountId.toString());
            logger.info("资金账户接口(3)调用时间：" + (System.currentTimeMillis() - beginTimeMills) + "mills");
            if (result.isSuccess() == false) {
                logger.error("获取资金账户信息错误，accountId ：" + accountId + ", 错误原因:" + result.getMessage());
            }
            SupplierInfo supplierInfo = new SupplierInfo();
            supplierInfo.setAccountId(accountId);
            supplierInfo.setProcessStatus(false);//默认设为false，如果有资金账户会进行修改
            // 有境内或者境外资金账号
            if ( result.isSuccess() == true && result.getValue() != null && result.getMap() != null) {
                //支付方式
                int payoutMethod = (Integer) result.getMap().get("payoutMethod");
                supplierInfo.setPaymentType(payoutMethod);
                //支付管道
                int payoutPipline = (Integer) result.getMap().get("payoutPipline");
                supplierInfo.setPayoutPipline(payoutPipline);

                //保存资金账号数据
                Object obj = result.getValue();
                if ((payoutMethod == PayoutMethodEnum.INNER_BANK.getKey() || payoutMethod == PayoutMethodEnum.COMMON.getKey())
                        && obj instanceof FinanceInnerBankPayeeMO) {
                    //国内
                    this.saveInnerBankData(obj, supplierInfo);
                } else if (payoutMethod == PayoutMethodEnum.OUTER_BANK.getKey() && obj instanceof  FinanceInnerBankPayeeMO) {
                    //国内
                    this.saveOuterBankData(obj, supplierInfo);
                } else if (payoutMethod == PayoutMethodEnum.PAYONEER.getKey() && obj instanceof FinanceThirdPayAccountMO) {
                    //payonner
                    this.savePayonnerData(obj, supplierInfo);
                } else if (payoutMethod == PayoutMethodEnum.JD_PAY.getKey() && obj instanceof FinanceJdpayPayeeMO) {
                    //钱包
                    this.saveWalletData(obj, supplierInfo);
                }
            }

            try{
                //获取商家属性信息
                Long merchantTimeMills = System.currentTimeMillis();
                FinanceMerchantInfoMo merchantInfo = financeJdMerchantService.getFinanceMerchantInfoByAccountId(accountId);
                logger.info("商家属性接口(4)调用时间：" + (System.currentTimeMillis() - merchantTimeMills) + "mills");
                if (merchantInfo != null){
                    this.saveMasterData(merchantInfo, supplierInfo);
                } else {
                    throw new Exception("商家信息为空!");
                }
            } catch (Exception e){
                throw new Exception("获取商家主数据失败,accountId:" + accountId + "，原因：" + e.getMessage());
            }
            logger.info("单次商家数据保存数据：accountId:" + accountId + "耗时：" + (System.currentTimeMillis() - beginTimeMills) +"mills" );
        } catch (Throwable e){
            e.printStackTrace();
            throw new Exception("保存商家信息错误" + e.getMessage());
        }
    }


    /**
     * 分页查询
     *
     * @param query
     * @return
     * @throws Exception
     */
    @Override
    public Page findPage(SupplierInfoQuery query) throws Exception {
        return supplierInfoDao.findPage(query);
    }

    /**
     * 测试方法
     *
     * @throws Exception
     */
    @Override
    @Transactional
    public void testMethod() throws Exception {
        try {
            PayoneerMethod method = new PayoneerMethod();
            method.setAccountId(222L);
            method.setPayeeId("222");
            method.setFirstName("22233333333");
            method.setLastName("2222");
            method.setYn(true);
            method.setSysVersion(222);
            method.setCreatePin("222");
            method.setCreateDate(new Date());
            payoneerMethodDao.save(method);

            PayoneerMethod updateMethod = payoneerMethodDao.getById(1l);
            updateMethod.setAccountId(2233333L);
            payoneerMethodDao.update(updateMethod);
        } catch (Exception e){
            logger.error(e.getMessage());
            e.printStackTrace();
        }

    }

    /**
     * 通过Id获取supplier
     *
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public SupplierInfo getById(Long id) throws Exception {
        return supplierInfoDao.getById(id);
    }

    /**
     * 保存数据
     *
     * @param supplierInfo
     * @throws Exception
     */
    @Override
    public void save(SupplierInfo supplierInfo) throws Exception {
        supplierInfoDao.saveOrUpdate(supplierInfo);
    }

    /**
     * 条件查询
     *
     * @param accountId
     * @throws Exception
     */
    @Override
    public SupplierInfo getByAccountId(Long accountId) throws Exception {
        return supplierInfoDao.selectByAccountId(accountId);
    }

    /**
     * 通过id 或者accountId查询商家信息以及钱包信息
     *
     * @param id        supplier对象id
     * @param accountId
     * @return
     * @throws Exception
     */
    @Override
    public Map<String, Object> getSupplierAndPurchaseInfo(Long id, Long accountId) throws Exception {
        Map<String, Object> result = new HashedMap();

        try{
            SupplierInfo supplierInfo = null;
            Object object = null;
            Integer paymentType = null;
            String paymentTypeName = null;
            List methodList = null;

            //查询商家信息
            if (id != null) {
                supplierInfo = supplierInfoDao.getById(id);
            } else if (accountId != null){
                supplierInfo = supplierInfoDao.selectByAccountId(id);
            }

            //查询钱包信息
            if (supplierInfo != null){
                accountId = supplierInfo.getAccountId();
                paymentType = supplierInfo.getPaymentType();
                if ((paymentType == PayoutMethodEnum.INNER_BANK.getKey() || paymentType == PayoutMethodEnum.COMMON.getKey())) {
                    //国内
                    methodList = innerbankMethodDao.findByFields(new InnerbankMethod(accountId));
                    paymentTypeName = PayoutMethodEnum.INNER_BANK.getValue();
                } else if (paymentType == PayoutMethodEnum.OUTER_BANK.getKey()) {
                    //国内
                    methodList = outerbankMethodDao.findByFields(new OuterbankMethod(accountId));
                    paymentTypeName = PayoutMethodEnum.OUTER_BANK.getValue();
                } else if (paymentType == PayoutMethodEnum.PAYONEER.getKey()) {
                    //payonner
                    methodList = payoneerMethodDao.findByFields(new PayoneerMethod(accountId));
                    paymentTypeName = PayoutMethodEnum.PAYONEER.getValue();
                } else if (paymentType == PayoutMethodEnum.JD_PAY.getKey()) {
                    //钱包
                    methodList = jdWalletMethodDao.findByFields(new JdWalletMethod(accountId));
                    paymentTypeName = PayoutMethodEnum.JD_PAY.getValue();
                }
            }
            if (methodList != null && methodList.size() == 1){
                result.put("purchaseInfo", methodList.get(0));
            } else {
                throw new Exception("获取资金账户信息失败！");
            }
            result.put("supplierInfo", supplierInfo);
            result.put("paymentType", paymentType);
            result.put("paymentTypeName", paymentTypeName);
        } catch (Exception e){
            logger.error("查询商家信息以及钱包信息失败，accounId: " + accountId + "，原因：" + e.getMessage());
        }
        return result;
    }

    /**
     * 软删除商家及资金账户信息
     *
     * @param supplierInfo
     * @throws Exception
     */
    @Override
    public void deleteSupplierInfo(SupplierInfo supplierInfo) throws Exception {
        //删除supplierInfo
        supplierInfoDao.update(new SupplierInfo(supplierInfo.getAccountId(), false));

        //删除资金账户信息
        Integer paymentType = supplierInfo.getPaymentType();
        if ((paymentType == PayoutMethodEnum.INNER_BANK.getKey() || paymentType == PayoutMethodEnum.COMMON.getKey())) {
            //国内
            innerbankMethodDao.update(new InnerbankMethod(supplierInfo.getAccountId(), false));
        } else if (paymentType == PayoutMethodEnum.OUTER_BANK.getKey()) {
            //国内
            outerbankMethodDao.update(new OuterbankMethod(supplierInfo.getAccountId(), false));
        } else if (paymentType == PayoutMethodEnum.PAYONEER.getKey()) {
            //payonner
            payoneerMethodDao.update(new PayoneerMethod(supplierInfo.getAccountId(), false));
        } else if (paymentType == PayoutMethodEnum.JD_PAY.getKey()) {
            //钱包
            jdWalletMethodDao.update(new JdWalletMethod(supplierInfo.getAccountId(), false));
        }
    }

    public void saveMasterData(FinanceMerchantInfoMo merchantInfo, SupplierInfo supplierInfo) throws Exception {
        supplierInfo.setSupplierId(merchantInfo.getVenderId());
        supplierInfo.setCompanyId(merchantInfo.getCompanyId());
        supplierInfo.setSupplierName(merchantInfo.getShopName());//商家名称
        supplierInfo.setCompanyName(merchantInfo.getCompanyName());//公司名称（结算单上名称）
        supplierInfo.setAccountType(merchantInfo.getAccountType());//流水倒扣还是收支两线
        supplierInfo.setSupplierType(merchantInfo.getColType()); //店铺类型 sop..
        supplierInfo.setFtState(false);//冻结解冻状态  1冻结，0解冻；
        supplierInfo.setState(merchantInfo.getAccountStatus() == 1 ? true : false);//店铺状态（1启用、禁用）
        supplierInfo.setStrategicSupplier(false);//战略商家
        supplierInfo.setYn(Boolean.TRUE);
        supplierInfo.setSysVersion(SysConstants.FIRST_VERSION);
        supplierInfo.setCreatePin(SysConstants.SYS_CREATION_PIN);
        supplierInfo.setCreateDate(new Date());

        //保存数据
        supplierInfoDao.save(supplierInfo);
    }


    /**
     * 拷贝国内银行数据
     * @param fip
     * @param innerbankMethod
     */
    public void saveInnerBankData(Object obj, SupplierInfo supplierInfo) throws Exception{
        FinanceInnerBankPayeeMO fip = (FinanceInnerBankPayeeMO) obj;

        InnerbankMethod innerbankMethod = new InnerbankMethod();
        innerbankMethod.setAccountId(supplierInfo.getAccountId());
        innerbankMethod.setDepositId(fip.getDepositId());
        innerbankMethod.setDepositCompanyName(fip.getDepositCompanyName());
        innerbankMethod.setDepositName(fip.getDepositName());
        innerbankMethod.setDeposotBankName(fip.getDepositBankName());
        innerbankMethod.setDepositBankAddress(fip.getDepositBankAddress());
        innerbankMethod.setAssociatedLineNum(fip.getAssociatedLineNum());
        innerbankMethod.setYn(Boolean.TRUE);
        innerbankMethod.setSysVersion(SysConstants.FIRST_VERSION);
        innerbankMethod.setCreatePin(SysConstants.SYS_CREATION_PIN);
        innerbankMethod.setCreateDate(new Date());
        //保存支付数据
        innerbankMethodDao.save(innerbankMethod);

        //商家主数据
        supplierInfo.setPayeeId(fip.getId());
        supplierInfo.setProcessStatus(fip.getProcessStatus() == 1 ? true : false);
    }

    /**
     * 拷贝国内银行数据
     * @param fop
     * @param outerbankMethod
     */
    public void saveOuterBankData(Object obj, SupplierInfo supplierInfo) throws Exception{
        FinanceOuterBankPayeeMO fop = (FinanceOuterBankPayeeMO) obj;

        OuterbankMethod outerbankMethod = new OuterbankMethod();
        outerbankMethod.setAccountId(supplierInfo.getAccountId());
        outerbankMethod.setDepositId(fop.getDepositId());
        outerbankMethod.setDepositCompanyName(fop.getDepositCompanyName());
        outerbankMethod.setDepositName(fop.getDepositName());
        outerbankMethod.setDepositBankName(fop.getDepositBankName());
        outerbankMethod.setDepositBankAddress(fop.getDepositBankAddress());
        outerbankMethod.setAssociatedLineNum(fop.getDepositBankSwiftCode());
        outerbankMethod.setDepositBankCountry(fop.getDepositBankCountry());
        outerbankMethod.setDepositBankCountryCode(fop.getDepositBankCountryCode());
        outerbankMethod.setDepositBankBranchCode(fop.getDepositBankBranchCode());
        outerbankMethod.setDepositBankRountingNumber(fop.getDepositBankRountingNumber());
        outerbankMethod.setDepositBankIbanNumber(fop.getDepositBankIbanNumber());
        outerbankMethod.setInterBankName(fop.getInterBankBankName());
        outerbankMethod.setInterBankAddress(fop.getInterBankAddress());
        outerbankMethod.setInterBankCountryCode(fop.getInterBankCountryCode());
        outerbankMethod.setYn(Boolean.TRUE);
        outerbankMethod.setSysVersion(SysConstants.FIRST_VERSION);
        outerbankMethod.setCreatePin(SysConstants.SYS_CREATION_PIN);
        outerbankMethod.setCreateDate(new Date());
        //保存支付数据
        outerbankMethodDao.save(outerbankMethod);

        //商家主数据
        supplierInfo.setPayeeId(fop.getId());
        supplierInfo.setProcessStatus(fop.getProcessStatus() == 1 ? true : false);
    }

    /**
     * 拷贝国内银行数据
     * @param fip
     * @param payoneerMethod
     */
    public void savePayonnerData(Object obj, SupplierInfo supplierInfo) throws Exception{
        FinanceThirdPayAccountMO fip = (FinanceThirdPayAccountMO) obj;

        //拷贝数据
        PayoneerMethod payoneerMethod = new PayoneerMethod();
        payoneerMethod.setPayeeId(fip.getPayeeId());
        payoneerMethod.setAccountId(supplierInfo.getAccountId());
        payoneerMethod.setFirstName(fip.getFirstName());
        payoneerMethod.setLastName(fip.getLastName());
        payoneerMethod.setYn(Boolean.TRUE);
        payoneerMethod.setSysVersion(SysConstants.FIRST_VERSION);
        payoneerMethod.setCreatePin(SysConstants.SYS_CREATION_PIN);
        payoneerMethod.setCreateDate(new Date());
        //保存支付数据
        payoneerMethodDao.save(payoneerMethod);

        //商家主数据
        supplierInfo.setPayeeId(fip.getId());
        supplierInfo.setProcessStatus(fip.getProcessStatus() == 1 ? true : false);
    }

    /**
     * 拷贝国内银行数据
     * @param fjp
     * @param jdWalletMethod
     */
    public void saveWalletData(Object obj, SupplierInfo supplierInfo) throws Exception{
        FinanceJdpayPayeeMO fjp = (FinanceJdpayPayeeMO) obj;

        //拷贝数据
        JdWalletMethod jdWalletMethod = new JdWalletMethod();
        jdWalletMethod.setAccountId(supplierInfo.getAccountId());
        jdWalletMethod.setAccountName(fjp.getAccountName());
        jdWalletMethod.setUserName(fjp.getUserName());//用户名称(对应网银钱包的email)
        jdWalletMethod.setMerchantId(fjp.getMerchantNo());
        jdWalletMethod.setCustomId(fjp.getCustomId());
        jdWalletMethod.setAlias(fjp.getAlias());
        jdWalletMethod.setType(fjp.getType());
        jdWalletMethod.setYn(Boolean.TRUE);
        jdWalletMethod.setSysVersion(SysConstants.FIRST_VERSION);
        jdWalletMethod.setCreatePin(SysConstants.SYS_CREATION_PIN);
        jdWalletMethod.setCreateDate(new Date());
        //保存支付数据
        jdWalletMethodDao.save(jdWalletMethod);

        supplierInfo.setPayeeId(fjp.getId());
        supplierInfo.setProcessStatus(fjp.getProcessStatus() == 1 ? true : false);
    }
}
