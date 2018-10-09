package com.yf.base.dao.emergency.vo;

import com.yf.base.model.emergency.vo.EmergencyEventProcessVo;

import java.util.List;

public interface EmergencyEventProcessVoMapper {

    List<EmergencyEventProcessVo> selectByEventId(Integer eventId);
}
