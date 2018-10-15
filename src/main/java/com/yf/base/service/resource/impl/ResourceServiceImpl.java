package com.yf.base.service.resource.impl;

import com.yf.base.common.BaseDao;
import com.yf.base.common.BaseServiceImpl;
import com.yf.base.dao.resource.ResourceInfoMapper;
import com.yf.base.dao.resource.vo.ResourceInfoVoMapper;
import com.yf.base.model.resource.ResourceInfo;
import com.yf.base.model.resource.vo.ResourceInfoVo;
import com.yf.base.service.resource.ResourceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;
@Service
@Transactional
public class ResourceServiceImpl extends BaseServiceImpl<ResourceInfo,Integer> implements ResourceService {
    @Resource
    private ResourceInfoMapper resourceInfoMapper;
    @Resource
    private ResourceInfoVoMapper resourceInfoVoMapper;
    /**
     * 定义成抽象方法,由子类实现,完成dao的注入
     *
     * @return GenericDao实现类
     */
    @Override
    public BaseDao<ResourceInfo, Integer> getDao() {
        return resourceInfoMapper;
    }

    @Override
    public List<ResourceInfoVo> selectByParam(ResourceInfoVo vo) {
        return resourceInfoVoMapper.selectByParam(vo);
    }

    @Override
    public ResourceInfoVo getDetailById(Integer id) {
        return resourceInfoVoMapper.getDetailById(id);
    }
}
