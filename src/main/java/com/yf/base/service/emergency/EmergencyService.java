package com.yf.base.service.emergency;

import com.yf.base.common.BaseService;
import com.yf.base.model.emergency.EmergencyEvent;
import com.yf.base.model.emergency.vo.EmergencyEventVo;

import java.util.List;

public interface EmergencyService extends BaseService<EmergencyEvent,Integer> {

    List<EmergencyEventVo> selectByParam(EmergencyEventVo vo);

    EmergencyEventVo getDetailById(Integer id);
}
