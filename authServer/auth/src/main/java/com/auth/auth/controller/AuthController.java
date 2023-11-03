package com.auth.auth.controller;


import com.auth.auth.dto.TokenDTO;
import com.auth.auth.dto.UserDTO;
import com.auth.auth.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final static Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(
            @Autowired AuthService authService
    ){
        this.authService = authService;
    }


    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(
            @RequestBody UserDTO userDTO
    ){
        logger.info("[SignUp] 회원가입 요청 "+userDTO.toString());
        return this.authService.signUp(userDTO);
    }

    @PostMapping("/signin")
    public ResponseEntity<TokenDTO> signin(
            @RequestBody UserDTO userDTO
    ){
        logger.info("[SignIn] 로그인 요청 "+userDTO.toString());
        return this.authService.signIn(userDTO);
    }

}
