package com.yf.base.model.resource.vo;

import com.yf.base.common.Constants;
import com.yf.base.model.resource.ResourceInfo;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ResourceInfoVo extends ResourceInfo {

    private String typeName;

    private Integer pointStatus;

    public String getTypeName() {
        return Constants.configMap.get(this.getType());
    }


}
