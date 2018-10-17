package com.yf.base.controller.resource;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yf.base.common.BaseController;
import com.yf.base.common.Constants;
import com.yf.base.common.ReturnResult;
import com.yf.base.model.resource.ResourceInfo;
import com.yf.base.model.resource.vo.ResourceInfoVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.resource.ResourceService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Api(tags = "点位资源模块")
@Controller
@RequestMapping("/resource/point/")
public class ResourceController extends BaseController {
    @Resource
    private ResourceService resourceService;

    @ApiIgnore
    @RequestMapping("/main")
    public String main (){
        return "resource/resourceList";
    }

    @ApiOperation(value="获取点位资源列表",  httpMethod ="POST")
    @RequestMapping("/list")
    @ResponseBody
    public ReturnResult list(@RequestBody ResourceInfoVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            param =  param != null?param:new ResourceInfoVo();
            if(param.getPageNo() == null || param.getPageNo().intValue()<1){
                param.setPageNo(1);
            }
            PageHelper.startPage(param.getPageNo(), param.getPageSize());
            List<ResourceInfoVo> result = resourceService.selectByParam(param);
            PageInfo<ResourceInfoVo> pageInfo = new PageInfo<>(result);
            rr.setData(pageInfo);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("点位资源列表查询出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="上图资源查询",  httpMethod ="POST")
    @RequestMapping("/listMap")
    @ResponseBody
    public ReturnResult listMap(@RequestBody ResourceInfoVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            param =  param != null?param:new ResourceInfoVo();
            List<ResourceInfoVo> result = resourceService.selectByParam(param);
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("上图资源查询出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="保存点位资源",  httpMethod ="POST")
    @RequestMapping("/save")
    @ResponseBody
    public ReturnResult save(@RequestBody ResourceInfoVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            SysUserVo loginUser = this.getLoginUser();
            if (param.getId() == null) {
                param.setActive(Constants.ACTIVE_TRUE);
                param.setCreateUserId(loginUser.getId());
                param.setCreateTime(new Date());
                param.setCreateOrganId(loginUser.getOrganId());
                param.setLastUpdateUserId(loginUser.getId());
                param.setLastUpdateTime(new Date());
                resourceService.insert(param);
            } else {
                param.setCreateOrganId(loginUser.getOrganId());
                param.setLastUpdateUserId(loginUser.getId());
                resourceService.update(param);
            }
            rr.setData(param);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("保存点位资源出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="查看点位资源详情",  httpMethod ="POST")
    @RequestMapping("/get")
    @ResponseBody
    public ReturnResult get(Integer resourceId){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            ResourceInfoVo vo = resourceService.getDetailById(resourceId);
            rr.setData(vo);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("查看点位资源详情出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="删除点位资源",  httpMethod ="POST")
    @RequestMapping("/delete")
    @ResponseBody
    public ReturnResult delete(Integer resourceId){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            ResourceInfo vo = new ResourceInfo();
            vo.setId(resourceId);
            vo.setLastUpdateUserId(this.getLoginUser().getId());
            vo.setLastUpdateTime(new Date());
            vo.setActive(Constants.ACTIVE_FALSE);
            int result = resourceService.update(vo);
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("删除点位资源出错");
            ex.printStackTrace();
        }
        return rr;
    }

}
