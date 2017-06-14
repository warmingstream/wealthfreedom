package com.wealthfreedom.fms.merchantmaster.web.controller.store;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Title  商城controller
 * @Author warming.
 * @Date 2017/5/27.
 */
@Controller
@RequestMapping("/store/")
public class StroreController {

    @RequestMapping("index")
    public String login() {
        int i = 0;
        return null;
    }

    @RequestMapping("detail")
    public String logout() {
        int i = 0;
        return null;
    }
}
