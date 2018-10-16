package com.yf.base.model.resource;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
public class ResourceArea extends BaseModel {
    private Integer id;

    private String name;

    private String type;

    private String linkMan;

    private String linkPhone;

    private String note;

    private Integer createUserId;

    private Integer createOrganId;

    private Date createTime;

    private Integer lastUpdateUserId;

    private Date lastUpdateTime;

    private Integer active;

}