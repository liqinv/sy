package com.yf.base.controller.sys;

import com.alibaba.fastjson.JSON;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yf.base.common.BaseController;
import com.yf.base.common.ReturnResult;
import com.yf.base.model.sys.SysRole;
import com.yf.base.model.sys.vo.SysPermissionVo;
import com.yf.base.model.sys.vo.SysRoleVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.sys.SysRoleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@Api(tags="角色管理模块")
@Controller
@RequestMapping("/sys/role")
public class RoleController extends BaseController {

    @Autowired
    private SysRoleService roleService;

    @ApiIgnore
    @RequestMapping("/list")
    public String list (){
        return "sys/roleList";
    }

    @ApiOperation(value="获取角色列表",  httpMethod ="POST")
    @RequestMapping("/selectRoleList")
    @ResponseBody
    public ReturnResult selectRoleList(@RequestBody SysRoleVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            param =  param != null?param:new SysRoleVo();
            if(param.getPageNo() == null || param.getPageNo().intValue()<1){
                param.setPageNo(1);
            }
            PageHelper.startPage(param.getPageNo(), param.getPageSize());
            List<SysRoleVo> result = roleService.selectByParam(param);
            PageInfo<SysRoleVo> pageInfo = new PageInfo<>(result);
            rr.setData(pageInfo);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("角色列表查询出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="获取角色对象",  httpMethod ="POST")
    @RequestMapping("/getRoleById")
    @ResponseBody
    public ReturnResult getRoleById(Integer roleId){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            if(roleId == null || roleId.intValue()<1){
                return ReturnResult.FAILUER("参数不能为空");
            }
            SysRole result = roleService.selectById(roleId);
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("获取角色对象出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="新增角色",  httpMethod ="POST")
    @RequestMapping("/addRole")
    @ResponseBody
    public ReturnResult addRole(@RequestBody SysRoleVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            if(param == null || StringUtils.isBlank(param.getName()) ){
                return ReturnResult.FAILUER("参数为空");
            }
            SysUserVo loginUser = this.getLoginUser();
            Integer result = roleService.add(param,loginUser);
            if(result.intValue() == 2){
                return ReturnResult.FAILUER("角色名称已被使用");
            }
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("新增角色出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="修改角色",  httpMethod ="POST")
    @RequestMapping("/editRole")
    @ResponseBody
    public ReturnResult editRole(@RequestBody SysRoleVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            if(param == null || StringUtils.isBlank(param.getName()) ){
                return ReturnResult.FAILUER("参数为空");
            }
            SysUserVo loginUser = this.getLoginUser();
            Integer result = roleService.edit(param,loginUser);
            if(result.intValue() == 2){
                return ReturnResult.FAILUER("角色名称已被使用");
            }
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("修改角色出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="删除角色",  httpMethod ="POST")
    @RequestMapping("/deleteRole")
    @ResponseBody
    public ReturnResult deleteRole(Integer roleId){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            if(roleId == null ){
                return ReturnResult.FAILUER("参数为空");
            }
            SysUserVo loginUser = this.getLoginUser();
            Integer result = roleService.delete(roleId,loginUser);
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("新增角色出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="设置角色权限", httpMethod ="POST")
    @RequestMapping("/permissionRole")
    @ResponseBody
    public ReturnResult permissionRole(String paraStr,Integer roleId){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            if(StringUtils.isBlank(paraStr)){
                return ReturnResult.FAILUER("参数为空");
            }
            List<SysPermissionVo> paraList = JSON.parseArray(paraStr,SysPermissionVo.class);
            Integer result = roleService.setRolePermission(paraList,roleId);
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("权限列表查询出错");
            ex.printStackTrace();
        }
        return rr;
    }
    @ApiOperation(value="获取所有角色",  httpMethod ="POST")
    @RequestMapping("/selectRoleListAll")
    @ResponseBody
    public ReturnResult selectRoleListAll(){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            List<SysRoleVo> result = roleService.selectByParam(new SysRoleVo());
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("角色列表查询出错");
            ex.printStackTrace();
        }
        return rr;
    }
}
