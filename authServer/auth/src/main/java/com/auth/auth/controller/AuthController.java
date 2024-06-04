package com.auth.auth.controller;


import com.auth.auth.dto.KakaoDTO;
import com.auth.auth.dto.TokenDTO;
import com.auth.auth.dto.UserDTO;
import com.auth.auth.except.*;
import com.auth.auth.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final static Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(
            @Autowired AuthService authService
    ){
        this.authService = authService;
    }


    /**
     * @param userDTO
     * @return 회원가입에 대한 결과 ResponseEntity
     */
    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(
            @RequestBody UserDTO userDTO
    ){
        logger.info("[SignUp] 회원가입 요청 "+userDTO.toString());
        try {
            return ResponseEntity.status(201).body(this.authService.signUp(userDTO));
        }catch (EmailDuplicateException | NullDTOException | NicknameDuplicateException e){
            return ResponseEntity.status(400).body(UserDTO.builder().email(e.getMessage()).build());
        }
    }

    /**
     * @param userDTO
     * @return 로그인에 대한 결과 Response Entity
     */
    @PostMapping("/signin")
    public ResponseEntity<TokenDTO> signin(
            @RequestBody UserDTO userDTO
    ) {
        logger.info("[SignIn] 로그인 요청 " + userDTO.toString());
        try {
            return ResponseEntity.status(200).body(this.authService.signIn(userDTO));
        } catch (NotSignUpEmailException | PasswordMismatchException | NullDTOException e) {
            return ResponseEntity.status(400).body(TokenDTO.builder().accessToken(e.getMessage()).build());
        }
    }

    @GetMapping("/signin")
    public ResponseEntity<TokenDTO> refreshToken(
            @RequestHeader("Authorization") String refreshToken
    ){
        try {
            logger.info(refreshToken);
            logger.info("refreshToken으로 토큰 갱신");
            return ResponseEntity.status(201).body(this.authService.refreshToken(refreshToken));
        }catch (RefreshTokenNotValidException e){
            return ResponseEntity.status(400).body(TokenDTO.builder().accessToken(e.getMessage()).build());
        }
    }

    @PostMapping("/kakao/signup")
    public ResponseEntity<UserDTO> kakaoSignUp(
            @RequestBody KakaoDTO kakaoDTO
            ){
        try {
            return ResponseEntity.status(201).body(this.authService.kakaoSignUp(kakaoDTO));
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(400).body(null);
        }
    }

    @PostMapping("/kakao/signin")
    public ResponseEntity<TokenDTO> kakaoSignin(
            @RequestBody KakaoDTO kakaoDTO
    ){
        try {
            return ResponseEntity.status(200).body(this.authService.kakaoSignIn(kakaoDTO));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body(null);
        }
    }


}
