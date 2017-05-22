package com.jd.fms.merchantmaster.web.controller.supplier;

import cn.org.rapid_framework.page.Page;
import com.jd.fms.merchantmaster.service.SupplierService;
import com.jd.fms.merchantmaster.service.SynSupplierMasterService;
import com.jd.fms.merchantmaster.utils.response.JsonWriter;
import com.jd.fms.merchantmaster.web.controller.common.BaseController;
import com.jd.pops.merchantmaster.domain.enumeration.BusinessDepartmentEnum;
import com.jd.pops.merchantmaster.domain.enumeration.PayoutMethodEnum;
import com.jd.pops.merchantmaster.domain.enumeration.SupplierFreezenEnum;
import com.jd.pops.merchantmaster.domain.model.SupplierInfo;
import com.jd.pops.merchantmaster.domain.query.SupplierInfoQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("/supplier/")
public class SupplierControler extends BaseController {

	@Autowired
	private SynSupplierMasterService synMerchantMasterService;

	@Autowired
	private SupplierService supplierService;

	/**
	 * 商家主数据首页
	 * @param query
	 * @param model
	 * @return
	 */
	@RequestMapping("index")
	public String index(SupplierInfoQuery query, Model model) {
		try {
			//下拉列表
			model.addAttribute("SupplierFreezenEnumList", SupplierFreezenEnum.getAllType());
			model.addAttribute("BusinessDepartmentEnumList", BusinessDepartmentEnum.getAllType());

			//分页数据
			Page result = supplierService.findPage(query);
			model.addAllAttributes(toModelMap(result, query));
		} catch (Exception e){
			e.printStackTrace();
			logger.error("加载商家主数据首页失败！");
		}
		return "supplier/supplierIndex";
	}

	/**
	 * 查看详情
	 * @param id
	 * @return
	 */
	@RequestMapping("detail")
	public @ResponseBody JsonWriter supplierList(String id) {
		JsonWriter jsonWriter = new JsonWriter();
		try{
			jsonWriter.setData(supplierService.getById(Long.parseLong(id)));
		} catch (Exception e){
			logger.error("获取详情失败！" + e.getMessage());
		}
		jsonWriter.setSuccess(true);
		jsonWriter.setMsg("成功！");
		return jsonWriter;
	}

	/**
	 * 保存修改
	 * @param supplier
	 * @return
	 */
	@RequestMapping("save")
	public @ResponseBody JsonWriter save(SupplierInfo supplier, String strategicSupplier) {
		JsonWriter jsonWriter = new JsonWriter();
		try{
			if (supplier != null && supplier.getStrategicSupplier() == null ) {
				supplier.setStrategicSupplier(false);
			}
			supplierService.save(supplier);
		} catch (Exception e){
			logger.error("保存失败！" + e.getMessage());
		}
		jsonWriter.setSuccess(true);
		jsonWriter.setMsg("保存成功！");
		return jsonWriter;
	}

	/**
	 * 计费系统同步数据
	 * @param id
	 * @return
	 */
	@RequestMapping("sync")
	public @ResponseBody JsonWriter sync(String id) {
		JsonWriter jsonWriter = new JsonWriter();
		try {
			synMerchantMasterService.synSupplierInfoAll();
		} catch (Exception e){
			logger.error("计费系统同步数据失败！" + e.getMessage());
			jsonWriter.setSuccess(false);
			jsonWriter.setMsg("失败！");
			return jsonWriter;
		}
		jsonWriter.setSuccess(true);
		jsonWriter.setMsg("成功！");
		return jsonWriter;
	}

	/**
	 * 手动同步商家主数据
	 * @param ids
	 * @return
	 */
	@RequestMapping("synPage")
	public String synPage(String ids) {
		return "supplier/synSupplierPage";
	}

	/**
	 * 手动同步商家主数据
	 *
	 * 如果本地存在则删除后更新
	 * @param ids
	 * @return
	 */
	@RequestMapping("synAccountIds")
	public @ResponseBody JsonWriter synAccountIds(String ids) {
		JsonWriter jsonWriter = new JsonWriter();
		try {
			synMerchantMasterService.synSupplierInfoByAccountId(ids);
		} catch (Exception e){
			logger.error("手动同步商家主数据失败！" + e.getMessage());
			jsonWriter.setSuccess(false);
			jsonWriter.setMsg("失败！");
			return jsonWriter;
		}
		jsonWriter.setSuccess(true);
		jsonWriter.setMsg("成功！");
		return jsonWriter;
	}


