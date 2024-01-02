package com.auth.auth.except;

public class NotSignUpEmailException extends RuntimeException{


    public NotSignUpEmailException() {
        super();
    }

    public NotSignUpEmailException(Throwable cause) {
        super(cause);
    }

    @Override
    public String getMessage() {
        return "not exist email";
    }

    @Override
    public void printStackTrace() {
        System.out.println("Not Sign Up Email Exception, not exist email");
        super.printStackTrace();
    }
}
