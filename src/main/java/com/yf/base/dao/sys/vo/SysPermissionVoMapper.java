package com.yf.base.dao.sys.vo;

import com.yf.base.common.BaseDao;
import com.yf.base.model.sys.SysPermission;
import com.yf.base.model.sys.vo.SysPermissionVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysPermissionVoMapper extends BaseDao<SysPermission,Integer> {

    /**
     * 查询列表
     * @param param
     * @return
     */
    List<SysPermissionVo> selectByParam(SysPermissionVo param);

    /**
     * 获取用户拥有的权限
     * @param userId 用户ID
     * @return
     */
    List<SysPermissionVo> selectPermissionByUserAndType(@Param("userId") Integer userId,@Param("resourceType") Integer resourceType);

    /**
     * 获取树形结构的权限列表
     * @param roleId
     * @return
     */
    List<SysPermissionVo> selectPermissionListByRoleId(@Param("roleId")Integer roleId);

    /**
     * 获取同层级最大ID
     * @param level
     * @return
     */
    Integer getMaxIdByLevel(@Param("level")Integer level);
}