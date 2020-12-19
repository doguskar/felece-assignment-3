package com.doguskar.todo.dto;

public class SignUpResponseDto {
    private boolean isUsernameUsed;
    private boolean isNotUsernameValid;
    private boolean isNotPasswordValid;
    private boolean result;

    public boolean isNotUsernameValid() {
        return isNotUsernameValid;
    }

    public void setNotUsernameValid(boolean notUsernameValid) {
        isNotUsernameValid = notUsernameValid;
    }

    public boolean isNotPasswordValid() {
        return isNotPasswordValid;
    }

    public void setNotPasswordValid(boolean notPasswordValid) {
        isNotPasswordValid = notPasswordValid;
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
