package com.yf.base.model.emergency;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Setter
@Getter
public class EmergencyEventProcess extends BaseModel {
    private Integer id;

    private String node;

    private Integer userId;

    private Integer organId;

    private Date createTime;

    private String note;

    private String sms;


}