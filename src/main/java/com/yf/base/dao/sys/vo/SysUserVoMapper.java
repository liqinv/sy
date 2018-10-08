package com.yf.base.dao.sys.vo;

import com.yf.base.model.sys.vo.SysUserVo;

import java.util.List;

public interface SysUserVoMapper {
    /**
     * 查询单个用户对象
     * @param SysUserVo
     * @return
     */
    SysUserVo getSysUserVo(SysUserVo SysUserVo);
    /**
     * 查询所有用户
     * @param SysUserVo
     * @return 用户对象集合
     */
    List<SysUserVo> selectListVo(SysUserVo SysUserVo);
    /**
     * 按机构ID查询用户个数
     * @param SysUserVo
     * @return
     */
    int getUserListCount(SysUserVo SysUserVo);
    /**
     * 添加用户
     * @param SysUserVo
     * @return
     */
    int addSysUserVo(SysUserVo SysUserVo);
    /**
     * 修改用户
     * @param SysUserVo
     * @return
     */
    int editSysUserVo(SysUserVo SysUserVo);
}