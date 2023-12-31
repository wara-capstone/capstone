package com.auth.auth.service;


import com.auth.auth.dao.UserDAO;
import com.auth.auth.dto.TokenDTO;
import com.auth.auth.dto.UserDTO;
import com.auth.auth.except.EmailDuplicateException;
import com.auth.auth.except.NotSignUpEmailException;
import com.auth.auth.except.NullDTOException;
import com.auth.auth.except.PasswordMismatchException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.*;

@SpringBootTest
public class AuthServiceTest {
    private UserDTO user1;
    private UserDTO user2;
    private UserDTO user3;
    private final UserDAO userDAO;
    private final AuthService authService;

    public AuthServiceTest(
            @Autowired UserDAO userDAO,
            @Autowired AuthService authService
    ){
        this.userDAO = userDAO;
        this.authService = authService;
    }


    @DisplayName("회원가입 테스트")
    @Test
    public void signUpTest(){
        UserDTO test = this.authService.signUp(user1);
        assertThat(user1.getEmail()).isEqualTo(test.getEmail());
    }

    @DisplayName("이메일 중복 회원가입")
    @Test
    public void duplicateEmailSignUp(){
        assertThatThrownBy(() -> {
            this.authService.signUp(user1);
            this.authService.signUp(user1);

        }).isInstanceOf(EmailDuplicateException.class);
    }

    @DisplayName("null값 회원가입")
    @Test
    public void nullSignUp(){
        assertThatThrownBy(()->{
            this.authService.signUp(new UserDTO());
        }).isInstanceOf(NullDTOException.class);
    }

    @DisplayName("로그인")
    @Test
    public void signInTest(){
        this.authService.signUp(user1);
        TokenDTO token = this.authService.signIn(user1);
        assertThat(user1.getEmail()).isEqualTo(token.getEmail());
    }

    @DisplayName("회원가입 되지 않은 계정으로 로그인")
    @Test
    public void notSignUpEmailSignIn(){
        assertThatThrownBy(()->{
            this.authService.signIn(user1);
        }).isInstanceOf(NotSignUpEmailException.class);
    }

    @DisplayName("잘못된 비밀번호 로그인")
    @Test
    public void passwordMismatchSignIn(){
        assertThatThrownBy(()->{
            this.authService.signUp(user1);
            user1.setPassword("12312312");
            this.authService.signIn(user1);
        }).isInstanceOf(PasswordMismatchException.class);
    }

    @DisplayName("null email값으로 로그인")
    @Test
    public void nullSignIn(){
        assertThatThrownBy(()->{
            this.authService.signUp(user1);
            user1.setEmail(null);
            this.authService.signIn(user1);
        }).isInstanceOf(NotSignUpEmailException.class);
    }

    @DisplayName("null DTO 로그인")
    @Test
    public void nullDTOSignIn(){
        assertThatThrownBy(()->{
            UserDTO test = UserDTO.builder().email(user1.getEmail()).build();
            this.authService.signUp(user1);
            this.authService.signIn(test);
        }).isInstanceOf(NullDTOException.class);
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
