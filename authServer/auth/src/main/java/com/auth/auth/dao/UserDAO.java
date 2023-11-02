package com.auth.auth.dao;


import com.auth.auth.entity.UserEntity;

import java.util.Optional;

public interface UserDAO {
    public Optional<UserEntity> readUser(String email);
    public UserEntity createUser(UserEntity userEntity);


}
