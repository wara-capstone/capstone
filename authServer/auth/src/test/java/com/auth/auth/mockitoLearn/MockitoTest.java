package com.auth.auth.mockitoLearn;


import com.auth.auth.dao.UserDAO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.exceptions.misusing.UnnecessaryStubbingException;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;


@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class MockitoTest {

    @Mock
    private final UserDAO userDAO;

    public MockitoTest(@Autowired UserDAO userDAO){
        this.userDAO = userDAO;
    }

    @DisplayName("사용되지 않는 스텁")
    @Test
    public void unnecessaryExceptionTest(){
        assertThatThrownBy(()->{
            when(this.userDAO.existUserByEmail("asd@naver.com")).thenReturn(true);
        }).isInstanceOf(UnnecessaryStubbingException.class);

    }

}
