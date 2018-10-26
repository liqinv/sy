package com.yf.base.dao.device;

import com.yf.base.common.BaseDao;
import com.yf.base.model.device.Gps;
import com.yf.base.model.device.GpsType;

import java.util.List;

public interface GpsTypeMapper extends BaseDao<GpsType,Integer> {
    public List<GpsType> findGpsType(GpsType gpsType);
}