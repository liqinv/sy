package com.yf.base.service.emergency.impl;

import cn.hutool.core.date.DateUtil;
import com.yf.base.common.BaseDao;
import com.yf.base.common.BaseServiceImpl;
import com.yf.base.common.SmsUtil;
import com.yf.base.dao.emergency.EmergencyEventMapper;
import com.yf.base.dao.emergency.EmergencyEventProcessMapper;
import com.yf.base.dao.emergency.vo.EmergencyEventProcessVoMapper;
import com.yf.base.dao.emergency.vo.EmergencyEventVoMapper;
import com.yf.base.dao.group.vo.GroupUserVoMapper;
import com.yf.base.dao.sys.SysFileMapper;
import com.yf.base.model.emergency.EmergencyEvent;
import com.yf.base.model.emergency.vo.EmergencyEventProcessVo;
import com.yf.base.model.emergency.vo.EmergencyEventVo;
import com.yf.base.model.group.vo.GroupUserKeyVo;
import com.yf.base.model.sys.SysFile;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.emergency.EmergencyService;
import org.apache.commons.lang3.StringUtils;
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
    @Resource
    private SysFileMapper sysFileMapper;
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
        SysFile fileParam = new SysFile();
        fileParam.setConnectId(id);
        fileParam.setTableName("emergency_event");
        List<SysFile> fileList = sysFileMapper.selectByParam(fileParam);
        eventVo.setFileList(fileList);
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
            case "BD005":
                eventStatus = null;
                break;
        }
        EmergencyEvent event = new EmergencyEvent();
        event.setId(processVo.getEventId());
        event.setStatus(eventStatus);
        if ("BA001".equals(eventStatus)) {
            event.setCode(this.getNextEventCode());
        }
        event.setLastUpdateTime(new Date());
        event.setLastUpdateUserId(loginUser.getId());
        eventMapper.updateByPrimaryKeySelective(event);
        processVo.setUserId(loginUser.getId());
        processVo.setOrganId(loginUser.getOrganId());
        processVo.setCreateTime(new Date());
        if (processVo.getSelectedGroupNames() != null) {
            processVo.setNote(processVo.getSelectedGroupNames());
        }
        processMapper.insert(processVo);

        if (!"BD005".equals(processVo.getNode())) {
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

    @Override
    public void addEvent(EmergencyEventVo vo) {
        eventMapper.insert(vo);
        if(vo.getFileList() != null && vo.getFileList().size() > 0) {
            for(SysFile sysFile : vo.getFileList()) {
                sysFile.setTableName("emergency_event");
                sysFile.setConnectId(vo.getId());
                sysFileMapper.insert(sysFile);
            }
        }
    }

    @Override
    public void updateEvent(EmergencyEventVo vo) {
        eventMapper.updateByPrimaryKeySelective(vo);
        if(vo.getFileList() != null && vo.getFileList().size() > 0) {
            for(SysFile sysFile : vo.getFileList()) {
                sysFile.setTableName("emergency_event");
                sysFile.setConnectId(vo.getId());
                if(sysFile.getId() == null) {
                    sysFileMapper.insert(sysFile);
                }
            }
        }
    }

    private String getNextEventCode() {
        String nextCode = "NO.";
        nextCode = nextCode + DateUtil.format(new Date(), "yyyyMMdd");
        String maxEventCode = eventVoMapper.getMaxEventCode();
        if (StringUtils.isNotBlank(maxEventCode)) {
            if (maxEventCode.startsWith(maxEventCode)) {
                int maxCodeInt = Integer.parseInt(maxEventCode.substring(nextCode.length(), maxEventCode.length())) + 1;
                String strMaxCode = String.valueOf(maxCodeInt);
                String strTemp = "000";
                nextCode = nextCode + strTemp.substring(0, 3 - strMaxCode.length()) + strMaxCode;
            } else {
                nextCode = nextCode + "001";
            }
        } else {
            nextCode = nextCode + "001";
        }
        return nextCode;
    }
}
