package com.wara.barcode.Service;


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
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;



@Service
public class TranslationService {



    private final DiscoveryClient discoveryClient;

    @Autowired
    public TranslationService(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }



    public URI serviceUrl(String serviceName, String endpoint) throws URISyntaxException {
        ServiceInstance userServer = discoveryClient.getInstances(serviceName).get(0);
        return new URI(userServer.getUri() + endpoint );
    }


    public HashMap toProduct(Long productId) throws URISyntaxException, IOException {

        HashMap<String,Object> failResult = new HashMap();
        failResult.put("result", HttpStatus.NOT_FOUND);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String,Object> bodyMap = new HashMap<>();
        bodyMap.put("productId",productId);

        HttpEntity<?> requestEntity = new HttpEntity<>(bodyMap, headers);

        URI uploadUri = serviceUrl("PRODUCT-SERVICE","/api/product/single/read");

        try {
            ResponseEntity response;
            RestTemplate restTemplate = new RestTemplate();

            response = restTemplate.exchange(
                    uploadUri,
                    HttpMethod.PUT,
                    requestEntity,
                    HashMap.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {

                return (HashMap)response.getBody();
            }

        }catch (HttpClientErrorException e){
            return failResult;
        }
        return failResult;
    }


    public String uploadImage(ByteArrayMultipartFile image) throws URISyntaxException, IOException {

        ByteArrayResource body = new ByteArrayResource(image.getBytes()) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        };

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> bodyMap = new LinkedMultiValueMap<>();
        bodyMap.add("images", body);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(bodyMap, headers);

        URI uploadUri = serviceUrl("IMAGE-SERVICE","/api/image/upload");


        try {
            ResponseEntity response;
            response = restTemplate.exchange(
                    uploadUri,
                    HttpMethod.POST,
                    requestEntity,
                    LinkedHashMap.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                LinkedHashMap responseBody = (LinkedHashMap) response.getBody();
                List<String> imageURLs = (List<String>) responseBody.get("images");
                String uploadedImageUrl = imageURLs.get(0);
                return uploadedImageUrl;
            }

        }catch (HttpClientErrorException e){
            return HttpStatus.BAD_REQUEST.toString();
        }
        return HttpStatus.NO_CONTENT.toString();
    }

}

