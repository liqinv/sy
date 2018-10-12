package com.yf.base.model.sys;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Setter
@Getter
public class SysFile {
    private Integer id;

    private Integer fileType;

    private String fileName;

    private String originalPath;

    private String thumbnailPath;

    private String tableName;

    private Integer connectId;

    private Date createTime;

    private Integer createUserId;

    private Integer active;

    private Long fileSize;
}