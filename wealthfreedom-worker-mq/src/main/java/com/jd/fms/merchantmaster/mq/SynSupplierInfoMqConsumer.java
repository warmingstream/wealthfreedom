package com.jd.fms.merchantmaster.mq;

import com.jd.fms.merchantmaster.dao.SupplierInfoDao;
import com.jd.fms.merchantmaster.service.SupplierService;
import com.jd.fms.merchantmaster.service.SynSupplierMasterService;
import com.jd.fms.merchantmaster.service.impl.SupplierServiceImpl;
import com.jd.jmq.client.consumer.MessageListener;
import com.jd.jmq.common.message.Message;
import com.jd.pops.merchantmaster.domain.model.SupplierInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * @Title 商家主数据异步消息消费
 * @Author warming.
 * @Date 2017/5/11.
 */
public class SynSupplierInfoMqConsumer implements MessageListener {
    Logger logger = LoggerFactory.getLogger(SynSupplierInfoMqConsumer.class);

    @Autowired
    private SynSupplierMasterService synSupplierMasterService;

    @Autowired
    private SupplierInfoDao supplierInfoDao;

    @Autowired
    private SupplierService supplierService;


    @Override
    public void onMessage(List<Message> messages) throws Exception {
        Long accountId = null;
        try {
            if (messages == null || messages.isEmpty()) {
                return;
            }

            for (Message message : messages) {
                accountId = Long.parseLong(message.getText());

                //本地存在则删除后在插入
                SupplierInfo supplierInfo = supplierInfoDao.selectByAccountId(accountId);
                if (supplierInfo != null){
                    synSupplierMasterService.synSupplierInfoByAccountId(supplierInfo);
                } else {
                    supplierService.saveRemoteSupplierData(accountId);
                }
            }
        } catch (Exception e) {
            logger.error("商家主数据异步消息消费失败" + e.getMessage());
            throw new Exception(e);
        }
    }
}
