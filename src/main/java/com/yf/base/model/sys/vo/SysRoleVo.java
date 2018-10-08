package com.yf.base.model.sys.vo;

import com.yf.base.model.sys.SysRole;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class SysRoleVo extends SysRole {
    private List<SysPermissionVo> permissionVoList;

    private String createUserName;
}