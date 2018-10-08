package com.yf.base.model.sys;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
public class SysRole extends BaseModel {
    private Integer id;

    private String name;

    private String note;

    private Integer createUserId;

    private Integer createOrganId;

    private Date createTime;

    private Integer lastUpdateUserId;

    private Date lastUpdateTime;

    private Integer active;
}