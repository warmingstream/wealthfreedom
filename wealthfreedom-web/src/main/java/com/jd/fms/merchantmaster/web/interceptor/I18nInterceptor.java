package com.jd.fms.merchantmaster.web.interceptor;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class I18nInterceptor extends HandlerInterceptorAdapter {

	private static final String splider = "_";
	private static final String pageLocale = "pageLocale";
	private static final ThreadLocal<Locale> i18nThreadLocal = new ThreadLocal<Locale>();
	private LocaleResolver localeResolver;

	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		Locale locale = localeResolver.resolveLocale(request);
		i18nThreadLocal.set(locale);
		request.setAttribute(pageLocale, getLangValue(locale));
		return true;
	}

	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		i18nThreadLocal.set(null);
		i18nThreadLocal.remove();
	}

	public LocaleResolver getLocaleResolver() {
		return localeResolver;
	}

	public void setLocaleResolver(LocaleResolver localeResolver) {
		this.localeResolver = localeResolver;
	}

	public static Locale getLocale() {
		return i18nThreadLocal.get();
	}

	public static String getLocaleString() {
		return getLangValue(i18nThreadLocal.get());
	}

	private static String getLangValue(Locale locale) {
		if (locale == null) {
			locale = Locale.SIMPLIFIED_CHINESE;
		}
		StringBuffer buffer = new StringBuffer();
		return buffer.append(locale.getLanguage()).append(splider)
				.append(locale.getCountry()).toString().toLowerCase();
	}
}
