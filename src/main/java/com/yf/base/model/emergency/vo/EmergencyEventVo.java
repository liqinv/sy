package com.yf.base.model.emergency.vo;

import com.yf.base.common.Constants;
import com.yf.base.model.emergency.EmergencyEvent;
import com.yf.base.model.sys.SysFile;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class EmergencyEventVo extends EmergencyEvent {

    private String categoryName;
    private String typeName;
    private String statusName;

    private List<EmergencyEventProcessVo> processVoList;

    private List<SysFile> fileList;


    public String getCategoryName() {
        return Constants.configMap.get(this.getCategory());
    }

    public String getTypeName() {
        return Constants.configMap.get(this.getType());
    }

    public String getStatusName() {
        return Constants.configMap.get(this.getStatus());
    }
}
