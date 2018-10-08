package com.yf.base.service.sys;

import com.yf.base.model.sys.vo.SysConfigVo;

import java.util.List;

public interface SysConfigService {
    /**
     * 获取对应类型的一级配置列表
     * @param type 配置类型
     * @return
     */
    List<SysConfigVo> selectConfigList(Integer type);

    /**
     * 获取对应类型的二级配置列表
     * @param type 配置类型
     * @return
     */
    List<SysConfigVo> selectConfigList2(Integer type);

    /**
     * 获取所有类型的配置列表
     * @return
     */
    List<SysConfigVo> selectConfigList();
}
