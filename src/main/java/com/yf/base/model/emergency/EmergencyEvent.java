package com.yf.base.model.emergency;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Setter
@Getter
public class EmergencyEvent extends BaseModel {
    private Integer id;

    private String name;

    private String category;

    private String type;

    private String plan;

    private String reportName;

    private String reportPhone;

    private Date happenTime;

    private Date endTime;

    private Integer community;

    private Integer grid;

    private String address;

    private String longitude;

    private String latitude;

    private String level;

    private String status;

    private String content;

    private String note;

    private Integer createUserId;

    private Integer createOrganId;

    private Date createTime;

    private Integer lastUpdateUserId;

    private Date lastUpdateTime;

    private Integer active;

    private String code;


}