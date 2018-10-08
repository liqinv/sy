package com.yf.base.service.sys.impl;

import com.yf.base.common.BaseDao;
import com.yf.base.common.BaseServiceImpl;
import com.yf.base.dao.sys.SysPermissionMapper;
import com.yf.base.dao.sys.vo.SysPermissionVoMapper;
import com.yf.base.dao.sys.vo.SysRolePermissionVoMapper;
import com.yf.base.model.sys.SysPermission;
import com.yf.base.model.sys.vo.SysPermissionVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.sys.SysPermissionService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@Transactional
public class SysPermissionServiceImpl extends BaseServiceImpl<SysPermission, Integer> implements SysPermissionService {

    @Resource
    private SysPermissionMapper permissionMapper;
    @Resource
    private SysPermissionVoMapper permissionVoMapper;
    @Resource
    private SysRolePermissionVoMapper rolePermissionVoMapper;

    @Override
    public BaseDao<SysPermission, Integer> getDao() {
        return permissionMapper;
    }

    /**
     * 新增权限
     *
     * @param param
     * @return
     */
    @Override
    public Integer addPermission(SysPermission param, SysUserVo loginUser) {
        Integer result = 0;
        if (param == null || StringUtils.isBlank(param.getName() + param.getPermission() + param.getResourceUrl()) || param.getLevel() == null || param.getLevel().intValue() < 1) {
            return result;
        }
        Date nowDate = new Date();
        Integer id = this.getNextIdByLevel(param.getLevel());
        param.setId(id);
        String ownerPath = "/" + id;//本级path
        //设置path
        if (param.getLevel().intValue() == 1) {
            param.setParentId(0);
            param.setPath(ownerPath);
        } else {
            //如果存在父级，则使用父级拼接
            SysPermission parent = permissionMapper.selectByPrimaryKey(param.getParentId());
            if (parent != null && param.getId() != null && param.getId().intValue() > 0) {
                param.setPath(parent.getPath() + ownerPath);
            }
        }
        param.setCreateOrganId(loginUser.getOrganId());
        param.setActive(1);
        param.setCreateTime(nowDate);
        param.setCreateUserId(loginUser.getId());
        param.setLastUpdateTime(nowDate);
        param.setLastUpdateUserId(loginUser.getId());
        result = permissionMapper.insert(param);
        return result;
    }

    /**
     * 删除权限，逻辑删除
     *
     * @param permission 权限对象，如果有子级权限，则以树形结构包含在nodes属性中
     * @param loginUser
     * @return
     */
    @Override
    public Integer deletePermission(SysPermissionVo permission, SysUserVo loginUser) {
        Integer result = 0;
        if (permission == null || permission.getId() == null || permission.getId().intValue() < 1) {
            return result;
        }
        List<Integer> permissionIdList = new ArrayList<>();
        SysPermission model = permissionMapper.selectByPrimaryKey(permission.getId());
        Date nowDate = new Date();
        if (model != null && model.getId() > 0) {
            model.setLastUpdateUserId(loginUser.getId());
            model.setLastUpdateTime(nowDate);
            model.setActive(0);
            Integer delResult = permissionMapper.updateByPrimaryKey(model);
            if (delResult > 0) {
                permissionIdList.add(model.getId());
            }
            recursionDelete(permission.getNodes(),permissionIdList,nowDate,loginUser.getId());
        }
        //删除权限与角色关系,物理删除
        String permissionIds = StringUtils.join(permissionIdList,",");
        rolePermissionVoMapper.deleteByPermissionIdIn(permissionIds);
        return 1;
    }

    @Override
    public List<SysPermissionVo> selectByParam(SysPermissionVo param) {
        List<SysPermissionVo> result = permissionVoMapper.selectByParam(param);
        return result;
    }

    /**
     * 获取树形结构的权限列表
     *
     * @param param
     * @return
     */
    @Override
    public List<SysPermissionVo> selectTreeSource(SysPermissionVo param) {
        List<SysPermissionVo> allList = permissionVoMapper.selectByParam(param);
        //获取到第一级
        List<SysPermissionVo> firstLevelList = new ArrayList<>();
        for (SysPermissionVo item : allList) {
            if (item.getLevel().intValue() == 1) {
                firstLevelList.add(item);
                recursionPermission(item, allList);
            }
        }
        //维护childIsMenu树形
        for (SysPermissionVo item : firstLevelList) {
            if (item.getNodes() != null && item.getNodes().size() > 0) {
                SysPermissionVo childItem = item.getNodes().get(0);
                if (childItem != null && childItem.getResourceType() != null && childItem.getResourceType().intValue() == 1) {
                    item.setChildIsMenu(true);
                } else {
                    item.setChildIsMenu(false);
                }
            } else {
                item.setChildIsMenu(false);
            }
            recursionChildIsMenu(item);
        }

        return firstLevelList;
    }

    /**
     * 获取树形结构的权限列表
     *
     * @param roleId@return
     */
    @Override
    public List<SysPermissionVo> selectListByRoleId(Integer roleId) {
        return permissionVoMapper.selectPermissionListByRoleId(roleId);
    }

