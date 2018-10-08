package com.yf.base.common;

import com.yf.base.model.sys.vo.SysUserVo;
import org.apache.shiro.SecurityUtils;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;

import java.util.Date;

/**
 * 公共视图控制器
 * 
 **/
public abstract class BaseController {
	
	/**
	 * 获取登录对象
	 * @return
	 */
	public SysUserVo getLoginUser() {
		SysUserVo loginUser= (SysUserVo) SecurityUtils.getSubject().getPrincipal();
		return loginUser;
	}


	@InitBinder
	public void initBinder(WebDataBinder binder) {
		binder.registerCustomEditor(Date.class, new MyCustomDateEditor());
	}

}