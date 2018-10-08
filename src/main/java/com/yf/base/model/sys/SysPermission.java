package com.yf.base.model.sys;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
public class SysPermission extends BaseModel {
    private Integer id;

    private String name;

    private Integer parentId;

    private String path;

    private Integer level;

    private Integer leaf;

    private String icon;

    private Integer sort;

    private String note;

    private String permission;

    private Integer resourceType;

    private String resourceUrl;

    private Integer createUserId;

    private Integer createOrganId;

    private Date createTime;

    private Integer lastUpdateUserId;

    private Date lastUpdateTime;

    private Integer active;


}