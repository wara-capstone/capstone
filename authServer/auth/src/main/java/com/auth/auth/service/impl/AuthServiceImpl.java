package com.auth.auth.service.impl;

import com.auth.auth.config.security.JwtTokenProvider;
import com.auth.auth.dao.UserDAO;
import com.auth.auth.dto.TokenDTO;
import com.auth.auth.dto.UserDTO;
import com.auth.auth.entity.UserEntity;
import com.auth.auth.enums.TokenType;
import com.auth.auth.except.*;
import com.auth.auth.repository.UserRepository;
import com.auth.auth.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;


/**
 * 유저의 인증 처리를 하는 서비스 구현체
 */
@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private final UserDAO userDAO;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(
            @Autowired UserDAO userDAO,
            @Autowired JwtTokenProvider jwtTokenProvider
            )
    {
        this.userDAO = userDAO;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * 회원가입 서비스
     * @param userDTO
     * @return 유저의 이메일을 담은 결과값 출력
     */
    @Override
    public UserDTO signUp(UserDTO userDTO) throws EmailDuplicateException, NullDTOException {
        this.emailDuplicateCheck(userDTO.getEmail());
        UserEntity signUpUser = userDAO.createUser(this.initEntity(userDTO));
        return UserDTO.builder().email(signUpUser.getEmail()).build();
    }

    /**
     * 로그인 서비스
     * @param userDTO
     * @return 유저 이메일, 유저 권한, JWT token을 담은 Token DTO와 결괏값 반환
     */
    @Override
    public TokenDTO signIn(UserDTO userDTO) throws NullDTOException, NotSignUpEmailException, PasswordMismatchException{
        this.existEmailCheck(userDTO.getEmail());
        UserEntity userEntity = userDAO.readUser(userDTO.getEmail());
        this.passwordCheck(userDTO.getPassword(), userEntity.getPassword());
        return this.makeToken(userEntity.getEmail(), userEntity.getRoles().get(0));
    }

    /**
     * token 갱신
     * @param token Refresh Token
     * @return 새로 만들어진 TokenDTO
     */
    @Override
    public TokenDTO refreshToken(String token) throws RefreshTokenNotValidException{
        String email = this.jwtTokenProvider.getEmailByToken(token);
        if(this.jwtTokenProvider.validateToken(token) && this.userDAO.existUserByEmail(email)){
            UserEntity userEntity = this.userDAO.readUser(email);
            return this.makeToken(userEntity.getEmail(), userEntity.getRoles().get(0));
        }else throw new RefreshTokenNotValidException("refresh token not valid");
    }


    /**
     * 유저의 이메일이 데이터베이스에 존재하는지 체크
     * @param email 체크하려는 이메일
     * @return true 존재하는 이메일, false 존재하지 않는 이메일
     *
     */
    private void emailDuplicateCheck(String email){
        if(userDAO.existUserByEmail(email)){
            throw new EmailDuplicateException();
        }
    }

    private UserEntity initEntity(UserDTO userDTO){
        userDTO.setProfileImage("https://www.onoff.zone/api/image/download/1");
        if(userDTO.getRole().equalsIgnoreCase("admin")){
            userDTO.setRole("ROLE_ADMIN");
        }else if(userDTO.getRole().equalsIgnoreCase("seller")){
            userDTO.setRole("ROLE_SELLER");
        }else{
            userDTO.setRole("ROLE_USER");
        }
        return UserEntity.dtoToEntity(userDTO);
    }




    private TokenDTO makeToken(String email, String role){
        return TokenDTO.builder()
                .email(email)
                .role(role)
                .refreshToken(this.jwtTokenProvider.createToken(email, Arrays.asList(role), TokenType.REFRESH))
                .accessToken(this.jwtTokenProvider.createToken(email, Arrays.asList(role), TokenType.ACCESS)
                ).build();
    }
    private void existEmailCheck(String email) throws NotSignUpEmailException{
        if(!userDAO.existUserByEmail(email))
            throw new NotSignUpEmailException();
    }
    private void passwordCheck(String requestPassword, String entityPassword) throws PasswordMismatchException{
        if (!requestPassword.equals(entityPassword)) {
            logger.info("패스워드 불일치");
            throw new PasswordMismatchException();
        }
    }

    /**
     * 토큰의 유효성을 검증한다.
     * @param token JWT 토큰
     * @return true 유효 토큰, false 유효하지 않는 토큰
     */
    public boolean tokenValidCheck(String token) {
        return this.jwtTokenProvider.validateToken(token);
    }
}
