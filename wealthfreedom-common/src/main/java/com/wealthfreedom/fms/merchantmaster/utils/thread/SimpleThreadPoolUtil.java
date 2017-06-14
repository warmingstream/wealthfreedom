package com.wealthfreedom.fms.merchantmaster.utils.thread;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @Title
 * @Author warming.
 * @Date 2017/5/16.
 */
public class SimpleThreadPoolUtil {

    private static ThreadPoolExecutor threadPool = null;

    private SimpleThreadPoolUtil() {

    }

    /**
     * 获取线程池
     * @return
     */
    public static ThreadPoolExecutor getInstance() {
        if (threadPool == null) {
            synchronized ("1") {
                if (threadPool == null) {
                    threadPool = new ThreadPoolExecutor(10, 15, 60,
                            TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(3),
                            new ThreadPoolExecutor.DiscardOldestPolicy()
                    );
                }
            }
        }
        return threadPool;
    }

}
