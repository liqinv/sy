package com.yf.base.model.group.vo;

import com.yf.base.model.group.GroupInfo;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class GroupInfoVo extends GroupInfo {

    private String createUserName;

    private String selectedUserIds;

    private String selectedUserNames;

}
