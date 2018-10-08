package com.yf.base.controller.sys;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yf.base.common.BaseController;
import com.yf.base.common.ReturnResult;
import com.yf.base.model.sys.SysPermission;
import com.yf.base.model.sys.vo.SysPermissionVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.sys.SysPermissionService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@Api(tags = "权限管理模块")
@Controller
@RequestMapping("/sys/perms")
public class PermissionController extends BaseController {

    @Autowired
    private SysPermissionService permissionService;

    @ApiIgnore
    @RequestMapping("/list")
    public String list(){
        return "sys/permission";
    }

    @ApiOperation(value = "添加权限", httpMethod = "POST")
    @RequestMapping("/addPermission")
    @ResponseBody
    public ReturnResult addPermission(@RequestBody SysPermission param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            SysUserVo loginUser = this.getLoginUser();
            Integer result = permissionService.addPermission(param,loginUser);
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("添加权限出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value = "删除权限，逻辑删除", httpMethod = "POST")
    @RequestMapping("/deletePermission")
    @ResponseBody
    public ReturnResult deletePermission(@RequestBody SysPermissionVo permission){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            SysUserVo loginUser = this.getLoginUser();
            Integer result = permissionService.deletePermission(permission,loginUser);
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("添加权限出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value = "获取登录人权限列表", notes = "返回树形结构的集合", httpMethod = "POST")
    @RequestMapping("/selectMenuTree")
    @ResponseBody
    public ReturnResult selectMenuTree() {
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            rr.setData(this.getLoginUser().getPermissionTree());
        } catch (Exception ex) {
            rr = ReturnResult.FAILUER("导航菜单查询出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value = "获取所有的权限列表", notes = "返回树形结构的集合", httpMethod = "POST")
    @RequestMapping("/selectPermissionTreeSource")
    @ResponseBody
    public ReturnResult selectPermissionTreeSource() {
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            List<SysPermissionVo> result = permissionService.selectTreeSource(null);
            rr.setData(result);
        } catch (Exception ex) {
            rr = ReturnResult.FAILUER("权限列表查询出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value = "获取所有的权限列表，并根据角色设置选中", notes = "返回树形结构的集合", httpMethod = "POST")
    @RequestMapping("/selectPermissionList")
    @ResponseBody
    public ReturnResult selectPermissionList(Integer roleId) {
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            if (roleId == null) {
                return ReturnResult.FAILUER("参数为空");
            }
            List<SysPermissionVo> result = permissionService.selectAllTreeSourceSetRoleByRoleId(roleId);
            rr.setData(result);
        } catch (Exception ex) {
            rr = ReturnResult.FAILUER("权限列表查询出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value = "获取角色的权限列表", notes = "返回树形结构的集合", httpMethod = "POST")
    @RequestMapping("/selectPermissionListByRoleId")
    @ResponseBody
    public ReturnResult selectPermissionListByRoleId(Integer roleId) {
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            if (roleId == null) {
                return ReturnResult.FAILUER("参数为空");
            }
            List<SysPermissionVo> result = permissionService.selectTreeSourceByRoleId(roleId);
            JSONArray resultObj = JSON.parseArray(JSON.toJSONString(result));
            for (int i = 0; i < resultObj.size(); i++) {
                JSONObject itemObj = resultObj.getJSONObject(i);
                JSONArray childNodes = itemObj.getJSONArray("nodes");
                if (childNodes != null && childNodes.size() > 0) {
                    removeNodes(childNodes);
                } else {
                    itemObj.remove("nodes");
                }
            }
            rr.setData(resultObj);
        } catch (Exception ex) {
            rr = ReturnResult.FAILUER("权限列表查询出错");
            ex.printStackTrace();
        }
        return rr;
    }

    private void removeNodes(JSONArray nodes) {
        if (nodes != null && nodes.size() > 0) {
            for (int i = 0; i < nodes.size(); i++) {
                JSONObject itemObj = nodes.getJSONObject(i);
                JSONArray childNodes = itemObj.getJSONArray("nodes");
                if (childNodes != null && childNodes.size() > 0) {
                    removeNodes(childNodes);
                } else {
                    itemObj.remove("nodes");
                }
            }
        }
    }
}
