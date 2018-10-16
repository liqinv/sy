package com.yf.base.dao.resource.vo;

import com.yf.base.model.resource.vo.ResourceAreaVo;

import java.util.List;

public interface ResourceAreaVoMapper {
    List<ResourceAreaVo> selectByParam(ResourceAreaVo vo);

    ResourceAreaVo getDetailById(Integer id);
}
