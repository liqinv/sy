package com.yf.base.dao.emergency.vo;

import com.yf.base.model.emergency.vo.EmergencyEventVo;

import java.util.List;

public interface EmergencyEventVoMapper {

    List<EmergencyEventVo> selectByParam(EmergencyEventVo vo);

    EmergencyEventVo getDetailById(Integer id);
}
