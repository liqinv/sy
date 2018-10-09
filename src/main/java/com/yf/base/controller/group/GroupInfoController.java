package com.yf.base.controller.group;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yf.base.common.BaseController;
import com.yf.base.common.Constants;
import com.yf.base.common.ReturnResult;
import com.yf.base.model.group.GroupInfo;
import com.yf.base.model.group.vo.GroupInfoVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.group.GroupInfoService;
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

@Api(tags = "人员分组模块")
@Controller
@RequestMapping("/group")
public class GroupInfoController extends BaseController {
    @Resource
    private GroupInfoService groupInfoService;
    @Resource
    private SysUserService sysUserService;

    @ApiIgnore
    @RequestMapping("/list")
    public String list (){
        return "group/groupList";
    }

    @ApiOperation(value="获取分组列表",  httpMethod ="POST")
    @RequestMapping("/selectGroupList")
    @ResponseBody
    public ReturnResult selectGroupList(@RequestBody GroupInfoVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            param =  param != null?param:new GroupInfoVo();
            if(param.getPageNo() == null || param.getPageNo().intValue()<1){
                param.setPageNo(1);
            }
            PageHelper.startPage(param.getPageNo(), param.getPageSize());
            List<GroupInfoVo> result = groupInfoService.selectByParam(param);
            PageInfo<GroupInfoVo> pageInfo = new PageInfo<>(result);
            rr.setData(pageInfo);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("分组列表查询出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="获取所有分组",  httpMethod ="POST")
    @RequestMapping("/allList")
    @ResponseBody
    public ReturnResult allList(@RequestBody GroupInfoVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            param =  param != null?param:new GroupInfoVo();
            List<GroupInfoVo> result = groupInfoService.selectByParam(param);
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("获取所有分组出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="新增分组",  httpMethod ="POST")
    @RequestMapping("/add")
    @ResponseBody
    public ReturnResult add(@RequestBody GroupInfoVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            if(param == null || StringUtils.isBlank(param.getName()) ){
                return ReturnResult.FAILUER("参数为空");
            }
            SysUserVo loginUser = this.getLoginUser();
            param.setActive(Constants.ACTIVE_TRUE);
            param.setCreateUserId(loginUser.getId());
            param.setCreateTime(new Date());
            param.setCreateOrganId(loginUser.getOrganId());
            param.setLastUpdateUserId(loginUser.getId());
            param.setLastUpdateTime(new Date());
            groupInfoService.addGroup(param);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("新增分组出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="获取分组对象",  httpMethod ="POST")
    @RequestMapping("/get")
    @ResponseBody
    public ReturnResult get(Integer groupId){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            if(groupId == null || groupId.intValue()<1){
                return ReturnResult.FAILUER("参数不能为空");
            }
            GroupInfoVo result = groupInfoService.selectDetailById(groupId);
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("获取分组对象出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="修改分组",  httpMethod ="POST")
    @RequestMapping("/edit")
    @ResponseBody
    public ReturnResult edit(@RequestBody GroupInfoVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            if(param == null || StringUtils.isBlank(param.getName()) ){
                return ReturnResult.FAILUER("参数为空");
            }
            SysUserVo loginUser = this.getLoginUser();
            param.setLastUpdateUserId(loginUser.getId());
            param.setLastUpdateTime(new Date());
            groupInfoService.editGroup(param);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("修改分组出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="删除分组",  httpMethod ="POST")
    @RequestMapping("/delete")
    @ResponseBody
    public ReturnResult delete(Integer groupId){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            if(groupId == null ){
                return ReturnResult.FAILUER("参数为空");
            }
            SysUserVo loginUser = this.getLoginUser();
            GroupInfo gi = new GroupInfo();
            gi.setId(groupId);
            gi.setLastUpdateUserId(loginUser.getId());
            gi.setLastUpdateTime(new Date());
            gi.setActive(Constants.ACTIVE_FALSE);
            Integer result = groupInfoService.update(gi);
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("删除分组出错");
            ex.printStackTrace();
        }
        return rr;
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
            List<SysUserVo> userList=sysUserService.selectListVo(sysUserVo);
            json.setData(userList);
        } catch (Exception e) {
            json = ReturnResult.FAILUER(Constants.QUERY_ERROR);
            e.printStackTrace();
        }
        return json;
    }
}
