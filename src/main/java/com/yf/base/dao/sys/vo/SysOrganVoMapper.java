package com.yf.base.dao.sys.vo;

import com.yf.base.model.sys.SysOrgan;
import com.yf.base.model.sys.vo.SysOrganVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysOrganVoMapper {
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
    public Integer getOrganVoId(int level);

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
    SysOrganVo getOrganVoById(@Param("organVoId") Integer organVoId);
    /**
     * 获取最近路径的层级机构对象
     * @param sysOrganVo
     * @return
     */
    SysOrgan getOrganByPath(SysOrganVo sysOrganVo);

    /**
     * 查询当前级别最大ID
     * @param level
     * @return
     */
    Integer getOrganMaxCode(@Param("level") Integer level);
}