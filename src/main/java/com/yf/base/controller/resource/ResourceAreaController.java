package com.yf.base.controller.resource;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yf.base.common.BaseController;
import com.yf.base.common.Constants;
import com.yf.base.common.ReturnResult;
import com.yf.base.model.resource.ResourceArea;
import com.yf.base.model.resource.vo.ResourceAreaVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.resource.ResourceAreaService;
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

@Api(tags = "区域资源模块")
@Controller
@RequestMapping("/resource/area/")
public class ResourceAreaController extends BaseController {
    @Resource
    private ResourceAreaService areaService;

    @ApiIgnore
    @RequestMapping("/main")
    public String main (){
        return "resource/areaList";
    }

    @ApiOperation(value="获取区域资源列表",  httpMethod ="POST")
    @RequestMapping("/list")
    @ResponseBody
    public ReturnResult list(@RequestBody ResourceAreaVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            param =  param != null?param:new ResourceAreaVo();
            if(param.getPageNo() == null || param.getPageNo().intValue()<1){
                param.setPageNo(1);
            }
            PageHelper.startPage(param.getPageNo(), param.getPageSize());
            List<ResourceAreaVo> result = areaService.selectByParam(param);
            PageInfo<ResourceAreaVo> pageInfo = new PageInfo<>(result);
            rr.setData(pageInfo);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("区域资源列表查询出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="保存区域资源",  httpMethod ="POST")
    @RequestMapping("/save")
    @ResponseBody
    public ReturnResult save(@RequestBody ResourceAreaVo param){
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
                areaService.insert(param);
            } else {
                param.setCreateOrganId(loginUser.getOrganId());
                param.setLastUpdateUserId(loginUser.getId());
                areaService.update(param);
            }
            rr.setData(param);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("保存区域资源出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="查看区域资源详情",  httpMethod ="POST")
    @RequestMapping("/get")
    @ResponseBody
    public ReturnResult get(Integer areaId){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            ResourceAreaVo vo = areaService.getDetailById(areaId);
            rr.setData(vo);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("查看区域资源详情出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="删除区域资源",  httpMethod ="POST")
    @RequestMapping("/delete")
    @ResponseBody
    public ReturnResult delete(Integer areaId){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            ResourceArea vo = new ResourceArea();
            vo.setId(areaId);
            vo.setLastUpdateUserId(this.getLoginUser().getId());
            vo.setLastUpdateTime(new Date());
            vo.setActive(Constants.ACTIVE_FALSE);
            int result = areaService.update(vo);
            rr.setData(result);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("删除区域资源出错");
            ex.printStackTrace();
        }
        return rr;
    }
}
