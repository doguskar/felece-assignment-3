package com.doguskar.todo.controller;

import com.doguskar.todo.dto.TodoItemDto;
import com.doguskar.todo.entity.TodoItem;
import com.doguskar.todo.entity.User;
import com.doguskar.todo.service.TodoItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;

@Controller
@RequestMapping(path = "/")
public class HomepageController {

    @Autowired
    TodoItemService todoItemService;

    @GetMapping
    public RedirectView openHomepage(){
        if (getCurrentUser() == null)
            return new RedirectView("welcome");
        return new RedirectView("todos");
    }
    @RequestMapping(path = "welcome", method = RequestMethod.GET)
    public String openWelcome(){
        return "homepage/welcome";
    }
    @RequestMapping(path = "login", method = RequestMethod.GET)
    public String openLogin(){
        return "members/login";
    }
    @RequestMapping(path = "todos", method = RequestMethod.GET)
    public String openTodos(){
        return "homepage/index";
    }

    @RequestMapping(value = "TodoItems", method = RequestMethod.GET)
    @ResponseBody
    public List<TodoItem> GetTodoItems(@RequestParam(required = false) String startDate, @RequestParam(required = false) String endDate){
        List<TodoItem> todos = todoItemService.findAllForUser(getCurrentUser(), startDate, endDate);
        return todos;
    }
    @RequestMapping(value = "TodoItems", method = RequestMethod.POST)
    @ResponseBody
    public TodoItem AddTodoItems(@RequestBody TodoItemDto dto){
        TodoItem todoItem = todoItemService.save(dto, getCurrentUser());
        return todoItem;
    }
    @RequestMapping(value = "TodoItems", method = RequestMethod.PUT)
    @ResponseBody
    public TodoItem UpdateTodoItems(@RequestBody TodoItemDto dto){
        TodoItem todoItem = todoItemService.update(dto);
        return todoItem;
    }
    @RequestMapping(value = "TodoItems/{id}", method = RequestMethod.GET)
    @ResponseBody
    public TodoItem findTodoItemById(@PathVariable Long id){
        return todoItemService.findById(id);
    }
    @RequestMapping(value = "TodoItems/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void deleteTodoItemById(@PathVariable Long id){
        todoItemService.deleteById(id);
    }
    public User getCurrentUser() {
        User userInfo = null;
        SecurityContext securityContext = SecurityContextHolder.getContext();
        if (securityContext != null && null != securityContext.getAuthentication()) {
            Object principal = securityContext.getAuthentication().getPrincipal();
            if (User.class.isAssignableFrom(principal.getClass())) {
                userInfo = (User) principal;
            }
        }
        return userInfo;
    }
}
