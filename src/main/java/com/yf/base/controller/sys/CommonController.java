package com.yf.base.controller.sys;

import com.yf.base.common.BaseController;
import com.yf.base.common.ReturnResult;
import com.yf.base.model.sys.vo.SysConfigVo;
import com.yf.base.service.sys.SysConfigService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Api(tags="公共接口模块")
@Controller
@RequestMapping("/common")
public class CommonController extends BaseController {
    @Autowired
    private SysConfigService configService;

    @ApiOperation(value="查询指定类型的一级配置列表",  httpMethod ="POST")
    @ResponseBody
    @RequestMapping("/configList")
    public ReturnResult configList(Integer type) {
        ReturnResult rr = ReturnResult.SUCCESS();
        List<SysConfigVo> list = configService.selectConfigList(type);
        rr.setData(list);
        return rr;
    }

    @ApiOperation(value="查询指定类型的二级配置列表",  httpMethod ="POST")
    @ResponseBody
    @RequestMapping("/configList2")
    public ReturnResult configList2(Integer type) {
        ReturnResult rr = ReturnResult.SUCCESS();
        List<SysConfigVo> list = configService.selectConfigList2(type);
        rr.setData(list);
        return rr;
    }
}
