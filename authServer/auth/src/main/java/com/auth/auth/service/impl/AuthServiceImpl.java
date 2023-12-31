package com.auth.auth.service.impl;

import com.auth.auth.config.security.JwtTokenProvider;
import com.auth.auth.dao.UserDAO;
import com.auth.auth.dto.TokenDTO;
import com.auth.auth.dto.UserDTO;
import com.auth.auth.entity.UserEntity;
import com.auth.auth.except.EmailDuplicateException;
import com.auth.auth.except.NotSignUpEmailException;
import com.auth.auth.except.NullDTOException;
import com.auth.auth.except.PasswordMismatchException;
import com.auth.auth.repository.UserRepository;
import com.auth.auth.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;


/**
 * 유저의 인증 처리를 하는 서비스 구현체
 */
// 로그인 관련 서비스 구현체
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


    /**
     * 토큰의 유효성을 검증한다.
     * @param token JWT 토큰
     * @return true 유효 토큰, false 유효하지 않는 토큰
     */
    @Override
    public boolean tokenValidCheck(String token) {
        return this.jwtTokenProvider.validateToken(token);
    }

    /**
     * 회원가입 서비스
     * @param userDTO
     * @return 유저의 이메일을 담은 결과값 출력
     */
    @Override
    public UserDTO signUp(UserDTO userDTO) {
        logger.info("[getSignUpResult] 회원가입 정보 전달");
        UserEntity userEntity;

        // 이메일 중복 체크
        try {
            try {
                this.emailDuplicateCheck(userDTO.getEmail());
                // 규칙 설정
                if (userDTO.getRole().equalsIgnoreCase("admin")) {
                    userEntity = UserEntity.builder()
                            .email(userDTO.getEmail())
                            .password(userDTO.getPassword())
                            .nickname(userDTO.getNickname())
                            .name(userDTO.getName())
                            .phone(userDTO.getPhone())
                            .profileImage("https://www.onoff.zone/api/image/download/1")
                            .roles(Collections.singletonList("ROLE_ADMIN"))
                            .build();
                } else if (userDTO.getRole().equalsIgnoreCase("seller")) {
                    userEntity = UserEntity.builder()
                            .email(userDTO.getEmail())
                            .password(userDTO.getPassword())
                            .nickname(userDTO.getNickname())
                            .name(userDTO.getName())
                            .phone(userDTO.getPhone())
                            .profileImage("https://www.onoff.zone/api/image/download/1")
                            .roles(Collections.singletonList("ROLE_SELLER"))
                            .build();
                } else {
                    userEntity = UserEntity.builder()
                            .email(userDTO.getEmail())
                            .password(userDTO.getPassword())
                            .nickname(userDTO.getNickname())
                            .name(userDTO.getName())
                            .phone(userDTO.getPhone())
                            .profileImage("https://www.onoff.zone/api/image/download/1")
                            .roles(Collections.singletonList("ROLE_USER"))
                            .build();
                }

                // 생성한 유저 엔티티를 DB에 저장
                UserEntity signUpUser = userDAO.createUser(userEntity);
                return UserDTO.builder().email(signUpUser.getEmail()).build();
//            logger.info("[getSignUpResult] userEntity 값이 들어왔는지 확인 후 결과 값 주입");
//            if (!savedUser.getEmail().isEmpty()) {
//                logger.info("[getSignUpResult] 정상 처리 완료");
//                return ResponseEntity.status(201).body(UserDTO.builder().email(userDTO.getEmail()).build());
//            } else {
//                logger.info("[getSignUpResult]  실패 처리 완료");
//                return ResponseEntity.badRequest().body(UserDTO.builder().email("email null").build());
//            }
                // DataIntegrityViolatingException은 email이 null일 경우 발생
            }catch (NullPointerException | DataIntegrityViolationException e){
                throw new NullDTOException();
            }
        }catch (EmailDuplicateException e){
            throw e;
        }
    }

    /**
     * 로그인 서비스
     * @param userDTO
     * @return 유저 이메일, 유저 권한, JWT token을 담은 Token DTO와 결괏값 반환
     */
    @Override
    public TokenDTO signIn(UserDTO userDTO) {
        logger.info("[getSignInResult] signDataHandler 로 회원 정보 요청");
        if(!userDAO.existUserByEmail(userDTO.getEmail()))
            throw new NotSignUpEmailException();

        try {
            UserEntity userEntity = userDAO.readUser(userDTO.getEmail()).get();
            logger.info("[getSignInResult] e-mail : {}", userDTO.getEmail());

            TokenDTO tokenDTO = new TokenDTO();
            tokenDTO.setEmail(userDTO.getEmail());

            logger.info("[getSignInResult] 패스워드 비교 수행");
            //try {// 패스워드 불일치
                if (!(userDTO.getPassword().equals(userEntity.getPassword()))) {
                    logger.info("패스워드 불일치");
                    throw new PasswordMismatchException();
                }
//            } catch (IllegalArgumentException e) {
//                tokenDTO.setToken("Email mismatch");
//                return ResponseEntity.badRequest().body(tokenDTO);
//            }

            tokenDTO.setRole(userEntity.getRoles().get(0).equals("ROLE_USER") ? "user" : "seller");
            logger.info("[getSignInResult] 패스워드 일치");
            tokenDTO.setToken("Bearer " + jwtTokenProvider.createToken(String.valueOf(userEntity.getEmail()), userEntity.getRoles()));
            return tokenDTO;
        }catch (NullPointerException e){
            throw new NullDTOException();
        }
    }

}
