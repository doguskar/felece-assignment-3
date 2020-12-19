package com.doguskar.todo.controller;

import com.doguskar.todo.dto.AdminInsertUserResponseDto;
import com.doguskar.todo.dto.AdminUpdateUserResponseDto;
import com.doguskar.todo.dto.TodoItemDto;
import com.doguskar.todo.dto.UserDto;
import com.doguskar.todo.service.TodoItemService;
import com.doguskar.todo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(path = "/admin")
public class AdminController {
    @Autowired
    TodoItemService todoItemService;
    @Autowired
    UserService userService;

    @GetMapping
    public  String openAdmin(){
        return  "admin/index";
    }
    @RequestMapping(value = "TodoItems", method = RequestMethod.GET)
    @ResponseBody
    public List<TodoItemDto> GetTodoItems(@RequestParam(required = false) String startDate, @RequestParam(required = false) String endDate){
        List<TodoItemDto> todos = todoItemService.findAll(startDate, endDate);
        return todos;
    }
    @RequestMapping(value = "Users", method = RequestMethod.GET)
    @ResponseBody
    public List<UserDto> GetUsers(){
        List<UserDto> users = userService.findAll();
        return users;
    }
    @RequestMapping(value = "Users/{id}", method = RequestMethod.GET)
    @ResponseBody
    public UserDto GetUsersById(@PathVariable Long id){
        return userService.findById(id);
    }
    @RequestMapping(value = "Users", method = RequestMethod.PUT)
    @ResponseBody
    public AdminUpdateUserResponseDto UpdateUsers(@RequestBody UserDto dto){
        return userService.updateAll(dto);
    }
    @RequestMapping(value = "Users/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void DeleteUsers(@PathVariable Long id){
        userService.delete(id);
    }
    @RequestMapping(path = "/Users", method = RequestMethod.POST)
    @ResponseBody
    public AdminInsertUserResponseDto InsertUser(@RequestBody UserDto dto){
        return userService.insertUser(dto);
    }
}
