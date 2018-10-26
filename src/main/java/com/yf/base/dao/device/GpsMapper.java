package com.yf.base.dao.device;

import com.yf.base.common.BaseDao;
import com.yf.base.model.device.Gps;
import com.yf.base.model.device.vo.GpsBean;

import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface GpsMapper extends BaseDao<Gps,Integer> {

    /**
     * 查询机构信息集合
     * @param gps
     * @return
     */
    List<Gps> selectGpsVoList(Gps gps);

    public List<Gps> selectByName(Gps gps);

    List<GpsBean> selectGpsByOrgan(@Param("organCode") String organCode, @Param("organPath") String organPath);
}