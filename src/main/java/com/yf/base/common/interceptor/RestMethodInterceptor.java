package com.yf.base.common.interceptor;

import com.yf.base.model.sys.SysLog;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.sys.SysLogService;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

@Component
public class RestMethodInterceptor implements HandlerInterceptor {
	@Autowired
	SysLogService logService;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
		String requestUri = request.getRequestURI();
		String contextPath = request.getContextPath();
		String url = requestUri.substring(contextPath.length());


		if (handler instanceof HandlerMethod) {
			if ("/error".equals(url)) {
				System.out.println("::::::::::::::::::::::::::::"+url);
			} else {
				HandlerMethod method = (HandlerMethod) handler;
				System.out.println(" [" + method.getBean() + " Started...]");
				System.out.println("requestMethod: [ " + url + " ]");
			}
		} else {
			System.out.println("::::::::::::::::::::::::::::"+url);
		}

		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
		if (handler instanceof HandlerMethod) {
			HandlerMethod h = (HandlerMethod) handler;

			String requestUri = request.getRequestURI();
			String contextPath = request.getContextPath();
			String url = requestUri.substring(contextPath.length());
			if (!"/error".equals(url)) {
				SysUserVo loginUser = (SysUserVo) SecurityUtils.getSubject().getPrincipal();
				if (loginUser != null && (url.toLowerCase().indexOf("delete") > 0 || url.toLowerCase().indexOf("edit") > 0 || url.toLowerCase().indexOf("add") > 0 || url.toLowerCase().indexOf("update") > 0
						|| url.toLowerCase().indexOf("login") > 0 || url.toLowerCase().indexOf("logout") > 0 || url.toLowerCase().indexOf("save") > 0)) {
					SysLog syslog = new SysLog();
					syslog.setAction(url);
					syslog.setUserId(loginUser.getId());
					syslog.setOrganId(loginUser.getOrganId());
					syslog.setOprerationTime(new Date());
					syslog.setIpAddress(request.getRemoteAddr());
					logService.insert(syslog);
				}
			}
			request.setAttribute("requestCurrURL", url.substring(url.lastIndexOf("/") + 1));
			System.out.println(" [" + h.getBean() + " Normally End.]");
		}
	}

}
