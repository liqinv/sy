package com.yf.base.controller.sys;


import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yf.base.common.*;
import com.yf.base.model.sys.SysUser;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.sys.SysUserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;


/**
 * 用户
 * 
 **/
@Api(tags="用户管理模块")
@Controller
@RequestMapping("/sys/user")
public class UserController extends BaseController {

	private String salt="salt";

	@Resource
	private SysUserService sysUserService;

	@ApiIgnore
	@RequestMapping("/list")
	public String list() {
		return "sys/userList";
	}

	@ApiIgnore
	@RequestMapping("/pwd")
	public String pwd() {
		return "sys/userPwd";
	}

    /**
     * 查询单个用户
     * @param sysUserVo
     * @return
     */
	@ApiOperation(value="查询单个用户",  httpMethod ="POST")
	@ResponseBody
    @RequestMapping("/getUser")
    public ReturnResult getUser(@RequestBody SysUserVo sysUserVo) {
		ReturnResult json = ReturnResult.SUCCESS();
		try {
			SysUserVo sysOrganVoTes=sysUserService.getSysUserVo(sysUserVo);
			json.setData(sysOrganVoTes);

		} catch (Exception e) {
			json = ReturnResult.FAILUER(Constants.QUERY_ERROR);
			e.printStackTrace();
		}
		return json;
    }
	/**
	 * 查询所有用户
	 * @param sysUserVo
	 * @return
	 */
	@ApiOperation(value="查询所有用户",  httpMethod ="POST")
	@ResponseBody
	@RequestMapping("/selectUser")
	public ReturnResult selectUser(@RequestBody SysUserVo sysUserVo) {
		ReturnResult json = ReturnResult.SUCCESS();
		try {
			sysUserVo = sysUserVo != null ? sysUserVo : new SysUserVo();
			if (sysUserVo.getPageNo() == null || sysUserVo.getPageNo().intValue() < 1) {
				sysUserVo.setPageNo(1);
			}
			PageHelper.startPage(sysUserVo.getPageNo(), sysUserVo.getPageSize());
			if (sysUserVo.getSearchCondition() != null && sysUserVo.getSearchCondition() != "") {
				String lowerCase = sysUserVo.getSearchCondition().toLowerCase();
				sysUserVo.setSearchCondition(lowerCase);
			}
			List<SysUserVo> sysOrganVoList=sysUserService.selectListVo(sysUserVo);
			PageInfo<SysUserVo> pageInfo = new PageInfo<>(sysOrganVoList);
			json.setData(pageInfo);
		} catch (Exception e) {
			json = ReturnResult.FAILUER(Constants.QUERY_ERROR);
			e.printStackTrace();
		}
		return json;
	}
	/**
	 * 添加用户
	 * @param sysUserVo
	 * @return
	 */
	@ApiOperation(value="添加用户",  httpMethod ="POST")
	@ResponseBody
	@RequestMapping("/add")
	public ReturnResult add(@RequestBody SysUserVo sysUserVo) {
		ReturnResult json = ReturnResult.SUCCESS();
		try {
				SysUserVo sysUserVoCount=new SysUserVo();
			sysUserVoCount.setAccount(sysUserVo.getAccount());
			if (sysUserService.getUserListCount(sysUserVoCount) != 0) {
				json.setCode(MessageCode.STATUS_FAIL);
				json.setDescription("此用户已存在");
				return json;
			}
			SysUser user = this.getLoginUser();
			Date date = new Date();
			sysUserVo.setCreateTime(date);
			sysUserVo.setLastUpdateTime(date);
			sysUserVo.setLastUpdateUserId(user.getId());
			sysUserVo.setCreateUserId(user.getId());
			sysUserVo.setCreateOrganId(user.getOrganId());
			sysUserVo.setSpell(PinYin2Abbreviation.cn2py(sysUserVo.getName()));
			sysUserVo.setActive(1);
			sysUserVo.setSalt(salt);
			sysUserVo.setPassword(MD5.md5Encrypt("123456",salt));
			int i =sysUserService.addSysUserVo(sysUserVo);
		} catch (Exception e) {
			json = ReturnResult.FAILUER(Constants.QUERY_ERROR);
			e.printStackTrace();
		}
		return json;
	}
	/**
	 * 修改用户
	 * @param sysUserVo
	 * @return
	 */
	@ApiOperation(value="修改用户",  httpMethod ="POST")
	@ResponseBody
	@RequestMapping("/edit")
	public ReturnResult edit(@RequestBody SysUserVo sysUserVo) {
		ReturnResult json = ReturnResult.SUCCESS();
		try {
			SysUserVo sysUserVoCount=new SysUserVo();
			sysUserVoCount.setAccount(sysUserVo.getAccount());
			sysUserVoCount.setId(sysUserVo.getId());
			if (sysUserService.getUserListCount(sysUserVoCount) != 0) {
				json.setCode(MessageCode.STATUS_FAIL);
				json.setDescription("此用户已存在");
				return json;
			}
			SysUser user = this.getLoginUser();
			Date date = new Date();
			sysUserVo.setLastUpdateTime(date);
			sysUserVo.setLastUpdateUserId(user.getId());
			if(sysUserVo.getName()!= null){
				sysUserVo.setSpell(PinYin2Abbreviation.cn2py(sysUserVo.getName()));
			}
			sysUserService.editSysUserVo(sysUserVo);
		} catch (Exception e) {
			json = ReturnResult.FAILUER(Constants.QUERY_ERROR);
			e.printStackTrace();
		}
		return json;
	}
	/**
	 * 删除用户
	 * @param sysUser
	 * @return
	 */
	@ApiOperation(value="删除用户",  httpMethod ="POST")
	@ResponseBody
	@RequestMapping("/delete")
	public ReturnResult delete(@RequestBody SysUser sysUser) {
		ReturnResult json = ReturnResult.SUCCESS();
		try {
			SysUser user = this.getLoginUser();
			Date date = new Date();
			sysUser.setLastUpdateTime(date);
			sysUser.setLastUpdateUserId(user.getId());
			sysUser.setActive(0);
			int i =sysUserService.update(sysUser);
		} catch (Exception e) {
			json = ReturnResult.FAILUER(Constants.QUERY_ERROR);
			e.printStackTrace();
		}
		return json;
	}

	@ApiOperation(value = "修改密码", httpMethod = "POST")
	@ResponseBody
	@RequestMapping("/editPwd")
	public ReturnResult editPwd(String oldPwd,String newPwd){
		ReturnResult rr = ReturnResult.SUCCESS();
		try {
			if(StringUtils.isBlank(oldPwd) || StringUtils.isBlank(newPwd)){
				return ReturnResult.FAILUER("参数为空");
			}
			String oldPwdMD5 = MD5.md5Encrypt(oldPwd,"salt");
			SysUser user = this.getLoginUser();
			if(!user.getPassword().equals(oldPwdMD5)){
				return ReturnResult.FAILUER("旧密码错误");
			}
			String newPwdMD5 = MD5.md5Encrypt(newPwd,"salt");
			Integer result = sysUserService.editPwd(user.getId(),newPwdMD5);
			rr.setData(result);
		} catch (Exception e) {
			rr = ReturnResult.FAILUER(Constants.QUERY_ERROR);
			e.printStackTrace();
		}
		return rr;
	}
}
