package com.auth.auth.service.impl;

import com.auth.auth.config.security.JwtTokenProvider;
import com.auth.auth.dao.UserDAO;
import com.auth.auth.dto.KakaoDTO;
import com.auth.auth.dto.TokenDTO;
import com.auth.auth.dto.UserDTO;
import com.auth.auth.entity.UserEntity;
import com.auth.auth.enums.TokenType;
import com.auth.auth.except.*;
import com.auth.auth.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.LinkedHashMap;


/**
 * 유저의 인증 처리를 하는 서비스 구현체
 */
@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private final UserDAO userDAO;
    private final JwtTokenProvider jwtTokenProvider;

    // kakao Oauth
    @Value(value = "${oauth.kakao.oauth_uri}")
    private String kakaoOauthUri;
    @Value(value = "${oauth.kakao.data_uri}")
    private String kakaoDataUri;
    @Value(value = "${oauth.kakao.grant_type}")
    private String grant_type;
    @Value(value = "${oauth.kakao.client_id}")
    private String client_id;
    @Value(value = "${oauth.kakao.redirect_uri_signup}")
    private String redirect_uri_signup;
    @Value(value = "${oauth.kakao.redirect_uri_signin}")
    private String redirect_uri_signin;
    @Value(value = "${oauth.kakao.client_secret}")
    private String client_secret;

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
        if(userEntity.getPassword().equals("KAKAO")) throw new PasswordMismatchException();
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

    @Override
    public UserDTO kakaoSignUp(KakaoDTO kakaoDTO) throws URISyntaxException {
        // 1. code를 사용하여 카카오 서버에서 토큰을 발급받는다.
        String kakaoAccessToken = this.fetchKakaoAccessToken(kakaoDTO.getCode(), true);

        // 2. 토큰을 사용하여 카카오 서버에서 유저의 정보를 가져온다.
        LinkedHashMap<String, Object> value = this.fetchKakaoUserData(kakaoAccessToken);
        String email = (String) value.get("email");
        value = (LinkedHashMap<String, Object>) value.get("profile");

        // 3. 카카오에서 받아온 유저 정보와 회원가입으로 얻은 정보를 취합하여 회원가입을 진행한다.
        UserDTO userDTO = UserDTO.builder()
                .name(kakaoDTO.getName()).role(kakaoDTO.getRole()).phone(kakaoDTO.getPhone())
                .email(email).nickname((String) value.get("nickname")).password("KAKAO").build();

        return this.signUp(userDTO);
    }

    @Override
    public TokenDTO kakaoSignIn(KakaoDTO kakaoDTO) throws URISyntaxException {
        // 1. code를 사용하여 카카오 서버에서 토큰을 발급받는다.
        String kakaoAccessToken = this.fetchKakaoAccessToken(kakaoDTO.getCode(), false);

        // 2. 토큰을 사용하여 카카오 서버에서 유저의 정보를 가져온다.
        LinkedHashMap<String, Object> value = this.fetchKakaoUserData(kakaoAccessToken);
        String email = (String) value.get("email");

        // 3. 카카오에서 받아온 유저 이메일이 서버에 존재하는지 확인하고 비밀번호가 KAKAO인지 체크하여 토큰을 발급한다.
        this.existEmailCheck(email);
        UserEntity userEntity = userDAO.readUser(email);
        this.passwordCheck("KAKAO", userEntity.getPassword());
        return this.makeToken(userEntity.getEmail(), userEntity.getRoles().get(0));
    }


    private String fetchKakaoAccessToken(String code, boolean redirect) throws URISyntaxException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.add("grant_type", this.grant_type);
        parameters.add("client_id", this.client_id);
        parameters.add("redirect_uri", redirect ? redirect_uri_signup : redirect_uri_signin);
        parameters.add("code", code);
        parameters.add("client_secret", this.client_secret);

        HttpEntity<?> http = new HttpEntity<>(parameters, headers);
        URI uri = new URI(this.kakaoOauthUri);

        ResponseEntity<LinkedHashMap> response = restTemplate.exchange(uri, HttpMethod.POST, http, LinkedHashMap.class);
        return "Bearer "+response.getBody().get("access_token");
    }

    private LinkedHashMap<String, Object> fetchKakaoUserData(String kakaoAccessToken) throws URISyntaxException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", kakaoAccessToken);
        HttpEntity<?> http = new HttpEntity<>(headers);
        URI uri = new URI(this.kakaoDataUri);

        ResponseEntity<LinkedHashMap> response = restTemplate.exchange(uri, HttpMethod.GET, http, LinkedHashMap.class);
        return (LinkedHashMap<String, Object>) response.getBody().get("kakao_account");
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
