package com.doguskar.todo.auth;

public enum  AppUserPermission {
    TODO_READ("todo:read"),
    TODO_WRITE("todo:write"),
    ALL_TODO_READ("all_todo:read"),
    ALL_TODO_WRITE("all_todo:write");

    private final String permission;

    AppUserPermission(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }
}
