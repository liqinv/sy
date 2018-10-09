package com.yf.base.model.emergency;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Setter
@Getter
public class EmergencyEventProcess {
    private Integer id;

    private String node;

    private Integer userId;

    private Integer organId;

    private Date createTime;

    private String note;

    private String sms;

    private Integer eventId;


}