package com.yf.base.dao.group.vo;

import com.yf.base.model.group.vo.GroupInfoVo;

import java.util.List;

public interface GroupInfoVoMapper {

    List<GroupInfoVo> selectByParam(GroupInfoVo vo);

    GroupInfoVo selectDetailById(Integer id);
}
