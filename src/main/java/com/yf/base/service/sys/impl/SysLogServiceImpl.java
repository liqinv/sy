package com.yf.base.service.sys.impl;

import com.yf.base.common.BaseDao;
import com.yf.base.common.BaseServiceImpl;
import com.yf.base.dao.sys.SysLogMapper;
import com.yf.base.dao.sys.SysUserMapper;
import com.yf.base.dao.sys.vo.SysLogVoMapper;
import com.yf.base.dao.sys.vo.SysUserVoMapper;
import com.yf.base.model.sys.SysLog;
import com.yf.base.model.sys.SysUser;
import com.yf.base.model.sys.vo.SysLogVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.sys.SysLogService;
import com.yf.base.service.sys.SysUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
@Transactional
public class SysLogServiceImpl extends BaseServiceImpl<SysLog,Integer> implements SysLogService {

    @Resource
    private SysLogMapper sysLogMapper;
    @Resource
    private SysLogVoMapper sysLogVoMapper;
    @Override
    public BaseDao<SysLog, Integer> getDao() {
        return sysLogMapper;
    }

    /**
     * 查询所有日志
     * @param sysLogVo
     * @return
     */
    @Override
    public List<SysLogVo> selectLogList(SysLogVo sysLogVo) {
        List<SysLogVo> list = sysLogVoMapper.selectLogList(sysLogVo);
        return list;
    }
}
