package com.auth.auth.service;


import com.auth.auth.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;

/**
 * 유저 정보와 관련된 비즈니스 로직 서비스 인터페이스
 */
public interface UserService {
    public ResponseEntity<String> createImage(String email, MultipartFile image) throws URISyntaxException, IOException;
    public ResponseEntity<UserDTO> updateUser(UserDTO userDTO);
    public ResponseEntity<UserDTO> readUser(String email);

}
