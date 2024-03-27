package com.auth.auth.except;

public class RefreshTokenNotValidException extends RuntimeException{

    public RefreshTokenNotValidException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return super.getMessage();
    }
}
