package com.yf.base.model.sys.vo;

import com.yf.base.model.sys.SysPermission;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;

import java.util.List;


public class SysPermissionVo extends SysPermission {

    //子权限
    @Setter
    @Getter
    private List<SysPermissionVo> nodes;

    private Integer nodeId;

    //是否选中，false未选中，true选中
    @Setter
    @Getter
    private Boolean check = false;

    //用于bootstrap-treeview显示节点文字
    private String text;

    //用于bootstrap-treeview是否可以选中，默认不可选
    @Setter
    @Getter
    private boolean selectable = false;

    //判断下级是菜单还是功能点,true菜单，false功能点
    @Getter
    @Setter
    private boolean childIsMenu = true;

    public String getText() {
        this.text = "";
        if (StringUtils.isNotBlank(this.getName())) {
            this.text = this.getName();
        }
        return this.text;
    }

    public Integer getNodeId() {
        this.nodeId = 0;
        if (this.getId() != null && this.getId().intValue() > 0) {
            this.nodeId = this.getId();
        }
        return nodeId;
    }
}