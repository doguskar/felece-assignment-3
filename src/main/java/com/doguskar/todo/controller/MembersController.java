package com.doguskar.todo.controller;

import com.doguskar.todo.dto.UserDto;
import com.doguskar.todo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(path = "members/")
public class MembersController {
    @Autowired
    UserService userService;

    @RequestMapping(path = "/login", method = RequestMethod.GET)
    public String openLogin(){
        return "members/login";
    }
    @RequestMapping(path = "/signup", method = RequestMethod.POST)
    @ResponseBody
    public UserDto saveUser(@RequestBody UserDto dto){
        return userService.save(dto);
    }
}
