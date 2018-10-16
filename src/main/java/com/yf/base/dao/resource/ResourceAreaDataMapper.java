package com.yf.base.dao.resource;

import com.yf.base.common.BaseDao;
import com.yf.base.model.resource.ResourceAreaData;

import java.util.List;

public interface ResourceAreaDataMapper extends BaseDao<ResourceAreaData,Integer> {

    List<ResourceAreaData> selectByAreaId(Integer areaId);

    void deleteByAreaId(Integer areaId);

}