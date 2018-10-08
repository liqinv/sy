package com.yf.base.controller.sys;

import com.yf.base.common.BaseController;
import com.yf.base.common.ReturnResult;
import com.yf.base.model.sys.vo.SysPermissionVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

/**
 * 用户登录登出视图控制器
 * 
 **/
@Api(tags="用户管理模块")
@Controller
public class LoginController extends BaseController {
	@ApiIgnore()
	@RequestMapping("/other/main")
	public String index(){
//		System.out.println(this.getLoginUser().getName());
		return "index";
	}

	@ApiOperation(value="用户登录接口",  httpMethod ="POST")
	@ResponseBody
	@RequestMapping("/login")
	public ReturnResult login(String username, String password) {
		ReturnResult json =  ReturnResult.SUCCESS("登录成功");
		Subject subject = SecurityUtils.getSubject();
		UsernamePasswordToken token = new UsernamePasswordToken(username, password);
		try {
			subject.login(token);
			//获取登录后首页地址
			List<SysPermissionVo> permissionTree = this.getLoginUser().getPermissionTree();
			if (permissionTree == null || permissionTree.size() == 0) {
				json =  ReturnResult.FAILUER("没有分配功能权限，请联系管理员！");
			} else {
				String indexUrl = "";
				SysPermissionVo first = permissionTree.get(0);
				if (first.getLeaf() == 1) {
					indexUrl = first.getResourceUrl();
				} else {
					indexUrl = first.getNodes().get(0).getResourceUrl();
				}
				json.setData(indexUrl);
				subject.getSession().setTimeout(180000);
			}
		} catch (UnknownAccountException e1) {
			token.clear();
			json =  ReturnResult.FAILUER("账号不存在");
		} catch (IncorrectCredentialsException e2) {
			token.clear();
			json =  ReturnResult.FAILUER("密码不正确");
		} catch (Exception e) {
			token.clear();
			json =  ReturnResult.FAILUER("登录失败");
		}
		return json;
	}

	@ApiIgnore()
	@RequestMapping("/403")
	public String unauthorizedRole(){
		return "403";
	}

	@ApiIgnore()
	@ResponseBody
	@RequestMapping("/other/role1")
	//@RequiresPermissions("/other/role1")//权限管理;
	public String role1() {
        return "role1";
	}

	@ApiIgnore()
	@ResponseBody
	@RequestMapping("/other/role2")
	//@RequiresPermissions("/other/role2")//权限管理;
	public String role2() {
		return "role2";
	}
}
