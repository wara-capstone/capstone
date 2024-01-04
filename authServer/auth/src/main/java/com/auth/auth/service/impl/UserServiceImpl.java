package com.auth.auth.service.impl;

import com.auth.auth.dao.UserDAO;
import com.auth.auth.dto.UserDTO;
import com.auth.auth.entity.UserEntity;
import com.auth.auth.except.NotSignUpEmailException;
import com.auth.auth.except.NullDTOException;
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

/**
 * 유저 정보와 관련된 비즈니스 로직 인터페이스 구현체
 */
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

    /**
     * 유저의 프로필 이미지 수정
     * @param email 유저 이메일
     * @param image 수정하려는 이미지
     * @return 수정된 이미지의 경로
     * @throws URISyntaxException
     * @throws IOException
     */
    @Override
    public String createImage(String email, MultipartFile image) throws URISyntaxException, IOException, NotSignUpEmailException, HttpClientErrorException {
        this.existEmailCheck(email);
        UserEntity user = this.userDAO.readUser(email);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<?> http = new HttpEntity<>(headers);

        // 이미지 서버의 주소를 디스커버리 서버로부터 받아온다.
        ServiceInstance imageService = discoveryClient.getInstances("IMAGE-SERVICE").get(0);

        this.deleteOriginImage(
                user.getProfileImage().replace("https://www.onoff.zone/api/image/download/", ""),
                imageService.getUri(),
                http,
                restTemplate);

        // 이미지를 RestTemplate로 전송하기 위해 ByteArray로 수정
        ByteArrayResource body = imageToByteArrayResource(image);
        // 새로운 이미지를 저장한다.
        MultiValueMap<String, Object> bodyMap = new LinkedMultiValueMap<>();
        bodyMap.add("images", body);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        http = new HttpEntity<>(bodyMap, headers);

        URI uri = new URI(imageService.getUri() + "/api/image/upload");
        ResponseEntity response = restTemplate.exchange(uri, HttpMethod.POST, http, LinkedHashMap.class);
        logger.info(uri.toString());

        LinkedHashMap responseBody = (LinkedHashMap) response.getBody();
        List<String> images = (List) responseBody.get("images");
        String imageUri = (String) images.get(0);
        user.setProfileImage(imageUri);
        this.userDAO.createUser(user);
        return imageUri;
    }


    /**
     * 유저 정보를 수정
     * @param userDTO
     * @return
     */
    @Override
    public UserDTO updateUser(UserDTO userDTO) throws NotSignUpEmailException, NullDTOException
    {
        this.existEmailCheck(userDTO.getEmail());
        UserEntity user = this.userDAO.readUser(userDTO.getEmail());
        user.setNickname(userDTO.getNickname());
        user.setPhone(userDTO.getPhone());
        user.setPassword(userDTO.getPassword().equals("") ?
                user.getPassword() : userDTO.getPassword());
        return UserEntity.entityToDTO(this.userDAO.createUser(user));
    }

    /**
     * 유저 정보를 읽어온다.
     * @param email
     * @return
     */
    @Override
    public UserDTO readUser(String email) throws NotSignUpEmailException{
        this.existEmailCheck(email);
        return UserEntity.entityToDTO(this.userDAO.readUser(email));
    }

    private ByteArrayResource imageToByteArrayResource(MultipartFile image) throws IOException {
        return new ByteArrayResource(image.getBytes()) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        };
    }

    private void deleteOriginImage(String index, URI uri, HttpEntity<?> http, RestTemplate restTemplate) throws URISyntaxException {
        if (!index.equals("1")) {
            URI deleteUri = new URI(uri + "/api/image/" + index);
            logger.info(deleteUri.toString());
            restTemplate.exchange(deleteUri, HttpMethod.DELETE, http, Boolean.class);
        }
    }



    public void existEmailCheck(String email) throws NotSignUpEmailException{
        if(!this.userDAO.existUserByEmail(email))
            throw new NotSignUpEmailException();
    }

}
