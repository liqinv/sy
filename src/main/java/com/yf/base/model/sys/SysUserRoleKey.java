package com.yf.base.model.sys;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SysUserRoleKey extends BaseModel {
    private Integer userId;

    private Integer roleId;
}