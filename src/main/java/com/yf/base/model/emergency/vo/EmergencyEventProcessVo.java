package com.yf.base.model.emergency.vo;

import com.yf.base.common.Constants;
import com.yf.base.model.emergency.EmergencyEventProcess;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class EmergencyEventProcessVo extends EmergencyEventProcess {

    private String selectedGroupIds;

    private String selectedGroupNames;

    private String userName;

    private String organName;

    private String nodeName;

    public String getNodeName() {
        return Constants.configMap.get(this.getNode());
    }
}
