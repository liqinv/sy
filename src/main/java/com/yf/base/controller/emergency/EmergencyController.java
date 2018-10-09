package com.yf.base.controller.emergency;

import com.yf.base.common.BaseController;
import com.yf.base.common.Constants;
import com.yf.base.common.ReturnResult;
import com.yf.base.model.emergency.vo.EmergencyEventProcessVo;
import com.yf.base.model.emergency.vo.EmergencyEventVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.emergency.EmergencyService;
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

@Api(tags = "应急指挥模块")
@Controller
@RequestMapping("/emergency")
public class EmergencyController extends BaseController {
    @Resource
    private EmergencyService emergencyService;

    @ApiIgnore
    @RequestMapping("/main")
    public String main (){
        return "emergency/main";
    }

    @ApiOperation(value="保存事件",  httpMethod ="POST")
    @RequestMapping("/save")
    @ResponseBody
    public ReturnResult save(@RequestBody EmergencyEventVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {

            SysUserVo loginUser = this.getLoginUser();
            if (param.getId() == null) {
                param.setStatus("BA005");
                param.setActive(Constants.ACTIVE_TRUE);
                param.setCreateUserId(loginUser.getId());
                param.setCreateTime(new Date());
                param.setCreateOrganId(loginUser.getOrganId());
                param.setLastUpdateUserId(loginUser.getId());
                param.setLastUpdateTime(new Date());
                emergencyService.insert(param);
            } else {
                param.setCreateOrganId(loginUser.getOrganId());
                param.setLastUpdateUserId(loginUser.getId());
                emergencyService.update(param);
            }
            rr.setData(param);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("保存事件出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="查询事件",  httpMethod ="POST")
    @RequestMapping("/list")
    @ResponseBody
    public ReturnResult list(@RequestBody EmergencyEventVo param){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            List<EmergencyEventVo> list = emergencyService.selectByParam(param);
            rr.setData(list);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("查询事件出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="查看事件详情",  httpMethod ="POST")
    @RequestMapping("/get")
    @ResponseBody
    public ReturnResult get(Integer eventId){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            EmergencyEventVo vo = emergencyService.getDetailById(eventId);
            rr.setData(vo);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("查看事件详情出错");
            ex.printStackTrace();
        }
        return rr;
    }

    @ApiOperation(value="事件流程",  httpMethod ="POST")
    @RequestMapping("/addProcess")
    @ResponseBody
    public ReturnResult addProcess(@RequestBody EmergencyEventProcessVo processVo){
        ReturnResult rr = ReturnResult.SUCCESS();
        try {
            SysUserVo loginUser = this.getLoginUser();
            emergencyService.addProcess(processVo, loginUser);

            EmergencyEventVo vo = emergencyService.getDetailById(processVo.getEventId());
            rr.setData(vo);
        }catch (Exception ex){
            rr = ReturnResult.FAILUER("事件流程出错");
            ex.printStackTrace();
        }
        return rr;
    }
}
