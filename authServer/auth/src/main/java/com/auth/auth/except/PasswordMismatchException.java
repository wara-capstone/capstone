package com.auth.auth.except;

public class PasswordMismatchException extends RuntimeException{
    public PasswordMismatchException() {
        super();
    }

    @Override
    public String getMessage() {
        return "Password Mismatch";
    }

    @Override
    public void printStackTrace() {
        System.err.println("Password Mismatch");
        super.printStackTrace();
    }
}
