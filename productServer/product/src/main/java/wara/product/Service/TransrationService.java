package wara.product.Service;


import com.netflix.discovery.EurekaClient;
import org.apache.http.protocol.HTTP;
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
import java.util.*;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



@Service
public class TransrationService {

    private static final Logger logger = LoggerFactory.getLogger(TransrationService.class);
    private final DiscoveryClient discoveryClient;
    private final RestTemplate restTemplate;

    @Autowired
    public TransrationService(RestTemplate restTemplate, DiscoveryClient discoveryClient) {
        this.restTemplate = restTemplate;
        this.discoveryClient = discoveryClient;
    }



    /**
     * @return 유레카 서버로부터 가져온 서버 인스턴스의 URL
     */
    public URI serviceUrl(String serviceName, String endpoint) throws URISyntaxException {
        ServiceInstance userServer = discoveryClient.getInstances(serviceName).get(0);
        return new URI(userServer.getUri() + endpoint );
    }


    public String uploadImage(MultipartFile image) throws URISyntaxException, IOException {
        ByteArrayResource imageResource = new ByteArrayResource(image.getBytes()) {
            @Override public String getFilename() {
                return image.getOriginalFilename();
            }
        };


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> bodyMap = new LinkedMultiValueMap<>();
        bodyMap.add("images", imageResource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(bodyMap, headers);

        URI uploadUri = serviceUrl("IMAGE-SERVICE","/image/upload");
        System.out.println(uploadUri);
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




    public String validCheckFromStore(Long storeId, List<Long> productId) throws URISyntaxException, IOException {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String,Object> bodyMap = new HashMap<>();
        bodyMap.put("storeId", storeId);
        bodyMap.put("productId", productId);

        HttpEntity<?> requestEntity = new HttpEntity<>(bodyMap, headers);


        URI uploadUri = serviceUrl("STORE-SERVICE","/store/update/id");
        try {
            ResponseEntity response;
            response = restTemplate.exchange(
                    uploadUri,
                    HttpMethod.PUT,
                    requestEntity,
                    HashMap.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                HashMap fromStore = (HashMap)response.getBody();
                return (String) fromStore.get("result");
            }

        }catch (HttpClientErrorException e){
            return "fail";
        }

        return HttpStatus.NO_CONTENT.toString();
    }



    public String toBarcode (Long storeId, Long productId) throws URISyntaxException, IOException {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String,Object> bodyMap = new HashMap<>();
        bodyMap.put("storeId", storeId);
        bodyMap.put("productId", productId);

        HttpEntity<?> requestEntity = new HttpEntity<>(bodyMap, headers);


        URI uploadUri = serviceUrl("BARCODE-SERVICE","/barcode/create");

        try {
            ResponseEntity response;
            response = restTemplate.exchange(
                    uploadUri,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info(response.getBody().toString());
                return (String)response.getBody();
            }

        }catch (HttpClientErrorException e){
            return HttpStatus.BAD_REQUEST.toString();
        }

        return HttpStatus.NO_CONTENT.toString();
    }

}







