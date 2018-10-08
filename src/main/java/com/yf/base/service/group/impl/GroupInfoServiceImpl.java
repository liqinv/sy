package com.yf.base.service.group.impl;

import com.yf.base.common.BaseDao;
import com.yf.base.common.BaseServiceImpl;
import com.yf.base.dao.group.GroupInfoMapper;
import com.yf.base.dao.group.GroupUserMapper;
import com.yf.base.dao.group.vo.GroupInfoVoMapper;
import com.yf.base.model.group.GroupInfo;
import com.yf.base.model.group.GroupUserKey;
import com.yf.base.model.group.vo.GroupInfoVo;
import com.yf.base.service.group.GroupInfoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
@Transactional
public class GroupInfoServiceImpl extends BaseServiceImpl<GroupInfo,Integer> implements GroupInfoService {
    @Resource
    private GroupInfoMapper groupInfoMapper;
    @Resource
    private GroupInfoVoMapper groupInfoVoMapper;
    @Resource
    private GroupUserMapper groupUserMapper;
    /**
     * 定义成抽象方法,由子类实现,完成dao的注入
     *
     * @return GenericDao实现类
     */
    @Override
    public BaseDao<GroupInfo, Integer> getDao() {
        return groupInfoMapper;
    }

    @Override
    public List<GroupInfoVo> selectByParam(GroupInfoVo vo) {
        return groupInfoVoMapper.selectByParam(vo);
    }

    @Override
    public void addGroup(GroupInfoVo vo) {
        this.insert(vo);
        String userIds = vo.getSelectedUserIds();
        String[] userIdArr = userIds.split(",");
        for(String idStr : userIdArr) {
            GroupUserKey gu = new GroupUserKey();
            gu.setGroupId(vo.getId());
            gu.setUserId(Integer.valueOf(idStr));
            groupUserMapper.insert(gu);
        }
    }

    @Override
    public void editGroup(GroupInfoVo vo) {
        this.update(vo);
        groupUserMapper.deleteByGroupId(vo.getId());
        String userIds = vo.getSelectedUserIds();
        String[] userIdArr = userIds.split(",");
        for(String idStr : userIdArr) {
            GroupUserKey gu = new GroupUserKey();
            gu.setGroupId(vo.getId());
            gu.setUserId(Integer.valueOf(idStr));
            groupUserMapper.insert(gu);
        }
    }

    @Override
    public GroupInfoVo selectDetailById(Integer id) {
        return groupInfoVoMapper.selectDetailById(id);
    }
}
