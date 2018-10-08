package com.yf.base.dao.sys.vo;

import com.yf.base.model.sys.vo.SysRoleVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysRoleVoMapper {

    /**
     * 查询角色列表
     * @param param
     * @return
     */
    List<SysRoleVo> selectByParam(SysRoleVo param);

    /**
     *  获取角色列表，根据用户ID
     * @param userId
     * @return
     */
    List<SysRoleVo> selectRoleListByUserId(@Param("userId") Integer userId);
}