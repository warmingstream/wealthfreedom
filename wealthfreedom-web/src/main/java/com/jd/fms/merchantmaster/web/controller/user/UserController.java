package com.jd.fms.merchantmaster.web.controller.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Title  用户权限controller
 * @Author warming.
 * @Date 2017/5/27.
 */
@Controller
@RequestMapping("/user/")
public class UserController {

    @RequestMapping("login")
    public String login() {
        return null;
    }

    @RequestMapping("logout")
    public String logout() {
        return null;
    }
}
