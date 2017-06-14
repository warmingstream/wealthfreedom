package com.jd.fms.merchantmaster.web.controller;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.LocaleResolver;

import com.jd.common.web.LoginContext;

@Controller
@RequestMapping("/")
public class IndexControler {

	private String loginCookieKey = "_lc_";

	private String webAppName = "pops-settlement-web";

	private String webAppEnv = "dev";

	public String getLoginCookieKey() {
		return loginCookieKey;
	}

	public void setLoginCookieKey(String loginCookieKey) {
		this.loginCookieKey = loginCookieKey;
	}

	@RequestMapping(value = "", method = RequestMethod.GET)
	public String index(ModelMap mode) {
		int i = 0;
//		LoginContext loginContext = LoginContext.getLoginContext();
//		String erpCode = loginContext.getPin();
//		// 登陆成功保存登陆用户信息
//		loginSuccessSaveUserInfo(erpCode);
//		mode.addAttribute("logPin", erpCode);
//
//		mode.put("webAppName", this.webAppName);
//		mode.put("webAppEnv", this.webAppEnv);
		return "index";
	}

	private void loginSuccessSaveUserInfo(String erpCode) {
		try {
			int i = 0;
			// 登陆成功保存登陆用户信息
			// srcUserService.loginSuccessSaveUserInfo(erpCode);
		} catch (Exception e) {
		}
	}

	@Autowired
	LocaleResolver localeResolver;

	// @HrmPrivilege("wos_index")
	@RequestMapping(value = "index", method = RequestMethod.GET)
	public String index(
			@RequestParam(value = "locale", required = false) Locale locale,
			HttpServletRequest request, HttpServletResponse response,
			ModelMap mode) {
		if (locale != null) {
			localeResolver.setLocale(request, response, locale);
		}
		LoginContext loginContext = LoginContext.getLoginContext();
		String erpCode = loginContext.getPin();
		// 登陆成功保存登陆用户信息
		loginSuccessSaveUserInfo(erpCode);
		mode.put("webAppName", this.webAppName);
		mode.put("webAppEnv", this.webAppEnv);
		return "index";
	}

	@RequestMapping(value = "menu", method = { RequestMethod.GET,
			RequestMethod.POST })
	public String menu(
			@RequestParam(value = "locale", required = false) Locale locale,
			HttpServletRequest request, HttpServletResponse response) {
		return "index_menu";
	}

	@RequestMapping(value = "error/{code}", method = { RequestMethod.POST,
			RequestMethod.GET })
	public String error(@PathVariable String code) {
		if (StringUtils.isNotEmpty(code)
				&& (code.trim().equals("404") || code.trim().equals("500"))) {
			return "common/" + code;
		} else {
			return "common/404";
		}
	}

	/**
	 * 注销登录
	 * 
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "logout", method = RequestMethod.GET)
	public String logout(HttpServletResponse response) {
		return "redirect:" + "http://test.ssa.jd.com/sso/logout?ReturnUrl=http://pops.jd.com:8080";
	}
}
