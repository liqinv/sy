package com.yf.base.controller.sys;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yf.base.common.*;
import com.yf.base.model.sys.SysOrgan;
import com.yf.base.model.sys.vo.SysOrganVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.sys.SysOrganService;
import com.yf.base.service.sys.SysUserService;
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

/**
 * 机构
 **/
@Api(tags = "机构管理模块")
@Controller
@RequestMapping("/sys/organ")
public class OrganController extends BaseController {
    @Resource
    private SysOrganService sysOrganService;
    @Resource
    private SysUserService sysUserService;

    @ApiIgnore
    @RequestMapping("/list")
    public String list() {
        return "sys/organList";
    }

    /**
     * 查询机构列表
     *
     * @param sysOrganVo
     * @return
     */
    @ApiOperation(value = "获取机构列表", httpMethod = "POST")
    @ResponseBody
    @RequestMapping("/selectOrgan")
    public ReturnResult selectOrgan(@RequestBody SysOrganVo sysOrganVo) {
        ReturnResult json = ReturnResult.SUCCESS();
        try {
            sysOrganVo = sysOrganVo != null ? sysOrganVo : new SysOrganVo();
            if (sysOrganVo.getPageNo() == null || sysOrganVo.getPageNo().intValue() < 1) {
                sysOrganVo.setPageNo(1);
            }
            PageHelper.startPage(sysOrganVo.getPageNo(), sysOrganVo.getPageSize());
            if (sysOrganVo.getSearchCondition() != null && sysOrganVo.getSearchCondition() != "") {
                String lowerCase = sysOrganVo.getSearchCondition().toLowerCase();
                sysOrganVo.setSearchCondition(lowerCase);
            }
            PageInfo<SysOrganVo> sysOrganVoList = sysOrganService.selectByPage(sysOrganVo);

            json.setData(sysOrganVoList);

        } catch (Exception e) {
            json = ReturnResult.FAILUER(Constants.QUERY_ERROR);
            e.printStackTrace();
        }
        return json;
    }

    /**
     * 添加新的机构
     *
     * @param sysOrganVo
     * @return
     */
    @ApiOperation(value = "添加机构", httpMethod = "POST")
    @ResponseBody
    @RequestMapping(value = "/add")
    public ReturnResult add(@RequestBody SysOrganVo sysOrganVo) {
        ReturnResult json = ReturnResult.SUCCESS();
        SysUserVo userVo = this.getLoginUser();
        Date date = new Date();
        sysOrganVo.setCreateTime(date);
        sysOrganVo.setLastUpdateTime(date);
        sysOrganVo.setLastUpdateUserId(userVo.getId());
        sysOrganVo.setCreateUserId(userVo.getId());
        sysOrganVo.setCreateOrganId(userVo.getOrganId());
        sysOrganVo.setActive(1);
        try {
            if (sysOrganService.getSysOrganByNameCount(sysOrganVo) != 0) {
                json.setCode(MessageCode.STATUS_FAIL);
                json.setDescription("此机构已存在");
                return json;
            }
            int number;
            sysOrganVo.setSpell(PinYin2Abbreviation.cn2py(sysOrganVo.getName()));
            sysOrganVo.setShortSpell(PinYin2Abbreviation.cn2py(sysOrganVo.getShortName()));
            number = sysOrganService.addSysOrganVo(sysOrganVo);
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
     * 按ID修改机构
     *
     * @param sysOrgan
     * @return
     */
    @ApiOperation(value = "修改机构", httpMethod = "POST")
    @ResponseBody
    @RequestMapping("/edit")
    public ReturnResult edit(@RequestBody SysOrgan sysOrgan) {
        ReturnResult json = ReturnResult.SUCCESS();
        SysUserVo userVo = this.getLoginUser();
        sysOrgan.setLastUpdateUserId(userVo.getId());
        Date date = new Date();
        sysOrgan.setLastUpdateTime(date);
        try {
            if (sysOrganService.getSysOrganByNameCount(sysOrgan) > 0) {
                json.setCode(MessageCode.STATUS_FAIL);
                json.setDescription("此机构已存在");
                return json;
            }
            sysOrgan.setSpell(PinYin2Abbreviation.cn2py(sysOrgan.getName()));
            sysOrgan.setShortSpell(PinYin2Abbreviation.cn2py(sysOrgan.getShortName()));
            sysOrganService.update(sysOrgan);
        } catch (Exception e) {
            json = ReturnResult.FAILUER(Constants.EDIT_ERROR);
            e.printStackTrace();
        }
        return json;
    }

    /**
     * 按ID删除机构
     *
     * @param sysOrgan
     * @return
     */
    @ApiOperation(value = "删除机构", httpMethod = "POST")
    @ResponseBody
    @RequestMapping("/delete")
    public ReturnResult delete(@RequestBody SysOrgan sysOrgan) {
        ReturnResult json = ReturnResult.SUCCESS();
        SysOrgan sysOrganDel = new SysOrgan();
        SysUserVo userVo = this.getLoginUser();
        sysOrganDel.setLastUpdateUserId(userVo.getId());
        Date date = new Date();
        sysOrganDel.setLastUpdateTime(date);
        sysOrganDel.setId(sysOrgan.getId());
        sysOrganDel.setActive(0);
        try {

            int i = GetOrganLowerCount(sysOrgan.getId());
            if (i == 1) {
                json.setCode(MessageCode.STATUS_FAIL);
                json.setDescription("有下机机构存在，无法删除");
                return json;
            } else if (i == 2) {
                json.setCode(MessageCode.STATUS_FAIL);
                json.setDescription("机构下有用户，无法删除");
                return json;
            }
            sysOrganService.update(sysOrganDel);
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
     * 按机构ID查询机构
     *
     * @param organVoId
     * @return
     */
    @ApiOperation(value = "ID查询机构", httpMethod = "POST")
    @ResponseBody
    @RequestMapping("/getOrgan")
    public ReturnResult getOrgan(Integer organVoId) {
        ReturnResult json = ReturnResult.SUCCESS();
        try {
            SysOrganVo organVo = sysOrganService.getOrganVoById(organVoId);
            json.setData(organVo);
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
