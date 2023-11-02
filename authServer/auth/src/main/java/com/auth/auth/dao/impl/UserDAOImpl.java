package com.auth.auth.dao.impl;

import com.auth.auth.dao.UserDAO;
import com.auth.auth.entity.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

@Repository
public class UserDAOImpl implements UserDAO {

    private static final Logger logger = LoggerFactory.getLogger(UserDAOImpl.class);

    @Override
    public UserEntity updateUser(UserEntity userEntity) {
        return null;
    }
}
