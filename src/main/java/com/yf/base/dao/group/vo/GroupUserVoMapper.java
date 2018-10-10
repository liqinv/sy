package com.yf.base.dao.group.vo;

import com.yf.base.model.group.vo.GroupUserKeyVo;

import java.util.List;

public interface GroupUserVoMapper {

    List<GroupUserKeyVo> selectByGroupId(Integer groupId);
}
