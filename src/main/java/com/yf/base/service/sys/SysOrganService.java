package com.yf.base.service.sys;

import com.github.pagehelper.PageInfo;
import com.yf.base.common.BaseService;
import com.yf.base.model.sys.SysOrgan;
import com.yf.base.model.sys.vo.SysOrganVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysOrganService extends BaseService<SysOrgan,Integer> {
    /**
     * 查询机构信息集合
     * @param sysOrganVo
     * @return
     */
    List<SysOrganVo> selectSysOrganVoList(SysOrganVo sysOrganVo);
    /**
     * 查询当前级别最大ID
     * @param level  机构级别
     * @return
     */
    Integer getOrganMaxCode(int level);

    /**
     * 查询机构列表，分页
     * @param sysOrganVo
     * @return
     */
    PageInfo selectByPage(SysOrganVo sysOrganVo);

    /**
     * 添加机构
     * @param sysOrganVo
     * @return
     */
    int addSysOrganVo(SysOrganVo sysOrganVo);

    /**
     * 根据机构名称查询重复机构个数
     * @param sysOrgan
     * @return
     */
    int getSysOrganByNameCount(SysOrgan sysOrgan);
    /**
     * 查询机构总数
     * @param sysOrgan  机构对象
     * @return
     */
    int getOrganListCount(SysOrgan sysOrgan);

    /**
     * 查询单个机构信息
     * @param organVoId 机构ID
     * @return
     */
    SysOrganVo getOrganVoById(@Param("organVoId")Integer organVoId);
    /**
     * 获取Kendo树所需要的数据源，根据指定的机构节点开始显示
     * @param organId 指定的机构节点ID
     * @author YYQ
     * @return
     */
    List<SysOrganVo> selectTreeSource(Integer organId);

}
