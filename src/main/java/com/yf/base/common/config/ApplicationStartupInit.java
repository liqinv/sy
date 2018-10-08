package com.yf.base.common.config;

import com.yf.base.common.Constants;
import com.yf.base.model.sys.vo.SysConfigVo;
import com.yf.base.service.sys.SysConfigService;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

import java.util.List;

/**
 * 用于项目启动时初始化数据
 */
public class ApplicationStartupInit implements ApplicationListener<ContextRefreshedEvent> {
    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        SysConfigService service = contextRefreshedEvent.getApplicationContext().getBean(SysConfigService.class);
        List<SysConfigVo> configList = service.selectConfigList();
        for(SysConfigVo config : configList) {
            Constants.configMap.put(config.getConfigKey(),config.getConfigValue());
        }
    }
}
