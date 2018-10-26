package com.yf.base.controller.device;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yf.base.common.*;
import com.yf.base.model.device.Gps;
import com.yf.base.model.device.GpsType;
import com.yf.base.model.device.vo.GpsBean;
import com.yf.base.model.sys.SysOrgan;
import com.yf.base.model.sys.vo.SysOrganVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.device.GpsService;
import com.yf.base.service.sys.SysOrganService;
import com.yf.base.service.sys.SysUserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * GPS
 **/
@Api(tags = "定位设备管理模块")
@Controller
@RequestMapping("/device/gps")
public class GpsController extends BaseController {

    @Resource
    private GpsService gpsService;

    @Resource
    private SysOrganService sysOrganService;
    @Resource
    private SysUserService sysUserService;

    @ApiIgnore
    @RequestMapping("/list")
    public String list() {
        return "device/gpsList";
    }

    /**
     * 查询列表
     *
     * @param Gps
     * @return
     */
    @ApiOperation(value = "获取列表", httpMethod = "POST")
    @ResponseBody
    @RequestMapping("/selectGps")
    public ReturnResult selectOrgan(@RequestBody Gps Gps) {
        ReturnResult json = ReturnResult.SUCCESS();
        try {
            Gps = Gps != null ? Gps : new Gps();
            if (Gps.getPageNo() == null || Gps.getPageNo().intValue() < 1) {
                Gps.setPageNo(1);
            }
            PageHelper.startPage(Gps.getPageNo(), Gps.getPageSize());
            if (Gps.getSearchCondition() != null && Gps.getSearchCondition() != "") {
                String lowerCase = Gps.getSearchCondition().toLowerCase();
                Gps.setSearchCondition(lowerCase);
            }
            PageInfo<Gps> gpsVoList = gpsService.selectByPage(Gps);

            json.setData(gpsVoList);

        } catch (Exception e) {
            json = ReturnResult.FAILUER(Constants.QUERY_ERROR);
            e.printStackTrace();
        }
        return json;
    }

    /**
     * 添加新的设备
     *
     * @param Gps
     * @return
     */
    @ApiOperation(value = "添加设备", httpMethod = "POST")
    @ResponseBody
    @RequestMapping(value = "/add")
    public ReturnResult add(@RequestBody Gps Gps) {
        ReturnResult json = ReturnResult.SUCCESS();
        SysUserVo userVo = this.getLoginUser();
        Date date = new Date();
        try {
            if (gpsService.selectByName(Gps).size() != 0) {
                json.setDescription("此设备已存在");
                return json;
            }
            int number;
            number = gpsService.insert(Gps);
            if (number != 0) {
                json.setData(number);
            } else {
                json = ReturnResult.FAILUER(Constants.QUERY_ERROR);
            }
        } catch (Exception e) {
            json = ReturnResult.FAILUER(Constants.ADD_ERROR);
            e.printStackTrace();
        }
        return json;
    }

    /**
     * 按ID修改设备
     *
     * @param Gps
     * @return
     */
    @ApiOperation(value = "修改设备", httpMethod = "POST")
    @ResponseBody
    @RequestMapping("/edit")
    public ReturnResult edit(@RequestBody Gps Gps) {
        ReturnResult json = ReturnResult.SUCCESS();
        SysUserVo userVo = this.getLoginUser();
        try {
            if (gpsService.selectByName(Gps).size() > 0) {
                json.setDescription("此设备已存在");
                return json;
            }
            gpsService.update(Gps);
        } catch (Exception e) {
            json = ReturnResult.FAILUER(Constants.EDIT_ERROR);
            e.printStackTrace();
        }
        return json;
    }
    /**
     * 获取类型
     *
     * @return
     */
    @ApiOperation(value = "获取类型", httpMethod = "POST")
    @ResponseBody
    @RequestMapping("/getType")
    public ReturnResult getType() {
        ReturnResult json = ReturnResult.SUCCESS();
        try {
            List<GpsType> gts = gpsService.findGpsType(null);
            json.setData(gts);
        } catch (Exception e) {
            json = ReturnResult.FAILUER(Constants.EDIT_ERROR);
            e.printStackTrace();
        }
        return json;
    }
    /**
     * 按ID删除设备
     *
     * @param Gps
     * @return
     */
    @ApiOperation(value = "删除设备", httpMethod = "POST")
    @ResponseBody
    @RequestMapping("/delete")
    public ReturnResult delete(@RequestBody Gps Gps) {
        ReturnResult json = ReturnResult.SUCCESS();
        SysUserVo userVo = this.getLoginUser();
        try {
            gpsService.delete(Gps.getId());
        } catch (Exception e) {
            json = ReturnResult.FAILUER(Constants.EDIT_ERROR);
            e.printStackTrace();
        }
        return json;
    }


    /**
     * 删除时，查询机构数量和用户数量
     *
     * @param id
     * @return int
     */
    public int GetOrganLowerCount(int id) {
        SysOrgan sysOrgan = new SysOrgan();
        sysOrgan.setParentId(id);
        SysUserVo sysUserVo = new SysUserVo();
        sysUserVo.setOrganId(id);

        try {
            int organCount = sysOrganService.getOrganListCount(sysOrgan);
            int userCount = sysUserService.getUserListCount(sysUserVo);
            if (organCount > 0) {
                return 1;
            }
            if (userCount > 0) {
                return 2;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    /**
     * 按机构ID查询设备
     *
     * @param gpsId
     * @return
     */
    @ApiOperation(value = "ID查询设备", httpMethod = "POST")
    @ResponseBody
    @RequestMapping("/getGps")
    public ReturnResult getGps(Integer gpsId) {
        ReturnResult json = ReturnResult.SUCCESS();
        try {
            Gps gps = gpsService.getGpsById(gpsId);
            json.setData(gps);
        } catch (Exception e) {
            json = ReturnResult.FAILUER(Constants.QUERY_ERROR);
            e.printStackTrace();
        }
        return json;
    }

    /**
     * 获取所有模块信息，已构造成适应tendo的树的data
     *
     * @return
     */
    @ApiOperation(value = "获取机构树数据", httpMethod = "POST")
    @RequestMapping("/getOrganAll")
    @ResponseBody
    public ReturnResult getOrganAll() {
        ReturnResult result = ReturnResult.SUCCESS();
        try {
            Integer organId = 0;
            organId = this.getLoginUser().getAuthDeptId();

            List<SysOrganVo> moduleList = sysOrganService.selectTreeSource(organId);
            JSONArray resultObj = JSON.parseArray(JSON.toJSONString(moduleList));
            removeNodes(resultObj);
            result.setCode(MessageCode.STATUS_SUCESS);
            result.setData(resultObj);
            result.setDescription("查询成功");
        } catch (Exception ex) {
            ex.printStackTrace();
            result = ReturnResult.FAILUER(Constants.QUERY_ERROR);
        }
        return result;
    }

    private void removeNodes(JSONArray nodes) {
        if (nodes != null && nodes.size() > 0) {
            for (int i = 0; i < nodes.size(); i++) {
                JSONObject itemObj = nodes.getJSONObject(i);
                //机构树图标
                itemObj.put("icon","glyphicon glyphicon-object-align-left");
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
