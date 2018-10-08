/**
 * 
 */
package com.yf.base.common;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Leo
 *
 */
public class Constants {

	public static Map<String,String> configMap = new HashMap<>();
	
	/** 操作错误提示 */
	public final static String QUERY_ERROR = "查询失败";
	
	public final static String ADD_ERROR = "新增失败";
	
	public final static String ADD_SUCCESS = "新增成功";
	
	public final static String EDIT_ERROR = "编辑失败";
	
	public final static String EDIT_SUCCESS = "编辑成功";
	
	public final static String DELETE_ERROR = "删除失败";
	
	public final static String DELETE_SUCCESS = "删除成功";
	
	public final static String HANDLE_ERROR = "处理失败";
	
	public final static String HANDLE_SUCCESS = "处理成功";
	/** 操作错误提示 */
	
	/** 数据有效性 */
	public final static Integer ACTIVE_TRUE = 1;
	
	public final static Integer ACTIVE_FALSE = 0;

	/** 权限-资源类型 */
	public final static int RESOURCE_TYPE_MENU = 1;

	public final static int RESOURCE_TYPE_BUTTION = 2;

}
