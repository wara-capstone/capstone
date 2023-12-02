package com.auth.auth.controller;


import com.auth.auth.dto.UserDTO;
import com.auth.auth.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(
            @Autowired UserService userService
    ){
        this.userService = userService;
    }


    /**
     * @param image 유저의 프로필 이미지
     * @param email 유저의 이메일(아이디)
     * @return 이미지 수정에 대한 결과
     * @throws URISyntaxException
     * @throws IOException
     */
    @PostMapping("/image")
    public ResponseEntity<String> createImage(
            @RequestPart("image") MultipartFile image,
            @RequestParam("email") String email
    ) throws URISyntaxException, IOException {
        logger.info("[create Image] " + email);
        return this.userService.createImage(email, image);
    }


    /**
     * @param userDTO 유저 정보
     * @return
     */
    @PutMapping()
    public ResponseEntity<UserDTO> updateUser(
            @RequestBody UserDTO userDTO
            ){
        logger.info("[update User] "+userDTO.toString());
        return this.userService.updateUser(userDTO);
    }

    /**
     * 유저의 정보를 읽는다.
     * @param email 유저의 이메일
     * @return
     */
    @GetMapping()
    public ResponseEntity<UserDTO> readUser(
            @RequestParam("email") String email
    ){
        logger.info("[read User] " + email);
        return this.userService.readUser(email);
    }


}
