package com.auth.auth.service;

import com.auth.auth.dao.UserDAO;
import com.auth.auth.dto.UserDTO;
import com.auth.auth.except.NotSignUpEmailException;
import com.auth.auth.except.NullDTOException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
public class UserServiceTest {
    private final UserService userService;
    private final AuthService authService;
    private final UserDAO userDAO;
    private UserDTO user1;
    private UserDTO user2;
    private UserDTO user3;

    public UserServiceTest(
            @Autowired AuthService authService,
            @Autowired UserService userService,
            @Autowired UserDAO userDAO
    ){
        this.authService = authService;
        this.userService = userService;
        this.userDAO = userDAO;
    }

    @DisplayName("유저 업데이트")
    @Test
    public void updateUser(){
        authService.signUp(user1);

        user1.setNickname("창창의");
        this.checkUserDTO(user1, userService.updateUser(user1));

        user1.setNickname("창의");
        user1.setPhone("010-5678-1234");
        this.checkUserDTO(user1, userService.updateUser(user1));

        user1.setNickname("창창창의");
        user1.setPhone("010-1111-2222");
        // user1.setPassword("4321");
        // this.checkUserDTO(user1, userService.updateUser(user1).getBody());
    }

    @DisplayName("미가입 이메일 유저 업데이트")
    @Test
    public void notSignUpUserUpdate(){
        assertThatThrownBy(()->{
            this.userService.updateUser(user1);
        }).isInstanceOf(NotSignUpEmailException.class);
    }

    @DisplayName("Null DTO 유저 업데이트")
    @Test
    public void nullDTOUserUpdate(){
        assertThatThrownBy(()->{
            this.userService.updateUser(new UserDTO());
        }).isInstanceOf(NotSignUpEmailException.class);
    }

    @DisplayName("이메일 제외 Null DTO 유저 업데이트")
    @Test
    public void onlyEmailDTOUserUpdate(){
        assertThatThrownBy(()->{
            this.authService.signUp(user1);

            UserDTO userDTO = new UserDTO();
            userDTO.setEmail(user1.getEmail());
            this.userService.updateUser(userDTO);
        }).isInstanceOf(NullDTOException.class);
    }


    @DisplayName("유저 조회")
    @Test
    public void readUser(){
        authService.signUp(user1);
        this.checkUserDTO(user1, this.userService.readUser(user1.getEmail()));
    }

    @DisplayName("미가입 이메일 유저 조회")
    @Test
    public void notSignUpUserRead(){
        assertThatThrownBy(()->{
            this.userService.readUser(user1.getEmail());
        }).isInstanceOf(NotSignUpEmailException.class);
    }

    @DisplayName("null email 유저 조회")
    @Test
    public void nullDTOUserRead(){
        assertThatThrownBy(()->{
            this.userService.readUser(null);
        }).isInstanceOf(NotSignUpEmailException.class);
    }




    private void checkUserDTO(UserDTO user1, UserDTO user2){
        assertThat(user1.getEmail()).isEqualTo(user2.getEmail());
        assertThat(user1.getPhone()).isEqualTo(user2.getPhone());
        // assertThat(user1.getPassword()).isEqualTo(user2.getPassword());
        assertThat(user1.getName()).isEqualTo(user2.getName());
        assertThat(user1.getNickname()).isEqualTo(user2.getNickname());
        assertThat(user1.getProfileImage()).isEqualTo(user2.getProfileImage());
        //assertThat(user1.getRole()).isEqualTo(user2.getRole());
    }

    @AfterEach
    public void initDB(){
        this.userDAO.deleteAllUser();
    }


    @DisplayName("[UserDAOTest] 테스트 초기화")
    @BeforeEach
    public void setUp(){
        this.user1 = new UserDTO();
        this.user1.setProfileImage("https://www.onoff.zone/api/image/download/1");
        this.user1.setEmail("test1@naver.com");
        this.user1.setName("창의");
        this.user1.setNickname("창의보이");
        this.user1.setPassword("1234");
        this.user1.setPhone("010-1234-5678");
        this.user1.setRole("user");

        this.user2 = new UserDTO();
        this.user2.setProfileImage("https://www.onoff.zone/api/image/download/1");
        this.user2.setEmail("test2@naver.com");
        this.user2.setName("민규");
        this.user2.setNickname("어민규");
        this.user2.setPassword("1234");
        this.user2.setPhone("010-1234-5678");

        this.user3 = new UserDTO();
        this.user3.setProfileImage("https://www.onoff.zone/api/image/download/1");
        this.user3.setEmail("test3@naver.com");
        this.user3.setName("종현");
        this.user3.setNickname("종효이");
        this.user3.setPassword("1234");
        this.user3.setPhone("010-1234-5678");
    }
}
