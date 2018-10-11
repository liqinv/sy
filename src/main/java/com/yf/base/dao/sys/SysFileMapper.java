package com.yf.base.dao.sys;

import com.yf.base.common.BaseDao;
import com.yf.base.model.sys.SysFile;

import java.util.List;

public interface SysFileMapper extends BaseDao<SysFile,Integer> {
    List<SysFile> selectByParam(SysFile sysFile);
}