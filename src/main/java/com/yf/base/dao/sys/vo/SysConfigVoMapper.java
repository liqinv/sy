package com.yf.base.dao.sys.vo;

import com.yf.base.model.sys.vo.SysConfigVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysConfigVoMapper {
    /**
     * 获取对应类型的配置列表，type==0表示查询所有类型的配置列表
     *
     * @param type 配置类型
     * @return
     */
    List<SysConfigVo> selectConfigList(@Param("type") Integer type);
}
