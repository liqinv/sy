package com.yf.base.model.device;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/*
 * 定位设备  实体类
 */
@Setter
@Getter
public class Gps  extends BaseModel {
	/*
	 * 主键值id
	 */
    private Integer id;
    /*
	 * 定位设备类型id
	 */
    private Integer typeId;

    /*
	 * 定位设备所属组织机构id
	 */
    private Integer orgId;
    /*
	 * 定位设备编号
	 */
    private String number;
    /*
	 * 定位设备名称
	 */
    private String gpsName;
    /*
	 * 平台标识
	 */
    private Boolean syncState;
    /*
	 *平台id 
	 */
    private Integer platformId;
    /*
	 * 对应图标地址
	 */
    private String iconUrl;

    private Integer iconId;

    /*
	 * 定位设备类型名称
	 */
    private String typeName;
}