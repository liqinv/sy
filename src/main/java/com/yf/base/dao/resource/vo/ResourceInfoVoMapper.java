package com.yf.base.dao.resource.vo;

import com.yf.base.model.resource.vo.ResourceInfoVo;

import java.util.List;

public interface ResourceInfoVoMapper {

    List<ResourceInfoVo> selectByParam(ResourceInfoVo vo);

    ResourceInfoVo getDetailById(Integer id);
}
