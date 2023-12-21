package com.auth.auth;

import com.auth.auth.dao.UserDAO;
import com.auth.auth.entity.UserEntity;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Collections;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

@SpringBootTest
public class UserDAOTest {
    private final UserDAO userDAO;
    private final static Logger logger = LoggerFactory.getLogger(UserDAOTest.class);

    public UserDAOTest(
            @Autowired UserDAO userDAO
    ) {
        this.userDAO = userDAO;
    }


    @Test
    public void createAndReadTest(){
        UserEntity userEntity = new UserEntity();
        userEntity.setProfileImage("https://www.onoff.zone/api/image/download/1");
        userEntity.setEmail("test@naver.com");
        userEntity.setName("창의");
        userEntity.setNickname("창의보이");
        userEntity.setPassword("1234");
        userEntity.setPhone("010-1234-5678");
        userEntity.setRoles(Collections.singletonList("ROLE_USER"));

        UserEntity testUser = this.userDAO.createUser(userEntity);
        assertThat(userEntity, is(testUser));

        userEntity = this.userDAO.readUser(userEntity.getEmail()).orElse(null);
        assertThat(testUser, is(userEntity));

        logger.info(userEntity.toString());
        logger.info(testUser.toString());
    }


}
