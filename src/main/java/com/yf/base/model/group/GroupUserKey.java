package com.yf.base.model.group;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class GroupUserKey extends BaseModel {
    private Integer groupId;

    private Integer userId;

}