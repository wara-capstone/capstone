package com.auth.auth;

import com.auth.auth.dao.UserDAO;
import com.auth.auth.entity.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
public class UserDAOTest {
    private final UserDAO userDAO;
    private final static Logger logger = LoggerFactory.getLogger(UserDAOTest.class);

    private UserEntity user1;
    private UserEntity user2;
    private UserEntity user3;

    public UserDAOTest(
            @Autowired UserDAO userDAO
    ) {
        this.userDAO = userDAO;
    }



    @DisplayName("생성 후 조회 및 삭제")
    @Transactional
    @Test
    public void createAndReadTest(){
        // Create
        UserEntity testUser = this.userDAO.createUser(this.user1);
        this.checkUser(this.user1, testUser);

        // Read
        this.user1 = this.userDAO.readUser(this.user1.getEmail()).orElse(null);
        this.checkUser(this.user1, testUser);

        // Rollback
        this.userDAO.deleteUser(this.user1.getEmail());
        assertThat(this.userDAO.getCountUser()).isEqualTo(0);
    }

    @DisplayName("유저 생성, 카운트 및 전체삭제")
    @Transactional
    @Test
    public void createAndCountTest(){
        this.userDAO.createUser(this.user1);
        assertThat(this.userDAO.getCountUser()).isEqualTo(1);

        this.userDAO.createUser(this.user2);
        assertThat(this.userDAO.getCountUser()).isEqualTo(2);

        this.userDAO.createUser(this.user3);
        assertThat(this.userDAO.getCountUser()).isEqualTo(3);

        this.userDAO.deleteAllUser();
        assertThat(this.userDAO.getCountUser()).isEqualTo(0);

    }

    @DisplayName("없는 이메일 조회")
    @Test
    @Transactional
    public void nullEmailRead(){
        UserEntity userEntity = this.userDAO.readUser("asd").orElse(null);
        assertThat(userEntity).isNull();
    }


    private void checkUser(UserEntity user1, UserEntity user2){
        assertThat(user1.getId()).isEqualTo(user2.getId());
        assertThat(user1.getProfileImage()).isEqualTo(user2.getProfileImage());
        assertThat(user1.getEmail()).isEqualTo(user2.getEmail());
        assertThat(user1.getPassword()).isEqualTo(user2.getPassword());
        assertThat(user1.getName()).isEqualTo((user2.getName()));
        assertThat(user1.getNickname()).isEqualTo(user2.getNickname());
        assertThat(user1.getPhone()).isEqualTo(user2.getPhone());
        assertThat(user1.getRoles().get(0)).isEqualTo(user2.getRoles().get(0));
    }

    @DisplayName("[UserDAOTest] 테스트 초기화")
    @BeforeEach
    public void setUp(){
        this.user1 = new UserEntity();
        this.user1.setProfileImage("https://www.onoff.zone/api/image/download/1");
        this.user1.setEmail("test1@naver.com");
        this.user1.setName("창의");
        this.user1.setNickname("창의보이");
        this.user1.setPassword("1234");
        this.user1.setPhone("010-1234-5678");
        this.user1.setRoles(Collections.singletonList("ROLE_USER"));

        this.user2 = new UserEntity();
        this.user2.setProfileImage("https://www.onoff.zone/api/image/download/1");
        this.user2.setEmail("test2@naver.com");
        this.user2.setName("민규");
        this.user2.setNickname("어민규");
        this.user2.setPassword("1234");
        this.user2.setPhone("010-1234-5678");
        this.user2.setRoles(Collections.singletonList("ROLE_USER"));

        this.user3 = new UserEntity();
        this.user3.setProfileImage("https://www.onoff.zone/api/image/download/1");
        this.user3.setEmail("test3@naver.com");
        this.user3.setName("종현");
        this.user3.setNickname("종효이");
        this.user3.setPassword("1234");
        this.user3.setPhone("010-1234-5678");
        this.user3.setRoles(Collections.singletonList("ROLE_USER"));
    }

}
