package com.auth.auth.except;

public class NicknameDuplicateException extends RuntimeException{
    public NicknameDuplicateException() {
        super();
    }

    public NicknameDuplicateException(String message) {
        super(message);
    }
}
