package com.yf.base.model.sys.vo;


import com.yf.base.model.sys.SysLog;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SysLogVo extends SysLog {
    private String userName;//用户名称
    private String organName;//用户机构名称
    private String operation;//操作名称

    public String getOperation() {
        if(this.operation==null||"".equals(this.operation)){
            this.operation= "登录";
        }
        return operation;
    }
}