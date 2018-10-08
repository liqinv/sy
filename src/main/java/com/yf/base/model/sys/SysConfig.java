package com.yf.base.model.sys;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SysConfig {
    private String configKey;

    private String configValue;

    private Integer type;

    private String typeName;

    private Integer sort;

    private String note;

    private Integer active;

    private String parentKey;
}