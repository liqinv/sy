package com.yf.base.service.sys.impl;

import com.yf.base.dao.sys.SysFileMapper;
import com.yf.base.service.sys.CommonService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class CommonServiceImpl implements CommonService {
    @Resource
    private SysFileMapper sysFileMapper;
    @Override
    public void deleteFile(Integer id) {
        sysFileMapper.deleteByPrimaryKey(id);
    }
}
