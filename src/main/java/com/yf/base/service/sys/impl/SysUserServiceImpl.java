package com.yf.base.service.sys.impl;

import com.yf.base.common.BaseDao;
import com.yf.base.common.BaseServiceImpl;
import com.yf.base.dao.sys.SysUserMapper;
import com.yf.base.dao.sys.SysUserRoleMapper;
import com.yf.base.dao.sys.vo.SysOrganVoMapper;
import com.yf.base.dao.sys.vo.SysRoleVoMapper;
import com.yf.base.dao.sys.vo.SysUserRoleVoMapper;
import com.yf.base.dao.sys.vo.SysUserVoMapper;
import com.yf.base.model.sys.SysUser;
import com.yf.base.model.sys.SysUserRoleKey;
import com.yf.base.model.sys.vo.SysRoleVo;
import com.yf.base.model.sys.vo.SysUserRoleKeyVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.sys.SysUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
@Transactional
public class SysUserServiceImpl extends BaseServiceImpl<SysUser,Integer> implements SysUserService {

    @Resource
    private SysUserMapper sysUserMapper;
    @Resource
    private SysUserVoMapper sysUserVoMapper;
    @Resource
    private SysOrganVoMapper sysOrganVoMapper;
    @Resource
    private SysUserRoleMapper sysUserRoleMapper;
    @Resource
    private SysUserRoleVoMapper sysUserRoleVoMapper;
    @Resource
    private SysRoleVoMapper sysRoleVoMapper;
    @Override
    public BaseDao<SysUser, Integer> getDao() {
        return sysUserMapper;
    }

    /**
     * 添加用户
     *
     * @param sysUserVo
     * @return
     */
    @Override
    public int addSysUserVo(SysUserVo sysUserVo) {
        int j= sysUserMapper.insert(sysUserVo);
        Integer [] uerId=sysUserVo.getUserRoleKeyId();
        for (int i = 0; i < uerId.length; i++) {
            SysUserRoleKey sysUserRoleKey=new SysUserRoleKey();
            sysUserRoleKey.setRoleId(uerId[i]);
            sysUserRoleKey.setUserId(sysUserVo.getId());
            sysUserRoleMapper.insert(sysUserRoleKey);
        }
        return j;
    }

    /**
     * 查询所有用户
     * @param SysUserVo
     * @return 用户对象集合
     */
    @Override
    public List<SysUserVo> selectListVo(SysUserVo SysUserVo) {
        return sysUserVoMapper.selectListVo(SysUserVo);
    }
    /**
     * 查询单个用户对象
     * @param SysUserVo
     * @return
     */
    @Override
    public SysUserVo getSysUserVo(SysUserVo SysUserVo) {
        SysUserVo uvo = sysUserVoMapper.getSysUserVo(SysUserVo);
        List<SysRoleVo> roleVoList=sysRoleVoMapper.selectRoleListByUserId(uvo.getId());
        uvo.setRoleVoList(roleVoList);
        if (uvo != null && uvo.getSysOrgan() != null) {
            uvo.setAuthDeptId(uvo.getSysOrgan().getId());
            uvo.setAuthDeptPath(uvo.getSysOrgan().getPath());
        }
        return uvo;
    }

    /**
     * 按机构ID查询用户个数
     *
     * @param sysUserVo
     * @return
     */
    @Override
    public int getUserListCount(SysUserVo sysUserVo) {
        return sysUserVoMapper.getUserListCount(sysUserVo);
    }

    /**
     * 修改用户
     *
     * @param sysUserVo
     */
    @Override
    public void editSysUserVo(SysUserVo sysUserVo) {
        sysUserMapper.updateByPrimaryKey(sysUserVo);

        sysUserRoleVoMapper.delByUserId(sysUserVo.getId());
        Integer [] uerId=sysUserVo.getUserRoleKeyId();
        for (int i = 0; i < uerId.length; i++) {
            SysUserRoleKey sysUserRoleKey=new SysUserRoleKey();
            sysUserRoleKey.setRoleId(uerId[i]);
            sysUserRoleKey.setUserId(sysUserVo.getId());
            sysUserRoleMapper.insert(sysUserRoleKey);
        }

    }

    /**
     * 修改密码
     *
     * @param userId
     * @param newPwd
     * @return
     */
    @Override
    public Integer editPwd(Integer userId, String newPwd) {
        SysUser user = sysUserMapper.selectByPrimaryKey(userId);
        user.setPassword(newPwd);
        Integer result = sysUserMapper.updateByPrimaryKeySelective(user);
        return result;
    }
}
