package com.jd.fms.merchantmaster.dao.cache;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Created by bjyfzcl.
 */
public class SerialTool {
	private static final Log log = LogFactory.getLog(SerialTool.class);

	public static byte[] serialize(Object obj) {
		byte[] bytes = null;
		if (obj != null) {
			ByteArrayOutputStream bos = null;
			ObjectOutputStream oos = null;
			try {
				bos = new ByteArrayOutputStream();
				oos = new ObjectOutputStream(bos);
				oos.writeObject(obj);
				bytes = bos.toByteArray();
			} catch (Exception e) {
				log.error("SERIALIZE_EXCEPTION|序列化对象出现异常", e);
			} finally {
				try {
					if (bos != null) {
						bos.close();
					}
					if (oos != null) {
						oos.close();
					}
				} catch (IOException e) {
					log.error("SERIALIZE__IOCLOSE_ERROR|序列化关闭IO出现异常");
				}
			}
		}
		return bytes;
	}

	public static Object deSerialize(byte[] buf) {
		Object obj = null;
		if (buf != null) {
			ByteArrayInputStream bos = null;
			ObjectInputStream ios = null;
			try {
				bos = new ByteArrayInputStream(buf);
				ios = new ObjectInputStream(bos);
				obj = ios.readObject();
			} catch (Exception e) {
				log.error("DESERIALIZE_EXCEPTION|反序列化对象出现异常", e);
			} finally {
				try {
					if (bos != null) {
						bos.close();
					}
					if (ios != null) {
						ios.close();
					}
				} catch (IOException e) {
					log.error("DESERIALIZE__IOCLOSE_ERROR|反序列化关闭IO出现异常");
				}
			}
		}
		return obj;
	}
}
