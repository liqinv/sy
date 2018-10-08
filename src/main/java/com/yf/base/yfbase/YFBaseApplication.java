package com.yf.base.yfbase;

import com.yf.base.common.config.ApplicationStartupInit;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@MapperScan("com.yf.base.dao")
@ComponentScan(basePackages = {"com.yf.base.*"})
public class YFBaseApplication {

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(YFBaseApplication.class);
        springApplication.addListeners(new ApplicationStartupInit());
        springApplication.run(args);
    }
}
