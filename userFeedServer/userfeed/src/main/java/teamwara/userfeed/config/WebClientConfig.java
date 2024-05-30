package teamwara.userfeed.config;

import lombok.RequiredArgsConstructor;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@RequiredArgsConstructor
public class WebClientConfig {
    private final DiscoveryClient discoveryClient;

    @Bean
    public WebClient userServiceWebClient() {
        // "USER-SERVICE" 인스턴스의 URL을 가져옴
        ServiceInstance instance = discoveryClient.getInstances("USER-SERVICE").stream()
                .findFirst() // 첫 번째 인스턴스를 사용
                .orElseThrow(() -> new IllegalStateException("USER-SERVICE not available"));

        return WebClient.builder()
                .baseUrl(instance.getUri().toString()) // 동적으로 baseUrl 설정
                .build();
    }

    @Bean
    public WebClient imageServiceWebClient() {
        // "IMAGE-SERVICE" 인스턴스의 URL을 가져옴
        ServiceInstance instance = discoveryClient.getInstances("IMAGE-SERVICE").stream()
                .findFirst() // 첫 번째 인스턴스를 사용
                .orElseThrow(() -> new IllegalStateException("USER-SERVICE not available"));

        return WebClient.builder()
                .baseUrl(instance.getUri().toString()) // 동적으로 baseUrl 설정
                .build();
    }
}
