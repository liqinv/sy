package com.yf.base.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 对属性文件内容进行注入(*.yml，*.properties)
 */
@Component
@ConfigurationProperties(prefix="custom")//接收application.yml中的custom下面的属性
public class CustomProperties {

    private String title;
    private String description;
    @Value("${custom.dom.name}")
    private String name;
    @Value("${custom.dom.phone}")
    private String phone;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
