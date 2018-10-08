package com.yf.base.controller.sys;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yf.base.common.BaseController;
import com.yf.base.common.Constants;
import com.yf.base.common.ReturnResult;
import com.yf.base.model.sys.vo.SysLogVo;
import com.yf.base.model.sys.vo.SysRoleVo;
import com.yf.base.service.sys.SysLogService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.codehaus.plexus.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@Api(tags="日志管理模块")
@Controller
@RequestMapping("/sys/log")
public class LogController extends BaseController {
    @Autowired
    private SysLogService logService;
    @ApiIgnore
    @RequestMapping("/list")
    public String list() {
        return "sys/logList";
    }
    @ApiOperation(value="获取日志列表",  httpMethod ="POST")
    @RequestMapping("/selectLog")
    @ResponseBody
    public ReturnResult selectLog(@RequestBody SysLogVo sysLogVo){
        ReturnResult json = ReturnResult.SUCCESS();
        try {
            sysLogVo =  sysLogVo != null?sysLogVo:new SysLogVo();
            if(sysLogVo.getPageNo() == null || sysLogVo.getPageNo().intValue()<1){
                sysLogVo.setPageNo(1);
            }
            if(StringUtils.isNotBlank(sysLogVo.getSearchStartDate())) {
                sysLogVo.setSearchStartDate(sysLogVo.getSearchStartDate()+" 00:00:00");
            }
            if(StringUtils.isNotBlank(sysLogVo.getSearchEndDate())) {
                sysLogVo.setSearchEndDate(sysLogVo.getSearchEndDate()+" 23:59:59");
            }
            if (sysLogVo.getSearchCondition() != null && sysLogVo.getSearchCondition() != "") {
                String lowerCase = sysLogVo.getSearchCondition().toLowerCase();
                sysLogVo.setSearchCondition(lowerCase);
            }

            PageHelper.startPage(sysLogVo.getPageNo(), sysLogVo.getPageSize());
            List<SysLogVo> sysLogVoList = logService.selectLogList(sysLogVo);
            PageInfo<SysLogVo> pageInfo = new PageInfo<>(sysLogVoList);
            json.setData(pageInfo);
        }catch (Exception ex){
            json = ReturnResult.FAILUER(Constants.QUERY_ERROR);
            ex.printStackTrace();
        }
        return json;
    }
}
