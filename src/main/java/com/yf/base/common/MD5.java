package com.yf.base.common;

import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.util.ByteSource;

public class MD5 {

	public static final String md5Encrypt(String password, String salt){
		//加密方式
		String hashAlgorithmName = "MD5";
		//盐：为了即使相同的密码不同的盐加密后的结果也不同
		ByteSource byteSalt = ByteSource.Util.bytes(salt);
		//密码
		Object source = password;
		//加密次数
		int hashIterations = 2;
		SimpleHash result = new SimpleHash(hashAlgorithmName, source, byteSalt, hashIterations);
		return result.toString();
	}
	
	public static void main(String[] args) {
		String pass = String.valueOf(System.currentTimeMillis());
		String md5pass = MD5.md5Encrypt("111111","salt");
		System.out.println(md5pass);
	}

}
