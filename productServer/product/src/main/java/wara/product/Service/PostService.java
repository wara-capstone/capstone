package wara.product.Service;

import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.EurekaClient;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@Service
public class PostService {



    private final EurekaClient eurekaClient;

    private RestTemplate restTemplate;

    public PostService(@Autowired EurekaClient eurekaClient) {
        this.eurekaClient = eurekaClient;
    }

    /**
     * @return 유레카 서버로부터 가져온 서버 인스턴스의 URL
     */
    public String serviceUrl(String serviceName) {
        InstanceInfo instance = eurekaClient.getNextServerFromEureka(serviceName, false);
        return instance.getHomePageUrl();
    }


    public ResponseEntity<String> registryProductImage(byte[] blobData)
    {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(blobData, headers);

        String url = serviceUrl("IMAGE-SERVICE"); // 이미지 서버의 URL

        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

        return response;
    }





}