	/**
	 * 手动同步商家主数据
	 * @param id
	 * @return
	 */
	@RequestMapping("supplierDetails")
	public String supplierDetails(String id, Model model) {

		try{
			//查询商家信息以及钱包信息
			Map<String, Object> supplierAndPurchaseInfo =
					supplierService.getSupplierAndPurchaseInfo(Long.parseLong(id), null);

			model.addAttribute("supplierInfo", supplierAndPurchaseInfo.get("supplierInfo"));
			model.addAttribute("purchaseInfo", supplierAndPurchaseInfo.get("purchaseInfo"));
			model.addAttribute("paymentType", supplierAndPurchaseInfo.get("paymentType"));
		} catch (Exception e){
			e.printStackTrace();
			logger.error("查询详情失败！原因：" + e.getMessage());
		}
		return "supplier/supplierDetails";
	}




//	@Autowired
//	private StrategicBusinessJsfService strategicBusinessJsfService;
//	@Autowired
//	private PayoneerMethodDao payoneerMethodDao;
//	@Autowired
//	private SupplierInfoDao supplierInfoDao;
//	@Autowired
//	private FinanceAccountServiceProvider financeAccountService;//国际站商家判定接口
//	@Autowired
//	private SynSupplierMasterService synSupplierMasterService;
	@RequestMapping("test")
	public String testController() {
//		try {
//			List<Long> allStrategicBusiness = strategicBusinessJsfService.getAllStrategicBusiness();
//			for (Long supplierId : allStrategicBusiness){
//				System.out.print(supplierId + ",");
//			}
//		} catch (Exception e) {
//			logger.error("测试数据发生错误:" + e.getMessage());
//			e.printStackTrace();
//		}
//







//
//		String[] accountIds = {
//				"1223210000",
//				"1223210000",
//				"1223210000",
//				"1223210000",
//				"1223210000",
//				"1223210000",
//				"1223210000",
//				"2038120000",
//				"2038120000",
//				"1352710000",
//				"1352710000",
//				"1122410000",
//				"1122410000"
//		};
//		for (String accountId : accountIds){
//			try{
//				synSupplierMasterService.synSupplierInfoByAccountId(Long.parseLong(accountId));
//			} catch (Exception e){
//				System.out.println(11);
//			}
//		}













		//测试
//		SupplierInfo info = supplierInfoDao.selectByAccountId(1223210000L);

//		SupplierInfo info = supplierInfoDao.selectByAccountId(1223210001L);
//		info.setYn(false);
//		supplierInfoDao.saveOrUpdate(info);

//		String[] accountIds = {
////				"1223210000",
////				"2038120000",
////				"1122410000",
////				"1352710000",
//
//
//
////				"2066110000",
////				"2056110000",
////				"2035810000",
//				"1831610000",
//				"1831110000",
//
//		};
//		for (String accountId : accountIds){
//			try {
//				supplierService.saveRemoteSupplierData(Long.parseLong(accountId));
//
////				boolean flag = financeAccountService.checkBusiness(Long.parseLong(accountId), BusinessTypeEnumMO.GLOBALPURCHASE);
////				System.out.println(flag);
//			} catch (Exception e) {
//				logger.error("测试数据发生错误:" + e.getMessage());
//				e.printStackTrace();
//			}
//		}






//		try {
//			PayoneerMethod payoneerMethod = new PayoneerMethod();
//			payoneerMethod.setAccountId(111L);
//			payoneerMethod.setPayeeId("111");
//			payoneerMethod.setFirstName("firstName");
//			payoneerMethod.setLastName("lastName");
//			payoneerMethod.setYn(Boolean.TRUE);
//			payoneerMethod.setSysVersion(SysConstants.FIRST_VERSION);
//			payoneerMethod.setCreatePin(SysConstants.SYS_CREATION_PIN);
//			payoneerMethod.setCreateDate(new Date());
//			payoneerMethodDao.insert(payoneerMethod);
//
//			List<PayoneerMethod> payoneerMethodList = payoneerMethodDao.findByFields(payoneerMethod);
//		} catch (Exception e) {
//			logger.error("测试数据发生错误:" + e.getMessage());
//			e.printStackTrace();
//		}



//		boolean isNationalStation =
//				financeAccountService.checkBusiness(1223210000L, BusinessTypeEnumMO.GLOBALPURCHASE);


		return null;
	}
}
