package com.yf.base.service.resource;

import com.yf.base.common.BaseService;
import com.yf.base.model.resource.ResourceArea;
import com.yf.base.model.resource.vo.ResourceAreaVo;

import java.util.List;

public interface ResourceAreaService  extends BaseService<ResourceArea,Integer> {
    List<ResourceAreaVo> selectByParam(ResourceAreaVo vo);

    ResourceAreaVo getDetailById(Integer id);

    void addArea(ResourceAreaVo vo);

    void updateArea(ResourceAreaVo vo);

    List<ResourceAreaVo> selectMapByParam(ResourceAreaVo vo);
}
