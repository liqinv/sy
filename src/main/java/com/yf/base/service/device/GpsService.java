package com.yf.base.service.device;

import com.github.pagehelper.PageInfo;
import com.yf.base.common.BaseService;
import com.yf.base.model.device.Gps;
import com.yf.base.model.device.GpsType;
import com.yf.base.model.device.vo.GpsBean;
import com.yf.base.model.sys.SysOrgan;
import com.yf.base.model.sys.vo.SysOrganVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface GpsService extends BaseService<Gps,Integer> {
    /**
     * 查询机构信息集合
     * @param GpsVo
     * @return
     */
    List<Gps> selectSysOrganVoList(Gps GpsVo);

    /**
     * 查询机构列表，分页
     * @param GpsVo
     * @return
     */
    List<Gps> selectByPage(Gps GpsVo);

    /**
     * 添加机构
     * @param GpsVo
     * @return
     */
    int addGpsVo(Gps GpsVo);

    /**
     * 查询机构总数
     * @param Gps  机构对象
     * @return
     */
    int getGpsListCount(Gps Gps);

    /**
     * 查询单个机构信息
     * @param gpsId 机构ID
     * @return
     */
    Gps getGpsById(@Param("gpsId") Integer gpsId);

    List<Gps> selectByName(Gps gps);

    /**
     * 查询设备类型
     * @return
     */
    List<GpsType> findGpsType(GpsType gpsType);

    List<GpsBean> selectGpsByOrgan(@Param("organCode") String organCode, @Param("organPath") String organPath);
}
