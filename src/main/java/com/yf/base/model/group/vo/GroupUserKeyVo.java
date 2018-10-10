package com.yf.base.model.group.vo;

import com.yf.base.model.group.GroupUserKey;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class GroupUserKeyVo extends GroupUserKey {

    private String groupName;

    private String userName;

    private String userPhone;
}
