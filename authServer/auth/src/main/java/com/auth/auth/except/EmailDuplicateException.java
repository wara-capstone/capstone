package com.auth.auth.except;

public class EmailDuplicateException extends RuntimeException{

    public EmailDuplicateException() {
        super();
    }

    @Override
    public String getMessage() {
        return "email is duplicate";
    }

    @Override
    public void printStackTrace() {
        System.err.println("Sign Up Email is Duplicate");
        super.printStackTrace();
    }
}
