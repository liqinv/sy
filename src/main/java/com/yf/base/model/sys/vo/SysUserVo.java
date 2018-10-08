package com.yf.base.model.sys.vo;

import com.yf.base.common.Constants;
import com.yf.base.model.sys.SysConfig;
import com.yf.base.model.sys.SysOrgan;
import com.yf.base.model.sys.SysUser;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class SysUserVo extends SysUser {
    private static final long serialVersionUID = 1L;
    private SysOrgan sysOrgan;
    private List<SysRoleVo> roleVoList;
    private List<SysPermissionVo> permissionTree;
    private List<SysConfig> jobList;
    private List<SysConfig> typeList;
    private List<SysConfig> statusList;
    private String organName;
    private Integer organId;
    private Integer roleId;
    private String  jobName;
    private String typeName;
    private Integer [] userRoleKeyId;
    private String  roleName;//角色拼接字符串
    public String getJobName() {
        return Constants.configMap.get(this.getJob());
    }

    public String getTypeName() {
         return Constants.configMap.get(this.getType());
    }
}