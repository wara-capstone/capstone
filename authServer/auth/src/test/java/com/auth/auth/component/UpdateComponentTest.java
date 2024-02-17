package com.auth.auth.component;

import com.auth.auth.componet.UpdateComponent;
import com.auth.auth.componet.impl.UpdateComponentImpl;
import com.auth.auth.dto.UserDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

public class UpdateComponentTest {

    //private final UpdateComponent updateComponent;
    private UserDTO user1;
    private UserDTO user2;
    private UserDTO user3;

//
//    public UpdateComponentTest(
//            UpdateComponent updateComponent){
//        this.updateComponent = updateComponent;
//    }


    @DisplayName("Update Test")
    @Test
    public void updateObject(){
        UpdateComponent updateComponent = new UpdateComponentImpl();
        UserDTO before = user1;
        user1.setNickname("김치");
        user1.setName("김치맨");
        UserDTO after = updateComponent.update(before, user1, UserDTO.class);
        assertThat(after).isEqualTo(user1);

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
