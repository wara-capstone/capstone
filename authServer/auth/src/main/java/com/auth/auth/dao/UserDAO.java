package com.auth.auth.dao;


import com.auth.auth.entity.UserEntity;

import java.util.Optional;

public interface UserDAO {
    public UserEntity readUser(String email);
    public UserEntity createUser(UserEntity userEntity);
    public void deleteUser(String email);
    public Integer getCountUser();
    public void deleteAllUser();
    public Boolean existUserByEmail(String email);
}
