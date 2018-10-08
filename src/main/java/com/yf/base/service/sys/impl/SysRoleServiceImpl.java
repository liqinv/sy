package com.yf.base.service.sys.impl;

import com.yf.base.common.BaseDao;
import com.yf.base.common.BaseServiceImpl;
import com.yf.base.dao.sys.SysRoleMapper;
import com.yf.base.dao.sys.SysRolePermissionMapper;
import com.yf.base.dao.sys.vo.SysRolePermissionVoMapper;
import com.yf.base.dao.sys.vo.SysRoleVoMapper;
import com.yf.base.dao.sys.vo.SysUserRoleVoMapper;
import com.yf.base.model.sys.SysRole;
import com.yf.base.model.sys.SysRolePermissionKey;
import com.yf.base.model.sys.vo.SysPermissionVo;
import com.yf.base.model.sys.vo.SysRoleVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.sys.SysRoleService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SysRoleServiceImpl extends BaseServiceImpl<SysRole, Integer> implements SysRoleService {

    @Resource
    private SysRoleMapper roleMapper;
    @Resource
    private SysRoleVoMapper roleVoMapper;
    @Resource
    private SysRolePermissionVoMapper rolePermissionVoMapper;
    @Resource
    private SysRolePermissionMapper rolePermissionMapper;
    @Resource
    private SysUserRoleVoMapper userRoleVoMapper;


    @Override
    public BaseDao<SysRole, Integer> getDao() {
        return roleMapper;
    }

    @Override
    public List<SysRoleVo> selectByParam(SysRoleVo param) {
        return roleVoMapper.selectByParam(param);
    }

    /**
     * 删除对应角色的权限
     *
     * @param roleId
     * @return
     */
    @Override
    public Integer deletePermissionByRoleId(Integer roleId) {
        if (roleId == null || roleId.intValue() < 1) {
            return 0;
        }
        return rolePermissionVoMapper.deleteByRoleId(roleId);
    }

    /**
     * 给指定角色添加权限
     *
     * @param permissionIdList 权限ID集合
     * @param roleId           角色ID
     * @return
     */
    @Override
    public Integer addRolePermission(List<Integer> permissionIdList, Integer roleId) {
        if (permissionIdList == null || permissionIdList.size() < 1 || roleId == null || roleId.intValue() < 1) {
            return 0;
        }
        //获取角色
        SysRole role = roleMapper.selectByPrimaryKey(roleId);
        if (role == null || role.getId() == null || role.getId().intValue() < 1) {
            return 0;
        }
        //先删除原有权限
        this.deletePermissionByRoleId(roleId);

        //重新添加权限
        for (Integer itemId : permissionIdList) {
            SysRolePermissionKey rp = new SysRolePermissionKey();
            rp.setPermissionId(itemId);
            rp.setRoleId(roleId);
            rolePermissionMapper.insert(rp);
        }

        return 1;
    }

    /**
     * 获取角色列表，根据用户ID
     *
     * @param userId 角色ID
     * @return
     */
    @Override
    public List<SysRoleVo> selectRoleListByUserId(Integer userId) {
        return roleVoMapper.selectRoleListByUserId(userId);
    }

    /**
     * 新增
     *
     * @param param
     * @param loginUser
     * @return
     */
    @Override
    public Integer add(SysRole param, SysUserVo loginUser) {
        Integer result = 0;
        if (param == null || StringUtils.isBlank(param.getName()) || loginUser == null || loginUser.getId() < 1) {
            return result;
        }
        SysRoleVo nParam = new SysRoleVo();
        nParam.setName(param.getName());
        List<SysRoleVo> nameList = roleVoMapper.selectByParam(nParam);
        if (nameList != null && nameList.size() > 0) {
            return 2;
        }
        Date nowDate = new Date();
        param.setActive(1);
        param.setCreateOrganId(loginUser.getOrganId());
        param.setCreateTime(nowDate);
        param.setCreateUserId(loginUser.getId());
        param.setLastUpdateTime(nowDate);
        param.setLastUpdateUserId(loginUser.getId());
        result = roleMapper.insert(param);
        return result;
    }

    /**
     * 修改
     *
     * @param param
     * @param loginUser
     * @return
     */
    @Override
    public Integer edit(SysRole param, SysUserVo loginUser) {
        Integer result = 0;
        if (param == null || StringUtils.isBlank(param.getName()) || param.getId() < 1 || loginUser == null || loginUser.getId() < 1) {
            return result;
        }
        SysRoleVo nParam = new SysRoleVo();
        nParam.setName(param.getName());
        List<SysRoleVo> nameList = roleVoMapper.selectByParam(nParam);
        Optional<SysRoleVo> opExistVo = nameList.stream().filter(a -> a.getName().equals(param.getName()) && a.getId().intValue() != param.getId().intValue()).findFirst();
        if (opExistVo.isPresent()) {
            return 2;
        }
        param.setLastUpdateTime(new Date());
        param.setLastUpdateUserId(loginUser.getId());
        result = roleMapper.updateByPrimaryKey(param);
        return result;
    }

    /**
     * 删除,逻辑删除
     *
     * @param roleId
     * @param loginUser
     * @return 0删除失败；1删除成功，2此角色已被占用，删除失败
     */
    @Override
    public Integer delete(Integer roleId, SysUserVo loginUser) {
        Integer result = 0;
        if (roleId == null || roleId.intValue() < 1 || loginUser == null || loginUser.getId() < 1) {
            return result;
        }
        //判断此角色是否被使用
        Integer useCount = userRoleVoMapper.getUserRoleCountByRoleId(roleId);
        if (useCount != null && useCount.intValue() > 0) {
            return 2;
        }
        SysRole model = roleMapper.selectByPrimaryKey(roleId);
        if (model == null) {
            //不存在，也可以认为删除成功
            return 1;
        }
        model.setActive(0);
        model.setLastUpdateUserId(loginUser.getId());
        model.setLastUpdateTime(new Date());
        result = roleMapper.updateByPrimaryKey(model);
        return result;
    }

    /**
     * 获取用户角色记录数，根据角色ID
     *
     * @param roleId 角色ID
     * @return
     */
    @Override
    public Integer getUserRoleCountByRoleId(Integer roleId) {
        if (roleId == null) {
            return null;
        }
        return userRoleVoMapper.getUserRoleCountByRoleId(roleId);
    }

    /**
     * 给指定角色添加权限
     *
     * @param permissionTreeList 权限列表，此列表是树形结构
     * @param roleId             角色ID
     * @return 0失败，大于0成功
     */
    @Override
    public Integer setRolePermission(List<SysPermissionVo> permissionTreeList, Integer roleId) {
        Integer result = 0;
        if (permissionTreeList == null || permissionTreeList.size() < 1 || roleId == null || roleId.intValue() < 1) {
            return result;
        }
        //获取选中的权限ID
        List<Integer> permissionIdList = new ArrayList<>();
        for (SysPermissionVo item : permissionTreeList) {
            if (item.getCheck()) {
                permissionIdList.add(item.getId());
            }
            recursionGetPermission(item.getNodes(), permissionIdList);
        }
        //将选中的权限添加到角色中
        result = this.addRolePermission(permissionIdList, roleId);
        return result;
    }

    /**
     * 递归方式获取已经选中的权限
     *
     * @param childList
     * @param permissionIdList
     */
    private void recursionGetPermission(List<SysPermissionVo> childList, List<Integer> permissionIdList) {
        for (SysPermissionVo item : childList) {
            if (item.getCheck()) {
                if (!permissionIdList.contains(item.getId())) {
                    permissionIdList.add(item.getId());
                }
            }
            recursionGetPermission(item.getNodes(), permissionIdList);
        }
    }
}
