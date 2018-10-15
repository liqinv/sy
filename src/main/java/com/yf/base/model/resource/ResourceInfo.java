package com.yf.base.model.resource;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Setter
@Getter
public class ResourceInfo extends BaseModel {
    private Integer id;

    private String name;

    private String type;

    private String linkMan;

    private String linkPhone;

    private String locationX;

    private String locationY;

    private String address;

    private String note;

    private Integer createUserId;

    private Integer createOrganId;

    private Date createTime;

    private Integer lastUpdateUserId;

    private Date lastUpdateTime;

    private Integer active;

}