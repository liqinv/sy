package com.yf.base.service.device.impl;

import com.yf.base.common.BaseDao;
import com.yf.base.common.BaseServiceImpl;
import com.yf.base.dao.device.GpsMapper;
import com.yf.base.dao.device.GpsTypeMapper;
import com.yf.base.model.device.Gps;
import com.yf.base.model.device.GpsType;
import com.yf.base.model.device.vo.GpsBean;
import com.yf.base.service.device.GpsService;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
@Transactional
public class GpsServiceImpl extends BaseServiceImpl<Gps,Integer> implements GpsService {

    @Resource
    private GpsMapper gpsMapper;

    @Resource
    private GpsTypeMapper gpsTypeMapper;

    @Override
    public BaseDao<Gps, Integer> getDao() {
        return gpsMapper;
    }

    @Override
    public List<Gps> selectSysOrganVoList(Gps GpsVo) {
        return null;
    }

    @Override
    public List<Gps> selectByPage(Gps GpsVo) {
        List<Gps> result = gpsMapper.selectGpsVoList(GpsVo);
        return result;
    }

    @Override
    public int addGpsVo(Gps GpsVo) {
        return 0;
    }

    @Override
    public int getGpsListCount(Gps Gps) {
        return 0;
    }

    @Override
    public Gps getGpsById(@Param("gpsId") Integer gpsId) {
        return gpsMapper.selectByPrimaryKey(gpsId);
    }

    @Override
    public List<GpsType> findGpsType(GpsType gpsType) {
        return gpsTypeMapper.findGpsType(gpsType);
    }

    @Override
    public List<GpsBean> selectGpsByOrgan(@Param("organCode") String organCode, @Param("organPath") String organPath) {
        return gpsMapper.selectGpsByOrgan(organCode, organPath);
    }

    @Override
    public List<Gps> selectByName(Gps gps) {
        return gpsMapper.selectByName(gps);
    }
}
