package com.yf.base.common;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class BaseModel implements Serializable {

	private static final long serialVersionUID = 1L;

	/**每页显示多少条数据*/
	private Integer pageSize = 15;
	/**当前页数*/
	private Integer pageNo;
	/**检索开始日期*/
    private String searchStartDate;
	/**检索截止日期*/
    private String searchEndDate;
	/**检索模糊匹配内容*/
	private String searchCondition;
	/**排序条件*/
	private String orderBy;
	/**权限机构ID*/
	private Integer authDeptId;
	/**权限机构PATH*/
	private String authDeptPath;


}
