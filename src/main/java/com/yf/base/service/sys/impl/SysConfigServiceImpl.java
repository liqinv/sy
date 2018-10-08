package com.yf.base.service.sys.impl;

import com.yf.base.dao.sys.vo.SysConfigVoMapper;
import com.yf.base.model.sys.SysConfig;
import com.yf.base.model.sys.vo.SysConfigVo;
import com.yf.base.service.sys.SysConfigService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
@Service
public class SysConfigServiceImpl implements SysConfigService {
    @Resource
    private SysConfigVoMapper configVoMapper;

    /**
     * 获取所有类型的配置列表
     *
     * @return
     */
    @Override
    public List<SysConfigVo> selectConfigList() {
        return configVoMapper.selectConfigList(0);
    }

    /**
     * 获取对应类型的配置列表
     *
     * @param type 配置类型
     * @return
     */
    @Override
    @Cacheable(value = "hours-1-cache",keyGenerator = "keyGenerator")
    public List<SysConfigVo> selectConfigList(Integer type) {
        return configVoMapper.selectConfigList(type);
    }

    /**
     * 获取对应类型的二级配置列表
     *
     * @param type 配置类型
     * @return
     */
    @Override
    public List<SysConfigVo> selectConfigList2(Integer type) {
        List<SysConfigVo> result = new ArrayList<>();
        List<SysConfigVo> list = configVoMapper.selectConfigList(type);
        for(SysConfigVo vo : list) {
            if (vo.getParentKey() == null) {
                List<SysConfigVo> children = new ArrayList<>();
                for(SysConfigVo child : list) {
                    if (child.getParentKey() != null && child.getParentKey().equals(vo.getConfigKey())) {
                        children.add(child);
                    }
                 }
                 vo.setChildren(children);
                result.add(vo);
            }
        }
         return result;
    }
}
