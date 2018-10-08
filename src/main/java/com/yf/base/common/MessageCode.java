
package com.yf.base.common;

/**
 *
 * @author fantedan@tieserv.com
 * @date  2015-1-13 下午3:13:45
 */
public class MessageCode {
	/**
	 *返回状态代码注释
	 *成功 200
	 *失败300
	 *失败细分以3开头
	 */
	public final static int STATUS_SUCESS = 200;
	public final static int STATUS_FAIL = 300;
	
	//参数缺失
	public final static int STATUS_NOTPRESENT = 301;
	//参数类型错误
	public final static int STATUS_TYPEMISMATCH = 302;
	//添加修改有不能重复字段
	public final static int STATUS_NOTUNIQUE = 303;
	//机构有子节点不能删除
	public final static int STATUS_HASCHILD = 304;
	
	//系统内部异常
	public final static int STATUS_EXCEPTION = 399;
}
