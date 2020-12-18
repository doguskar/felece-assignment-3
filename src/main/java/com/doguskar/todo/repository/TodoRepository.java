package com.doguskar.todo.repository;

import com.doguskar.todo.entity.TodoItem;
import com.doguskar.todo.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TodoRepository extends CrudRepository<TodoItem, Long> {
    List<TodoItem> findAll();
    List<TodoItem> findAllByOrderByCreatedDateDesc();
    List<TodoItem> findAllByDateAfterAndDateBeforeOrderByCreatedDateDesc(Date startDate, Date endDate);
    List<TodoItem> findAllByDateAfterOrderByCreatedDateDesc(Date startDate);
    List<TodoItem> findAllByDateBeforeOrderByCreatedDateDesc(Date endDate);
    List<TodoItem> findAllByUserOrderByCreatedDateDesc(User user);
    List<TodoItem> findAllByUserAndDateAfterAndDateBeforeOrderByCreatedDateDesc(User user, Date startDate, Date endDate);
    List<TodoItem> findAllByUserAndDateAfterOrderByCreatedDateDesc(User user, Date startDate);
    List<TodoItem> findAllByUserAndDateBeforeOrderByCreatedDateDesc(User user, Date endDate);
}
