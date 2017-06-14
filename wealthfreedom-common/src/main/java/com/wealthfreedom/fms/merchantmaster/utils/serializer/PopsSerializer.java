package com.wealthfreedom.fms.merchantmaster.utils.serializer;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

public class PopsSerializer {
	public static byte[] serialize(Object obj) throws IOException {
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		ObjectOutputStream oos = new ObjectOutputStream(bos);
		oos.writeObject(obj);
		byte[] bytes = bos.toByteArray();
		bos.close();
		oos.close();
		return bytes;
	}

	public static Object deSerialize(byte[] buf) throws IOException,
			ClassNotFoundException {
		ByteArrayInputStream bos = new ByteArrayInputStream(buf);
		ObjectInputStream ios = new ObjectInputStream(bos);
		Object obj = ios.readObject();
		return obj;
	}
}
