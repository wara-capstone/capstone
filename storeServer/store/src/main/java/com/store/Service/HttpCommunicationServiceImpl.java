package com.store.Service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

@Service
public class HttpCommunicationServiceImpl implements HttpCommunicationService{
    private final DiscoveryClient discoveryClient;
    private final static Logger logger = LoggerFactory.getLogger(HttpCommunicationServiceImpl.class);

    public HttpCommunicationServiceImpl(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    @Override
    public Boolean productDelete(Long storeId) throws URISyntaxException {
        try {
            ServiceInstance productService = discoveryClient.getInstances("PRODUCT-SERVICE").get(0);
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<?> http = new HttpEntity<>(headers);

            URI uri = new URI(productService.getUri() + "/api/product/seller/store/" + storeId);

            ResponseEntity response = restTemplate.exchange(uri, HttpMethod.DELETE, http, String.class);


            if (response.getStatusCode().is2xxSuccessful()) {
                return true;
            }

        } catch (HttpClientErrorException e) {
            return false;
        }

        return false;
    }

    @Override
    public String imageUpload(@NotNull MultipartFile image) throws URISyntaxException, IOException {
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

            MultiValueMap<String, Object> bodyMap = new LinkedMultiValueMap<>();
            bodyMap.add("images", body);
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            http = new HttpEntity<>(bodyMap, headers);

            URI uri = new URI(imageService.getUri() + "/api/image/upload");
            ResponseEntity response = restTemplate.exchange(uri, HttpMethod.POST, http, LinkedHashMap.class);


            if (response.getStatusCode().is2xxSuccessful()) {
                LinkedHashMap responseBody = (LinkedHashMap) response.getBody();
                List<String> images = (List) responseBody.get("images");
                String imageUri = (String) images.get(0);

                return imageUri;
            }
        } catch (HttpClientErrorException e) {
            return "Failed to upload image";
        }

        return "Failed to upload image";
    }

    @Override
    public String imageUpdate(@NotNull MultipartFile image, String imageKey) throws URISyntaxException, IOException {
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

            MultiValueMap<String, Object> bodyMap = new LinkedMultiValueMap<>();
            ResponseEntity response;

            if (imageKey != null) {
                bodyMap.add("image", body);
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);
                HttpEntity<?> http = new HttpEntity<>(bodyMap, headers);
                URI uri = new URI(imageService.getUri() + "/api/image/" + imageKey);
                response = restTemplate.exchange(uri, HttpMethod.PUT, http, String.class);
                logger.info("ImageServer PUT Method");

                if (response.getStatusCode().is2xxSuccessful()) {
                    String imageUri = (String) response.getBody();

                    return imageUri;
                }
            } else {
                bodyMap.add("images", body);
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);
                HttpEntity<?> http = new HttpEntity<>(bodyMap, headers);
                URI uri = new URI(imageService.getUri() + "/api/image/upload");
                response = restTemplate.exchange(uri, HttpMethod.POST, http, LinkedHashMap.class);
                logger.info("ImageServer POST method");

                if (response.getStatusCode().is2xxSuccessful()) {
                    LinkedHashMap responseBody = (LinkedHashMap) response.getBody();
                    List<String> images = (List) responseBody.get("images");
                    String imageUri = (String) images.get(0);

                    return imageUri;
                }
            }

        } catch (HttpClientErrorException e) {
            return "Failed to upload image";
        }

        return "Failed to upload image";
    }

    @Override
    public Boolean imageDelete(String imageKey) throws URISyntaxException{
        try {
            ServiceInstance imageService = discoveryClient.getInstances("IMAGE-SERVICE").get(0);
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<?> http = new HttpEntity<>(headers);

            ResponseEntity response;

            if (imageKey != null) {
                URI uri = new URI(imageService.getUri() + "/api/image/" + imageKey);
                response = restTemplate.exchange(uri, HttpMethod.DELETE, http, Boolean.class);
                logger.info("ImageServer DELETE Method");
                return (Boolean) response.getBody();
            } else {
                return true;
            }
        } catch (HttpClientErrorException e) {
            return false;
        }
    }
}
