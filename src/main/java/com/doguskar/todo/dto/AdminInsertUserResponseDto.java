package com.doguskar.todo.dto;

public class AdminInsertUserResponseDto {
    private SignUpResponseDto signUpResponse;
    private UserDto user;

    public AdminInsertUserResponseDto(SignUpResponseDto signUpResponse, UserDto user) {
        this.signUpResponse = signUpResponse;
        this.user = user;
    }

    public AdminInsertUserResponseDto() {
    }

    public SignUpResponseDto getSignUpResponse() {
        return signUpResponse;
    }

    public void setSignUpResponse(SignUpResponseDto signUpResponse) {
        this.signUpResponse = signUpResponse;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }
}
