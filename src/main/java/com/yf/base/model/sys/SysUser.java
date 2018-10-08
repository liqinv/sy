package com.yf.base.model.sys;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
public class SysUser extends BaseModel {
    private Integer id;

    private String name;

    private String account;

    private String password;

    private String salt;

    private String phone;

    private String email;

    private Integer organId;

    private String spell;

    private String job;

    private String type;

    private String status;

    private String note;

    private Integer createUserId;

    private Integer createOrganId;

    private Date createTime;

    private Integer lastUpdateUserId;

    private Date lastUpdateTime;

    private Integer active;
}