package com.yf.base.dao.sys.vo;

import com.yf.base.common.BaseDao;
import com.yf.base.model.sys.SysRolePermissionKey;
import org.apache.ibatis.annotations.Param;

public interface SysRolePermissionVoMapper extends BaseDao<SysRolePermissionKey,SysRolePermissionKey> {

    /**
     * 删除对应角色的权限
     * @param roleId
     * @return
     */
    Integer deleteByRoleId(@Param("roleId") Integer roleId);

    /**
     * 删除角色权限关系，根据权限ID
     * @param permissionIds 权限id字符串，多个用英文逗号","隔开
     * @return
     */
    Integer deleteByPermissionIdIn(@Param("permissionIds") String permissionIds);
}