package com.yf.base.model.sys.vo;


import com.yf.base.common.Constants;
import com.yf.base.model.sys.SysOrgan;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class SysOrganVo extends SysOrgan {

    private String parentName;//上级机构名称
    private List<SysOrganVo> nodes;//下机机构信息
    private SysUserVo sysUserVo;
    private String paerantShortName;//上级机构简称
    private String text;
    public String getText() {
        return this.getName();
    }
    private String typeString;
    private Map<String,Object> state;
    public String  getTypeString() {
        return Constants.configMap.get(this.getType());
    }
    public Map getState() {
        Map<String,Object> map = new HashMap<>();
//        map.put("checked",true);
//        map.put("disabled",true);
        map.put("expanded",true);

        return map;
    }
}