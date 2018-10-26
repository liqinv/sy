package com.yf.base.model.device;

import com.yf.base.common.BaseModel;
import lombok.Getter;
import lombok.Setter;

/*
 * 定位设备类型实体类
 */
@Setter
@Getter
public class GpsType  extends BaseModel {
	/*
	 * 主键值id
	 */
    private Integer id;
    /*
	 * 定位设备类型名称
	 */
    private String name;
    /*
	 * 平台标识
	 */
    private Boolean syncState;
    /*
	 * 平台id
	 */
    private Integer platformId;
    
    private int parentIconType;

    private int iconGroupId;
    
    private String nomalUrl;
    
    private String selectedUrl;
    
    private String intoEnclosureUrl;
    
	private String dispatchUrl;
    
    private String arriveUrl;


}