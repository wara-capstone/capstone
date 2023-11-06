package com.auth.auth.dao.impl;

import com.auth.auth.dao.UserDAO;
import com.auth.auth.entity.UserEntity;
import com.auth.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserDAOImpl implements UserDAO {

    private static final Logger logger = LoggerFactory.getLogger(UserDAOImpl.class);
    private final UserRepository userRepository;

    public UserDAOImpl(
            @Autowired UserRepository userRepository
    ){
        this.userRepository = userRepository;
    }


    @Override
    public Optional<UserEntity> readUser(String email) {
        return this.userRepository.findByEmail(email);
    }

    @Override
    public UserEntity createUser(UserEntity userEntity) {
        return this.userRepository.save(userEntity);
    }

}
