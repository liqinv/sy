package com.yf.base.dao.group;

import com.yf.base.common.BaseDao;
import com.yf.base.model.group.GroupUserKey;

public interface GroupUserMapper extends BaseDao<GroupUserKey,GroupUserKey> {
    void deleteByGroupId(Integer groupId);
}