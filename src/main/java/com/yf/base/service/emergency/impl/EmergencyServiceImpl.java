package com.yf.base.service.emergency.impl;

import com.yf.base.common.BaseDao;
import com.yf.base.common.BaseServiceImpl;
import com.yf.base.common.SmsUtil;
import com.yf.base.dao.emergency.EmergencyEventMapper;
import com.yf.base.dao.emergency.EmergencyEventProcessMapper;
import com.yf.base.dao.emergency.vo.EmergencyEventProcessVoMapper;
import com.yf.base.dao.emergency.vo.EmergencyEventVoMapper;
import com.yf.base.dao.group.vo.GroupUserVoMapper;
import com.yf.base.model.emergency.EmergencyEvent;
import com.yf.base.model.emergency.vo.EmergencyEventProcessVo;
import com.yf.base.model.emergency.vo.EmergencyEventVo;
import com.yf.base.model.group.vo.GroupUserKeyVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.emergency.EmergencyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    @Resource
    private GroupUserVoMapper groupUserVoMapper;
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
        EmergencyEventVo eventVo = eventVoMapper.getDetailById(id);
        List<EmergencyEventProcessVo> processVoList = processVoMapper.selectByEventId(id);
        eventVo.setProcessVoList(processVoList);
        return eventVo;
    }

    @Override
    public void addProcess(EmergencyEventProcessVo processVo, SysUserVo loginUser) {
        String eventStatus = "";
        switch (processVo.getNode()) {
            case "BD001":
                eventStatus = "BA001";
                break;
            case "BD002":
                eventStatus = "BA002";
                break;
            case "BD003":
                eventStatus = "BA003";
                break;
            case "BD004":
                eventStatus = "BA004";
                break;
        }
        EmergencyEvent event = new EmergencyEvent();
        event.setId(processVo.getEventId());
        event.setStatus(eventStatus);
        event.setLastUpdateTime(new Date());
        event.setLastUpdateUserId(loginUser.getId());
        eventMapper.updateByPrimaryKeySelective(event);
        processVo.setUserId(loginUser.getId());
        processVo.setOrganId(loginUser.getOrganId());
        processVo.setCreateTime(new Date());
        processVo.setNote(processVo.getSelectedGroupNames());
        processMapper.insert(processVo);

        //send SMS
        Set<String> phoneSet = new HashSet<>();
        String[] groupIds = processVo.getSelectedGroupIds().split(",");
        for(String groupId : groupIds) {
            List<GroupUserKeyVo> list = groupUserVoMapper.selectByGroupId(Integer.parseInt(groupId));
            for (GroupUserKeyVo gu : list) {
                phoneSet.add(gu.getUserPhone());
            }
        }
        String[] mobiles = {};
        SmsUtil.sendSMS(phoneSet.toArray(mobiles),processVo.getSms());
    }
}
