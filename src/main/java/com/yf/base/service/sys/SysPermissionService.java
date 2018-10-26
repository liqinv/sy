package com.yf.base.service.sys;

import com.yf.base.common.BaseService;
import com.yf.base.model.sys.SysPermission;
import com.yf.base.model.sys.vo.SysPermissionVo;
import com.yf.base.model.sys.vo.SysUserVo;

import java.util.List;

public interface SysPermissionService extends BaseService<SysPermission,Integer> {

    /**
     * 新增权限
     * @param param
     * @return
     */
    Integer addPermission(SysPermission param, SysUserVo loginUser);

    /**
     * 删除权限，逻辑删除
     * @param permission 权限对象，如果有子级权限，则以树形结构包含在nodes属性中
     * @return
     */
    Integer deletePermission(SysPermissionVo permission, SysUserVo loginUser);

    /**
     * 查询列表
     * @param param
     * @return
     */
    List<SysPermissionVo> selectByParam(SysPermissionVo param);

    /**
     * 根据条件获取树形结构的权限列表
     * @param param
     * @return
     */
    List<SysPermissionVo> selectTreeSource(SysPermissionVo param);

    /**
     * 根据角色获取权限列表
     * @param roleId
     * @return
     */
    List<SysPermissionVo> selectListByRoleId(Integer roleId);

    /**
     * 获取所有权限列表，并根据角色权限设置选中
     * @param roleId
     * @return 返回树形结构集合
     */
    List<SysPermissionVo> selectAllTreeSourceSetRoleByRoleId(Integer roleId);

    /**
     * 获取角色拥有的权限列表
     * @param roleId
     * @return 返回树形结构集合
     */
    List<SysPermissionVo> selectTreeSourceByRoleId(Integer roleId);

    /**
     * 根据用户和资源类型获取树形结构的权限列表
     * @param userId
     * @param resourceType
     * @return
     */
    List<SysPermissionVo> selectTreeByUserAndType(Integer userId, Integer resourceType);

    /**
     * 获取ID
     * @param level
     * @return
     */
    Integer getNextIdByLevel(Integer level);
}
