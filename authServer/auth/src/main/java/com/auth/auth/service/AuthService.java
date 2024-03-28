package com.auth.auth.service;



import com.auth.auth.dto.TokenDTO;
import com.auth.auth.dto.UserDTO;
import com.auth.auth.except.EmailDuplicateException;
import com.auth.auth.except.NotSignUpEmailException;
import com.auth.auth.except.NullDTOException;
import com.auth.auth.except.PasswordMismatchException;
import org.springframework.http.ResponseEntity;


/**
 * 인증 및 인가와 관련된 비즈니스 로직 인터페이스
 */
public interface AuthService {

    // 회원가입
    public UserDTO signUp(UserDTO userDTO) throws EmailDuplicateException;
    // 로그인
    public TokenDTO signIn(UserDTO userDTO) throws NullDTOException, NotSignUpEmailException, PasswordMismatchException;
    public TokenDTO refreshToken(String token);
}