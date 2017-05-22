package com.jd.fms.merchantmaster.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5Util {
	private MD5Util() {
	}

	static MessageDigest getDigest() {
		try {
			return MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}
	}

	public static byte[] md5(byte data[]) {
		return getDigest().digest(data);
	}

	@edu.umd.cs.findbugs.annotations.SuppressFBWarnings("DM_DEFAULT_ENCODING")
	public static byte[] md5(String data) {
		return md5(data.getBytes());
	}

	public static String md5Hex(byte data[]) {
		return HexUtil.toHexString(md5(data));
	}

	public static String md5Hex(String data) {
		return HexUtil.toHexString(md5(data));
	}
}
