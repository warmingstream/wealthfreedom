package com.jd.fms.merchantmaster.web.controller.common;

import java.io.IOException;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.ui.ModelMap;
import org.springframework.util.Assert;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import cn.org.rapid_framework.page.Page;
import cn.org.rapid_framework.page.PageRequest;

import com.alibaba.fastjson.JSON;
import com.jd.common.util.StringUtils;
import com.jd.common.util.base.BaseQuery;
import com.jd.common.web.LoginContext;
import com.jd.fms.merchantmaster.utils.exception.ExceptionUtility;
import com.jd.fms.merchantmaster.utils.response.JsonWriter;

public class BaseController {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	//@Resource
	//private PopsCache popsCacheService;

	@ModelAttribute
	public void init(ModelMap model) {
		LoginContext loginContext = LoginContext.getLoginContext();

		String userCdoe = loginContext.getPin();
		String key = "WOS_RESOURCES_KEY_" + userCdoe;
		//Set<String> resources = (Set<String>) popsCacheService.get(key);

	}

	/**
	 * 转换成jQuery EasyUi 分页对象
	 * 
	 * @param page
	 * @return
	 */
	protected Map<String, Object> toPageMap(Page<BaseQuery> page) {
		Map<String, Object> result = new HashMap<String, Object>();
		if (page != null) {
			result.put("rows", page.getItemList());
			result.put("total", page.getTotalCount());
		}
		return result;
	}

	@SuppressWarnings("rawtypes")
	public static ModelMap toModelMap(Page page, PageRequest pageRequest) {
		return toModelMap("", page, pageRequest);
	}

	@SuppressWarnings("rawtypes")
	public static ModelMap toModelMap(String tableId, Page page,
			PageRequest pageRequest) {
		ModelMap model = new ModelMap();
		saveIntoModelMap(tableId, page, pageRequest, model);
		return model;
	}

	/**
	 * 用于一个页面有多个extremeTable是使用
	 * 
	 * @param tableId
	 *            等于extremeTable的tableId属性
	 */
	@SuppressWarnings("rawtypes")
	public static void saveIntoModelMap(String tableId, Page page,
			PageRequest pageRequest, ModelMap model) {
		Assert.notNull(tableId, "tableId must be not null");
		Assert.notNull(page, "page must be not null");
		model.addAttribute(tableId + "page", page);
		model.addAttribute(tableId + "totalRows",
				Integer.valueOf(page.getTotalCount()));
		model.addAttribute(tableId + "pageRequest", pageRequest);
		model.addAttribute(tableId + "query", pageRequest);
	}

	@InitBinder
	protected void initBinder(WebDataBinder binder) {
		binder.registerCustomEditor(Date.class, new CustomDateEditor(
				new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"), true));
	}

	// valid exception
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseBody
	public JsonWriter handleMethodArgumentNotValidException(
			MethodArgumentNotValidException ex) {
		BindingResult bindingResult = ex.getBindingResult();
		String errorMesssage = "Invalid Request:";
		for (FieldError fieldError : bindingResult.getFieldErrors()) {
			errorMesssage += fieldError.getDefaultMessage() + ", ";
		}
		JsonWriter response = new JsonWriter();
		response.setSuccess(false);
		response.setErrorMsg(errorMesssage);
		return response;
	}

	// JSON convert exception
	@ExceptionHandler(HttpMessageNotReadableException.class)
	@ResponseBody
	public JsonWriter handleHttpMessageNotReadableException(
			HttpMessageNotReadableException ex) {
		JsonWriter response = new JsonWriter();
		response.setSuccess(false);
		logger.error("handleHttpMessageNotReadableException:", ex);
		response.setErrorMsg("json convert failure!");
		return response;
	}

	/**
	 * 异常拦截处理器
	 * 
	 * @param ex
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@ExceptionHandler(Exception.class)
	public ModelAndView handleException(Exception ex,
			HttpServletRequest request, HttpServletResponse response) {
		ModelAndView modelAndView = new ModelAndView();
		logger.error("异常拦截处理器,路径(" + request.getRequestURI() + "):", ex);
		HttpInputMessage inputMessage = new ServletServerHttpRequest(request);
		List<MediaType> acceptedMediaTypes = inputMessage.getHeaders()
				.getAccept();
		MediaType.sortByQualityValue(acceptedMediaTypes);
		if (acceptedMediaTypes.contains(MediaType.TEXT_HTML)) {
			// 请求内容为text/html
			modelAndView.addObject("exception", ex);
			modelAndView.addObject("exceptionStackTrace",
					ExceptionUtility.getStackTrace(ex));
			modelAndView.setViewName("error/errorPage");
			return modelAndView;
		}
		if (acceptedMediaTypes.contains(MediaType.APPLICATION_JSON)) {
			// 请求内容为"application/json"
			JsonWriter jsonWriter = new JsonWriter();
			jsonWriter.setSuccess(false);
			jsonWriter.setErrorMsg("处理失败，请联系管理员！");
			String eStr = ExceptionUtility.getStackTrace(ex);
			if (StringUtils.isNotBlank(eStr)) {
				int exLen = eStr.length() > 5000 ? 5000 : eStr.length();
				jsonWriter.setExceptionMsg(eStr.substring(0, exLen));
			}
			String responseStr = JSON.toJSONString(jsonWriter);
			response.setCharacterEncoding("UTF-8");
			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			Writer writer = null;
			try {
				writer = response.getWriter();
				writer.write(responseStr);
				writer.flush();
			} catch (IOException e) {
				logger.error("handleException error:", e);
			} finally {
				if (writer != null) {
					try {
						writer.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
			return null;
		}

		return modelAndView;
	}

}
