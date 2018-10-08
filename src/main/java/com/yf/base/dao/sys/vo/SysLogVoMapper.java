package com.yf.base.dao.sys.vo;

import com.yf.base.model.sys.vo.SysLogVo;

import java.util.List;

public interface SysLogVoMapper {
    /**
     * 查询所有日志
     * @param sysLogVo
     * @return
     */
    List<SysLogVo> selectLogList(SysLogVo sysLogVo);
}