    /**
     * 获取所有权限列表，并根据角色权限设置选中
     *
     * @param roleId
     * @return 返回树形结构的数据
     */
    @Override
    public List<SysPermissionVo> selectAllTreeSourceSetRoleByRoleId(Integer roleId) {
        //所有权限
        List<SysPermissionVo> allList = permissionVoMapper.selectByParam(null);
        //角色权限
        List<SysPermissionVo> roleList = permissionVoMapper.selectPermissionListByRoleId(roleId);
        for (SysPermissionVo itemAll : allList) {
            for (SysPermissionVo itemRole : roleList) {
                if (itemRole.getId().intValue() == itemAll.getId().intValue()) {
                    itemAll.setCheck(true);
                }
            }
        }

        //获取到第一级
        List<SysPermissionVo> firstLevelList = new ArrayList<>();
        for (SysPermissionVo item : allList) {
            if (item.getLevel().intValue() == 1) {
                firstLevelList.add(item);
                recursionPermission(item, allList);
            }
        }

        return firstLevelList;
    }

    /**
     * 获取角色拥有的权限列表
     *
     * @param roleId
     * @return 返回树形结构集合
     */
    @Override
    public List<SysPermissionVo> selectTreeSourceByRoleId(Integer roleId) {
        List<SysPermissionVo> roleList = permissionVoMapper.selectPermissionListByRoleId(roleId);
        //获取到第一级
        List<SysPermissionVo> firstLevelList = new ArrayList<>();
        for (SysPermissionVo item : roleList) {
            if (item.getLevel().intValue() == 1) {
                firstLevelList.add(item);
                recursionPermission(item, roleList);
                if (item.getNodes() == null || item.getNodes().size() < 1) {

                }
            }
        }

        return firstLevelList;
    }

    /**
     * 根据用户和资源类型获取树形结构的权限列表
     *
     * @param userId
     * @param resourceType
     * @return
     */
    @Override
    public List<SysPermissionVo> selectTreeByUserAndType(Integer userId, Integer resourceType) {
        List<SysPermissionVo> allList = permissionVoMapper.selectPermissionByUserAndType(userId, resourceType);
        //获取到第一级
        List<SysPermissionVo> firstLevelList = new ArrayList<>();
        for (SysPermissionVo item : allList) {
            if (item.getLevel().intValue() == 1) {
                firstLevelList.add(item);
                recursionPermission(item, allList);
            }
        }

        return firstLevelList;
    }

    /**
     * 获取ID
     *
     * @param level
     * @return
     */
    @Override
    public Integer getNextIdByLevel(Integer level) {
        Integer nextId = 0;
        Integer maxId = permissionVoMapper.getMaxIdByLevel(level);
        if (maxId != null && maxId.intValue() > 0) {
            nextId = maxId.intValue() + 1;
        } else {
            nextId = level * 1000 + 1;
        }
        return nextId;
    }

    /**
     * 递归处理，用于生成树形结构数据
     *
     * @param parent  父级对象,此对象中需要nodes集合属性，用于存放子级
     * @param allList 数据源
     */
    private void recursionPermission(SysPermissionVo parent, List<SysPermissionVo> allList) {
        if (parent == null || parent.getId() == null || parent.getId().intValue() < 1) {
            return;
        }
        if (parent.getNodes() == null || parent.getNodes().size() < 1) {
            parent.setNodes(new ArrayList<>());
        }
        for (SysPermissionVo item : allList) {
            if (item.getParentId().intValue() == parent.getId().intValue()) {
                parent.getNodes().add(item);
                recursionPermission(item, allList);
            }
        }
    }

    /**
     * 递归处理，用于维护childIsMenu树形
     *
     * @param parent 父级对象
     */
    private void recursionChildIsMenu(SysPermissionVo parent) {
        if (parent == null || parent.getNodes() == null || parent.getNodes().size() < 1) {
            return;
        }
        for (SysPermissionVo item : parent.getNodes()) {
            if (item.getNodes() != null && item.getNodes().size() > 0) {
                SysPermissionVo childItem = item.getNodes().get(0);
                if (childItem != null && childItem.getResourceType() != null && childItem.getResourceType().intValue() == 1) {
                    item.setChildIsMenu(true);
                } else {
                    item.setChildIsMenu(false);
                }
            } else {
                item.setChildIsMenu(false);
            }
            recursionChildIsMenu(item);
        }
    }

    /**
     * 递归处理，用于删除树形结构的权限列表
     * @param permissionList
     * @param permissionIdList
     */
    private void recursionDelete(List<SysPermissionVo> permissionList, List<Integer> permissionIdList,Date nowDate,Integer loginUserId) {
        if (permissionList != null && permissionList.size() > 0) {
            for (SysPermissionVo item : permissionList) {
                SysPermission model = permissionMapper.selectByPrimaryKey(item.getId());
                if (model != null && model.getId() > 0) {
                    model.setLastUpdateUserId(loginUserId);
                    model.setLastUpdateTime(nowDate);
                    model.setActive(0);
                    Integer delResult = permissionMapper.updateByPrimaryKey(model);
                    if (delResult > 0) {
                        permissionIdList.add(model.getId());
                    }
                    recursionDelete(item.getNodes(),permissionIdList,nowDate,loginUserId);
                }
            }
        }
    }
}
