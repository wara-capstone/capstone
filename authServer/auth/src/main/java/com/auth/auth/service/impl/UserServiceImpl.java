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
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public ResponseEntity<String> createImage(String email, MultipartFile image) throws URISyntaxException, IOException {
        Optional<UserEntity> user = this.userDAO.readUser(email);
        if(!user.isPresent()){
            return ResponseEntity.status(400).body(null);
        }
        ByteArrayResource body = new ByteArrayResource(image.getBytes()) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        };
        try {
            ServiceInstance imageService = discoveryClient.getInstances("IMAGE-SERVICE").get(0);
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<?> http = new HttpEntity<>(headers);

            String index = user.get().getProfileImage().replace("https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/image/download/", "");
            if (!index.equals("1")) {
                URI deleteUri = new URI(imageService.getUri() + "/image/" + index);
                logger.info(deleteUri.toString());
                restTemplate.exchange(deleteUri, HttpMethod.DELETE, http, Boolean.class);
            }


            MultiValueMap<String, Object> bodyMap = new LinkedMultiValueMap<>();
            bodyMap.add("images", body);
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            http = new HttpEntity<>(bodyMap, headers);

            URI uri = new URI(imageService.getUri() + "/image/upload");
            ResponseEntity response = restTemplate.exchange(uri, HttpMethod.POST, http, LinkedHashMap.class);
            logger.info(uri.toString());
            if (response.getStatusCode().is2xxSuccessful()) {
                LinkedHashMap responseBody = (LinkedHashMap) response.getBody();
                List<String> images = (List) responseBody.get("images");
                String imageUri = (String) images.get(0);
                UserEntity userEntity = user.get();
                userEntity.setProfileImage(imageUri);
                this.userDAO.createUser(userEntity);
                return ResponseEntity.status(200).body(imageUri);
            }
        }catch (HttpClientErrorException e){
            return ResponseEntity.status(400).body(null);
        }

        return ResponseEntity.status(400).body(null);
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
                .roles(userEntity.getRoles())
                .profileImage(userEntity.getProfileImage())
                .nickname(userDTO.getNickname())
                .phone(userDTO.getPhone())
                .password(userDTO.getPassword().equals("") ?
                        userEntity.getPassword() : userDTO.getPassword())
                .build();
        userEntity = this.userDAO.createUser(userEntity);
        userDTO = UserDTO.builder()
                .id(userEntity.getId())
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .nickname(userEntity.getNickname())
                .phone(userEntity.getPhone())
                .profileImage(userEntity.getProfileImage())
                .build();

        return ResponseEntity.status(200).body(userDTO);
    }

    @Override
    public ResponseEntity<UserDTO> readUser(String email) {
        Optional<UserEntity> user = this.userDAO.readUser(email);
        if(!user.isPresent()){
            return ResponseEntity.status(400).body(null);
        }
        UserEntity userEntity = user.get();
        UserDTO userDTO = UserDTO.builder()
                .id(userEntity.getId())
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .nickname(userEntity.getNickname())
                .phone(userEntity.getPhone())
                .profileImage(userEntity.getProfileImage())
                .build();

        return ResponseEntity.status(200).body(userDTO);
    }
}
