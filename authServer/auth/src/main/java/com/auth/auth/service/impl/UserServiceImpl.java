package com.auth.auth.service.impl;

import com.auth.auth.dao.UserDAO;
import com.auth.auth.dto.UserDTO;
import com.auth.auth.entity.UserEntity;
import com.auth.auth.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;


@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private final DiscoveryClient discoveryClient;
    private final UserDAO userDAO;
    public UserServiceImpl(
            @Autowired UserDAO userDAO,
            @Autowired DiscoveryClient discoveryClient
            ){
        this.userDAO = userDAO;
        this.discoveryClient = discoveryClient;
    }

    @Override
    public ResponseEntity<String> createImage(String email ,MultipartFile image) throws URISyntaxException {
        Optional<UserEntity> user = this.userDAO.readUser(email);
        if(!user.isPresent()){
            return ResponseEntity.status(400).body(null);
        }
        if()
        ServiceInstance imageService = discoveryClient.getInstances("IMAGE-SERVICE").get(0);
        URI uri = new URI(imageService.getUri().toString());

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<?> http = new HttpEntity<>(headers);

        ResponseEntity response = restTemplate.exchange(uri, HttpMethod.POST, http, LinkedHashMap.class);
        if(response.getStatusCode().is2xxSuccessful()){
            LinkedHashMap responseBody = (LinkedHashMap) response.getBody();
            List<String> images = (List) responseBody.get("images");
            String imageUri = (String) images.get(0);
            return ResponseEntity.status(200).body(imageUri);
        }


        return null;
    }

    @Override
    public ResponseEntity<UserDTO> updateUser(UserDTO userDTO) {
        Optional<UserEntity> user = this.userDAO.readUser(userDTO.getEmail());
        if(!user.isPresent()){
            return ResponseEntity.status(400).body(null);
        }
        UserEntity userEntity = user.get();
        userEntity = UserEntity.builder()
                .id(userEntity.getId())
                .email(userEntity.getEmail())
                .name(userEntity.getName())
                .nickname(userDTO.getNickname())
                .phone(userDTO.getPhone())
                .roles(userEntity.getRoles())
                .password(userEntity.getPassword())
                .build();
        userEntity = this.userDAO.createUser(userEntity);
        userDTO = UserDTO.builder()
                .id(userEntity.getId())
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .nickname(userEntity.getNickname())
                .phone(userEntity.getPhone())
                .build();

        return ResponseEntity.status(200).body(userDTO);
    }
}
