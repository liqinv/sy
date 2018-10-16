package com.yf.base.service.resource.impl;

import com.yf.base.common.BaseDao;
import com.yf.base.common.BaseServiceImpl;
import com.yf.base.dao.resource.ResourceAreaDataMapper;
import com.yf.base.dao.resource.ResourceAreaMapper;
import com.yf.base.dao.resource.vo.ResourceAreaVoMapper;
import com.yf.base.model.resource.ResourceArea;
import com.yf.base.model.resource.ResourceAreaData;
import com.yf.base.model.resource.vo.ResourceAreaVo;
import com.yf.base.service.resource.ResourceAreaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;
@Transactional
@Service
public class ResourceAreaServiceImpl extends BaseServiceImpl<ResourceArea,Integer> implements ResourceAreaService {
    @Resource
    private ResourceAreaMapper resourceAreaMapper;
    @Resource
    private ResourceAreaVoMapper resourceAreaVoMapper;
    @Resource
    private ResourceAreaDataMapper resourceAreaDataMapper;
    /**
     * 定义成抽象方法,由子类实现,完成dao的注入
     *
     * @return GenericDao实现类
     */
    @Override
    public BaseDao<ResourceArea, Integer> getDao() {
        return resourceAreaMapper;
    }

    @Override
    public List<ResourceAreaVo> selectByParam(ResourceAreaVo vo) {
        return resourceAreaVoMapper.selectByParam(vo);
    }

    @Override
    public ResourceAreaVo getDetailById(Integer id) {
        ResourceAreaVo vo  = resourceAreaVoMapper.getDetailById(id);
        List<ResourceAreaData> dataList = resourceAreaDataMapper.selectByAreaId(id);
        vo.setDataList(dataList);
        return vo;
    }

    @Override
    public void addArea(ResourceAreaVo vo) {
        resourceAreaMapper.insert(vo);
        if(vo.getDataList() != null && vo.getDataList().size() > 0) {
            for(ResourceAreaData data : vo.getDataList()) {
                data.setAreaId(vo.getId());
                resourceAreaDataMapper.insert(data);
            }
        }
    }

    @Override
    public void updateArea(ResourceAreaVo vo) {
        resourceAreaMapper.updateByPrimaryKeySelective(vo);
        resourceAreaDataMapper.deleteByAreaId(vo.getId());
        if(vo.getDataList() != null && vo.getDataList().size() > 0) {
            for(ResourceAreaData data : vo.getDataList()) {
                data.setAreaId(vo.getId());
                resourceAreaDataMapper.insert(data);
            }
        }
    }
}
