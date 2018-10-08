package com.yf.base.model.sys.vo;

import com.yf.base.model.sys.SysConfig;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Setter
@Getter
public class SysConfigVo extends SysConfig {

    private List<SysConfigVo> children;
}
