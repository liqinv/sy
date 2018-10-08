package com.yf.base.service.sys;

import com.yf.base.common.BaseService;
import com.yf.base.model.sys.SysRole;
import com.yf.base.model.sys.vo.SysPermissionVo;
import com.yf.base.model.sys.vo.SysRoleVo;
import com.yf.base.model.sys.vo.SysUserVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysRoleService extends BaseService<SysRole,Integer> {
    /**
     * 查询角色列表
     * @param param
     * @return
     */
    List<SysRoleVo> selectByParam(SysRoleVo param);

    /**
     * 删除对应角色的权限
     * @param roleId
     * @return
     */
    Integer deletePermissionByRoleId(@Param("roleId") Integer roleId);

    /**
     * 给指定角色添加权限
     * @param permissionIdList 权限ID字符串，多个用英文逗号“,”隔开
     * @param roleId 角色ID
     * @return
     */
    Integer addRolePermission(List<Integer> permissionIdList,Integer roleId);

    /**
     * 获取角色列表，根据用户ID
     * @param userId 角色ID
     * @return
     */
    List<SysRoleVo> selectRoleListByUserId(Integer userId);

    /**
     * 新增
     * @param param
     * @return 0失败，1成功，2角色名已存在
     */
    Integer add(SysRole param, SysUserVo loginUser);

    /**
     * 修改
     * @param param
     * @return 0失败，1成功，2角色名已存在
     */
    Integer edit(SysRole param, SysUserVo loginUser);

    /**
     * 删除,逻辑删除
     * @param roleId
     * @param loginUser
     * @return
     */
    Integer delete(Integer roleId,SysUserVo loginUser);

    /**
     * 获取用户角色记录数，根据角色ID
     * @param roleId 角色ID
     * @return
     */
    Integer getUserRoleCountByRoleId(Integer roleId);

    /**
     * 给指定角色添加权限
     * @param permissionTreeList 权限列表，此列表是树形结构
     * @param roleId 角色ID
     * @return 0失败，大于0成功
     */
    Integer setRolePermission(List<SysPermissionVo> permissionTreeList, Integer roleId);
}
