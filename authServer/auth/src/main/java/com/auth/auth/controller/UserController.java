package com.auth.auth.controller;


import com.auth.auth.dto.UserDTO;
import com.auth.auth.except.NotSignUpEmailException;
import com.auth.auth.except.NullDTOException;
import com.auth.auth.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;

@CrossOrigin(origins = "*")
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
    ) {
        logger.info("[create Image] " + email);
        try {
            try {
                return ResponseEntity.status(200).body(this.userService.createImage(email, image));
            } catch (URISyntaxException | IOException | HttpClientErrorException e){
                return ResponseEntity.status(500).body("서버에 내부적인 오류가 발생하였습니다.");
            }
        }catch (NotSignUpEmailException e){
                return ResponseEntity.status(400).body(null);
        }
    }


    /**
     * @param userDTO 유저 정보
     * @return
     */
    @PutMapping()
    public ResponseEntity<UserDTO> updateUser(
            @RequestBody UserDTO userDTO
            ){
        try {
            logger.info("[update User] " + userDTO.toString());
            return ResponseEntity.status(200).body(this.userService.updateUser(userDTO));
        }catch (NotSignUpEmailException | NullDTOException e){
            return ResponseEntity.status(400).body(null);

        }
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
        try {
            logger.info("[read User] " + email);
            return ResponseEntity.status(200).body(this.userService.readUser(email));
        }catch (NotSignUpEmailException e){
            return ResponseEntity.status(400).body(null);
        }
    }


}
