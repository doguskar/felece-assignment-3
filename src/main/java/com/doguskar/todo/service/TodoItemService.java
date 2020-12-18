package com.doguskar.todo.service;

import com.doguskar.todo.dto.TodoItemDto;
import com.doguskar.todo.entity.Status;
import com.doguskar.todo.entity.TodoItem;
import com.doguskar.todo.entity.User;
import com.doguskar.todo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class TodoItemService {
    @Autowired
    TodoRepository todoRepository;

    public List<TodoItemDto> findAll(String startDate, String endDate){
        Date startDateObj = null;
        Date endDateObj = null;

        if (!startDate.isEmpty() && !startDate.equals("undefined")){
            try {
                startDateObj = new SimpleDateFormat("yyyy-MM-dd").parse(startDate);
                Calendar c = Calendar.getInstance();
                c.setTime(startDateObj);
                c.add(Calendar.DATE, -1);
                startDateObj = c.getTime();
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        if (!endDate.isEmpty() && !endDate.equals("undefined")){
            try {
                endDateObj = new SimpleDateFormat("yyyy-MM-dd").parse(endDate);
                Calendar c = Calendar.getInstance();
                c.setTime(endDateObj);
                c.add(Calendar.DATE, 1);
                endDateObj = c.getTime();
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        List<TodoItem> ls;
        if(startDateObj != null && endDateObj != null){
            ls = todoRepository.findAllByDateAfterAndDateBeforeOrderByCreatedDateDesc(startDateObj,endDateObj);
        }else if(startDateObj != null){
            ls = todoRepository.findAllByDateAfterOrderByCreatedDateDesc(startDateObj);
        }
        else if(endDateObj != null){
            ls = todoRepository.findAllByDateBeforeOrderByCreatedDateDesc(endDateObj);
        }else{
            ls = todoRepository.findAllByOrderByCreatedDateDesc();
        }
        List<TodoItemDto> todos = new ArrayList<>();
        for (TodoItem i : ls){
            todos.add(new TodoItemDto(
                    i.getId(),
                    i.getDescription(),
                    i.getStatus(),
                    i.getDate(),
                    i.getCreatedDate(),
                    i.getUser().getId()
            ));
        }
        return todos;
    }
    public List<TodoItem> findAllForUser(User user, String startDate, String endDate){
        Date startDateObj = null;
        Date endDateObj = null;

        if (!startDate.isEmpty() && !startDate.equals("undefined")){
            try {
                startDateObj = new SimpleDateFormat("yyyy-MM-dd").parse(startDate);
                Calendar c = Calendar.getInstance();
                c.setTime(startDateObj);
                c.add(Calendar.DATE, -1);
                startDateObj = c.getTime();
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        if (!endDate.isEmpty() && !endDate.equals("undefined")){
            try {
                endDateObj = new SimpleDateFormat("yyyy-MM-dd").parse(endDate);
                Calendar c = Calendar.getInstance();
                c.setTime(endDateObj);
                c.add(Calendar.DATE, 1);
                endDateObj = c.getTime();
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        if(startDateObj != null && endDateObj != null){
            return todoRepository.findAllByUserAndDateAfterAndDateBeforeOrderByCreatedDateDesc(user,startDateObj,endDateObj);
        }else if(startDateObj != null){
            return todoRepository.findAllByUserAndDateAfterOrderByCreatedDateDesc(user,startDateObj);
        }
        else if(endDateObj != null){
            return todoRepository.findAllByUserAndDateBeforeOrderByCreatedDateDesc(user,endDateObj);
        }else{
            return todoRepository.findAllByUserOrderByCreatedDateDesc(user);
        }
    }
    public TodoItem save(TodoItemDto dto, User user){
        if (dto.getId() != null)
            return null;
        if (dto.getDescription() == null)
            return null;
        Date date = null;
        try {
            date = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(dto.getDate() + " " + dto.getTime());
        } catch (ParseException e) {
            e.printStackTrace();
        }

        TodoItem todoItem = new TodoItem();
        todoItem.setDescription(dto.getDescription());
        todoItem.setStatus(Status.TODO);
        todoItem.setDate(date);
        todoItem.setUser(user);

        return todoRepository.save(todoItem);
    }
    public TodoItem update(TodoItemDto dto){
        if (dto.getId() == null)
            return null;
        TodoItem todoItem = todoRepository.findById(dto.getId()).get();
        todoItem.setStatus(dto.getStatus());
        if (dto.getDescription() != null){
            todoItem.setDescription(dto.getDescription());
        }
        if (dto.getDate() != null){
            try {
                todoItem.setDate(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(dto.getDate() + " " + dto.getTime()));
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        return todoRepository.save(todoItem);
    }
    public TodoItem findById(Long id){
        return todoRepository.findById(id).get();
    }
    public void deleteById(Long id){
        todoRepository.deleteById(id);
    }
}
