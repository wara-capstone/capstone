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



    private final EurekaClient eurekaClient;
    private final DiscoveryClient discoveryClient;
    private final RestTemplate restTemplate;

    @Autowired
    public TransrationService(EurekaClient eurekaClient, RestTemplate restTemplate, DiscoveryClient discoveryClient) {
        this.eurekaClient = eurekaClient;
        this.restTemplate = restTemplate;
        this.discoveryClient = discoveryClient;
    }



    /**
     * @return 유레카 서버로부터 가져온 서버 인스턴스의 URL
     */
    public URI serviceUrl() throws URISyntaxException {
        //  InstanceInfo instance = eurekaClient.getNextServerFromEureka(serviceName, false);
        //        return new URI(instance.getHomePageUrl() +  endpoint);
        ServiceInstance userServer = discoveryClient.getInstances("STORE-SERVICE").get(0);


        System.out.println("getInstanceId "+userServer.getInstanceId());
        System.out.println("getServiceId "+userServer.getServiceId());
        System.out.println("getUri "+userServer.getUri());
        System.out.println("userServer "+userServer);
        System.out.println("getHost "+userServer.getHost());
        System.out.println("getPort "+userServer.getPort());


        return new URI(userServer.getUri() + "/store/update" );
//        return new URI(userServer + endpoint);
    }


    public String uploadImage(MultipartFile image) throws URISyntaxException, IOException {


        ByteArrayResource imageResource = new ByteArrayResource(image.getBytes()) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        };


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> bodyMap = new LinkedMultiValueMap<>();
        bodyMap.add("images", imageResource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(bodyMap, headers);

        URI uploadUri = new URI("https://port-0-image-jvpb2mloft5vlw.sel5.cloudtype.app/image/upload");

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

        URI uploadUri = new URI("https://port-0-capstone-12fhqa2llodwi7b3.sel5.cloudtype.app/store/update/id");

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
            return HttpStatus.BAD_REQUEST.toString();
        }

        return HttpStatus.NO_CONTENT.toString();
    }

}







