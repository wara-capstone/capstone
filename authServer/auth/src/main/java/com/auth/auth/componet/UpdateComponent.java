package com.auth.auth.componet;

public interface UpdateComponent {

    public <T> T update(T before, T After, Class<T> type );
}
