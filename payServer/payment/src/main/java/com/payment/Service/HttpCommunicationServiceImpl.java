package com.payment.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;

@Service
public class HttpCommunicationServiceImpl implements HttpCommunicationService{
    private final DiscoveryClient discoveryClient;
    private final static Logger logger = LoggerFactory.getLogger(HttpCommunicationServiceImpl.class);

    public HttpCommunicationServiceImpl(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    @Override
    public Boolean stockUpdate(Long productId, Long optionId, Long count) throws URISyntaxException {
        try {
            ServiceInstance productService = discoveryClient.getInstances("PRODUCT-SERVICE").get(0);
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<?> http = new HttpEntity<>(headers);

            URI uri = new URI(productService.getUri() + "/api/product/user/product/" + productId + "/" + optionId + "/" + count);
            ResponseEntity response = restTemplate.exchange(uri, HttpMethod.PUT, http, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return true;
            }

        } catch (HttpClientErrorException e) {
            return false;
        }

        return false;
    }
}