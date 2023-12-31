package com.auth.auth.service;



import com.auth.auth.dto.TokenDTO;
import com.auth.auth.dto.UserDTO;
import org.springframework.http.ResponseEntity;


/**
 * 인증 및 인가와 관련된 비즈니스 로직 인터페이스
 */
public interface AuthService {

    // 회원가입
    public UserDTO signUp(UserDTO userDTO);
    // 로그인
    public TokenDTO signIn(UserDTO userDTO);
    // 토큰 검증
    public boolean tokenValidCheck(String token);
}