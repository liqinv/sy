package com.yf.base.service.sys;

import com.yf.base.common.BaseService;
import com.yf.base.model.sys.SysLog;
import com.yf.base.model.sys.vo.SysLogVo;


import java.util.List;

public interface SysLogService extends BaseService<SysLog,Integer> {
    /**
     * 查询所有日志
     * @param sysLogVo
     * @return
     */
    List<SysLogVo> selectLogList(SysLogVo sysLogVo);
}
