package com.yf.base.model.resource.vo;

import com.yf.base.common.Constants;
import com.yf.base.model.resource.ResourceInfo;

public class ResourceInfoVo extends ResourceInfo {

    private String typeName;

    public String getTypeName() {
        return Constants.configMap.get(this.getType());
    }


}
