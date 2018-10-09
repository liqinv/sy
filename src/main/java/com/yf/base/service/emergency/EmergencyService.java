package com.yf.base.service.emergency;

import com.yf.base.common.BaseService;
import com.yf.base.model.emergency.EmergencyEvent;
import com.yf.base.model.emergency.vo.EmergencyEventProcessVo;
import com.yf.base.model.emergency.vo.EmergencyEventVo;
import com.yf.base.model.sys.vo.SysUserVo;

import java.util.List;

public interface EmergencyService extends BaseService<EmergencyEvent,Integer> {

    List<EmergencyEventVo> selectByParam(EmergencyEventVo vo);

    EmergencyEventVo getDetailById(Integer id);

    void addProcess(EmergencyEventProcessVo processVo, SysUserVo loginUser);

}
