package com.jd.fms.merchantmaster.utils;


public class HexUtil {
	private HexUtil() {
	}

	public static String toHexString(byte b[]) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < b.length; i++) {
			sb.append("0123456789abcdef".charAt(b[i] >>> 4 & 15));
			sb.append("0123456789abcdef".charAt(b[i] & 15));
		}

		return sb.toString();
	}

	public static byte[] toByteArray(String s) {
		byte buf[] = new byte[s.length() / 2];
		int j = 0;
		for (int i = 0; i < buf.length; i++)
			buf[i] = (byte) (Character.digit(s.charAt(j++), 16) << 4 | Character
					.digit(s.charAt(j++), 16));

		return buf;
	}

	public static String appendParam(String returnStr, String paramId,
			String paramValue) {
		if (!returnStr.equals("")) {
			if (!paramValue.equals(""))
				returnStr = (new StringBuilder()).append(returnStr).append("&")
						.append(paramId).append("=").append(paramValue)
						.toString();
		} else if (!paramValue.equals(""))
			returnStr = (new StringBuilder()).append(paramId).append("=")
					.append(paramValue).toString();
		return returnStr;
	}

	private static final String HEX_CHARS = "0123456789abcdef";
}
