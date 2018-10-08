package com.yf.base.service.emergency.impl;

import com.yf.base.common.BaseDao;
import com.yf.base.common.BaseServiceImpl;
import com.yf.base.dao.emergency.EmergencyEventMapper;
import com.yf.base.dao.emergency.EmergencyEventProcessMapper;
import com.yf.base.dao.emergency.vo.EmergencyEventProcessVoMapper;
import com.yf.base.dao.emergency.vo.EmergencyEventVoMapper;
import com.yf.base.model.emergency.EmergencyEvent;
import com.yf.base.model.emergency.vo.EmergencyEventVo;
import com.yf.base.service.emergency.EmergencyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
@Transactional
public class EmergencyServiceImpl extends BaseServiceImpl<EmergencyEvent,Integer> implements EmergencyService {
    @Resource
    private EmergencyEventMapper eventMapper;
    @Resource
    private EmergencyEventVoMapper eventVoMapper;
    @Resource
    private EmergencyEventProcessMapper processMapper;
    @Resource
    private EmergencyEventProcessVoMapper processVoMapper;
    /**
    /**
     * 定义成抽象方法,由子类实现,完成dao的注入
     *
     * @return GenericDao实现类
     */
    @Override
    public BaseDao<EmergencyEvent, Integer> getDao() {
        return eventMapper;
    }

    @Override
    public List<EmergencyEventVo> selectByParam(EmergencyEventVo vo) {
        return eventVoMapper.selectByParam(vo);
    }

    @Override
    public EmergencyEventVo getDetailById(Integer id) {
        return eventVoMapper.getDetailById(id);
    }
}
