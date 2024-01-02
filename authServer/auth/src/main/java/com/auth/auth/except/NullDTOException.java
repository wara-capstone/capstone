package com.auth.auth.except;


public class NullDTOException extends RuntimeException{

    public NullDTOException(Throwable cause) {
        super(cause);
    }


    @Override
    public String getMessage() {
        return "DTO has null";
    }

    @Override
    public void printStackTrace() {
        System.err.println("DTO has null");
        super.printStackTrace();
    }
}
