package com.yf.base.model.sys;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
public class SysLog extends BaseModel {
    private Integer id;

    private Integer userId;

    private Integer organId;

    private String action;

    private Date oprerationTime;

    private String ipAddress;

    private String macAddress;

    private String note;
}