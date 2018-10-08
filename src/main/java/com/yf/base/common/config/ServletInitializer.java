package com.yf.base.common.config;

import com.yf.base.yfbase.YFBaseApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * 此类用于tomcat启动
 */
public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder){
        builder.listeners(new ApplicationStartupInit());
        return builder.sources(YFBaseApplication.class);
    }
}
