package com.auth.auth.service;


import com.auth.auth.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;

public interface UserService {
    public ResponseEntity<String> createImage(String email, MultipartFile image) throws URISyntaxException, IOException;
    public ResponseEntity<UserDTO> updateUser(UserDTO userDTO);
    public ResponseEntity<UserDTO> readUser(String email);

}
