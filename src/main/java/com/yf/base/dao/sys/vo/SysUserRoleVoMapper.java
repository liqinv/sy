package com.yf.base.dao.sys.vo;

import com.yf.base.model.sys.SysUserRoleKey;
import com.yf.base.model.sys.vo.SysUserRoleKeyVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysUserRoleVoMapper {

    /**
     * 获取记录数，根据角色Id
     * @param roleId
     * @return
     */
    Integer getUserRoleCountByRoleId(@Param("roleId") Integer roleId);

    /**
     * 修改用户角色
     * @param sysUserRoleKey
     */
    void editUserRole(SysUserRoleKey sysUserRoleKey);

    /**
     * 按用户ID删除用户和角色关联信息
     * @param userId
     * @return
     */
    int delByUserId(@Param("userId") Integer userId);
}