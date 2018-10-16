package com.yf.base.model.resource.vo;

import com.yf.base.model.resource.ResourceArea;
import com.yf.base.model.resource.ResourceAreaData;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ResourceAreaVo extends ResourceArea {
    private List<ResourceAreaData> dataList;
}
