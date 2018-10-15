package com.yf.base.service.resource;

import com.yf.base.common.BaseService;
import com.yf.base.model.resource.ResourceInfo;
import com.yf.base.model.resource.vo.ResourceInfoVo;

import java.util.List;

public interface ResourceService extends BaseService<ResourceInfo,Integer> {
    List<ResourceInfoVo> selectByParam(ResourceInfoVo vo);

    ResourceInfoVo getDetailById(Integer id);
}
