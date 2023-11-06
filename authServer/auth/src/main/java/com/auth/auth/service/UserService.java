package com.auth.auth.service;


import com.auth.auth.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.net.URISyntaxException;

public interface UserService {
    public ResponseEntity<String> createImage(MultipartFile image) throws URISyntaxException;
    public ResponseEntity<UserDTO> updateUser(UserDTO userDTO);

}
