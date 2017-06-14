package com.wealthfreedom.fms.merchantmaster.web.deploy.listener;

import java.io.File;

import org.apache.log4j.PropertyConfigurator;

import com.jd.autodeploy.configurer.ConfigChangeListener;
import com.jd.common.util.StringUtils;

/**
 * Created by bjyfzcl.
 */
public class ConfigChangeEvent implements ConfigChangeListener {
    @Override
    public void onChange(File file, String s, String s1) {
        String url = file.toString();
        //动态属性log4j配置文件
        if(StringUtils.isNotBlank(url)
                && url.endsWith("log4j.properties")
                && "log4j.dynamic.refresh".equals(s)
                && "OPEN".equals(s1)){
            PropertyConfigurator.configure(url);
        }
    }
}
