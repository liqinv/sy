package com.yf.base.service.sys;

import com.yf.base.common.BaseService;
import com.yf.base.model.sys.SysUser;
import com.yf.base.model.sys.vo.SysUserVo;

import java.util.List;

public interface SysUserService extends BaseService<SysUser,Integer> {
    /**
     * 查询所有用户
     * @param SysUserVo
     * @return 用户对象集合
     */
    List<SysUserVo> selectListVo(SysUserVo SysUserVo);
    /**
     * 查询单个用户对象
     * @param SysUserVo
     * @return
     */
    SysUserVo getSysUserVo(SysUserVo SysUserVo);

    /**
     * 按机构ID查询用户个数
     * @param sysUserVo
     * @return
     */
    int getUserListCount(SysUserVo sysUserVo);
    /**
     * 添加用户
     * @param SysUserVo
     * @return
     */
    int addSysUserVo(SysUserVo SysUserVo);

    /**
     * 修改用户
     * @param sysUserVo
     */
    void editSysUserVo(SysUserVo sysUserVo);

    /**
     * 修改密码
     * @param userId
     * @param newPwd
     * @return
     */
    Integer editPwd(Integer userId, String newPwd);
}
