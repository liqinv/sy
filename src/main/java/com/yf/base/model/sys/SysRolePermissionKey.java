package com.yf.base.model.sys;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SysRolePermissionKey extends BaseModel {
    private Integer roleId;

    private Integer permissionId;
}