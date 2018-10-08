package com.yf.base.service.group;

import com.yf.base.common.BaseService;
import com.yf.base.model.group.GroupInfo;
import com.yf.base.model.group.vo.GroupInfoVo;

import java.util.List;

public interface GroupInfoService extends BaseService<GroupInfo,Integer> {

    List<GroupInfoVo> selectByParam(GroupInfoVo vo);

    void addGroup(GroupInfoVo vo);

    void editGroup(GroupInfoVo vo);

    GroupInfoVo selectDetailById(Integer id);
}
