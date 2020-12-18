package com.doguskar.todo.dto;

import com.doguskar.todo.entity.Status;

import java.util.Date;

public class TodoItemDto {
    private Long id;
    private String description;
    private Status status;
    private String date;
    private String time;
    private Date fdate;
    private Date createdDate;
    private Long user_id;

    public TodoItemDto(Long id, String description, Status status, Date fdate, Date createdDate, Long user_id) {
        this.id = id;
        this.description = description;
        this.status = status;
        this.fdate = fdate;
        this.createdDate = createdDate;
        this.user_id = user_id;
    }

    public TodoItemDto() {
    }

    public Date getFdate() {
        return fdate;
    }

    public void setFdate(Date fdate) {
        this.fdate = fdate;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
