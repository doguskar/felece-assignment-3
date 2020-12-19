package com.doguskar.todo.dto;

public class AdminUpdateUserResponseDto {
    private UserDto user;
    private boolean isUsernameUsed;
    private boolean isNotUserIdValid;
    private boolean result;

    public AdminUpdateUserResponseDto(UserDto user, boolean isUsernameUsed, boolean isNotUserIdValid, boolean result) {
        this.user = user;
        this.isUsernameUsed = isUsernameUsed;
        this.isNotUserIdValid = isNotUserIdValid;
        this.result = result;
    }

    public boolean isNotUserIdValid() {
        return isNotUserIdValid;
    }

    public void setNotUserIdValid(boolean notUserIdValid) {
        isNotUserIdValid = notUserIdValid;
    }

    public AdminUpdateUserResponseDto() {
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public boolean isUsernameUsed() {
        return isUsernameUsed;
    }

    public void setUsernameUsed(boolean usernameUsed) {
        isUsernameUsed = usernameUsed;
    }

    public boolean isResult() {
        return result;
    }

    public void setResult(boolean result) {
        this.result = result;
    }
}
