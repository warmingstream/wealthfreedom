package com.jd.fms.merchantmaster.utils.exception;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * Created by bjyfzcl.
 */
public class ExceptionUtility {
    /**
     * 获取异常的堆栈信息
     *
     * @param t
     * @return
     */
    public static String getStackTrace(Throwable t) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        try {
            t.printStackTrace(pw);
            return sw.toString();
        } finally {
            pw.close();
        }
    }
}
