package com.yf.base.model.device.vo;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

/**
 * 人员信息
 * 
 * @author Administrator
 * 
 */
@Setter
@Getter
public class GpsBean implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer gpsId;
	private Integer gpsTypeId;
	private String gpsNumber;
	private Integer orgId;
	private String gpsName;
	private String userNumber;
	private String typeName;
	private Integer policeId;
	private String policeName;
	private String policeNumber;
	private String policeMobile;
	private String iconUrl;
	private String iconUrlHigh;
	private String organName;

	private Date beginTime;
	private Date endTime;

	private Integer areaId;
	private String areaName;

}
